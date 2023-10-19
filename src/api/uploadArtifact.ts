import { UPLOAD_ARTIFACTE_MUTATION } from '@/graphql/mutations'
import { GQL_URL } from '@/utils/constants'
import {
  FileOrBuffer,
  fileOrBufferSchema,
  uploadArtifactSchema,
} from '@/utils/parsers'
import request from '@/utils/request'

type UploadArtifactOptions = {
  name: string
  description: string
  modelFile: FileOrBuffer
  settingsFile: FileOrBuffer
  pkFile: FileOrBuffer
  organizationId: string
  url?: string // Making url optional
}

/**
 * Uploads an artifact, consisting of model, settings, and pk files.
 * @param options - The options object containing:
 *   - `name` The name of the artifact.
 *   - `description` A description of the artifact.
 *   - `modelFile` The model file as a Buffer or File.
 *   - `settingsFile` The settings file as a Buffer or File.
 *   - `pkFile` The pk file as a Buffer or File.
 *   - `organizationId` The ID of the organization.
 *   - `url` (optional) The endpoint URL. Defaults to GQL_URL if not provided.
 * @returns An object containing the id of the uploaded artifact.
 * @throws If there is an error in the request or validation process.
 */

export default async function uploadArtifact({
  name,
  description,
  modelFile,
  settingsFile,
  pkFile,
  organizationId,
  url = GQL_URL,
}: UploadArtifactOptions) {
  const validatedModelFile = fileOrBufferSchema.parse(modelFile)
  const validatedSettingsFile = fileOrBufferSchema.parse(settingsFile)
  const validatedPkFile = fileOrBufferSchema.parse(pkFile)

  const operations = {
    query: UPLOAD_ARTIFACTE_MUTATION,
    variables: {
      name,
      description,
      validatedModelFile,
      validatedSettingsFile,
      validatedPkFile,
      organizationId,
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
    const uploadArtifactResponse = await request<unknown>(url, {
      unwrapData: true,
      method: 'POST',
      body,
    })

    const validatedUploadArtifactResponse = uploadArtifactSchema.parse(
      uploadArtifactResponse,
    )

    return validatedUploadArtifactResponse.uploadArtifactLegacy
  } catch (e) {
    console.error(e)
    throw e
  }
}
