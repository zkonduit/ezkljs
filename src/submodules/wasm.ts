import { ethers, Contract } from 'ethers'
import JSONBig from 'json-bigint'

interface Snark {
  instances: Array<Array<Array<string>>>
  proof: string
}

function vecu64ToField(b: string[]): bigint {
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
  return result
}

function parseProof(proofFileContent: string): [bigint[], string] {
  // Parse proofFileContent into Snark object using JSONBig
  const proof: Snark = JSONBig.parse(proofFileContent)
  console.log(proof.instances)
  // Parse instances to public inputs
  const instances: bigint[][] = []

  for (const val of proof.instances) {
    const inner_array: bigint[] = []
    for (const inner of val) {
      inner_array.push(vecu64ToField(inner))
    }
    instances.push(inner_array)
  }

  const publicInputs = instances.flat()
  return [publicInputs, '0x' + proof.proof]
}

type VerifyMethod = {
  verify: (pubInputs: bigint[], proof: string) => Promise<boolean>
}

type VerifierContract = ethers.Contract & VerifyMethod

async function simulateVerify(
  pubInputs: bigint[],
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

export const Wasm = {
  parseProof,
  simulateVerify,
}
