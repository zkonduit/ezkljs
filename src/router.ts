// import path
import path from 'path';
import { readFile } from 'node:fs/promises';
import request from './utils/request';

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

// async function prove(id: string, input: ProveInput) {
async function prove(id: string, input: any) {
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

  const inputPath = path.resolve(__dirname, '../dist/public/input.json');
  console.log('inputPath', inputPath);
  const rawData = await readFile(inputPath);
  const someBlob = new Blob([rawData]);

  // console.log('rawData', rawData);
  // return;
  // Prepare form data
  const formData = new FormData();
  formData.append('operations', JSON.stringify(operations));
  formData.append('map', JSON.stringify(map));
  formData.append(
    'input',
    someBlob,
    // new Blob([JSON.stringify(input)], { type: 'application/json' }),
    'input.json'
  );

  // const { prove: proofStatus } = await request<{
  const resp = await fetch(URL, {
    method: 'POST',
    body: formData,
  });

  console.log(
    'status~!',
    resp.status,
    '\nContent-Type~!',
    resp.headers.get('content-type')
  );

  const proofStatus = await resp.json();

  console.log('resp', proofStatus);
  // console.log(resp.status, resp.headers.get('content-type'));
  // const proofStatus = resp.prove;

  // console.log('proofStatus', proofStatus);
  // return proofStatus;
}

// Usage
void prove('4cd02d5f-3499-4c4a-8e82-e0e8c7c367bd', {
  input_data: [[1.5417295, 0.5346153, 1.2172532]],
  input_shapes: [[1, 3]],
  output_data: [[0.28125, 0.6484375, 0.0, 0.0]],
});

export default { artifacts };
