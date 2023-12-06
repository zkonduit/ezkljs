import hub from '../src'
import { GQL_URL } from '../src/utils/constants'

import { createArtifact } from './utils'

describe('delete artifact', () => {
  let id: string | undefined

  const artifactName = `test delete artifact 4 ${Date.now()}`
  beforeAll(async () => {
    const { id: _id } = await createArtifact(artifactName)

    id = _id
  }, 40_000)

  it('deletes an artifact', async () => {
    const deletedArtifact = await hub.deleteArtifact({
      name: artifactName,
      organizationName: 'currenthandle',
      url: GQL_URL,
    })

    expect(deletedArtifact).toBeDefined()
    expect(deletedArtifact).toEqual(id)
  })

  it("throws an error if the artifact does't exist", async () => {
    try {
      const deletedArtifact = await hub.deleteArtifact({
        name: 'not a real artifact',
        organizationName: 'currenthandle',
        url: GQL_URL,
      })

      expect(deletedArtifact).toBeDefined()
    } catch (e) {
      expect(e.message).toEqual(
        'No artifacts found matching the provided criteria.',
      )
    }
  })
})
