'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { notify } from '@/utils/notify';
import { User, Mail, Lock, Loader2, UserPlus, Sparkles } from 'lucide-react';
import PropTypes from 'prop-types';

const inputClass = 'w-full h-11 px-4 rounded-xl text-sm bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#e0ff4f]/40 focus:ring-2 focus:ring-[#e0ff4f]/10 transition-all';

function Field({ label, icon: Icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {Icon && <Icon size={12} />}
        {label}
      </label>
      {children}
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
};

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.confirm_password) {
      notify.error('Campos incompletos', 'Por favor completa todos los campos requeridos.');
      return;
    }
    if (formData.password !== formData.confirm_password) {
      notify.error('Error de validación', 'Las contraseñas no coinciden.');
      return;
    }
    if (formData.password.length < 8) {
      notify.error('Contraseña débil', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });
      notify.success('¡Registro exitoso!', 'Te damos la bienvenida a DystoAI. 🚀');
    } catch (error) {
      notify.error('Error al registrar', error.response?.data?.detail || 'Ha ocurrido un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles size={20} style={{ color: '#e0ff4f' }} />
            <span className="text-lg font-bold text-white">DystoAI</span>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#e0ff4f' }}>by Netrunners</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Crear Cuenta</h1>
          <p className="text-zinc-500 text-sm">Forja tu nueva identidad digital</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" icon={User}>
                <input
                  type="text"
                  name="first_name"
                  id="register-first-name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Neo"
                  className={inputClass}
                />
              </Field>
              <Field label="Apellidos" icon={User}>
                <input
                  type="text"
                  name="last_name"
                  id="register-last-name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Anderson"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Correo electrónico" icon={Mail}>
              <input
                type="email"
                name="email"
                id="register-email"
                value={formData.email}
                onChange={handleChange}
                placeholder="neo@matrix.com"
                className={inputClass}
              />
            </Field>

            <Field label="Contraseña" icon={Lock}>
              <input
                type="password"
                name="password"
                id="register-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputClass}
              />
            </Field>

            <Field label="Confirmar contraseña" icon={Lock}>
              <input
                type="password"
                name="confirm_password"
                id="register-confirm-password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputClass}
              />
            </Field>

            <button
              type="submit"
              id="register-submit-btn"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl mt-2"
              style={{ background: loading ? '#333' : '#e0ff4f', color: loading ? '#666' : '#0a0a0a' }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Inicializando…
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  Registrarse
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-zinc-600 text-sm">
            ¿Ya tienes acceso?{' '}
            <Link href="/login" className="font-semibold transition-colors hover:text-white" style={{ color: '#e0ff4f' }}>
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
