import { UPLOAD_ARTIFACTE_MUTATION } from '@/graphql/mutations'
import { GQL_URL } from '@/utils/constants'
import {
  FileOrBuffer,
  fileOrBufferSchema,
  uploadArtifactSchema,
} from '@/utils/parsers'
import request from '@/utils/request'
import throwError from '@/utils/throwError'

/**
 * Uploads an artifact, consisting of model, settings, and pk files.
 * @param modelFile The model file as a Buffer or File.
 * @param settingsFile The settings file as a Buffer or File.
 * @param pkFile The pk file as a Buffer or File.
 * @returns An object containing the id of the uploaded artifact.
 * @throws If there is an error in the request or validation process.
 */
export default async function uploadArtifact(
  modelFile: FileOrBuffer,
  settingsFile: FileOrBuffer,
  pkFile: FileOrBuffer,
) {
  const validatedModelFile = fileOrBufferSchema.parse(modelFile)
  const validatedSettingsFile = fileOrBufferSchema.parse(settingsFile)
  const validatedPkFile = fileOrBufferSchema.parse(pkFile)

  const operations = {
    query: UPLOAD_ARTIFACTE_MUTATION,
    variables: {
      validatedModelFile,
      validatedSettingsFile,
      validatedPkFile,
    },
  }

  const map = {
    model: ['variables.model'],
    settings: ['variables.settings'],
    pk: ['variables.pk'],
  }

  const body = new FormData()
  body.append('operations', JSON.stringify(operations))
  body.append('map', JSON.stringify(map))
  body.append('model', new Blob([validatedModelFile]))
  body.append('settings', new Blob([validatedSettingsFile]))
  body.append('pk', new Blob([validatedPkFile]))

  try {
    const uploadArtifactResponse = await request<unknown>(GQL_URL, {
      unwrapData: true,
      method: 'POST',
      body,
    })

    const validatedUploadArtifactResponse = uploadArtifactSchema.parse(
      uploadArtifactResponse,
    )

    return validatedUploadArtifactResponse.uploadArtifact
  } catch (e) {
    throwError(e)
  }
}
