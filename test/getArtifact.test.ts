import hub from '../src'

const baseUrl = 'https://hub-staging.ezkl.xyz' as const
const gqlUrl = `${baseUrl}/graphql` as const
const artifactId = 'b0b8c895-5dc1-4ebe-93d7-2e19bf2c5b19'

describe('getArtifact', () => {
  it('gets an artifact by name', async () => {
    const artifact = await hub.getArtifact({
      url: gqlUrl,
      name: 'globe',
      organizationName: 'currenthandle',
    })
    expect(artifact?.organization.name).toEqual('currenthandle')
  })
  it('gets an artifact by id', async () => {
    const artifact = await hub.getArtifact({
      url: gqlUrl,
      id: artifactId,
    })

    expect(artifact?.organization.name).toEqual('currenthandle')
  })
})
