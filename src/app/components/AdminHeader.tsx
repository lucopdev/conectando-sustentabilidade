'use client';

import { useRouter } from 'next/navigation';
import { Session } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ThemeToggle } from './ThemeToggle';

interface AdminHeaderProps {
  session: Session | null;
}

export function AdminHeader({ session }: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const user = session?.user;

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Painel Administrativo
            </h1>
            {user && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Logado como: {user.email}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent 
                       rounded-md shadow-sm text-sm font-medium text-white 
                       bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                       dark:focus:ring-offset-gray-800
                       transition-colors duration-200"
            >
              <svg
                className="mr-2 -ml-1 h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
