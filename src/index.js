"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateVerify = exports.parseProof = void 0;
const ethers_1 = require("ethers");
const fs = __importStar(require("fs"));
const JSONBig = __importStar(require("json-bigint"));
function vecu64ToField(b) {
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
function fieldToVecu64(s) {
    const inputBigInt = BigInt(s);
    const mask = BigInt('0xFFFFFFFFFFFFFFFF'); // Mask to get the least significant 64 bits
    let result = [];
    for (let i = 0; i < 4; i++) {
        // Extract the least significant 64 bits, and then right-shift
        const value = (inputBigInt >> (BigInt(i) * BigInt(64))) & mask;
        result.push(value.toString());
    }
    return result;
}
function parseProof(proofFilePath) {
    // Read the proof file
    const proofFileContent = fs.readFileSync(proofFilePath, 'utf-8');
    // Parse it into Snark object using JSONBig
    const proof = JSONBig.parse(proofFileContent);
    console.log(proof.instances);
    // Parse instances to public inputs
    const instances = [];
    for (const val of proof.instances) {
        const inner_array = [];
        for (const inner of val) {
            inner_array.push(vecu64ToField(inner));
        }
        instances.push(inner_array);
    }
    const publicInputs = instances.flat();
    return [publicInputs, '0x' + proof.proof];
}
exports.parseProof = parseProof;
async function simulateVerify(pubInputs, proof, provider, contractAddress, abi) {
    // Initialize provider and contract
    const contract = new ethers_1.Contract(contractAddress, abi, provider);
    const result = await contract.verify(pubInputs, proof);
    return result;
}
exports.simulateVerify = simulateVerify;
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
