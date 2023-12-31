import path from 'node:path'
import hub from '../src'
import { GQL_URL } from '../src/utils/constants'

import { setTimeout } from 'node:timers/promises'
import fs from 'node:fs'
import { createArtifact } from './utils'

describe('get proofs', () => {
  let id: string
  let cleanup: () => Promise<void>
  const artifactName = `test getProofs ${Date.now()}`

  beforeAll(async () => {
    const { id: _id, cleanup: _clnup } = await createArtifact(artifactName)
    id = _id
    cleanup = _clnup
  }, 40_000)

  afterAll(async () => {
    await cleanup()
  })

  it('gets proofs', async () => {
    const proofs = await hub.getProofs({
      url: GQL_URL,
      artifactName,
      organizationName: 'currenthandle',
    })

    expect(proofs).toBeDefined()
    expect(proofs?.length).toBe(0)
  })

  describe('test after adding proofs', () => {
    const numProofs = 3
    beforeAll(async () => {
      const inputFile = fs.readFileSync(
        path.resolve(__dirname, 'proof_artifacts', 'input.json'),
      )
      if (!inputFile) {
        throw new Error('inputFile not found')
      }

      if (!id) {
        throw new Error('id not found')
      }

      for (let i = 0; i < numProofs; i++) {
        await hub.initiateProof({
          url: GQL_URL,
          artifactId: id,
          inputFile,
        })
        await setTimeout(3_000)
      }
    }, 40_000)

    it('gets proofs', async () => {
      const proofs = await hub.getProofs({
        url: GQL_URL,
        artifactName,
        organizationName: 'currenthandle',
      })

      expect(proofs).toBeDefined()
      expect(proofs?.length).toBe(numProofs)
    })
  })
  afterAll(async () => {
    if (!id) {
      throw new Error('id not found')
    }
    try {
      const deletedArtifact = await hub.deleteArtifact({
        name: artifactName,
        organizationName: 'currenthandle',
        url: GQL_URL,
      })
      expect(deletedArtifact).toBeDefined()
      expect(deletedArtifact).toEqual(id)
    } catch (e) {
      console.log('error', e)
    }
  })
})
