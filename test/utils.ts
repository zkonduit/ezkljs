// artifactUtils.js
import fs from 'node:fs'
import path from 'node:path'
import hub from '../src'
import { GQL_URL, ORG_ID } from '../src/utils/constants'
import { setTimeout } from 'node:timers/promises'

export function getModel() {
  const modelFilePath = path.resolve(
    __dirname,
    'proof_artifacts',
    'network.onnx',
  )
  const modelFile = fs.readFileSync(modelFilePath)
  if (!modelFile) {
    throw new Error('modelFile not found')
  }
  return modelFile
}

export function getInput() {
  const inputFilePath = path.resolve(
    path.resolve(__dirname, 'proof_artifacts', 'input.json'),
  )
  const inputFile = fs.readFileSync(inputFilePath)

  if (!inputFile) {
    throw new Error('inputFile not found')
  }

  return inputFile
}

export async function createArtifact(testName: string) {
  const modelFile = getModel()
  const inputFile = getInput()

  const artifactName = `${testName} ${Date.now()}`

  const id = await hub.genArtifact({
    description: 'test artifact',
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
    await setTimeout(3_000)
    artifact = await hub.getArtifact({
      url: GQL_URL,
      id,
    })
  } while (artifact.status !== 'SUCCESS')

  return {
    id,
    cleanup: async () => {
      await hub.deleteArtifact({
        url: GQL_URL,
        name: artifactName,
        organizationName: 'currenthandle',
      })
    },
  }
}

export async function createProof(artifactId: string) {
  const inputFile = getInput()

  let proof = await hub.initiateProof({
    artifactId,
    inputFile,
    url: GQL_URL,
  })

  if (!proof) {
    throw new Error('proof not found')
  }

  do {
    await setTimeout(3_000)
    const newProof = await hub.getProof({
      url: GQL_URL,
      id: proof.id,
    })

    if (!newProof) {
      throw new Error('proof not found')
    }

    proof = newProof
  } while (proof.status !== 'SUCCESS')

  return proof.id

  // return {
  //   proofId: proof.id,
  //   // cleanup: async () => {
  //   //   await hub.deleteProof({
  //   //     url: GQL_URL,
  //   //     proofId: proof.taskId,
  //   //     organizationName: 'currenthandle',
  //   //   })
  //   // },
  // }
}
