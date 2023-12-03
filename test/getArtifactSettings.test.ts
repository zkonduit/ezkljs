// import hub from '../dist/bundle.cjs'
import fs from 'node:fs'
import hub from '../src'
import { setTimeout } from 'node:timers/promises'
import path from 'node:path'
import { GQL_URL, ORG_ID } from '../src/utils/constants'

const baseUrl = 'https://hub-staging.ezkl.xyz' as const

interface ArtifactSettingsResponse {
  num_rows: number
}

const artifactName = `test Artifact settings ${Date.now()}`

describe('get artifacts settings', () => {
  let id: string | undefined

  beforeAll(async () => {
    const modelFile = fs.readFileSync(
      path.resolve(__dirname, 'proof_artifacts', 'network.onnx'),
    )
    const inputFile = fs.readFileSync(
      path.resolve(__dirname, 'proof_artifacts', 'input.json'),
    )

    if (!modelFile) {
      throw new Error('modelFile not found')
    }

    if (!inputFile) {
      throw new Error('inputFile not found')
    }

    id = await hub.genArtifact({
      description: 'test delete artifact',
      name: artifactName,
      organizationId: ORG_ID,
      uncompiledModelFile: modelFile,
      inputFile,
      url: GQL_URL,
    })

    if (!id) {
      throw new Error('id not found')
    }

    await setTimeout(8_000)
  }, 10_0000)

  it('gets an artifact by id', async () => {
    if (!id) {
      throw new Error('id not found')
    }
    const settingsResp = await hub.getArtifactSettings({
      url: baseUrl,
      id,
    })

    expect(settingsResp).toBeDefined()
    const typedSettingsResp = settingsResp as ArtifactSettingsResponse
    expect(typedSettingsResp.num_rows).toBeDefined()
  }, 10_000)

  afterAll(async () => {
    if (!id) {
      throw new Error('id not found')
    }
    try {
      const deletedArtifact = await hub.deleteArtifact({
        name: artifactName,
        organizationName: 'currenthandle',
        url: GQL_URL,
      })
      expect(deletedArtifact).toBeDefined()
      expect(deletedArtifact).toEqual(id)
    } catch (e) {
      console.log('error', e)
    }
  })
})
