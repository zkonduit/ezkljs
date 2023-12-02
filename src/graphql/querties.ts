export const GET_ARTIFACTS_QUERY = `
  query Artifacts($first: Int, $skip: Int) {
    artifacts(first: $first, skip: $skip) {
      name
      description
      id
      organization {
        id
        name
      }
    }
  }
`

export const GET_PROOF_QUERY = `query GetProof($id: String!){
  getProof(id: $id) {
    id
    status
    proof
    instances
    transcriptType
    createdAt
    timeTaken
  }
}`
