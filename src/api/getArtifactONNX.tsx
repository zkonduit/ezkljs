import { BASE_URL } from '@/utils/constants'
// import request from '@/utils/request'
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

export default async function getArtifactONNX(
  options: ArtifactSettingsInput,
): Promise<Blob | undefined> {
  const validResp = artifactSettingsInputSchema.parse(options)
  const { id } = validResp
  let { url } = validResp

  if (!url) {
    url = BASE_URL
  }
  const requestURL = `${url}/download/${id}/network.onnx`

  try {
    const modelResp = await fetch(requestURL)
    const modelBlob = await modelResp.blob()

    return modelBlob
  } catch (e) {
    throw new Error(`Error fetching ONNX: ${e}`)
  }
}
