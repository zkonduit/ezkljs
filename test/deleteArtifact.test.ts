import path from 'node:path'
import hub from '../src'
import { GQL_URL, ORG_ID } from '../src/utils/constants'

import fs from 'node:fs'
import exp from 'node:constants'

describe('delete artifact', () => {
  let id: string | undefined

  const artifactName = 'test delete artifact 4'
  // const organizationName = 'currenthandle'
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
  })

  it('deletes an artifact', async () => {
    const deletedArtifact = await hub.deleteArtifact({
      name: artifactName,
      organizationName: 'currenthandle',
      url: GQL_URL,
    })

    expect(deletedArtifact).toBeDefined()
    expect(deletedArtifact).toEqual(id)
  })

  it("throws an error if the artifact does't exist", async () => {
    try {
      const deletedArtifact = await hub.deleteArtifact({
        name: 'not a real artifact',
        organizationName: 'currenthandle',
        url: GQL_URL,
      })

      console.log('asdsda', deletedArtifact)
    } catch (e) {
      expect(e.message).toEqual(
        'No artifacts found matching the provided criteria.',
      )
    }
  })
})
