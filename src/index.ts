import { ethers, Contract } from 'ethers';
import * as fs from 'fs';
import * as JSONBig from 'json-bigint';
interface Snark {
  instances: Array<Array<Array<string>>>;
  proof: string;
}

function vecu64ToField(b: string[]): string {
  if (b.length !== 4) {
    throw new Error('Input should be an array of 4 big integers.');
  }

  let result = BigInt(0);
  for (let i = 0; i < 4; i++) {
    // Note the conversion to BigInt for the shift operation
    result += BigInt(b[i]) << (BigInt(i) * BigInt(64));
  }
  return result.toString();
}

// function fieldToVecu64(s: string): string[] {
//   const inputBigInt = BigInt(s);
//   const mask = BigInt('0xFFFFFFFFFFFFFFFF'); // Mask to get the least significant 64 bits

//   const result: string[] = [];

//   for (let i = 0; i < 4; i++) {
//       // Extract the least significant 64 bits, and then right-shift
//       const value = (inputBigInt >> (BigInt(i) * BigInt(64))) & mask;
//       result.push(value.toString());
//   }

//   return result;
// }


export function parseProof(proofFilePath: string): [string[], string] {
  // Read the proof file
  const proofFileContent: string = fs.readFileSync(proofFilePath, 'utf-8');
  // Parse it into Snark object using JSONBig
  const proof: Snark = JSONBig.parse(proofFileContent);
  console.log(proof.instances);
  // Parse instances to public inputs
  const instances: string[][] = [];

  for (const val of proof.instances) {
    const inner_array: string[] = [];
    for (const inner of val) {
      inner_array.push(vecu64ToField(inner));
    }
    instances.push(inner_array);
  }

  const publicInputs = instances.flat();
  return [publicInputs, '0x' + proof.proof];
}

export async function simulateVerify(
  pubInputs: string[],
  proof: string,
  provider: ethers.Provider,
  contractAddress: string,
  abi: ethers.InterfaceAbi
): Promise<boolean> {
  // Initialize provider and contract
  const contract = new Contract(contractAddress, abi, provider);
  const result: boolean = await contract.verify(pubInputs, proof);
  return result;
}