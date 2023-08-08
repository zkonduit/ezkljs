import { GET_PROOF_QUERY } from '@/graphql/querties'
import { GQL_URL } from '@/utils/constants'
import { UUID, getProofResponseSchema, uuidSchema } from '@/utils/parsers'
import request from '@/utils/request'
import { isValidHexString } from '@/utils/stringValidators'
import throwError from '@/utils/throwError'

/**
 * Fetches the proof details for a given task ID.
 * @param taskId The UUID of Hub proof task.
 * @returns The proof details.
 * @throws If the task ID is invalid, the proof is invalid, or a request error occurs.
 */
export default async function getProof(taskId: UUID) {
  const validTaskId = uuidSchema.parse(taskId)

  try {
    const response = await request<unknown>(GQL_URL, {
      unwrapData: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_PROOF_QUERY,
        variables: {
          taskId: validTaskId,
        },
      }),
    })
    const validatedProofResponse = getProofResponseSchema.parse(response)

    if (!isValidHexString(validatedProofResponse.getProof.proof)) {
      throw new Error('Invalid proof')
    }

    return validatedProofResponse.getProof
  } catch (e) {
    throwError(e)
  }
}
