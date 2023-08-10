import assert from 'node:assert/strict'
import { router } from '../dist/index.js'
import { describe, it } from 'node:test'
import { readFile } from 'node:fs/promises'

let artifact
describe('router', () => {
  it('checks health', async () => {
    assert.ok(router.healthCheck)
    const health = await router.healthCheck()
    assert.deepStrictEqual(health, {
      status: 'ok',
      res: "Welcome to the ezkl hub's backend!",
    })
  })
  describe('artifact', () => {
    it('get artifacts', async () => {
      assert.ok(router.getArtifacts)
      const artifacts = await router.getArtifacts()

      assert.ok(artifacts)
      assert.ok(artifacts.length > 0)

      artifact = artifacts[0]

      assert.ok(artifact)
      assert.ok(artifact.name)
      assert.ok(artifact.description)
      assert.ok(artifact.id)
    })
    // it('upload artifact', async () => {
    //   assert.ok(router.uploadArtifact)
    //   // model file
    //   const modelFilePath = new URL(
    //     'proof_artifacts/network.ezkl',
    //     import.meta.url,
    //   ).pathname
    //   const modelFile = await readFile(modelFilePath)
    //   assert.ok(modelFile)

    //   // settings file
    //   const settingsFilePath = new URL(
    //     'proof_artifacts/settings.json',
    //     import.meta.url,
    //   ).pathname
    //   const settingsFile = await readFile(settingsFilePath)
    //   assert.ok(settingsFile)

    //   // pk file
    //   const pkFilePath = new URL('proof_artifacts/pk.key', import.meta.url)
    //     .pathname
    //   const pkFile = await readFile(pkFilePath)
    //   assert.ok(pkFile)

    //   const uploadArtifactResp = await router.uploadArtifact(
    //     modelFile,
    //     settingsFile,
    //     pkFile,
    //   )
    //   assert.ok(uploadArtifactResp)
    // })
  })

  describe('proof', () => {
    let taskId
    it('initiate proof', async () => {
      assert.ok(router.initiateProof)
      assert.ok(artifact)

      const inputFilePath = new URL(
        'proof_artifacts/input.json',
        import.meta.url,
      ).pathname
      const inputFile = await readFile(inputFilePath)
      const initiatedProof = await router.initiateProof(artifact.id, inputFile)

      assert.ok(initiatedProof)
      assert.ok(initiatedProof.taskId)
      assert.deepEqual(initiatedProof.status, 'PENDING')

      taskId = initiatedProof.taskId
    })

    it('get proof', async () => {
      assert.ok(router.getProof)

      await new Promise((resolve) => setTimeout(resolve, 5000)) // wait for 5 seconds
      const getProofDetails = await router.getProof(taskId)

      assert.ok(getProofDetails)
      assert.ok(getProofDetails.proof)
      assert.deepStrictEqual(getProofDetails.status, 'SUCCESS')
      assert.deepStrictEqual(getProofDetails.taskId, taskId)
      assert.ok(getProofDetails.witness.inputs)
      assert.ok(getProofDetails.witness.outputs)
    })
  })
})

// describe('router', () => {
//   it('get artifacts', async () => {
//     expect(getArtifacts).toBeDefined()
//     artifacts = await getArtifacts()
//     if (artifacts && artifacts.length > 0) {
//       const firstArtifact = artifacts[0]
//       if (firstArtifact) {
//         expect(firstArtifact.name).toBeDefined()
//         expect(firstArtifact.description).toBeDefined()
//         expect(firstArtifact.id).toBeDefined()
//       } else {
//         throw new Error('No first artifact found')
//       }
//     } else {
//       throw new Error('No artifacts returned from getArtifacts')
//     }
//   })

//   describe('proof related operations', () => {
//     beforeAll(async () => {
//       if (!artifacts || artifacts.length === 0) {
//         throw new Error('No artifacts')
//       }
//       const artifact = artifacts[0]
//       if (artifact) {
//         const artifactId = artifact.id
//         const filePath = path.resolve(
//           __dirname,
//           'proof_artifacts',
//           'input.json',
//         )
//         const file = await fs.readFile(filePath)
//         initiatedProof = await router.initiateProof(artifactId, file)

//         if (!initiatedProof) {
//           throw new Error('No initiatedProof returned')
//         }
//       } else {
//         throw new Error('No first artifact found')
//       }
//     })

//     it('initiate proof', async () => {
//       if (!initiatedProof) {
//         throw new Error('initiatedProof undefined')
//       }

//       expect(router.initiateProof).toBeDefined()
//       expect(initiatedProof).toBeDefined()

//       expect(initiatedProof.status).toEqual('PENDING')
//       expect(isValidV4UUID(initiatedProof.taskId)).toEqual(true)
//     })

//     it('retrieve proof', async () => {
//       if (!initiatedProof) {
//         throw new Error('initiatedProof undefined')
//       }

//       await new Promise((resolve) => setTimeout(resolve, 5000)) // wait for 5 seconds
//       const getProofDetails: GetProofDetails | undefined =
//         await router.getProof(initiatedProof.taskId)

//       if (!getProofDetails) {
//         throw new Error('No getProofDetails returned')
//       }

//       expect(isValidHexString(getProofDetails.proof)).toEqual(true)

//       expect(getProofDetails.status).toEqual('SUCCESS')
//       expect(getProofDetails.taskId).toEqual(initiatedProof.taskId)

//       expect(getProofDetails.witness.inputs).toBeDefined()
//       expect(getProofDetails.witness.outputs).toBeDefined()
//     }, 10000)
//   })
// })
