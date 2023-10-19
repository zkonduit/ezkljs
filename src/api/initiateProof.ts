import { INITIATED_PROOF_MUTATION } from '@/graphql/mutations'
import { GQL_URL } from '@/utils/constants'
import {
  FileOrBuffer,
  UUID,
  initiateProofInputSchema,
  initiateProofResponseSchema,
} from '@/utils/parsers'

import request from '@/utils/request'
type InitiateProofOptions = {
  artifactId: UUID
  inputFile: FileOrBuffer
  url?: string
}

/**
 * Initiates a proof for a given artifact and input file (dataset).
 * @param options - The options object containing:
 *   - `artifactId` The UUID of the artifact.
 *   - `inputFile` The file or buffer containing the data that will
 *     be run through the circuit.
 *   - `url` (optional) The endpoint URL. Defaults to GQL_URL if not provided.
 * @returns The initiated proof details with the taskId and status.
 * @throws If there is an error in the request or validation process.
 */
export default async function initiateProof({
  artifactId,
  inputFile,
  url = GQL_URL,
}: InitiateProofOptions) {
  const validatedInput = initiateProofInputSchema.parse({
    artifactId,
    inputFile,
  })

  const { artifactId: validatedArtifactId, inputFile: validatedInputFile } =
    validatedInput

  const operations = {
    query: INITIATED_PROOF_MUTATION,
    variables: {
      id: validatedArtifactId,
      input: validatedInputFile,
    },
  }

  const map = {
    input: ['variables.input'],
  }

  const body = new FormData()
  body.append('operations', JSON.stringify(operations))
  body.append('map', JSON.stringify(map))
  body.append('input', new Blob([inputFile]))

  try {
    const initiateProofResponse = await request<unknown>(url, {
      unwrapData: true,
      method: 'POST',
      body,
    })

    const validatedInitiateProof = initiateProofResponseSchema.parse(
      initiateProofResponse,
    )

    return validatedInitiateProof.initiateProof
  } catch (e) {
    console.error(e)
    throw e
  }
}
