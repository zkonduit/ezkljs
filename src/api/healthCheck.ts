import { healthyHealthCheckResponseSchema } from '@/utils/parsers'
import request from '@/utils/request'

/**
 * Performs a health check on the ezkl hub's backend.
 * @returns An object with the welcome message and status 'ok'.
 * @throws If the health check fails, or a request error occurs.
 */
export default async function healthCheck() {
  try {
    const response = await request<unknown>('https://hub.ezkl.xyz/')
    const data = healthyHealthCheckResponseSchema.parse(response)

    return data
  } catch (e) {
    console.error(e)
    throw e
  }
}
