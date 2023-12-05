import hub from '../src'
import { createArtifact } from './utils'
import { GQL_URL } from '../src/utils/constants'

describe('getArtifact', () => {
  const artifactName = `test getArtifact ${Date.now()}`
  let deleteArtifact: () => Promise<void>
  let artifactId: string

  beforeAll(async () => {
    const { cleanup, id } = await createArtifact(artifactName)

    deleteArtifact = cleanup
    artifactId = id
  }, 40_000)

  it('gets an artifact by name', async () => {
    const artifact = await hub.getArtifact({
      url: GQL_URL,
      name: artifactName,
      organizationName: 'currenthandle',
    })
    expect(artifact?.organization.name).toEqual('currenthandle')
  })

  it('gets an artifact by id', async () => {
    const artifact = await hub.getArtifact({
      url: GQL_URL,
      id: artifactId,
    })

    expect(artifact?.organization.name).toEqual('currenthandle')
  })

  afterAll(async () => {
    await deleteArtifact()
  })
})
