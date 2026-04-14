'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { notify } from '@/utils/notify';
import { Mail, Lock, Loader2, LogIn, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      notify.error('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      notify.success('¡Bienvenido/a de vuelta!');
    } catch (error) {
      notify.error('Error al iniciar sesión', error.response?.data?.detail || 'Ha ocurrido un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles size={20} style={{ color: '#e0ff4f' }} />
            <span className="text-lg font-bold text-white">DystoAI</span>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#e0ff4f' }}>by Netrunners</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Iniciar Sesión</h1>
          <p className="text-zinc-500 text-sm">Ingresa al universo de DystoAI</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <Mail size={12} /> Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                id="login-email"
                value={formData.email}
                onChange={handleChange}
                placeholder="neo@matrix.com"
                className="w-full h-11 px-4 rounded-xl text-sm bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#e0ff4f]/40 focus:ring-2 focus:ring-[#e0ff4f]/10 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <Lock size={12} /> Contraseña
              </label>
              <input
                type="password"
                name="password"
                id="login-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-xl text-sm bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#e0ff4f]/40 focus:ring-2 focus:ring-[#e0ff4f]/10 transition-all"
              />
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl mt-2"
              style={{ background: loading ? '#333' : '#e0ff4f', color: loading ? '#666' : '#0a0a0a' }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Identificando…
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  Entrar
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-zinc-600 text-sm">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-semibold transition-colors hover:text-white" style={{ color: '#e0ff4f' }}>
              Crea tu identidad
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
