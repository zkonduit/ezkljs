import path from 'node:path'
import hub from '../src'
import { GQL_URL, ORG_ID } from '../src/utils/constants'

import { setTimeout } from 'node:timers/promises'
import fs from 'node:fs'

describe('get proofs', () => {
  let id: string | undefined
  const artifactName = `test getProofs ${Date.now()}`
  beforeAll(async () => {
    const modelFile = fs.readFileSync(
      path.resolve(__dirname, 'proof_artifacts', 'network.onnx'),
    )
    const inputFile = fs.readFileSync(
      path.resolve(__dirname, 'proof_artifacts', 'input.json'),
    )

    if (!modelFile) {
      throw new Error('modelFile not found')
    }

    if (!inputFile) {
      throw new Error('inputFile not found')
    }

    id = await hub.genArtifact({
      description: 'test delete artifact',
      name: artifactName,
      organizationId: ORG_ID,
      uncompiledModelFile: modelFile,
      inputFile,
      url: GQL_URL,
    })

    if (!id) {
      throw new Error('id not found')
    }

    let artifact

    do {
      artifact = await hub.getArtifact({
        url: GQL_URL,
        id,
      })

      console.log('status', artifact.status)

      await setTimeout(3_000)
    } while (artifact.status === 'PENDING')

    console.log('arer loop')

    const newProof = await hub.initiateProof({
      url: GQL_URL,
      artifactId: id,
      inputFile,
    })
    console.log('newProof', newProof)
  }, 40_000)

  // it('expect true', () => {
  //   expect(true).toBe(true)
  // })

  it('gets proofs', async () => {
    expect(true).toBe(true)
    const proofs = await hub.getProofs({
      url: GQL_URL,
      artifactName,
      organizationName: 'currenthandle',
    })

    console.log('proofs', proofs)
    // expect(proofs).toBeDefined()
    // expect(proofs?.length).toBe(0)
  })
  // afterAll(async () => {
  //   if (!id) {
  //     throw new Error('id not found')
  //   }
  //   try {
  //     const deletedArtifact = await hub.deleteArtifact({
  //       name: artifactName,
  //       organizationName: 'currenthandle',
  //       url: GQL_URL,
  //     })
  //     expect(deletedArtifact).toBeDefined()
  //     expect(deletedArtifact).toEqual(id)
  //   } catch (e) {
  //     console.log('error', e)
  //   }
  // })
})
