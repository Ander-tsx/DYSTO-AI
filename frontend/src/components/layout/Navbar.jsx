'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  X,
  Package,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Store,
  Plus,
} from 'lucide-react';

// ── CartButton ────────────────────────────────────────────────────────────────

function CartButton({ count }) {
  return (
    <Link
      href="/cart"
      id="navbar-cart-btn"
      aria-label={`Carrito con ${count} artículos`}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[--navbar-text] hover:text-[--navbar-accent] hover:bg-[--navbar-surface] transition-all duration-200"
    >
      <ShoppingCart size={20} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-[--navbar-accent] text-[#0a0a0a] leading-none">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

// ── UserMenu ──────────────────────────────────────────────────────────────────

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleOutsideClick = useCallback((e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open, handleOutsideClick]);

  const roleLabel = {
    admin: 'Admin',
    vendedor: 'Vendedor',
    cliente: 'Cliente',
  }[user?.role] || user?.role;

  const initials = user?.first_name
    ? `${user.first_name[0]}${user.last_name?.[0] || ''}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="relative" ref={menuRef}>
      <button
        id="navbar-user-menu-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 h-9 px-2 rounded-lg text-[--navbar-text] hover:bg-[--navbar-surface] hover:text-[--navbar-accent] transition-all duration-200"
      >
        {/* Avatar with initials */}
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[--navbar-accent]/20 border border-[--navbar-accent]/40 text-[--navbar-accent] text-xs font-bold">
          {initials}
        </span>
        <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
          {user?.first_name || user?.email?.split('@')[0] || 'Usuario'}
        </span>
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <ChevronDown size={15} />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10,10,10,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
            zIndex: 9999,
          }}
        >
          {/* User info header */}
          <div className="px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[--navbar-accent]/20 border border-[--navbar-accent]/30 flex items-center justify-center text-[--navbar-accent] font-bold text-sm">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-[--navbar-muted] truncate">{user?.email}</p>
              </div>
            </div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[--navbar-accent]/15 text-[--navbar-accent] border border-[--navbar-accent]/25">
              {roleLabel}
            </span>
          </div>

          {/* Menu items */}
          <div className="py-2 px-2">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-[--navbar-text] hover:bg-white/5 hover:text-[--navbar-accent] rounded-lg transition-colors"
            >
              <User size={15} className="opacity-70" />
              Mi perfil
            </Link>

            <Link
              href="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-[--navbar-text] hover:bg-white/5 hover:text-[--navbar-accent] rounded-lg transition-colors"
            >
              <ClipboardList size={15} className="opacity-70" />
              Mis órdenes
            </Link>

            {/* Vendor menu items — all users are vendors */}
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-[--navbar-text] hover:bg-white/5 hover:text-[--navbar-accent] rounded-lg transition-colors"
            >
              <Package size={15} className="opacity-70" />
              Mis productos
            </Link>

            <Link
              href="/products/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-[--navbar-text] hover:bg-white/5 hover:text-[--navbar-accent] rounded-lg transition-colors"
            >
              <Plus size={15} className="opacity-70" />
              Publicar producto
            </Link>

            {/* Admin-only */}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-[--navbar-text] hover:bg-white/5 hover:text-[--navbar-accent] rounded-lg transition-colors"
              >
                <LayoutDashboard size={15} className="opacity-70" />
                Panel admin
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-white/5 py-2 px-2">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
            >
              <LogOut size={15} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Navbar (main export) ──────────────────────────────────────────────────────

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Inicio', icon: <Store size={16} /> },
    { href: '/products', label: 'Mis Productos', icon: <Package size={16} /> },
  ];

  return (
    <>
      {/* CSS tokens scoped to navbar */}
      <style>{`
        :root {
          --navbar-bg: #0d0d0d;
          --navbar-surface: #181818;
          --navbar-border: #222222;
          --navbar-accent: #e0ff4f;
          --navbar-text: #f0f0f0;
          --navbar-muted: #666666;
        }
      `}</style>

      <header
        id="main-navbar"
        className="fixed inset-x-0 top-0 z-50 h-16 border-b"
        style={{
          background: 'rgba(10, 10, 10, 0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: 'var(--navbar-border)',
        }}
      >
        <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            href="/"
            id="navbar-logo"
            className="shrink-0 flex items-center gap-2 group"
          >
            <span className="flex flex-col leading-none">
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: 'var(--navbar-text)' }}
              >
                DystoAI
              </span>
              <span
                className="text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: 'var(--navbar-accent)' }}
              >
                by Netrunners
              </span>
            </span>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: active ? 'var(--navbar-accent)' : 'var(--navbar-muted)',
                    background: active ? 'rgba(224,255,79,0.06)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--navbar-text)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--navbar-muted)'; }}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions row */}
          <div className="flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <CartButton count={cartCount} />
                <UserMenu user={user} onLogout={logout} />
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  id="navbar-login-btn"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{ color: 'var(--navbar-muted)' }}
                  onMouseEnter={e => e.target.style.color = 'var(--navbar-text)'}
                  onMouseLeave={e => e.target.style.color = 'var(--navbar-muted)'}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  id="navbar-register-btn"
                  className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 active:scale-95"
                  style={{
                    background: 'var(--navbar-accent)',
                    color: '#0a0a0a',
                  }}
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              id="navbar-mobile-menu-btn"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menú de navegación"
              className="flex md:hidden items-center justify-center w-9 h-9 ml-1 rounded-lg transition-colors"
              style={{ color: 'var(--navbar-text)' }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div
            className="md:hidden border-t px-4 pt-4 pb-6 flex flex-col gap-4"
            style={{
              background: 'var(--navbar-bg)',
              borderColor: 'var(--navbar-border)',
            }}
          >
            {/* Mobile nav links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium"
                  style={{ color: 'var(--navbar-text)' }}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile auth */}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 mt-2">
                <Link href="/login" className="w-full text-center py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--navbar-border)', color: 'var(--navbar-text)' }}>
                  Iniciar sesión
                </Link>
                <Link href="/register" className="w-full text-center py-2.5 rounded-lg text-sm font-bold" style={{ background: 'var(--navbar-accent)', color: '#0a0a0a' }}>
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Push page content below fixed navbar */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
