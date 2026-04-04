'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { notify } from '@/utils/notify';

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Redirigir si el usuario ya estaba autenticado antes de entrar al login.
  // Usamos la misma lógica de roles que login() para no pisar su redirect post-login.
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') router.push('/admin');
      else if (user.role === 'vendedor') router.push('/vendor/dashboard');
      else router.push('/marketplace');
    }
  }, [isAuthenticated, user, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      notify.error("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      notify.success("¡Bienvenido/a de vuelta!");
    } catch (error) {
      if (error.response?.status === 401) {
         notify.error("Credenciales incorrectas.", "Verifica tu email y contraseña");
      } else {
         notify.error("Error de servidor.", "No se pudo iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md w-full rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Iniciar Sesión
          </h2>
          <p className="text-zinc-400 mt-2 text-sm">
            Ingresa al universo de DystoAI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="neo@matrix.com"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-zinc-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Contraseña
            </label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-zinc-100 transition-all"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 px-4 flex justify-center items-center rounded-lg font-semibold transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] 
              ${loading 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
              }`}
          >
            {loading ? 'Identificando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-8 text-center text-zinc-500 text-sm">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Crea tu identidad
          </Link>
        </p>

      </div>
    </div>
  );
}
