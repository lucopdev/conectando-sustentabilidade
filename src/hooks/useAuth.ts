import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User, Session } from '@supabase/supabase-js'

export function useAuth() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verifica sessão atual ao montar o componente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event)
      setSession(session)
      setUser(session?.user ?? null)

      if (event === 'SIGNED_OUT') {
        router.push('/login')
      } else if (event === 'SIGNED_IN') {
        router.push('/admin')
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token atualizado')
      } else if (event === 'USER_UPDATED') {
        console.log('Dados do usuário atualizados')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  return {
    user,
    session,
    loading,
    signOut: () => supabase.auth.signOut(),
    isAdmin: user?.user_metadata?.role === 'admin',
    // Funções auxiliares
    getUser: () => user,
    getSession: () => session,
    isAuthenticated: !!session,
  }
}

// Exemplo de uso:
/*
function AdminComponent() {
  const { user, loading, isAdmin, signOut } = useAuth()

  if (loading) return <div>Carregando...</div>
  
  if (!isAdmin) return <div>Acesso negado</div>

  return (
    <div>
      <p>Bem-vindo, {user?.email}</p>
      <button onClick={signOut}>Sair</button>
    </div>
  )
}
*/ 