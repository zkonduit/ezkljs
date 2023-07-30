/* tslint:disable */
/* eslint-disable */
/**
* Initialize panic hook for wasm
*/
export function init_panic_hook(): void;
/**
* Generate a poseidon hash in browser. Input message
* @param {Uint8ClampedArray} message
* @returns {Uint8Array}
*/
export function poseidon_hash_wasm(message: Uint8ClampedArray): Uint8Array;
/**
* Encrypt using elgamal in browser. Input message
* @param {Uint8ClampedArray} pk
* @param {Uint8ClampedArray} message
* @param {Uint8ClampedArray} r
* @returns {Uint8Array}
*/
export function elgamal_encrypt_wasm(pk: Uint8ClampedArray, message: Uint8ClampedArray, r: Uint8ClampedArray): Uint8Array;
/**
* Decrypt using elgamal in browser. Input message
* @param {Uint8ClampedArray} cipher
* @param {Uint8ClampedArray} sk
* @returns {Uint8Array}
*/
export function elgamal_decrypt_wasm(cipher: Uint8ClampedArray, sk: Uint8ClampedArray): Uint8Array;
/**
* Generate circuit params in browser
* @param {Uint8ClampedArray} model_ser
* @param {Uint8ClampedArray} run_args_ser
* @returns {Uint8Array}
*/
export function gen_circuit_settings_wasm(model_ser: Uint8ClampedArray, run_args_ser: Uint8ClampedArray): Uint8Array;
/**
* Generate proving key in browser
* @param {Uint8ClampedArray} circuit_ser
* @param {Uint8ClampedArray} params_ser
* @param {Uint8ClampedArray} circuit_settings_ser
* @returns {Uint8Array}
*/
export function gen_pk_wasm(circuit_ser: Uint8ClampedArray, params_ser: Uint8ClampedArray, circuit_settings_ser: Uint8ClampedArray): Uint8Array;
/**
* Generate verifying key in browser
* @param {Uint8ClampedArray} pk
* @param {Uint8ClampedArray} circuit_settings_ser
* @returns {Uint8Array}
*/
export function gen_vk_wasm(pk: Uint8ClampedArray, circuit_settings_ser: Uint8ClampedArray): Uint8Array;
/**
* Verify proof in browser using wasm
* @param {Uint8ClampedArray} proof_js
* @param {Uint8ClampedArray} vk
* @param {Uint8ClampedArray} circuit_settings_ser
* @param {Uint8ClampedArray} params_ser
* @returns {boolean}
*/
export function verify_wasm(proof_js: Uint8ClampedArray, vk: Uint8ClampedArray, circuit_settings_ser: Uint8ClampedArray, params_ser: Uint8ClampedArray): boolean;
/**
* Prove in browser using wasm
* @param {Uint8ClampedArray} witness
* @param {Uint8ClampedArray} pk
* @param {Uint8ClampedArray} circuit_ser
* @param {Uint8ClampedArray} circuit_settings_ser
* @param {Uint8ClampedArray} params_ser
* @returns {Uint8Array}
*/
export function prove_wasm(witness: Uint8ClampedArray, pk: Uint8ClampedArray, circuit_ser: Uint8ClampedArray, circuit_settings_ser: Uint8ClampedArray, params_ser: Uint8ClampedArray): Uint8Array;
/**
* @param {number} num_threads
* @returns {Promise<any>}
*/
export function initThreadPool(num_threads: number): Promise<any>;
/**
* @param {number} receiver
*/
export function wbg_rayon_start_worker(receiver: number): void;
/**
*/
export class wbg_rayon_PoolBuilder {
  free(): void;
/**
* @returns {number}
*/
  numThreads(): number;
/**
* @returns {number}
*/
  receiver(): number;
/**
*/
  build(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly poseidon_hash_wasm: (a: number, b: number, c: number) => void;
  readonly elgamal_encrypt_wasm: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly elgamal_decrypt_wasm: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly gen_circuit_settings_wasm: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly gen_pk_wasm: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly gen_vk_wasm: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verify_wasm: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly prove_wasm: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => void;
  readonly init_panic_hook: () => void;
  readonly __wbg_wbg_rayon_poolbuilder_free: (a: number) => void;
  readonly wbg_rayon_poolbuilder_numThreads: (a: number) => number;
  readonly wbg_rayon_poolbuilder_receiver: (a: number) => number;
  readonly wbg_rayon_poolbuilder_build: (a: number) => void;
  readonly wbg_rayon_start_worker: (a: number) => void;
  readonly initThreadPool: (a: number) => number;
  readonly rustsecp256k1_v0_8_1_context_create: (a: number) => number;
  readonly rustsecp256k1_v0_8_1_context_destroy: (a: number) => void;
  readonly rustsecp256k1_v0_8_1_default_illegal_callback_fn: (a: number, b: number) => void;
  readonly rustsecp256k1_v0_8_1_default_error_callback_fn: (a: number, b: number) => void;
  readonly memory: WebAssembly.Memory;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_thread_destroy: (a: number, b: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput, maybe_memory?: WebAssembly.Memory): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory): Promise<InitOutput>;
