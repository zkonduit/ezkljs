import { ethers } from 'hardhat';
import { Verifier } from './test/typechain-types/Verifier';
import { assert } from 'ethers';
import * as fs from 'fs';
import * as JSONBig from 'json-bigint';


interface Snark {
    instances: Array<Array<Array<string>>>,
    proof: string
}

const abi = [
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
  ];

async function main() {
    let [pubInputs, proof] = await parse_proof("test.pf");
    
    // Instantiate contract
    let Verifier: Verifier

    Verifier = await ethers.deployContract("Verifier")

    
    console.info("publicInputs: ", pubInputs);
    console.info("proof: ", proof);

    // Call verify function and return results
    const result = await Verifier.verify(pubInputs, proof);

    assert(result == true, "Parsing worked", "BAD_DATA");
}

// 
function vecu64_to_fieldb(b: string[]): bigint {
    if (b.length !== 4) {
        throw new Error('Input should be an array of 4 big integers.');
    }

    let result = BigInt(0);
    for (let i = 0; i < 4; i++) {
        // Note the conversion to BigInt for the shift operation
        result += BigInt(b[i]) << (BigInt(i) * BigInt(64));
    }
    return result;
}


function parse_proof(proofFilePath: string): [bigint[], string] {
    // Read the proof file
    const proofFileContent: string = fs.readFileSync(proofFilePath, 'utf-8');
    // Parse it into Snark object using JSONBig
    const proof: Snark = JSONBig.parse(proofFileContent);
    console.log(proof.instances)
    // Parse instances to public inputs
    let instances: bigint[][] = [];

    for (const val of proof.instances) {
        let inner_array: bigint[] = [];
        for (const inner of val) {
            inner_array.push(vecu64_to_fieldb(inner));
        }
        instances.push(inner_array);
    }

    const publicInputs = instances.flat();
    return [publicInputs, "0x" + proof.proof]
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
