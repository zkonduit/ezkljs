import { ethers } from 'ethers';
export declare function parseProof(proofFilePath: string): [string[], string];
export declare function simulateVerify(pubInputs: bigint[], proof: string, provider: ethers.Provider, contractAddress: string, abi: ethers.InterfaceAbi): Promise<boolean>;
