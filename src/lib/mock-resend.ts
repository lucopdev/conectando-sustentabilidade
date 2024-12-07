export class MockResend {
  emails = {
    send: async () => ({ id: 'mock_id' })
  }
} 