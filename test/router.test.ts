import hub from '../dist/bundle.cjs'

import path from 'path'
import fs from 'node:fs/promises'
import {
  Artifact,
  GetProofDetails,
  InitiateProofResponse,
} from '../dist/utils/parsers'

const { getArtifacts } = hub

let artifacts: Artifact[] | undefined
let initiatedProof: InitiateProofResponse['initiateProof'] | undefined

describe('hub', () => {
  it('checks health', async () => {
    expect(hub.healthCheck).toBeDefined()
    const health = await hub.healthCheck()
    expect(health?.status).toEqual('ok')
    expect(health?.res).toEqual("Welcome to the ezkl hub's backend!")
  })
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
        const filePath = path.resolve(
          __dirname,
          'proof_artifacts',
          'input.json',
        )
        const file = await fs.readFile(filePath)
        initiatedProof = await hub.initiateProof(artifactId, file)

        if (!initiatedProof) {
          throw new Error('No initiatedProof returned')
        }
      } else {
        throw new Error('No first artifact found')
      }
    })

    it('initiate proof', async () => {
      if (!initiatedProof) {
        throw new Error('initiatedProof undefined')
      }

      expect(hub.initiateProof).toBeDefined()
      expect(initiatedProof).toBeDefined()

      expect(initiatedProof.status).toEqual('PENDING')
    })

    it('retrieve proof', async () => {
      if (!initiatedProof) {
        throw new Error('initiatedProof undefined')
      }

      await new Promise((resolve) => setTimeout(resolve, 5000)) // wait for 5 seconds
      const getProofDetails: GetProofDetails | undefined = await hub.getProof(
        initiatedProof.taskId,
      )

      if (!getProofDetails) {
        throw new Error('No getProofDetails returned')
      }

      expect(getProofDetails.status).toEqual('SUCCESS')
      expect(getProofDetails.taskId).toEqual(initiatedProof.taskId)

      expect(getProofDetails?.witness?.inputs).toBeDefined()
      expect(getProofDetails?.witness?.outputs).toBeDefined()
    }, 10000)
  })
})
