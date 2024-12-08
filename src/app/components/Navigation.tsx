'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ThemeToggle } from './ThemeToggle'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const isAdminPage = pathname?.startsWith('/admin')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-primary-600 dark:bg-primary-800 text-white p-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-primary-200 transition-colors">
          Conectando Sustentabilidade
        </Link>
        
        {/* Botão Hamburguer */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden"
          aria-label="Menu"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Menu de Navegação */}
        <nav className={`
          ${isOpen ? 'flex' : 'hidden'} 
          lg:flex
          absolute lg:relative
          top-20 lg:top-0
          left-0 lg:left-auto
          right-0 lg:right-auto
          bg-primary-600 lg:bg-transparent
          p-6 lg:p-0
          flex-col lg:flex-row
          items-center
          space-y-4 lg:space-y-0
          lg:space-x-8
          shadow-lg lg:shadow-none
          z-50
        `}>
          <Link 
            href="#sobre" 
            className="hover:text-primary-200 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Sobre
          </Link>
          <Link 
            href="#newsletter" 
            className="hover:text-primary-200 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Newsletter
          </Link>
          <Link 
            href="#ods" 
            className="hover:text-primary-200 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            ODS
          </Link>
          
          <ThemeToggle />
          
          {/* Botões de Login/Admin e Logout */}
          {isAdminPage ? (
            <>
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg bg-white text-primary-600 hover:bg-primary-50 
                         transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Painel Admin
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 
                         transition-colors font-medium"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-white text-primary-600 hover:bg-primary-50 
                       transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
} 