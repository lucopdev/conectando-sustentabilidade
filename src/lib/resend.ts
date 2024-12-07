import { Resend } from 'resend'
import { MockResend } from './mock-resend'

export function getResendClient() {
  // Durante o build, retorna o mock
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
    return new MockResend()
  }
  
  // Em runtime, retorna o cliente real
  return new Resend(process.env.RESEND_API_KEY || 'dummy_key')
} 