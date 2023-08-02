import { ethers, Contract } from 'ethers';
import * as JSONBig from 'json-bigint';

interface Snark {
  instances: Array<Array<Array<string>>>
  proof: string
}

function vecu64ToField(b: string[]): string {
  if (b.length !== 4) {
    throw new Error('Input should be an array of 4 big integers.')
  }

  let result = BigInt(0)
  for (let i = 0; i < 4; i++) {
    const val = b[i]
    if (val === undefined) {
      throw new Error('Input should be an array of 4 big integers.')
    }
    // Note the conversion to BigInt for the shift operation
    result += BigInt(val) << (BigInt(i) * BigInt(64))
  }
  return result.toString()
}

function fieldToVecU64(s: string): string[] {
  const inputBigInt = BigInt(s)
  const arr = new Array(4).fill("0")
  for (let i = 0; i < 4; i++) {
    const mask = BigInt("0xFFFFFFFFFFFFFFFF") << BigInt(i * 64)
    const val = (inputBigInt & mask) >> BigInt(i * 64)
    arr[3 - i] = val.toString()
  }
  return arr
}


function parseProof(proofFileContent: string): [string[], string] {
  // Parse proofFileContent into Snark object using JSONBig
  const proof: Snark = JSONBig.parse(proofFileContent)
  console.log(proof.instances)
  // Parse instances to public inputs
  const instances: string[][] = []

  for (const val of proof.instances) {
    const inner_array: string[] = []
    for (const inner of val) {
      inner_array.push(vecu64ToField(inner))
    }
    instances.push(inner_array)
  }

  const publicInputs = instances.flat()
  return [publicInputs, '0x' + proof.proof]
}

type VerifyMethod = {
  verify: (pubInputs: string[], proof: string) => Promise<boolean>
}

type VerifierContract = ethers.Contract & VerifyMethod

async function simulateVerify(
  pubInputs: string[],
  proof: string,
  provider: ethers.Provider,
  contractAddress: string,
  abi: ethers.InterfaceAbi,
): Promise<boolean> {
  // Initialize provider and contract
  const contract = new Contract(
    contractAddress,
    abi,
    provider,
  ) as VerifierContract
  const result: boolean = await contract.verify(pubInputs, proof)
  return result
}

export const Helper = {
  parseProof,
  simulateVerify,
  vecu64ToField,
  fieldToVecU64
}
