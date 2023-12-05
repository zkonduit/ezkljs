import { setTimeout } from 'timers/promises'
import hub from '../src'
import { GQL_URL } from '../src/utils/constants'
import { createArtifact, createProof } from './utils'
// import { Proof } from '../src/utils/parsers'

let id: string
let proofId: string
let cleanup: () => Promise<void>

beforeAll(async () => {
  // const resp = await createArtifact('get proof')
  const resp = await createArtifact(`get proof ${Date.now()}`)
  id = resp.id
  cleanup = resp.cleanup

  proofId = await createProof(id)
}, 30_000)

it('should return a proof', async () => {
  const fetchedProof = await hub.getProof({
    id: proofId,
    url: GQL_URL,
  })

  if (!fetchedProof) {
    throw new Error('proof not found')
  }

  expect(fetchedProof).toBeDefined()
})

it('should not return a proof, after delteing the proof', async () => {
  const deleted = await hub.deleteProof({
    proofId,
    organizationName: 'currenthandle',
    url: GQL_URL,
  })

  setTimeout(3_000)

  expect(deleted).toBeDefined()

  const fetchedProof = await hub.getProof({
    id: proofId,
    url: GQL_URL,
  })

  expect(fetchedProof).toBeNull()
})

afterAll(async () => {
  await cleanup()
})
