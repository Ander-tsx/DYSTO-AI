import { NextResponse } from 'next/server';

/**
 * NOTA DE SEGURIDAD: Este middleware usa la cookie `auth_role` escrita desde el cliente
 * para ofrecer protección de rutas a nivel de UX (evitar que el usuario llegue a páginas
 * que no le corresponden). Esta cookie NO es confiable para autorización estricta porque
 * puede ser modificada desde el navegador (DevTools). La autorización real debe ser
 * validada siempre en el backend/API mediante tokens firmados (JWT).
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Obtenemos la cookie seteada en el frontend (AuthContext) — solo para UX
  const roleCookie = request.cookies.get('auth_role');
  const role = roleCookie?.value;

  // Proteger /vendor/* -> requiere rol 'vendor'
  if (pathname.startsWith('/vendor')) {
    if (role !== 'vendor') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Proteger /admin/* -> requiere rol 'admin'
  if (pathname.startsWith('/admin')) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Proteger /buyer/* -> requiere estar autenticado (cualquier rol bastaría, 
  // pero típicamente cliente/vendedor/admin. Lo importante es que esté logueado)
  if (pathname.startsWith('/buyer')) {
    if (!role) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Las demás rutas (/login, /, /marketplace, etc) pasan sin problema
  return NextResponse.next();
}

export const config = {
  // Configuro el matcher para que el middleware SOLO se dispare en las rutas protegidas
  matcher: [
    '/vendor/:path*',
    '/admin/:path*',
    '/buyer/:path*'
  ],
};
