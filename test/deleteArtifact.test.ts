import path from 'node:path'
import hub from '../src'
import { GQL_URL, ORG_ID } from '../src/utils/constants'

import fs from 'node:fs'

describe('delete artifact', () => {
  let id: string | undefined

  const artifactName = 'test delete artifact 4'
  // const organizationName = 'currenthandle'
  beforeEach(async () => {
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
  })

  it('deletes an artifact', async () => {
    // if (!artifact) {
    //   throw new Error('artifact not found')
    // }

    const deletedArtifact = await hub.deleteArtifact({
      name: artifactName,
      organizationName: 'currenthandle',
      url: GQL_URL,
    })

    console.log(deletedArtifact)
    console.log('test')

    // expect(deletedArtifact).toBeDefined()
    // expect(deletedArtifact?.id).toEqual(artifact.id)
  })
})
