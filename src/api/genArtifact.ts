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

type GenArtifactOptions = {
  name: string
  description: string
  uncompiledModelFile: FileOrBuffer
  inputFile: FileOrBuffer
  organizationId: string
  url?: string
}

/**
 * Generates an artifact using the given model, settings, and input files.
 * @param options - The options object containing:
 *   - `name` The name of the artifact.
 *   - `description` A description of the artifact.
 *   - `uncompiledModelFile` The uncompiled model file as a Buffer or File.
 *   - `inputFile` The input file as a Buffer or File.
 *   - `organizationId` The ID of the organization.
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
  url = GQL_URL,
}: GenArtifactOptions) {
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

  try {
    const genArtifactResponse = await request<unknown>(url, {
      unwrapData: true,
      method: 'POST',
      body,
    })

    const validatedGenArtifactResponse =
      genArtifactResponseSchema.parse(genArtifactResponse)

    return validatedGenArtifactResponse.generateArtifact.artifact.id
  } catch (e) {
    console.error(e)
    throw e
  }
}
