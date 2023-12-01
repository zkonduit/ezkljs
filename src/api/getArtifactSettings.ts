import { BASE_URL } from '@/utils/constants'
import request from '@/utils/request'
import { z } from 'zod'

const artifactSettingsInputSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url().optional(),
})

type ArtifactSettingsInput = z.infer<typeof artifactSettingsInputSchema>

/**
 * Fetches the settings.json file for a given artifact.
 * @param options - The options object containing:
 * - `id` The id of the artifact.
 * - `url` (optional) The endpoint URL. Defaults to BASE_URL if not provided.
 * @returns The settings (obj) file for the given artifact.
 * @throws If there is an error in the request or validation process.
 */

export default async function getArtifactSettings(
  options: ArtifactSettingsInput,
): Promise<unknown> {
  const validResp = artifactSettingsInputSchema.parse(options)
  const { id } = validResp
  let { url } = validResp

  if (!url) {
    url = BASE_URL
  }
  const requestURL = `${url}/download/${id}/settings.json`

  try {
    const jsonCode = await request<unknown>(requestURL)

    return jsonCode
  } catch (e) {
    console.error(e)
    return null
  }
}
