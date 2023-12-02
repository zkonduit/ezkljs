import path from 'node:path'
import hub from '../src'
import { GQL_URL, ORG_ID } from '../src/utils/constants'
import fs from 'node:fs'
import { setTimeout } from 'node:timers/promises'

describe('deletes a proof', () => {
  let id: string | undefined

  // let proofId: any
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let proof: { id: string; status: string }

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

    if (!id) {
      throw new Error('id not found')
    }

    await setTimeout(8_000)

    proof = await hub.initiateProof({
      url: GQL_URL,
      artifactId: id,
      inputFile,
    })
  }, 10_000)

  it('deletes a proof', async () => {
    console.log('proof', proof)
    // if (!proof) {
    //   throw new Error('proofId not found')
    // }
    // const deletedProof = await hub.deleteProof({
    //   url: GQL_URL,
    //   proof,
    //   organizationName: 'currenthandle',
    // })
    // console.log('deletedProof', deletedProof)

    // expect(deletedProof).toBeDefined()
    // expect(deletedProof).toEqual(proofId)
  })

  afterAll(async () => {
    if (!id) {
      throw new Error('id not found')
    }

    await hub.deleteArtifact({
      url: GQL_URL,
      name: artifactName,
      organizationName: 'currenthandle',
    })
  })
})
