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
})

it('initiates a proof', async () => {
  const inputFile = getInput()
  const proofId = await hub.initiateProof({
    url: GQL_URL,
    artifactId,
    inputFile,
  })

  expect(proofId).toBeDefined()
  expect(proofId).toBe(proofId)
})

afterAll(async () => {
  await deleteArtifact()
})
