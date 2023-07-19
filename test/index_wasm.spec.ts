import { 
  poseidonHash,
  verify
} from '../src/index_wasm';
import { Type, Field } from "protobufjs";


  describe('WASM ts bindings', () => {
    const PROOF = require('fs').readFileSync("./test/data/wasm/test.proof", 'utf-8');
    const VK = require('fs').readFileSync('./test/data/wasm/test.key', 'utf-8');
    const CIRCUIT_PARAMS = require('fs').readFileSync('./test/data/wasm/settings.json', 'utf-8');
    const KZG_PARAMS = require('fs').readFileSync('./test/data/wasm/kzg', 'utf-8');
    const WITNESS = require('fs').readFileSync('./test/data/wasm/test.witness.json', 'utf-8');
    const NETWORK = require('fs').readFileSync('./test/data/wasm/test.onnx', 'utf-8');

    it('verifyHash', async () => {
        // Define the Poseidon constants
        const POSEIDON_WIDTH: number = 2;
        const POSEIDON_RATE: number = 1;
        const POSEIDON_LEN_GRAPH: number = 10;

        const NumberArray = new Type("NumberArray").add(new Field("values", 1, "int64", "repeated"));

        let message: Uint8Array[] = Array.from({length: 32}, (_, i) => {
          let hexString = (i+1).toString(16);
          hexString = "0".repeat(64 - hexString.length) + hexString;
          let hexParts = hexString.match(/.{1,2}/g);
          if (!hexParts) {
              throw new Error("Unexpected error splitting hexadecimal string.");
          }
          let bytes = new Uint8Array(hexParts.map(byte => parseInt(byte, 16)));
          return bytes;
        });

        let errMsg = NumberArray.verify({values: message});
        if (errMsg)
            throw Error(errMsg);
    
        let message_ser = NumberArray.encode({values: message}).finish();
    
        let hash = poseidonHash(new Uint8Array(message_ser.buffer));
        let hash_deserialized = NumberArray.decode(new Uint8Array(hash));
        console.log(hash_deserialized)
        // let hash_values: string[] = hash_deserialized.values;
    
        // let reference_hash = PoseidonChip.run(PoseidonSpec, POSEIDON_WIDTH, POSEIDON_RATE, POSEIDON_WIDTH, [...message]);
    
        // expect(hash_deserialized).toEqual(reference_hash);
    });

    it('verify_pass', async () => {
        const result = verify(PROOF, VK, CIRCUIT_PARAMS, KZG_PARAMS);

        // Your assertions here
        expect(result).toBe(true);
    });

    //Continue for all other test cases...
});

