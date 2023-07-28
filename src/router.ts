// import { Artifact } from 'hardhat/types';
// import request from './utils/request';
// import {
//   ApolloClient,
//   InMemoryCache,
//   ApolloProvider,
//   gql,
// } from '@apollo/client/core';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

const URL = 'http://127.0.0.1:5000/graphql';

const client = new ApolloClient({
  uri: URL,
  cache: new InMemoryCache(),
});

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

function isUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
}
interface ProveMutationResult {
  prove: Proof;
}

// type UUID = typeof v4;
// async function prove(artifactId: string, input: File) {
//   if (!isUUID(artifactId)) {
//     throw new Error('Invalid UUID');
//   }
// }

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
    query GetArtifacts {
      artifacts {
        name
        description
        id
      }
    }
  `;

  const {
    data: { artifacts },
  } = await client.query<ArtifactsResponse>({
    query: GET_ARTIFACTS,
  });

  return artifacts;
}

void afrifacts();

export default { afrifacts };
