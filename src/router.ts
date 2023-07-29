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

  // todo: need to investigate eslint type error

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call

  // const someBlob = new Blob([await readFile(inputPath)]);

  // console.log('rawData', rawData);
  // return;
  // Prepare form data
  const someBlob = new Blob([input]);
  const formData = new FormData();
  formData.append('operations', JSON.stringify(operations));
  formData.append('map', JSON.stringify(map));
  formData.append(
    'input',
    someBlob,
    // new Blob([JSON.stringify(input)], { type: 'application/json' }),
    'input.json'
  );

  // const resp = await request(URL, {
  const { prove: proofStatus } = await request<{
    prove: {
      taskId: string;
      status: string;
    };
  }>(URL, {
    method: 'POST',
    body: formData,
  });

  // console.log(
  //   'status~!',
  //   resp.status,
  //   '\nContent-Type~!',
  //   resp.headers.get('content-type')
  // );

  // const proofStatus = await resp.json();

  console.log('resp', proofStatus);
  // console.log(resp.status, resp.headers.get('content-type'));
  // const proofStatus = resp.prove;

  // console.log('proofStatus', proofStatus);
  // return proofStatus;
}
async function callProve() {
  const inputPath = path.resolve(__dirname, '../dist/public/input.json');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const input = await readFile(inputPath);
  void prove('4cd02d5f-3499-4c4a-8e82-e0e8c7c367bd', input);
}

callProve();

export default { artifacts };
