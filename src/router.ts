// import path
import path from 'path';
import { readFile } from 'node:fs/promises';
import request from './utils/request';
import isValidHexString from './utils/isValidHexString';

const URL = 'http://127.0.0.1:5000/graphql';

type Artifact = {
  name: string;
  description: string;
  id: string;
};

async function artifacts() {
  const response = await request<{ artifacts: Artifact[] }>(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query Artifacts {
          artifacts {
            name
            description
            id
          }
        }
      `,
    }),
  });

  console.log(response);
}

async function prove(id: string, input: Buffer) {
  const operations = {
    query: `mutation Prove($id: String!, $input: Upload!) {
      prove(id: $id, input: $input) { 
        taskId 
        status 
      }}`,
    variables: {
      id,
      input,
    },
  };

  const map = {
    input: ['variables.input'],
  };

  const body = new FormData();
  body.append('operations', JSON.stringify(operations));
  body.append('map', JSON.stringify(map));
  body.append('input', new Blob([input]));

  const { prove: proofStatus } = await request<{
    prove: {
      taskId: string;
      status: string;
    };
  }>(URL, {
    method: 'POST',
    body,
  });

  // console.log('resp', proofStatus);

  return proofStatus;
}

interface Witness {
  inputs: number[][];
  outputs: number[][];
  maxLookupInputs: number;
}

interface ProofDetails {
  taskId: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  proof: string;
  witness: Witness;
}

async function getProof(taskId: string) {
  const { proof: proofDetails } = await request<{ proof: ProofDetails }>(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetProof($taskId: String!){
          proof(taskId: $taskId) {
            taskId
            status
            proof
            witness {
              inputs
              outputs
              maxLookupInputs
            }
          }
        }
      `,
      variables: {
        taskId,
      },
    }),
  });

  if (!isValidHexString(proofDetails.proof)) {
    throw new Error('Invalid proof');
  }

  console.log(proofDetails);
  return proofDetails;
}

async function callProve() {
  const inputPath = path.resolve(__dirname, '../dist/public/input.json');
  // todo: need to investigate eslint type error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const input = await readFile(inputPath);
  const { taskId } = await prove('4cd02d5f-3499-4c4a-8e82-e0e8c7c367bd', input);
  void getProof(taskId);
}

callProve();

export default { artifacts };
