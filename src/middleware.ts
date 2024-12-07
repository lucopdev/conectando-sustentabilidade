import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verifica a sessão
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // URLs que requerem autenticação
  const protectedUrls = ['/admin']
  const isProtectedUrl = protectedUrls.some(url => 
    req.nextUrl.pathname.startsWith(url)
  )

  // Verifica se o token está expirado
  const isTokenExpired = session?.expires_at 
    ? session.expires_at * 1000 < Date.now()
    : true

  // Redireciona para login se:
  // 1. Não tem sessão
  // 2. Token expirado
  // 3. Tentando acessar URL protegida
  if ((!session || isTokenExpired) && isProtectedUrl) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('from', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Se já está logado, impede acesso à página de login
  if (session && !isTokenExpired && req.nextUrl.pathname === '/login') {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/admin'
    return NextResponse.redirect(redirectUrl)
  }

  // Atualiza o token se necessário
  if (session && !isTokenExpired) {
    await supabase.auth.getSession()
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     * - api routes (server endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
} 