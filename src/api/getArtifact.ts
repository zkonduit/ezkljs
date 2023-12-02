// import { Artifact, GetArtifactsInput } from '@/utils/parsers'

import { GQL_URL } from '@/utils/constants'
import request from '@/utils/request'
import { z } from 'zod'

const getArtifactInputSchema = z.object({
  id: z.string().uuid().optional(),
  organizationName: z.string().optional(),
  name: z.string().optional(),
  url: z.string().url().optional(),
})

type GetArtifactsInput = z.infer<typeof getArtifactInputSchema>

const artifactSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
  uncompiledModel: z.string().nullable(),
  solidityArtifacts: z.array(
    z.object({
      solidityCode: z.string(),
    }),
  ),
  proofs: z.array(
    z.object({
      status: z.union([
        z.literal('FAILURE'),
        z.literal('SUCCESS'),
        z.literal('PENDING'),
      ]),
      id: z.string(),
      proof: z.string().nullable(),
      instances: z.array(z.string()).nullable(),
      timeTaken: z.number().nullable(),
      createdAt: z.string(),
    }),
  ),
  organization: z.object({
    id: z.string(),
    name: z.string(),
  }),
})

type Artifact = z.infer<typeof artifactSchema>

/**
 * Fetches a single artifact by id or organization name + artifact name.
 * @param options - The options object containing:
 * - `id` The id of the artifact.
 * - `organizationName` The name of the organization.
 * - `name` The name of the artifact.
 * - `url` (optional) The endpoint URL. Defaults to GQL_URL if not provided.
 *
 * @returns
 */
export default async function getArtifact(
  options: GetArtifactsInput = { url: GQL_URL },
): Promise<Artifact> {
  let queryParams
  // type guards
  if ('id' in options && options.id !== undefined) {
    const validatedId = z.string().uuid().parse(options.id)
    queryParams = `id: "${validatedId}"`
  } else if (
    'organizationName' in options &&
    options.organizationName !== undefined &&
    'name' in options &&
    options.name !== undefined
  ) {
    queryParams = `organizationName: "${options.organizationName}", name: "${options.name}"`
  }
  const query = `query artifact {
      artifact(${queryParams}) {
        id
        name
        description
        createdAt
        uncompiledModel
        solidityArtifacts {
          solidityCode
        }
        proofs {
          status
          id
          proof
          instances
          timeTaken
          createdAt
        }
        organization {
          id
          name
        }
      }
    }`

  const resp = await request<unknown>(z.string().url().parse(options.url), {
    // cache: 'no-store',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    unwrapData: true,
  })

  const validResp = z.object({ artifact: artifactSchema }).parse(resp)

  return validResp.artifact
}
