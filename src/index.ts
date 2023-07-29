// import path
import path from 'path';
import { readFile } from 'node:fs/promises';
import Router from './router';
import Verifier from './verifier';

async function callProve() {
  const inputPath = path.resolve(__dirname, '../dist/public/input.json');
  // todo: need to investigate eslint type error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const input = await readFile(inputPath);
  const { taskId } = await Router.prove(
    '4cd02d5f-3499-4c4a-8e82-e0e8c7c367bd',
    input
  );
  const details = await Router.getProof(taskId);
  console.log(details);
}

callProve();

export { Router, Verifier };
