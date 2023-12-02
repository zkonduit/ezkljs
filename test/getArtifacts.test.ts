import path from 'node:path'
import hub from '../src'
import { GQL_URL, ORG_ID } from '../src/utils/constants'

import fs from 'node:fs'

describe('get artifacts', () => {
  let id: string | undefined

  const artifactName = 'test get artifacts 4'
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

  it('gets artifacts by organizationName', async () => {
    const artifacts = await hub.getArtifacts({
      url: GQL_URL,
      organizationName: 'currenthandle',
    })

    expect(artifacts).toBeDefined()
    expect(artifacts?.length).toBeGreaterThan(0)
  })

  it('gets artifacts by organizationId', async () => {
    const artifacts = await hub.getArtifacts({
      url: GQL_URL,
      organizationId: ORG_ID,
    })

    expect(artifacts).toBeDefined()
    expect(artifacts?.length).toBeGreaterThan(0)
  })

  it('should have all the fields', async () => {
    const artifacts = await hub.getArtifacts({
      url: GQL_URL,
      organizationId: ORG_ID,
    })

    expect(artifacts).toBeDefined()
    expect(artifacts?.length).toBeGreaterThan(0)

    const artifact = artifacts?.[0]
    expect(artifact?.id).toBeDefined()
    expect(artifact?.name).toBeDefined()
    expect(artifact?.description).toBeDefined()
    expect(artifact?.organization).toBeDefined()
    expect(artifact?.createdAt).toBeDefined()
    expect(artifact?.status).toBeDefined()
    expect(artifact?.uncompiledModel).toBeDefined()
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
