// import path
import path from 'path';
import { readFile } from 'node:fs/promises';
import Router from './router';
import Verifier from './verifier';

async function callProve() {
  const inputPath = path.resolve(__dirname, '../dist/public/input.json');
  const input = await readFile(inputPath);
  const { taskId } = await Router.prove(
    '44f2d71d-3ef8-455d-ba5c-636abc3513f8',
    input
  );
  const details = await Router.getProof(taskId);
  console.log(details);
}

void callProve();

// async function callArficats() {
//   const artifacts = await Router.artifacts();
//   console.log(artifacts);
// }

// void callArficats();

export { Router, Verifier };
