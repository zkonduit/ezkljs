export declare function poseidonHash(message: Uint8Array): Uint8Array;
export declare function genCircuitSettings(model_ser: Uint8Array, run_args_ser: Uint8Array): Uint8Array;
export declare function genPk(circuitSer: Uint8Array, paramsSer: Uint8Array, circuitSettingsSer: Uint8Array): Uint8Array;
export declare function genVk(pk: Uint8Array, circuitSettingsSer: Uint8Array): Uint8Array;
export declare function verify(proofJs: Uint8Array, vk: Uint8Array, circuitSettingsSer: Uint8Array, paramsSer: Uint8Array): boolean;
export declare function prove(witness: Uint8Array, pk: Uint8Array, circuitSer: Uint8Array, circuitSettingsSer: Uint8Array, paramsSer: Uint8Array): Uint8Array;
