import { z } from 'zod'

// Lista de domínios temporários comuns
const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'throwawaymail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  // Adicione mais conforme necessário
]

// Regex para validação básica de email
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const emailSchema = z
  .string()
  .min(5, 'Email muito curto')
  .max(255, 'Email muito longo')
  .email('Email inválido')
  .regex(EMAIL_REGEX, 'Formato de email inválido')
  .refine((email) => {
    // Verifica se não é um domínio temporário
    const domain = email.split('@')[1].toLowerCase()
    return !DISPOSABLE_DOMAINS.includes(domain)
  }, 'Por favor, use um email permanente')
  .refine((email) => {
    // Verifica se o domínio tem um formato válido
    const domain = email.split('@')[1]
    return domain.includes('.') && domain.split('.')[1].length >= 2
  }, 'Domínio de email inválido')
  .transform((email) => email.toLowerCase()) // Normaliza para minúsculas
 