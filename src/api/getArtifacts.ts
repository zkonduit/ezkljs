import request from '@/utils/request'
import { GQL_URL } from '@/utils/constants'
import {
  artifactsResponseSchema,
  GetArtifactsInput,
  getArtifactsInputSchema,
} from '@/utils/parsers'
import { GET_ARTIFACTS_QUERY } from '@/graphql/querties'

/**
 * Fetches a list of artifacts with optional pagination parameters.
 * @param first The number of artifacts to retrieve (default is 20).
 * @param skip The number of artifacts to skip (default is 0).
 * @returns An array of retrieved artifacts.
 * @throws If there is an error in the request or validation process.
 */
export default async function getArtifacts({
  first = 20,
  skip = 0,
  organizationId,
}: GetArtifactsInput = {}) {
  const validGetArtifactsInput = getArtifactsInputSchema.parse({
    first,
    skip,
    organizationId,
  })
  const {
    first: validatedFirst,
    skip: validatedSkip,
    organizationId: validatedOrganizationId,
  } = validGetArtifactsInput
  try {
    const response = await request<unknown>(GQL_URL, {
      unwrapData: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_ARTIFACTS_QUERY,
        variables: {
          first: validatedFirst,
          skip: validatedSkip,
          organizationId: validatedOrganizationId,
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
