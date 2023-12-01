import { UPLOAD_ARTIFACTE_MUTATION } from '@/graphql/mutations'
import { GQL_URL } from '@/utils/constants'
import {
  FileOrBuffer,
  fileOrBufferSchema,
  uploadArtifactSchema,
  urlSchema,
  uuidSchema,
} from '@/utils/parsers'
import request from '@/utils/request'
import { z } from 'zod'
import authHeaders from '@/utils/authHeaders'

type UploadArtifactOptions = {
  name: string
  description: string
  modelFile: FileOrBuffer
  settingsFile: FileOrBuffer
  pkFile: FileOrBuffer
  organizationId: string
  accessToken?: string
  apiKey?: string
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
 *   - `accessToken` (optional) The access token obtained after the oauth2 authorization flow
 *   - `apiKey` (optional) The API Key created by a user
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
  accessToken,
  apiKey,
  url = GQL_URL,
}: UploadArtifactOptions) {
  const validatedName = z.string().parse(name)
  const validatedDescription = z.string().parse(description)
  const validatedModelFile = fileOrBufferSchema.parse(modelFile)
  const validatedSettingsFile = fileOrBufferSchema.parse(settingsFile)
  const validatedPkFile = fileOrBufferSchema.parse(pkFile)
  const validatedOrganizationId = uuidSchema.parse(organizationId)
  const validatedUrl = urlSchema.parse(url)

  const operations = {
    query: UPLOAD_ARTIFACTE_MUTATION,
    variables: {
      name: validatedName,
      description: validatedDescription,
      organizationId: validatedOrganizationId,
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

  // const headers = authHeaders(apiKey, accessToken)

  let headers

  if (apiKey && accessToken) {
    headers = authHeaders(apiKey, accessToken)
  }

  try {
    const uploadArtifactResponse = await request<unknown>(validatedUrl, {
      unwrapData: true,
      method: 'POST',
      body,
      headers,
    })

    const validatedUploadArtifactResponse = uploadArtifactSchema.parse(
      uploadArtifactResponse,
    )

    return validatedUploadArtifactResponse.uploadArtifactLegacy
  } catch (e) {
    console.error('ERROR:', e)
    throw e
  }
}
