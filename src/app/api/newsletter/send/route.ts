import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { getResendClient } from '@/lib/resend'

// Cliente Supabase para API
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    console.log('🚀 Iniciando envio de newsletter...')

    // Verifica autenticação
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      console.log('❌ Usuário não autenticado')
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { subject, content } = await request.json()
    console.log('📧 Assunto:', subject)

    if (!subject || !content) {
      console.log('❌ Dados incompletos')
      return NextResponse.json(
        { message: 'Assunto e conteúdo são obrigatórios' },
        { status: 400 }
      )
    }

    // Busca inscritos
    const { data: subscribers, error: fetchError } = await supabaseAdmin
      .from('subscribers')
      .select('email')
      .eq('status', 'active')

    if (fetchError) {
      console.error('❌ Erro ao buscar inscritos:', fetchError)
      throw fetchError
    }

    if (!subscribers?.length) {
      console.log('⚠️ Nenhum inscrito encontrado')
      return NextResponse.json(
        { message: 'Nenhum inscrito encontrado' },
        { status: 404 }
      )
    }

    console.log(`📨 Enviando para ${subscribers.length} inscritos`)

    const resend = getResendClient()

    // Se estiver em build, retorna mock
    if (process.env.NEXT_PHASE === 'build') {
      return NextResponse.json({
        message: 'Mock response during build',
        success: true
      })
    }

    // Envia emails
    const results = await Promise.allSettled(
      subscribers.map(async (subscriber) => {
        try {
          console.log(`🔄 Tentando enviar para ${subscriber.email}`)
          
          const result = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: subscriber.email,
            subject: subject,
            html: content,
          })

          console.log(`✅ Enviado com sucesso para ${subscriber.email}`, result)
          return { email: subscriber.email, status: 'sent' }
        } catch (error) {
          console.error(`❌ Erro ao enviar para ${subscriber.email}:`, error)
          return { email: subscriber.email, status: 'failed', error }
        }
      })
    )

    // Registra envio
    const sendLog = await supabaseAdmin
      .from('newsletter_sends')
      .insert([
        {
          subject,
          content,
          sent_at: new Date().toISOString(),
          total_recipients: subscribers.length,
          results: results.map(r => r.status === 'fulfilled' ? r.value : r.reason)
        }
      ])
      .select()

    console.log('📝 Log de envio registrado:', sendLog)

    return NextResponse.json({
      message: 'Newsletter enviada com sucesso',
      total: subscribers.length,
      results
    })

  } catch (error) {
    console.error('❌ Erro geral:', error)
    return NextResponse.json(
      { message: 'Erro ao enviar newsletter', error },
      { status: 500 }
    )
  }
} 