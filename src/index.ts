import { ethers, Contract } from 'ethers';
import * as fs from 'fs';
import * as JSONBig from 'json-bigint';
interface Snark {
  instances: Array<Array<Array<string>>>;
  proof: string;
}

function vecu64ToField(b: string[]): bigint {
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

export function parseProof(proofFilePath: string): [bigint[], string] {
  // Read the proof file
  const proofFileContent: string = fs.readFileSync(proofFilePath, 'utf-8');
  // Parse it into Snark object using JSONBig
  const proof: Snark = JSONBig.parse(proofFileContent);
  console.log(proof.instances);
  // Parse instances to public inputs
  const instances: bigint[][] = [];

  for (const val of proof.instances) {
    const inner_array: bigint[] = [];
    for (const inner of val) {
      inner_array.push(vecu64ToField(inner));
    }
    instances.push(inner_array);
  }

  const publicInputs = instances.flat();
  return [publicInputs, '0x' + proof.proof];
}

export async function simulateVerify(
  pubInputs: bigint[],
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

// This method wraps around the poseidon_hash_wasm function in the WebAssembly module
// export function poseidonHash(message: Uint8Array): Uint8Array {
//   const clampedMessage = new Uint8ClampedArray(message.buffer);
//   const result = ezkl.poseidon_hash_wasm(clampedMessage);
//   return new Uint8Array(result.buffer);
// }

// // Other wrappers could be defined in a similar manner. For example:
// export function genCircuitSettings(
//   model_ser: Uint8Array,
//   run_args_ser: Uint8Array
// ): Uint8Array {
//   const clampedModelSer = new Uint8ClampedArray(model_ser.buffer);
//   const clampedRunArgsSer = new Uint8ClampedArray(run_args_ser.buffer);
//   const result = ezkl.gen_circuit_settings_wasm(
//     clampedModelSer,
//     clampedRunArgsSer
//   );
//   return new Uint8Array(result.buffer);
// }

// export function genPk(
//   circuitSer: Uint8Array,
//   paramsSer: Uint8Array,
//   circuitSettingsSer: Uint8Array
// ): Uint8Array {
//   const clampedCircuitSer = new Uint8ClampedArray(circuitSer.buffer);
//   const clampedParamsSer = new Uint8ClampedArray(paramsSer.buffer);
//   const clampedCircuitSettingsSer = new Uint8ClampedArray(
//     circuitSettingsSer.buffer
//   );

//   const result = ezkl.gen_pk_wasm(
//     clampedCircuitSer,
//     clampedParamsSer,
//     clampedCircuitSettingsSer
//   );
//   return new Uint8Array(result.buffer);
// }

// export function genVk(
//   pk: Uint8Array,
//   circuitSettingsSer: Uint8Array
// ): Uint8Array {
//   const clampedPk = new Uint8ClampedArray(pk.buffer);
//   const clampedCircuitSettingsSer = new Uint8ClampedArray(
//     circuitSettingsSer.buffer
//   );

//   const result = ezkl.gen_vk_wasm(clampedPk, clampedCircuitSettingsSer);
//   return new Uint8Array(result.buffer);
// }

// export function verify(
//   proofJs: Uint8Array,
//   vk: Uint8Array,
//   circuitSettingsSer: Uint8Array,
//   paramsSer: Uint8Array
// ): boolean {
//   const clampedProofJs = new Uint8ClampedArray(proofJs.buffer);
//   const clampedVk = new Uint8ClampedArray(vk.buffer);
//   const clampedCircuitSettingsSer = new Uint8ClampedArray(
//     circuitSettingsSer.buffer
//   );
//   const clampedParamsSer = new Uint8ClampedArray(paramsSer.buffer);

//   const result = ezkl.verify_wasm(
//     clampedProofJs,
//     clampedVk,
//     clampedCircuitSettingsSer,
//     clampedParamsSer
//   );
//   return result;
// }

// export function prove(
//   witness: Uint8Array,
//   pk: Uint8Array,
//   circuitSer: Uint8Array,
//   circuitSettingsSer: Uint8Array,
//   paramsSer: Uint8Array
// ): Uint8Array {
//   const clampedWitness = new Uint8ClampedArray(witness.buffer);
//   const clampedPk = new Uint8ClampedArray(pk.buffer);
//   const clampedCircuitSer = new Uint8ClampedArray(circuitSer.buffer);
//   const clampedCircuitSettingsSer = new Uint8ClampedArray(
//     circuitSettingsSer.buffer
//   );
//   const clampedParamsSer = new Uint8ClampedArray(paramsSer.buffer);

//   const result = ezkl.prove_wasm(
//     clampedWitness,
//     clampedPk,
//     clampedCircuitSer,
//     clampedCircuitSettingsSer,
//     clampedParamsSer
//   );
//   return new Uint8Array(result.buffer);
// }
