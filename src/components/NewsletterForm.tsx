'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      console.log('Enviando email:', email) // Log do email

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      console.log('Resposta:', data) // Log da resposta

      if (!response.ok) throw new Error(data.message || 'Erro ao processar inscrição')

      setStatus('success')
      setMessage(data.message)
      setEmail('')
    } catch (error) {
      console.error('Erro no formulário:', error)
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Erro ao processar inscrição')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu melhor email"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-4 py-2 text-white bg-primary-600 rounded-lg 
                 hover:bg-primary-700 focus:outline-none focus:ring-2 
                 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {status === 'loading' ? 'Inscrevendo...' : 'Inscrever-se'}
      </button>

      {message && (
        <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
} 