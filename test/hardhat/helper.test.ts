import { Helper } from '../../src/submodules/helper'
const { parseProof, simulateVerify } = Helper
import { ethers } from 'hardhat'
import { Verifier } from '../typechain-types'
import { assert } from 'ethers'
import * as fs from 'fs'

describe('ezkl', () => {
  let verifier: Verifier
  let proofPath: string = './test/data/test.pf'
  let rpc_url: string = 'http://127.0.0.1:8545/'
  beforeAll(async () => {
    // Instantiate contract
    verifier = await ethers.deployContract('Verifier')
  })
  describe('parseProof', () => {
    it('should return pubInputs and proof from test.pf file', async () => {
      let proofContent = fs.readFileSync(proofPath, 'utf-8') // Read file content

      let [pubInputs, proof] = parseProof(proofContent)

      console.debug('publicInputs: ', pubInputs)
      console.debug('proof: ', proof)

      // Call verify function and return results
      const result = await verifier.verify(pubInputs, proof)

      assert(result == true, 'Proof parsing worked', 'BAD_DATA')
    })
  })
  describe('simulateVerify', () => {
    it('should return true for test.pf file', async () => {
      let address = await verifier.getAddress()
      // get provider
      let provider = ethers.provider
      let abi = [
        {
          inputs: [
            {
              internalType: 'uint256[]',
              name: 'pubInputs',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes',
              name: 'proof',
              type: 'bytes',
            },
          ],
          name: 'verify',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ]
      let proofContent = fs.readFileSync(proofPath, 'utf-8') // Read file content
      let [pubInputs, proof] = parseProof(proofContent)
      let result = await simulateVerify(
        pubInputs,
        proof,
        provider,
        address,
        abi,
      )
      assert(result == true, 'Simulate verify worked', 'BAD_DATA')
    })
  })
})
