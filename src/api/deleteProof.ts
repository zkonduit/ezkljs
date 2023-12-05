import { GQL_URL } from '@/utils/constants'
import request from '@/utils/request'
import { z } from 'zod'

const userProvidedDeleteProofOptions = z.object({
  organizationName: z.string(),
  proofId: z.string(),
  url: z.string().url().optional(),
})
type UserProvidedDeleteProofOptions = z.infer<
  typeof userProvidedDeleteProofOptions
>

const deleteProofResponseSchema = z.object({
  deleteProof: z.array(z.string().uuid()),
})

/**
 * Deletes a proof by id.
 * @param options - The options object containing:
 * - `organizationName` The name of the organization.
 * - `proofId` The id of the proof.
 * - `url` (optional) The endpoint URL. Defaults to GQL_URL if not provided.
 * @returns The id of the deleted proof or undefined if the proof does not exist.
 */
export default async function deleteProof(
  options: UserProvidedDeleteProofOptions,
): Promise<string | undefined> {
  const validOptions = userProvidedDeleteProofOptions.parse(options)

  const config = {
    url: GQL_URL,
    ...validOptions,
  }

  const DELETE_PROOF = `mutation deleteProof($proofId: String!, $organizationName: String!) {
    deleteProof(proofId: $proofId, organizationName: $organizationName)
  }`
  const resp = await request<unknown>(config.url, {
    method: 'POST',
    unwrapData: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: DELETE_PROOF,
      variables: {
        proofId: config.proofId,
        organizationName: config.organizationName,
      },
    }),
  })

  const validResp = deleteProofResponseSchema.parse(resp)

  if (validResp.deleteProof && validResp.deleteProof.length > 0) {
    return validResp.deleteProof[0]
  } else {
    return undefined
  }
}
