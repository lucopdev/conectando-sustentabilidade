//comando para executar: npx tsx scripts/create-admin.ts

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Carrega o .env.local da raiz do projeto
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

// Verifica as variáveis de ambiente
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('Erro: NEXT_PUBLIC_SUPABASE_URL não encontrada no arquivo .env.local')
  process.exit(1)
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Erro: SUPABASE_SERVICE_ROLE_KEY não encontrada no arquivo .env.local')
  process.exit(1)
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createAdmin() {
  try {
    console.log('Iniciando criação do usuário admin...')
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: 'lucas.rosa@8ksoft.com', // Substitua pelo seu email
      password: 'bolovo85', // Substitua por uma senha segura
      email_confirm: true,
      user_metadata: { role: 'admin' }
    })

    if (error) throw error

    console.log('Admin criado com sucesso!')
    console.log('Email:', data.user.email)
    console.log('ID:', data.user.id)
    console.log('Role:', data.user.user_metadata.role)
  } catch (error) {
    console.error('Erro ao criar admin:', error)
  }
}

console.log('Verificando configurações...')
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurada ✓' : 'Não configurada ✗')
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configurada ✓' : 'Não configurada ✗')

createAdmin() 