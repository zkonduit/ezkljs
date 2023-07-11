import { parseProof } from '../src';
import { ethers } from 'hardhat';
import { Verifier } from '../test/typechain-types/Verifier';
import { assert } from 'ethers';

describe('ezkl', () => {
  describe('parseProof', () => {
    it('should return pubInputs and proof from test.pf file', async() => {

      let proofPath = "./test/data/test.pf"

      let [pubInputs, proof] = parseProof(proofPath);
    
      // Instantiate contract
      let Verifier: Verifier
  
      Verifier = await ethers.deployContract("Verifier")
  
      console.info("publicInputs: ", pubInputs);
      console.info("proof: ", proof);
  
      // Call verify function and return results
      const result = await Verifier.verify(pubInputs, proof);

      assert(result == true, "Parsing worked", "BAD_DATA");
    });
  });
});
