import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Obtenemos la cookie seteada en el frontend (AuthContext)
  const roleCookie = request.cookies.get('auth_role');
  const role = roleCookie?.value;

  // Proteger /vendor/* -> requiere rol 'vendedor'
  if (pathname.startsWith('/vendor')) {
    if (role !== 'vendedor') {
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
