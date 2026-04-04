'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { notify } from '@/utils/notify';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ 
    first_name: '', 
    last_name: '', 
    email: '', 
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/marketplace');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.confirm_password) {
      notify.error("Campos incompletos", "Por favor completa todos los campos requeridos.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      notify.error("Error de validación", "Las contraseñas no coinciden.");
      return;
    }

    if (formData.password.length < 8) {
      notify.error("Contraseña débil", "La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      // Formatear datos para el backend
      const registerData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirm_password
      };
      
      await register(registerData);
      notify.success("¡Registro Exitoso!", "Te damos la bienvenida a DystoAI.");
    } catch (error) {
      if (error.response?.data?.email) {
         notify.error("Correo no disponible", "Este correo ya se encuentra registrado.");
      } else {
         notify.error("Error al registrar", "Ha ocurrido un problema al procesar tu solicitud.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12">
      <div className="max-w-md w-full rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Registro
          </h2>
          <p className="text-zinc-400 mt-2 text-sm">
            Forja tu nueva identidad digital
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Nombre</label>
              <input 
                type="text" 
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Neo"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-zinc-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Apellidos</label>
              <input 
                type="text" 
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Anderson"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-zinc-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Correo Electrónico</label>
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
            <label className="block text-sm font-medium text-zinc-300 mb-1">Contraseña</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-zinc-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Confirmar Contraseña</label>
            <input 
              type="password" 
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-zinc-100 transition-all"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 px-4 flex justify-center items-center rounded-lg font-semibold transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] mt-6
              ${loading 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
              }`}
          >
            {loading ? 'Inicializando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-8 text-center text-zinc-500 text-sm">
          ¿Ya tienes acceso?{' '}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Inicia Sesión
          </Link>
        </p>

      </div>
    </div>
  );
}
