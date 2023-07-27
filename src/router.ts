// import { Artifact } from 'hardhat/types';
// import request from './utils/request';
import { request, gql } from 'graphql-request';

const URL = 'http://127.0.0.1:5000/graphql';
// import {
//   ApolloClient,
//   InMemoryCache,
//   ApolloProvider,
//   gql,
// } from '@apollo/client';

// import input from './input.json';

// const client = new ApolloClient({
//   uri: 'http://127.0.0.1:5000/graphql',
//   cache: new InMemoryCache(),
// });
// GET
// healthCheck
async function healthCheck() {
  const { data } = await client.query({
    query: gql`
      query {
        check
      }
    `,
  });
  return data.check;
}

interface Witness {
  inputs: string[];
  outputs: string[];
  maxLookupInputs: number;
}

interface Proof {
  taskId: string;
  status: string;
  proof: string;
  witness: Witness;
}

interface ProofQueryResult {
  proof: Proof;
}

// // getProof
// async function getProof() {
//   const { data } = await client.query<ProofQueryResult>({
//     query: gql`
//       query {
//         proof(taskId: "506e2d28-b9e5-4135-986a-405a34ee8eab") {
//           taskId
//           status
//           proof
//           witness {
//             inputs
//             outputs
//             maxLookupInputs
//           }
//         }
//       }
//     `,
//   });
//   return data.proof;
// }

function isUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
}
interface ProveMutationResult {
  prove: Proof;
}

// type UUID = typeof v4;
async function prove(artifactId: string, input: File) {
  if (!isUUID(artifactId)) {
    throw new Error('Invalid UUID');
  }
}

//   const { data } = await client.mutate<ProveMutationResult>({
//     mutation: gql`
//       mutation Prove($id: String!, $input: Upload!) {
//         prove(id: $id, input: $input) {
//           taskId
//           status
//         }
//       }
//     `,
//     variables: {
//       id: '78e593bd-e12a-4014-bb42-5d8d2dd3680b',
//       input: null,
//     },
//   });
//   return data.prove;
// }

// POST
// afrifacts
// uploadArtifact
// prove
type Artifact = {
  name: string;
  description: string;
  id: string;
};

type ArtifactsResponse = {
  artifacts: Artifact[];
};
async function afrifacts() {
  const GET_ARTIFACTS = gql`
    {
      artifacts {
        name
        description
        id
      }
    }
  `;
  const { artifacts } = await request<ArtifactsResponse>(URL, GET_ARTIFACTS);

  return artifacts;
}

void afrifacts();

export default { healthCheck };
