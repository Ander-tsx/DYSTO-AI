'use client';

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api, { setupInterceptors } from '@/lib/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  // Guardamos el accessToken SOLO en memoria, nunca en localStorage.
  // porque asi evitamos posibilidades de ataque XSS,si un atacante inyecta JavaEscri malicioso,
  // no podrá robar fácilmente el token persistente para suplantarnos en otras pestañas u ordenadores.
  const [accessToken, setAccessToken] = useState(null);

  // El estado del usuario puede persistir brevemente (o hidratarse desde backend), pero su información no es riesgosa.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funciones de control delegadas para Axios. Las envolvemos en useCallback
  // para que sean referencialmente estables y podamos usarlas en useEffect.

  const getAccessToken = useCallback(() => accessToken, [accessToken]);

  const handleLogout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      // El refreshToken sí se guarda en localStorage por razones de persistencia en UX.
      // Si el refreshToken es robado, el backend puede invalidarlo/blacklisealo.
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      document.cookie = 'auth_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    }
    router.push('/login');
  }, [router]);

  const handleTokenRefresh = useCallback(async () => {
    // Si no tenemos refresh token, de plano no podemos refrescar
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    if (!refreshToken) {
      handleLogout();
      return null;
    }

    try {
      // Directamente axios base porque no queremos enviar headers con tokens vencidos.
      const response = await api.post('/auth/refresh/', {
        refresh: refreshToken,
      });

      const newAccess = response.data.access;
      setAccessToken(newAccess);
      api.defaults.headers.Authorization = `Bearer ${newAccess}`;
      return newAccess;
    } catch (error) {
      // El refresh ha expirado o es inválido en backend, bay sesión
      handleLogout();
      throw error;
    }
  }, [handleLogout]);

  useEffect(() => {
    // Instalamos los interceptores al momento de montar el contexto
    setupInterceptors(
      () => getAccessToken(),     // Leemos el accessToken vivop de la RAM
      handleTokenRefresh,
      handleLogout
    );

    // Intentamos reautenticar al inicio si había un refresh token por ahí
    const initializeAuth = async () => {
      const storedRefresh = localStorage.getItem('refresh_token');
      const storedUser = localStorage.getItem('user_data');

      if (storedRefresh && !accessToken) {
        try {
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          await handleTokenRefresh();
        } catch (err) {
          // Falló pero handleTokenRefresh ya hace cleanup
          console.log("No se pudo auto-autenticar. Revisa tokens.");
        }
      }
      setLoading(false);
    };

    initializeAuth();

  }, [getAccessToken, handleTokenRefresh, handleLogout]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login/', { email, password });

      const { access, refresh, user: userData } = response.data;

      setAccessToken(access);

      api.defaults.headers.Authorization = `Bearer ${access}`;

      setUser(userData);

      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_data', JSON.stringify(userData));
        const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
        document.cookie = `auth_role=${userData.role}; path=/; max-age=604800; SameSite=Lax${secure}`;
      }

      // Redirección por rol
      if (userData.role === 'admin') router.push('/admin');
      else if (userData.role === 'vendor') router.push('/products');
      else router.push('/');

      return true;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);

      // Auto-login con los mismos tokens recibidos
      const { access, refresh, user: newUser } = response.data;

      setAccessToken(access);
      setUser(newUser);

      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_data', JSON.stringify(newUser));
        const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
        document.cookie = `auth_role=${newUser.role}; path=/; max-age=604800; SameSite=Lax${secure}`;
      }

      router.push('/');
      return true;
    } catch (error) {
      console.error("Register Error:", error);
      throw error;
    }
  };

  const contextValue = {
    user,
    accessToken,
    isAuthenticated: !!accessToken,
    loading,
    login,
    register,
    logout: handleLogout,
    refreshToken: handleTokenRefresh,
    // helpers de rol derivados del user
    isAdmin: user?.role === 'admin',
    isVendor: user?.role === 'vendor',
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado internamente de un AuthProvider');
  }
  return context;
};
