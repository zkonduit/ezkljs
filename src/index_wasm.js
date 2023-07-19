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
exports.prove = exports.verify = exports.genVk = exports.genPk = exports.genCircuitSettings = exports.poseidonHash = void 0;
// import your WebAssembly module
const ezkl = __importStar(require("../pkg/ezkl"));
// This method wraps around the poseidon_hash_wasm function in the WebAssembly module
function poseidonHash(message) {
    const clampedMessage = new Uint8ClampedArray(message.buffer);
    const result = ezkl.poseidon_hash_wasm(clampedMessage);
    return new Uint8Array(result.buffer);
}
exports.poseidonHash = poseidonHash;
// Other wrappers could be defined in a similar manner. For example:
function genCircuitSettings(model_ser, run_args_ser) {
    const clampedModelSer = new Uint8ClampedArray(model_ser.buffer);
    const clampedRunArgsSer = new Uint8ClampedArray(run_args_ser.buffer);
    const result = ezkl.gen_circuit_settings_wasm(clampedModelSer, clampedRunArgsSer);
    return new Uint8Array(result.buffer);
}
exports.genCircuitSettings = genCircuitSettings;
function genPk(circuitSer, paramsSer, circuitSettingsSer) {
    const clampedCircuitSer = new Uint8ClampedArray(circuitSer.buffer);
    const clampedParamsSer = new Uint8ClampedArray(paramsSer.buffer);
    const clampedCircuitSettingsSer = new Uint8ClampedArray(circuitSettingsSer.buffer);
    const result = ezkl.gen_pk_wasm(clampedCircuitSer, clampedParamsSer, clampedCircuitSettingsSer);
    return new Uint8Array(result.buffer);
}
exports.genPk = genPk;
function genVk(pk, circuitSettingsSer) {
    const clampedPk = new Uint8ClampedArray(pk.buffer);
    const clampedCircuitSettingsSer = new Uint8ClampedArray(circuitSettingsSer.buffer);
    const result = ezkl.gen_vk_wasm(clampedPk, clampedCircuitSettingsSer);
    return new Uint8Array(result.buffer);
}
exports.genVk = genVk;
function verify(proofJs, vk, circuitSettingsSer, paramsSer) {
    const clampedProofJs = new Uint8ClampedArray(proofJs.buffer);
    const clampedVk = new Uint8ClampedArray(vk.buffer);
    const clampedCircuitSettingsSer = new Uint8ClampedArray(circuitSettingsSer.buffer);
    const clampedParamsSer = new Uint8ClampedArray(paramsSer.buffer);
    const result = ezkl.verify_wasm(clampedProofJs, clampedVk, clampedCircuitSettingsSer, clampedParamsSer);
    return result;
}
exports.verify = verify;
function prove(witness, pk, circuitSer, circuitSettingsSer, paramsSer) {
    const clampedWitness = new Uint8ClampedArray(witness.buffer);
    const clampedPk = new Uint8ClampedArray(pk.buffer);
    const clampedCircuitSer = new Uint8ClampedArray(circuitSer.buffer);
    const clampedCircuitSettingsSer = new Uint8ClampedArray(circuitSettingsSer.buffer);
    const clampedParamsSer = new Uint8ClampedArray(paramsSer.buffer);
    const result = ezkl.prove_wasm(clampedWitness, clampedPk, clampedCircuitSer, clampedCircuitSettingsSer, clampedParamsSer);
    return new Uint8Array(result.buffer);
}
exports.prove = prove;
