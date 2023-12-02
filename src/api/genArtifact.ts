import { GEN_ARTIFACT_MUTATION } from '@/graphql/mutations'
import { GQL_URL } from '@/utils/constants'
import {
  FileOrBuffer,
  fileOrBufferSchema,
  genArtifactResponseSchema,
  uuidSchema,
} from '@/utils/parsers'
import request from '@/utils/request'
import { z } from 'zod'
import authHeaders from '@/utils/authHeaders'

type Visibility = 'private' | 'public' | 'fixed'

type GenArtifactOptions = {
  name: string
  description: string
  uncompiledModelFile: FileOrBuffer
  inputFile: FileOrBuffer
  organizationId: string
  accessToken?: string
  apiKey?: string
  url?: string
  inputVisibility?: Visibility
  outputVisibility?: Visibility
  paramVisibility?: Visibility
}

/**
 * Generates an artifact using the given model, settings, and input files.
 * @param options - The options object containing:
 *   - `name` The name of the artifact.
 *   - `description` A description of the artifact.
 *   - `uncompiledModelFile` The uncompiled model file as a Buffer or File.
 *   - `inputFile` The input file as a Buffer or File.
 *   - `organizationId` The ID of the organization.
 *   - `inputVisbility` (optional)
 *   - `outputVisibility` (optional)
 *   - `paramVisibility` (optional)
 *   - `accessToken` (optional) The access token obtained after the oauth2 authorization flow
 *   - `apiKey` (optional) The API Key created by a user
 *   - `url` (optional) The endpoint URL. Defaults to GQL_URL if not provided.
 * @returns The response from the artifact generation process.
 * @throws If there is an error in the request or validation process.
 */
export default async function genArtifact({
  name,
  description,
  uncompiledModelFile,
  inputFile,
  organizationId,
  accessToken,
  apiKey,
  inputVisibility = 'public',
  outputVisibility = 'public',
  paramVisibility = 'public',
  url = GQL_URL,
}: GenArtifactOptions): Promise<string | undefined> {
  const validatedName = z.string().parse(name)
  const validatedDescription = z.string().parse(description)
  const validatedOrganizationId = uuidSchema.parse(organizationId)

  const validatedUncompiledModelFile =
    fileOrBufferSchema.parse(uncompiledModelFile)
  const validatedInputFile = fileOrBufferSchema.parse(inputFile)

  const operations = {
    query: GEN_ARTIFACT_MUTATION,
    variables: {
      name: validatedName,
      description: validatedDescription,
      organizationId: validatedOrganizationId,
      inputVisibility,
      outputVisibility,
      paramVisibility,
      validatedUncompiledModelFile,
      validatedInputFile,
    },
  }

  const map = {
    uncompiledModel: ['variables.uncompiledModel'],
    input: ['variables.input'],
  }

  const body = new FormData()
  body.append('operations', JSON.stringify(operations))
  body.append('map', JSON.stringify(map))
  body.append('uncompiledModel', new Blob([validatedUncompiledModelFile]))
  body.append('input', new Blob([validatedInputFile]))

  // const headers = authHeaders(apiKey, accessToken)
  let headers

  if (apiKey && accessToken) {
    headers = authHeaders(apiKey, accessToken)
  }

  try {
    const genArtifactResponse = await request<unknown>(url, {
      unwrapData: true,
      method: 'POST',
      body,
      headers,
    })

    const validatedGenArtifactResponse =
      genArtifactResponseSchema.parse(genArtifactResponse)

    return validatedGenArtifactResponse.generateArtifact.id
  } catch (e) {
    console.error(e)
    throw e
  }
}
