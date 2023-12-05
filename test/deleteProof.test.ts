import hub from '../src'
import { GQL_URL } from '../src/utils/constants'
import { createArtifact, createProof } from './utils'

let id: string
let proofId: string
let cleanup: () => Promise<void>

beforeAll(async () => {
  const resp = await createArtifact(`delete proof ${Date.now()}`)

  id = resp.id
  cleanup = resp.cleanup

  proofId = await createProof(id)
}, 40_000)

it('deletes a proof', async () => {
  const deletedProofId = await hub.deleteProof({
    url: GQL_URL,
    organizationName: 'currenthandle',
    proofId: proofId,
  })

  expect(deletedProofId).toBeDefined()
  expect(deletedProofId).toBe(proofId)

  const getResp = await hub.getProof({
    id: proofId,
    url: GQL_URL,
  })

  expect(getResp).toBeNull()
})

afterAll(async () => {
  await cleanup()
})
