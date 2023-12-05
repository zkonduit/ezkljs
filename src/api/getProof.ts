import { GET_PROOF_QUERY } from '@/graphql/querties'
import { GQL_URL } from '@/utils/constants'
import {
  UUID,
  getProofResponseSchema,
  urlSchema,
  uuidSchema,
} from '@/utils/parsers'
import request from '@/utils/request'
import { isValidProof } from '@/utils/stringValidators'
import { z } from 'zod'

type GetProofOptions = {
  id: UUID
  url?: string
}

type Proof = z.infer<typeof getProofResponseSchema>['getProof']

/**
 * Fetches the proof details for a given task ID.
 * @param options - The options object containing:
 *   - `id` The UUID of Hub proof task.
 *   - `url` (optional) The endpoint URL. Defaults to GQL_URL if not provided.
 * @returns The proof details.
 * @throws If the task ID is invalid, the proof is invalid, or a request error occurs.
 */
export default async function getProof({
  id,
  url = GQL_URL,
}: GetProofOptions): Promise<Proof | null> {
  const validatedId = uuidSchema.parse(id)
  const validatedUrl = urlSchema.parse(url)

  try {
    const response = await request<unknown>(validatedUrl, {
      unwrapData: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_PROOF_QUERY,
        variables: {
          id: validatedId,
        },
      }),
    })

    // Directly handle the case where response is null
    if (response === null) {
      return null
    }

    // Validate the response against the getProofResponseSchema
    const validatedProofResponse = getProofResponseSchema.safeParse(response)

    // If the response does not match the schema, return null or handle the error
    if (!validatedProofResponse.success) {
      console.error(
        'Response does not match the expected schema',
        validatedProofResponse.error,
      )
      return null
    }

    // Check the validity of the proof
    if (
      validatedProofResponse.data.getProof.proof &&
      !isValidProof(validatedProofResponse.data.getProof.proof)
    ) {
      throw new Error('Invalid proof')
    }

    return validatedProofResponse.data.getProof
  } catch (e) {
    console.error(e)
    throw e
  }
}
