import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

// Cliente Supabase para API
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Usa service role key para acesso total
)

export async function POST(request: Request) {
  try {
    // Inicializa o Resend apenas quando a rota é chamada
    const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key')

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

    // Verifica se temos a chave do Resend
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { message: 'Configuração de email não disponível' },
        { status: 503 }
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

    // Busca todos os inscritos ativos
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

    // Envia para cada inscrito
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

    // Registra o envio no Supabase
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