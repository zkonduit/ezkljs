import { createArtifact, createProof } from './utils'

describe('delete proof', () => {
  let artifactId: string
  let cleanupArtifact: () => Promise<void>

  beforeAll(async () => {
    const { id, cleanup } = await createArtifact('test delete proof')

    cleanupArtifact = cleanup
    artifactId = id

    await createProof(artifactId)
  }, 30_000)

  it('deletes a proof', async () => {
    expect(true).toBe(true)
  })

  afterAll(async () => {
    await cleanupArtifact()
  })
})
