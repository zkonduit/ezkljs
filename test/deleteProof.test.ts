// import hub from '../src'
// import { GQL_URL } from '../src/utils/constants'
// import { createArtifact, createProof } from './utils'

import hub from '../src'
import { GQL_URL } from '../src/utils/constants'
import { createArtifact, createProof } from './utils'

// describe('delete proof', () => {
//   let artifactId: string
//   let cleanupArtifact: () => Promise<void>

//   let proofId: string

//   beforeAll(async () => {
//     const { id, cleanup } = await createArtifact('test delete proof')

//     cleanupArtifact = cleanup
//     artifactId = id

//     const { proofId: newProof } = await createProof(artifactId)
//     proofId = newProof
//   }, 30_000)

//   it('deletes a proof', async () => {
//     const deletedProofId = await hub.deleteProof({
//       url: GQL_URL,
//       organizationName: 'currenthandle',
//       proofId: proofId,
//     })

//     expect(deletedProofId).toBeDefined()
//     expect(deletedProofId).toBe(proofId)

//     // const getResp = await hub.getProof({
//     //   url: GQL_URL,
//     //   id: proofId,
//     // })

//     // expect(getResp).toBeUndefined()
//   })

//   afterAll(async () => {
//     await cleanupArtifact()
//   })
// })

// it('true to be true', () => {
//   expect(true).toBe(true)
// })

let id: string
let proofId: string
let cleanup: () => Promise<void>

beforeAll(async () => {
  const resp = await createArtifact(`delete proof ${Date.now()}`)

  console.log('resp', resp)
  id = resp.id
  cleanup = resp.cleanup

  // proof = await createProof(id)
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
