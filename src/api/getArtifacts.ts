import request from '@/utils/request'
import { GQL_URL } from '@/utils/constants'
import {
  artifactsResponseSchema,
  GetArtifactsInput,
  // getArtifactsInputSchema,
} from '@/utils/parsers'
import { GET_ARTIFACTS_QUERY } from '@/graphql/querties'
import { z } from 'zod'

/**
 * Fetches a list of artifacts with optional pagination parameters.
 * @param options - The options object containing:
 *   - `first` The number of artifacts to retrieve. Defaults to 200.
 *   - `skip` The number of artifacts to skip. Defaults to 0.
 *   - `url` (optional) The endpoint URL. Defaults to GQL_URL if not provided.
 * @returns An array of retrieved artifacts.
 * @throws If there is an error in the request or validation process.
 */
export default async function getArtifacts({
  first = 200,
  skip = 0,
  url = GQL_URL,
}: GetArtifactsInput) {
  try {
    const response = await request<unknown>(z.string().url().parse(url), {
      unwrapData: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_ARTIFACTS_QUERY,
        variables: {
          first,
          skip,
        },
      }),
    })

    const validatedArtifactsResponse = artifactsResponseSchema.parse(response)

    return validatedArtifactsResponse.artifacts
  } catch (e) {
    console.error(e)
    throw e
  }
}
