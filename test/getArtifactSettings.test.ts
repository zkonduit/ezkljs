// import hub from '../dist/bundle.cjs'
import { z } from 'zod'
import hub from '../src'

const baseUrl = 'https://hub-staging.ezkl.xyz' as const

interface ArtifactSettingsResponse {
  num_rows: number
}

describe('get artifacts settings', () => {
  it('gets an artifact by id', async () => {
    const settingsResp = await hub.getArtifactSettings({
      url: baseUrl,
      id: '3f47f257-601a-4ba8-8216-e3aa4959fac7',
    })

    expect(settingsResp).toBeDefined()

    const typedSettingsResp = settingsResp as ArtifactSettingsResponse
    expect(typedSettingsResp['num_rows']).toBeGreaterThan(0)
  })
})
