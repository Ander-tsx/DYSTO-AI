'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';

// ── Icons ──────────────────────────────────────────────────────────────────────

function CartIcon({ size = 22 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function SearchIcon({ size = 18 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function UserIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ChevronDown({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function MenuIcon({ size = 22 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon({ size = 22 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── SearchBar ─────────────────────────────────────────────────────────────────

function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/?search=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <span className="absolute left-3 text-[--navbar-muted] pointer-events-none">
        <SearchIcon size={16} />
      </span>
      <input
        id="navbar-search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos…"
        className="w-full h-9 pl-9 pr-4 rounded-lg text-sm bg-[--navbar-surface] border border-[--navbar-border] text-[--navbar-text] placeholder:text-[--navbar-muted] focus:outline-none focus:border-[--navbar-accent] focus:ring-1 focus:ring-[--navbar-accent]/40 transition-all duration-200"
      />
    </form>
  );
}

// ── CartButton ────────────────────────────────────────────────────────────────

function CartButton({ count }) {
  return (
    <Link
      href="/cart"
      id="navbar-cart-btn"
      aria-label={`Carrito con ${count} artículos`}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[--navbar-text] hover:text-[--navbar-accent] hover:bg-[--navbar-surface] transition-all duration-200"
    >
      <CartIcon />
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        id="navbar-user-menu-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 h-9 px-2 rounded-lg text-[--navbar-text] hover:bg-[--navbar-surface] hover:text-[--navbar-accent] transition-all duration-200"
      >
        {/* Avatar circle */}
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[--navbar-accent]/10 border border-[--navbar-accent]/30 text-[--navbar-accent]">
          <UserIcon size={14} />
        </span>
        <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
          {user?.email?.split('@')[0] || 'Usuario'}
        </span>
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <ChevronDown />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[--navbar-border] bg-[--navbar-bg] shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-[--navbar-border]">
            <p className="text-xs text-[--navbar-muted] mb-0.5">Sesión iniciada como</p>
            <p className="text-sm font-semibold text-[--navbar-text] truncate">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[--navbar-accent]/10 text-[--navbar-accent] border border-[--navbar-accent]/20">
              {roleLabel}
            </span>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[--navbar-text] hover:bg-[--navbar-surface] hover:text-[--navbar-accent] transition-colors"
            >
              <UserIcon size={15} />
              Mi perfil
            </Link>

            {/* Vendor-only */}
            {user?.role === 'vendedor' && (
              <Link
                href="/vendor/products"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[--navbar-text] hover:bg-[--navbar-surface] hover:text-[--navbar-accent] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 7H4a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                Mis productos
              </Link>
            )}

            {/* Admin-only */}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[--navbar-text] hover:bg-[--navbar-surface] hover:text-[--navbar-accent] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Panel admin
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-[--navbar-border] py-1">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
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
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch cart count when authenticated
  useEffect(() => {
    if (!isAuthenticated) { setCartCount(0); return; }
    let cancelled = false;
    api.get('/carts/').then((res) => {
      if (!cancelled) {
        const items = res.data?.items || [];
        const total = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);
        setCartCount(total);
      }
    }).catch(() => null);
    return () => { cancelled = true; };
  }, [isAuthenticated, pathname]);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/products', label: 'Explorar' },
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
          background: 'rgba(10, 10, 10, 0.85)',
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
            <span
              className="text-lg font-bold tracking-tight transition-colors duration-200"
              style={{ color: 'var(--navbar-text)' }}
            >
              NTR
              <span
                className="transition-colors duration-200"
                style={{ color: 'var(--navbar-accent)' }}
              >
                /DystoAI
              </span>
            </span>
          </Link>

          {/* SearchBar — desktop */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm">
            <SearchBar className="w-full" />
          </div>

          {/* Spacer */}
          <div className="flex-1 hidden md:block" />

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: active ? 'var(--navbar-accent)' : 'var(--navbar-muted)',
                    background: active ? 'rgba(224,255,79,0.06)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!active) e.target.style.color = 'var(--navbar-text)'; }}
                  onMouseLeave={e => { if (!active) e.target.style.color = 'var(--navbar-muted)'; }}
                >
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
                  className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200"
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
              {mobileOpen ? <XIcon /> : <MenuIcon />}
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
            {/* Mobile search */}
            <SearchBar className="w-full" />

            {/* Mobile nav links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium"
                  style={{ color: 'var(--navbar-text)' }}
                >
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
