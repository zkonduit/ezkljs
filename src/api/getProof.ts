import { GET_PROOF_QUERY } from '@/graphql/querties'
import { GQL_URL } from '@/utils/constants'
import { UUID, getProofResponseSchema, uuidSchema } from '@/utils/parsers'
import request from '@/utils/request'
import { isValidProof } from '@/utils/stringValidators'

type GetProofOptions = {
  id: UUID
  url?: string
}

/**
 * Fetches the proof details for a given task ID.
 * @param options - The options object containing:
 *   - `id` The UUID of Hub proof task.
 *   - `url` (optional) The endpoint URL. Defaults to GQL_URL if not provided.
 * @returns The proof details.
 * @throws If the task ID is invalid, the proof is invalid, or a request error occurs.
 */
export default async function getProof({ id, url = GQL_URL }: GetProofOptions) {
  const validTaskId = uuidSchema.parse(id)

  try {
    const response = await request<unknown>(url, {
      unwrapData: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_PROOF_QUERY,
        variables: {
          id: validTaskId,
        },
      }),
    })

    const validatedProofResponse = getProofResponseSchema.parse(response)

    if (!isValidProof(validatedProofResponse.getProof.proof)) {
      throw new Error('Invalid proof')
    }

    return validatedProofResponse.getProof
  } catch (e) {
    console.error(e)
    throw e
  }
}
