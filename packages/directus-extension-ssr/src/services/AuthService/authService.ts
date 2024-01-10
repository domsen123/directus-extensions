import { signIn } from './authActions'
import type { SSRDirectusClient } from '~/types'

export class AuthService {
  constructor(private directus: SSRDirectusClient) {}

  async signIn(email: string, password: string) {
    try {
      const response = await signIn(this.directus, email, password)
    }
    catch (error: any) {

    }
  }
}
