import { GEN_ARTIFACT_MUTATION } from '@/graphql/mutations'
import { GQL_URL } from '@/utils/constants'
import {
  FileOrBuffer,
  fileOrBufferSchema,
  genArtifactResponseSchema,
} from '@/utils/parsers'
import request from '@/utils/request'

/**
 * Uploads an artifact, consisting of model, settings, and pk files.
 * @param modelFile The model file as a Buffer or File.
 * @param settingsFile The settings file as a Buffer or File.
 * @param pkFile The pk file as a Buffer or File.
 * @returns An object containing the id of the uploaded artifact.
 * @throws If there is an error in the request or validation process.
 */
export default async function genArtifact(
  name: string,
  description: string,
  uncompiledModelFile: FileOrBuffer,
  inputFile: FileOrBuffer,
  organizationId: string
) {
  const validatedUncompiledModelFile =
    fileOrBufferSchema.parse(uncompiledModelFile)
  const validatedInputFile = fileOrBufferSchema.parse(inputFile)

  const operations = {
    query: GEN_ARTIFACT_MUTATION,
    variables: {
      name,
      description,
      validatedUncompiledModelFile,
      validatedInputFile,
      organizationId,
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
    const genArtifactResponse = await request<unknown>(GQL_URL, {
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