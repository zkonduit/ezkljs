import hub from '../src'
import { GQL_URL } from '../src/utils/constants'
import { createArtifact, getInput } from './utils'

let artifactId: string
let deleteArtifact: () => Promise<void>

beforeAll(async () => {
  const artifactName = `delete proof ${Date.now()}`
  const { id, cleanup } = await createArtifact(artifactName)

  artifactId = id
  deleteArtifact = cleanup
}, 40_000)

it('initiates a proof', async () => {
  const inputFile = getInput()
  const proof = await hub.initiateProof({
    url: GQL_URL,
    artifactId,
    inputFile,
  })

  expect(proof).toBeDefined()
  expect(proof.id).toBeDefined()
  expect(proof.status).toMatch(/PENDING|SUCCESS/)
})

afterAll(async () => {
  await deleteArtifact()
})
