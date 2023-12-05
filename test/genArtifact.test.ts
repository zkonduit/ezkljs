import { setTimeout } from 'timers/promises'
import hub from '../src'
import { GQL_URL, ORG_ID } from '../src/utils/constants'
import { getInput, getModel } from './utils'

const artifactName = `test genArtifact ${Date.now()}`

it('generates an artifact', async () => {
  const modelFile = getModel()
  const inputFile = getInput()
  const artifact = await hub.genArtifact({
    url: GQL_URL,
    description: 'test gen artifact',
    name: artifactName,
    uncompiledModelFile: modelFile,
    inputFile,
    organizationId: ORG_ID,
  })

  expect(artifact).toBeDefined()
})

it('successfully creates the artifact', async () => {
  let artifact = await hub.getArtifact({
    url: GQL_URL,
    name: artifactName,
    organizationName: 'currenthandle',
  })

  while (artifact.status !== 'SUCCESS') {
    console.log('artifact', artifact)
    console.log('')
    await setTimeout(3_000)
    artifact = await hub.getArtifact({
      url: GQL_URL,
      name: artifactName,
      organizationName: 'currenthandle',
    })
  }

  expect(artifact).toBeDefined()
}, 40_000)

afterAll(async () => {
  await hub.deleteArtifact({
    url: GQL_URL,
    name: artifactName,
    organizationName: 'currenthandle',
  })
})
