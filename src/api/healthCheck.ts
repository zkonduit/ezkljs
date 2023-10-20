import { healthyHealthCheckResponseSchema } from '@/utils/parsers'
import request from '@/utils/request'
import { BASE_URL } from '@/utils/constants'

type HealthCheckOptions = {
  url?: string
}

/**
 * Performs a health check on the ezkl hub's backend.
 * @param options - An optional object containing:
 *   - `url` (optional) The endpoint URL. Defaults to BASE_URL if not provided.
 * @returns An object with the welcome message and status 'ok'.
 * @throws If the health check fails, or a request error occurs.
 */
export default async function healthCheck(options: HealthCheckOptions = {}) {
  const { url = BASE_URL } = options

  try {
    const response = await request<unknown>(url)
    const data = healthyHealthCheckResponseSchema.parse(response)

    return data
  } catch (e) {
    console.error(e)
    throw e
  }
}
