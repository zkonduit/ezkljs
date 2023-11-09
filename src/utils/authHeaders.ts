import { z } from 'zod'

export default function authHeaders(
  apiKey: string | null,
  accessToken: string | null,
): Headers {
  const headers = new Headers()
  let validatedAccessToken = ''
  let validatedApiKey = ''

  if (accessToken) {
    validatedAccessToken = z.string().parse(accessToken)
    headers.append('Authorization', `Bearer ${validatedAccessToken}`)
  }
  if (apiKey) {
    validatedApiKey = z.string().parse(apiKey)
    headers.append('API-Key', validatedApiKey)
  }

  return headers
}
