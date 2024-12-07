import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { emailSchema } from '@/lib/validations'

// Cliente Supabase específico para API
const supabaseApi = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false }
  }
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Dados recebidos:', body)
    
    const validationResult = emailSchema.safeParse(body.email)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const email = validationResult.data
    const now = new Date().toISOString()

    // Tenta inserir diretamente (sem verificar existência)
    const { error: insertError } = await supabaseApi
      .from('subscribers')
      .insert([
        { 
          email,
          subscribed_at: now,
          created_at: now,
          status: 'active',
          metadata: {
            source: 'website',
            userAgent: request.headers.get('user-agent') || 'unknown',
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
          }
        }
      ])

    // Se der erro de duplicação, tenta atualizar
    if (insertError?.code === '23505') { // Código de erro de unique violation
      const { error: updateError } = await supabaseApi
        .from('subscribers')
        .update({ 
          status: 'active',
          subscribed_at: now,
          metadata: {
            source: 'website',
            userAgent: request.headers.get('user-agent') || 'unknown',
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
          }
        })
        .eq('email', email)

      if (updateError) throw updateError

      return NextResponse.json(
        { message: 'Inscrição reativada com sucesso!' },
        { status: 200 }
      )
    }

    if (insertError) throw insertError

    return NextResponse.json(
      { message: 'Inscrito com sucesso!' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erro detalhado:', error)
    
    return NextResponse.json(
      { 
        message: 'Erro ao processar inscrição',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
} 