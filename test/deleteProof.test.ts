import hub from '../src'
import { GQL_URL } from '../src/utils/constants'
import { createArtifact, createProof } from './utils'

describe('delete proof', () => {
  let artifactId: string
  let cleanupArtifact: () => Promise<void>

  let proofId: string

  beforeAll(async () => {
    const { id, cleanup } = await createArtifact('test delete proof')

    cleanupArtifact = cleanup
    artifactId = id

    const { proofId: newProof } = await createProof(artifactId)
    proofId = newProof
  }, 30_000)

  it('deletes a proof', async () => {
    const deletedProofId = await hub.deleteProof({
      url: GQL_URL,
      organizationName: 'currenthandle',
      proofId: proofId,
    })

    expect(deletedProofId).toBeDefined()
    expect(deletedProofId).toBe(proofId)
  })

  afterAll(async () => {
    await cleanupArtifact()
  })
})
