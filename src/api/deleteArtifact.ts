import { GQL_URL } from '@/utils/constants'
import request from '@/utils/request'
import { z } from 'zod'

const deleteArtifactOptions = z.object({
  organizationName: z.string(),
  name: z.string(),
  url: z.string().url(),
})

type DeleteArtifactOptions = z.infer<typeof deleteArtifactOptions>

const uuidSchema = z.string().uuid()
type UUID = z.infer<typeof uuidSchema>

const deletedArtifactResponseSchema = z.object({
  deleteArtifact: z.array(uuidSchema),
})

/**
 * Deletes an artifact by name and organization name.
 * @param options - The options object containing:
 * - `organizationName` The name of the organization.
 * - `name` The name of the artifact.
 * - `url` (optional) The endpoint URL. Defaults to GQL_URL if not provided.
 * @returns The id of the deleted artifact.
 * @throws If there is an error in the request or validation process.
 */
export default async function deleteArtifact(
  options: DeleteArtifactOptions,
): Promise<UUID | undefined> {
  const validOptions = deleteArtifactOptions.parse(options)
  const { organizationName, name } = validOptions
  let { url } = validOptions

  if (!url) {
    url = GQL_URL
  }

  const query = `mutation {
    deleteArtifact(organizationName: "${organizationName}", artifactName: "${name}")
  }`

  const resp = await request<unknown>(z.string().url().parse(url), {
    method: 'POST',
    unwrapData: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  const validResp = deletedArtifactResponseSchema.parse(resp)

  if (validResp.deleteArtifact && validResp.deleteArtifact.length > 0) {
    return validResp.deleteArtifact[0]
  } else {
    return undefined
  }
}
