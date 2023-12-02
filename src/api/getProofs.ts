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
