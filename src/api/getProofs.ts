import { GQL_URL } from '@/utils/constants'
import { getProofDetailsSchema } from '@/utils/parsers'
import request from '@/utils/request'
import { z } from 'zod'

const userProvidedGetProofsOptions = z.object({
  organizationName: z.string(),
  artifactName: z.string(),
  url: z.string().url().optional(),
  first: z.number().int().optional(),
  skip: z.number().int().optional(),
})

type UserProvidedGetProofsOptions = z.infer<typeof userProvidedGetProofsOptions>

type GetProofsOptionsWithDefaults = Required<UserProvidedGetProofsOptions>

type Proofs = z.infer<typeof getProofDetailsSchema>

const proofsSchema = z.array(getProofDetailsSchema)
const proofsResponseSchema = z.object({
  getProofs: proofsSchema,
})

/**
 * Fetches a list of proofs with optional pagination parameters.
 * @param options - The options object containing:
 *  - `organizationName` The name of the organization.
 * - `artifactName` The name of the artifact.
 * - `url` (optional) The endpoint URL. Defaults to GQL_URL if not provided.
 * - `first` (optional) The number of proofs to retrieve. Defaults to 500.
 * - `skip` (optional) The number of proofs to skip. Defaults to 0.
 * @returns An array of retrieved proofs.
 * @throws If there is an error in the request or validation process.
 */
export default async function getProofs(
  options: UserProvidedGetProofsOptions,
): Promise<Proofs[]> {
  const validOptions = userProvidedGetProofsOptions.parse(options)

  const config: GetProofsOptionsWithDefaults = {
    url: GQL_URL,
    first: 500,
    skip: 0,
    ...validOptions,
  }

  const proofDetailsFields = `
    id
    status
    proof
    instances
    timeTaken
    createdAt
  `

  const query = `query getProofs {
    getProofs(
      first: ${config.first},
      skip: ${config.skip},
      organizationName: "${config.organizationName}",
      artifactName: "${config.artifactName}"
    ) {
      ${proofDetailsFields}
    }
  }`

  const resp = await request<unknown>(config.url, {
    // no-cache: 'no-store',
    method: 'POST',
    unwrapData: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  const validResp = proofsResponseSchema.parse(resp)
  const { getProofs: proofs } = validResp

  return proofs
}
