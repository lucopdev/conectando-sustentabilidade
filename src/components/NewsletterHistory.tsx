'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type SendResult = {
  email: string
  status: 'sent' | 'failed'
  error?: {
    message: string
    code: string
  }
}

type NewsletterSend = {
  id: string
  subject: string
  content: string
  sent_at: string
  total_recipients: number
  results: SendResult[]
}

export function NewsletterHistory() {
  const [isOpen, setIsOpen] = useState(false)
  const [newsletters, setNewsletters] = useState<NewsletterSend[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (isOpen) {
      loadHistory()
    }
  }, [isOpen])

  async function loadHistory() {
    setLoading(true)
    const { data, error } = await supabase
      .from('newsletter_sends')
      .select('*')
      .order('sent_at', { ascending: false })

    if (!error && data) {
      setNewsletters(data)
    }
    setLoading(false)
  }

  const handleResend = async (newsletter: NewsletterSend) => {
    if (!confirm(`Reenviar a newsletter "${newsletter.subject}"?`)) return

    setSending(newsletter.id)
    
    try {
      console.log('Reenviando newsletter:', newsletter)
      
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: newsletter.subject,
          content: newsletter.content,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao reenviar newsletter')
      }

      const result = await response.json()
      console.log('Resultado do reenvio:', result)

      alert('Newsletter reenviada com sucesso!')
      
      loadHistory()
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao reenviar newsletter. Verifique o console para mais detalhes.')
    } finally {
      setSending(null)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent 
                 rounded-md shadow-sm text-sm font-medium text-white 
                 bg-primary-600 hover:bg-primary-700 focus:outline-none 
                 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Ver Histórico
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Histórico de Newsletters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {newsletters.map((newsletter) => (
                    <div 
                      key={newsletter.id} 
                      className="bg-white dark:bg-gray-700 rounded-lg shadow p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{newsletter.subject}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enviada em: {new Date(newsletter.sent_at).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Destinatários: {newsletter.total_recipients}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleResend(newsletter)}
                          disabled={sending === newsletter.id}
                          className="px-3 py-1 bg-primary-600 text-white rounded 
                                   hover:bg-primary-700 disabled:opacity-50
                                   transition-colors duration-200"
                        >
                          {sending === newsletter.id ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Reenviando...
                            </span>
                          ) : 'Reenviar'}
                        </button>
                      </div>

                      <div className="mt-2">
                        <button
                          onClick={() => {/* TODO: Implementar preview */}}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          Ver conteúdo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
} 