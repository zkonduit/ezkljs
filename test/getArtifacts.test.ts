import hub from '../src'
import { GQL_URL, ORG_ID } from '../src/utils/constants'

describe('get artifacts', () => {
  it('gets artifacts by organizationName', async () => {
    const artifacts = await hub.getArtifacts({
      url: GQL_URL,
      organizationName: 'currenthandle',
    })

    expect(artifacts).toBeDefined()
    // expect(artifacts?.length).toBeGreaterThan(0)
  })

  it('gets artifacts by organizationId', async () => {
    const artifacts = await hub.getArtifacts({
      url: GQL_URL,
      organizationId: ORG_ID,
    })

    expect(artifacts).toBeDefined()
    // expect(artifacts?.length).toBeGreaterThan(0)
  })

  it('should have all the fields', async () => {
    const artifacts = await hub.getArtifacts({
      url: GQL_URL,
      organizationId: ORG_ID,
    })

    expect(artifacts).toBeDefined()
    expect(artifacts?.length).toBeGreaterThan(0)

    const artifact = artifacts?.[0]
    expect(artifact?.id).toBeDefined()
    expect(artifact?.name).toBeDefined()
    expect(artifact?.description).toBeDefined()
    expect(artifact?.organization).toBeDefined()
    expect(artifact?.createdAt).toBeDefined()
    expect(artifact?.status).toBeDefined()
    expect(artifact?.uncompiledModel).toBeDefined()
  })

  afterAll(async () => {})
})
