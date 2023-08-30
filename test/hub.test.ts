import hub from '../dist/bundle.cjs'
// import hub from '../src/'

import path from 'path'
import fs from 'node:fs/promises'
import {
  Artifact,
  GetProofDetails,
  InitiateProofResponse,
} from '../dist/utils/parsers'

const { getArtifacts } = hub

let artifact: Artifact | undefined
let initiatedProof: InitiateProofResponse['initiateProof'] | undefined

describe('hub', () => {
  it('checks health', async () => {
    expect(hub.healthCheck).toBeDefined()
    const health = await hub.healthCheck()
    expect(health?.status).toEqual('ok')
    expect(health?.res).toEqual("Welcome to the ezkl hub's backend!")
  })
  describe('artifact related', () => {
    it('get artifacts', async () => {
      expect(getArtifacts).toBeDefined()
      const artifacts = await getArtifacts()
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

    it('uploads an arifact', async () => {
      const settingsPath = path.resolve(
        __dirname,
        'proof_artifacts',
        'settings.json',
      )
      const settingsFile = await fs.readFile(settingsPath)

      const modelPath = path.resolve(
        __dirname,
        'proof_artifacts',
        'network.ezkl',
      )
      const modelFile = await fs.readFile(modelPath)

      const pkPath = path.resolve(__dirname, 'proof_artifacts', 'pk.key')
      const pkFile = await fs.readFile(pkPath)

      const uploadArtifactResp = await hub.uploadArtifact(
        modelFile,
        settingsFile,
        pkFile,
      )

      artifact = uploadArtifactResp

      expect(uploadArtifactResp.id).toBeDefined()
    }, 10000)
  })

  describe('proof related operations', () => {
    beforeAll(async () => {
      if (!artifact) {
        throw new Error('no artifact')
      }
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

    it('get proof', async () => {
      expect(true).toBe(true)
      if (!initiatedProof) {
        throw new Error('initiatedProof undefined')
      }

      await new Promise((resolve) => setTimeout(resolve, 5000)) // wait for 5 seconds
      const getProofDetails: GetProofDetails | undefined = await hub.getProof(
        initiatedProof.taskId,
      )

      expect(getProofDetails).toBeDefined()
      expect(getProofDetails?.strategy).toEqual('single')
      expect(getProofDetails?.transcriptType).toEqual('EVM')
      expect(getProofDetails?.status).toEqual('SUCCESS')
      expect(typeof getProofDetails?.proof).toEqual('string')
      expect(typeof getProofDetails?.taskId).toEqual('string')
      expect(Array.isArray(getProofDetails?.instances)).toBe(true)
      getProofDetails?.instances?.forEach((item) => {
        expect(typeof item).toBe('number')
      })
    }, 10000)
  })
})