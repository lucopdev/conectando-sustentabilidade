import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SubscribersList } from '@/components/SubscribersList';
import { AdminHeader } from '@/components/AdminHeader';
import { NewsletterComposer } from '@/components/NewsletterComposer';
import { NewsletterHistory } from '@/components/NewsletterHistory';

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader session={session} />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Painel de Controle</h2>
            <div className="space-x-4">
              <NewsletterHistory />
              <SubscribersList />
            </div>
          </div>
          <NewsletterComposer />
        </div>
      </div>
    </div>
  );
}
