// export function getOrganization({

import { GQL_URL } from '@/utils/constants'
import { urlSchema, uuidSchema } from '@/utils/parsers'
import request from '@/utils/request'
import { z } from 'zod'

const artifactSchema = z.object({
  name: z.string(),
  description: z.string(),
  id: uuidSchema,
  createdAt: z.string(),
})
const organizationSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  artifacts: z.array(artifactSchema),
})

type Organization = z.infer<typeof organizationSchema>

const orgInputSchema = z.intersection(
  z.object({ url: urlSchema }),
  z.union([
    z.object({
      id: uuidSchema,
    }),
    z.object({
      name: z.string(),
    }),
  ]),
)

type OrgInput = z.infer<typeof orgInputSchema>

/**
 * Fetches an organization by id or name.
 * @param input - The input object containing:
 *   - `id` The id of the organization.
 *   - `name` The name of the organization.
 *   - `url` (optional) The endpoint URL. Defaults to GQL_URL if not provided.
 * @returns The organization.
 * @throws If there is an error in the request or validation process.
 */
export default async function getOrganization(
  input: OrgInput,
): Promise<Organization> {
  const { url = GQL_URL } = input
  const validatedUrl = urlSchema.parse(url)

  let query
  if ('id' in input && input.id !== undefined) {
    query = `query {
      organizations(id: "${input.id}") {
        id
        name
        artifacts {
          id
          name
          description
          createdAt
        }
      }
    }`
  } else if ('name' in input && input.name !== undefined) {
    query = `query {
      organizations(name: "${input.name}") {
        id
        name
        artifacts {
          id
          name
          description
          createdAt
        }
      }
    }`
  } else {
    throw new Error("Either 'id' or 'name' must be provided")
  }

  try {
    const response = await request<unknown>(validatedUrl, {
      // logs: true,
      unwrapData: true,
      // cache: "no-store",
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    const respSchema = z.object({
      organizations: z.array(organizationSchema),
    })

    const validatedResp = respSchema.parse(response)
    const org = validatedResp.organizations[0]

    return org
  } catch (e) {
    console.error(e)
    throw e
  }
}
