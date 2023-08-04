import {
  Router,
  Artifact,
  // ProveResponse,
  InitiateProofResponse,
  ProofDetails,
} from '../src/submodules/router'
import path from 'path'
import fs from 'node:fs/promises'
import { isValidV4UUID, isValidHexString } from '../src/utils/stringValidators'

const { getArtifacts } = Router

let artifacts: Artifact[] | undefined
let proofStatus: InitiateProofResponse['initiateProof'] | undefined

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
      if (!artifacts || artifacts.length === 0) {
        throw new Error('No artifacts')
      }
      const artifact = artifacts[0]
      if (artifact) {
        const artifactId = artifact.id
        const filePath = path.resolve(__dirname, 'input.json')
        const file = await fs.readFile(filePath)
        proofStatus = await Router.initiateProof(artifactId, file)

        if (!proofStatus) {
          throw new Error('No proofStatus returned')
        }
      } else {
        throw new Error('No first artifact found')
      }
    })

    it('initiate proof', async () => {
      if (!proofStatus) {
        throw new Error('proofStatus undefined')
      }

      expect(Router.initiateProof).toBeDefined()
      expect(proofStatus).toBeDefined()

      expect(proofStatus.status).toEqual('PENDING')
      expect(isValidV4UUID(proofStatus.taskId)).toEqual(true)
    })

    it('retrieve proof', async () => {
      if (!proofStatus) {
        throw new Error('proofStatus undefined')
      }

      await new Promise((resolve) => setTimeout(resolve, 5000)) // wait for 5 seconds
      const proof: ProofDetails | undefined = await Router.getProof(
        proofStatus.taskId,
      )

      if (!proof) {
        throw new Error('No proof returned')
      }

      expect(isValidHexString(proof.proof)).toEqual(true)

      expect(proof.status).toEqual('SUCCESS')
      expect(proof.taskId).toEqual(proofStatus.taskId)

      expect(proof.witness.inputs).toBeDefined()
      expect(proof.witness.outputs).toBeDefined()
    }, 10000)
  })
})
