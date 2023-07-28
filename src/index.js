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
