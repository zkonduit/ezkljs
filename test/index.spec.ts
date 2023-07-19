import { parseProof, simulateVerify } from '../src';
import { ethers } from 'hardhat';
import { Verifier } from './typechain-types/Verifier';
import { assert } from 'ethers';

describe('ezkl', () => {
  let Verifier: Verifier;
  let proofPath: string = "./test/data/test.pf"
  let rpc_url: string = "http://127.0.0.1:8545/"
  beforeAll(async () => {
    // Instantiate contract
    Verifier = await ethers.deployContract("Verifier");
  });
  describe('parseProof', () => {
    it('should return pubInputs and proof from test.pf file', async() => {

      let [pubInputs, proof] = parseProof(proofPath);

      console.info("publicInputs: ", pubInputs);
      console.info("proof: ", proof);
  
      // Call verify function and return results
      const result = await Verifier.verify(pubInputs, proof);

      assert(result == true, "Proof parsing worked", "BAD_DATA");
    });
  });
  describe('simulateVerify', () => {
    it('should return true for test.pf file', async() => {
      let address = await Verifier.getAddress();
      // get provider
      let provider = ethers.provider;
      let abi = [
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "pubInputs",
              "type": "uint256[]"
            },
            {
              "internalType": "bytes",
              "name": "proof",
              "type": "bytes"
            }
          ],
          "name": "verify",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
      console.log(proofPath)
      let [pubInputs, proof] = parseProof(proofPath);
      let result = await simulateVerify(pubInputs, proof, provider, address, abi);
      assert(result == true, "Simulate verify worked", "BAD_DATA");
    });
  })
});
