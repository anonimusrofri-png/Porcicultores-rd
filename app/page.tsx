import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Comprobar token o cookie de autenticación
  const token = request.cookies.get('token_porcicultores')?.value

  const { pathname } = request.nextUrl

  // Definir rutas públicas que SÍ se pueden ver sin estar registrado (login y registro)
  const esRutaPublica = pathname === '/login' || pathname === '/registro' || pathname.startsWith('/_next') || pathname.startsWith('/api')

  // Si no hay token y quiere acceder a una ruta protegida, redirigir a la página principal con la tarjeta de bloqueo
  if (!token && !esRutaPublica && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}