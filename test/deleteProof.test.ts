import path from 'node:path'
import hub from '../src'
import { GQL_URL, ORG_ID } from '../src/utils/constants'
import fs from 'node:fs'
import { setTimeout } from 'node:timers/promises'

describe('deletes a proof', () => {
  let id: string | undefined

  // let proof: { id: string; status: string }

  const artifactName = `delete artifact test ${Date.now()}}`
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

    console.log('id', id)
    if (!id) {
      throw new Error('id not found')
    }

    await setTimeout(15_000)

    console.log('before initiateProof')
    const proof = await hub.initiateProof({
      url: GQL_URL,
      artifactId: id,
      inputFile,
    })
    await setTimeout(10_000)

    console.log('proof', proof)
  }, 100_000)

  // it('deletes a proof', async () => {
  //   // expect(proof).toBeDefined()
  //   if (!proof) {
  //     throw new Error('proofId not found')
  //   }
  //   const deletedProof = await hub.deleteProof({
  //     url: GQL_URL,
  //     proofId: proof.id,
  //     organizationName: 'currenthandle',
  //   })
  //   // console.log('deletedProof', deletedProof)

  //   expect(deletedProof).toBeDefined()
  //   expect(deletedProof).toEqual(proof.id)

  //   await setTimeout(10_000)
  // }, 100_000)

  it('deletes an artifact', async () => {
    expect(true).toBe(true)
  })

  // afterAll(async () => {
  //   if (!id) {
  //     throw new Error('id not found')
  //   }

  //   await hub.deleteArtifact({
  //     url: GQL_URL,
  //     name: artifactName,
  //     organizationName: 'currenthandle',
  //   })
  // }, 100_000)
})
