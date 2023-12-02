import request from '@/utils/request'
import { GQL_URL } from '@/utils/constants'
import {
  artifactsResponseSchema,
  // GetArtifactsInput,
  // getArtifactsInputSchema,
} from '@/utils/parsers'
// import { GET_ARTIFACTS_QUERY } from '@/graphql/querties'
import { z } from 'zod'

const userProvidedGetArtifactsOptions = z.object({
  organizationName: z.string().optional(),
  organizationId: z.string().uuid().optional(),
  first: z.number().int().optional(),
  skip: z.number().int().optional(),
  url: z.string().url().optional(),
})

type UserProvidedGetArtifactsOptions = z.infer<
  typeof userProvidedGetArtifactsOptions
>
/**
 * Fetches a list of artifacts with optional pagination parameters.
 * @param options - The options object containing:
 *   - `organizationName` The name of the organization.
 *   - `organizationId` The id of the organization.
 *   - `first` The number of artifacts to retrieve. Defaults to 200.
 *   - `skip` The number of artifacts to skip. Defaults to 0.
 *   - `url` (optional) The endpoint URL. Defaults to GQL_URL if not provided.
 * @returns An array of retrieved artifacts.
 * @throws If there is an error in the request or validation process.
 */
export default async function getArtifacts(
  options: UserProvidedGetArtifactsOptions,
) {
  const config = { first: 200, skip: 0, url: GQL_URL, ...options }

  const orgIdentifier = (() => {
    if (config.organizationName) {
      return `organizationName: "${config.organizationName}"`
    } else if (config.organizationId) {
      return `organizationId: "${config.organizationId}"`
    } else {
      throw new Error(
        'Must provide either organizationName or organizationId to get artifacts',
      )
    }
  })()
  const query = buildArtifactsQuery(orgIdentifier, config.skip, config.first)

  try {
    const response = await request<unknown>(
      z.string().url().parse(config.url),
      {
        unwrapData: true,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
        // body: JSON.stringify({
        //   query: GET_ARTIFACTS_QUERY,
        //   variables: {
        //     first,
        //     skip,
        //   },
        // }),
      },
    )

    const validatedArtifactsResponse = artifactsResponseSchema.parse(response)

    return validatedArtifactsResponse.artifacts
  } catch (e) {
    console.error(e)
    throw e
  }
}

function buildArtifactsQuery(
  orgIdentifier: string,
  skip: number,
  first: number,
) {
  return `query Artifacts  {
      artifacts (
        ${orgIdentifier}, skip: ${skip}, first: ${first}
        orderBy: {field: "createdAt", order: ASC}
      ) {
        id
        name
        createdAt
        status
        uncompiledModel
        description
        organization {
          id
          name
        }
      }
    }`
}
