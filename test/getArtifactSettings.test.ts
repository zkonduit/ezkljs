import hub from '../src'
import { createArtifact } from './utils'

const baseUrl = 'https://hub-staging.ezkl.xyz' as const

interface ArtifactSettingsResponse {
  num_rows: number
}

const artifactName = `test Artifact settings ${Date.now()}`

describe('get artifacts settings', () => {
  let artifactId: string
  let cleanup: () => Promise<void>

  beforeAll(async () => {
    const resp = await createArtifact(artifactName)

    artifactId = resp.id
    cleanup = resp.cleanup
  }, 40_000)

  it('gets an artifact by id', async () => {
    if (!artifactId) {
      throw new Error('artifactId not found')
    }
    const settingsResp = await hub.getArtifactSettings({
      url: baseUrl,
      id: artifactId,
    })

    expect(settingsResp).toBeDefined()
    const typedSettingsResp = settingsResp as ArtifactSettingsResponse
    expect(typedSettingsResp.num_rows).toBeDefined()
  }, 10_000)

  afterAll(async () => {
    await cleanup()
  })
})
