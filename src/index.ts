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
