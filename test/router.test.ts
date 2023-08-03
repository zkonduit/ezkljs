import {
  Router,
  Artifact,
  ProveResponse,
  ProofDetails,
} from '../src/submodules/router'
import path from 'path'
import fs from 'node:fs/promises'
import { isValidV4UUID, isValidHexString } from '../src/utils/stringValidators'

const { getArtifacts } = Router

let artifacts: Artifact[]
let proofStatus: ProveResponse['prove']

jest.setTimeout(10000) // Set a default timeout of 10 seconds for all tests in this file

describe('router', () => {
  it('get artifacts', async () => {
    expect(getArtifacts).toBeDefined()
    artifacts = await getArtifacts()
    if (artifacts && artifacts.length > 0) {
      const firstArtifact = artifacts[0]
      if (firstArtifact) {
        expect(firstArtifact.name).toBeDefined()
        expect(firstArtifact.description).toBeDefined()
        expect(firstArtifact.id).toBeDefined()
      } else {
        throw new Error('No first artifact found')
      }
    } else {
      throw new Error('No artifacts returned from getArtifacts')
    }
  })

  describe('proof related operations', () => {
    beforeAll(async () => {
      const artifact = artifacts[0]
      if (artifact) {
        const artifactId = artifact.id
        const filePath = path.resolve(__dirname, './data/input.json')
        const file = await fs.readFile(filePath)
        proofStatus = await Router.initiateProof(artifactId, file)
      } else {
        throw new Error('No first artifact found')
      }
    })

    it('initiate proof', async () => {
      expect(Router.initiateProof).toBeDefined()
      expect(proofStatus).toBeDefined()
      expect(proofStatus.taskId).toBeDefined()
      expect(proofStatus.status).toBeDefined()
      expect(proofStatus.status).toEqual('PENDING')
      expect(isValidV4UUID(proofStatus.taskId)).toEqual(true)
    })

    it('retrieve proof', async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000)) // wait for 5 seconds
      const proof: ProofDetails = await Router.getProof(proofStatus.taskId)
      expect(proof).toBeDefined()
      expect(proof.proof).toBeDefined()
      expect(proof.proof).toEqual(expect.any(String))
      expect(isValidHexString(proof.proof)).toEqual(true)
      expect(proof.status).toEqual('SUCCESS')
      expect(proof.taskId).toEqual(proofStatus.taskId)
      expect(proof.witness).toBeDefined()
      expect(proof.witness.inputs).toBeDefined()
      expect(proof.witness.outputs).toBeDefined()
    })
  })
})
