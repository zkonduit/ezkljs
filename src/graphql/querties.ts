export const GET_ARTIFACTS_QUERY = `
  query Artifacts($first: Int, $skip: Int) {
    artifacts(first: $first, skip: $skip) {
      id
      name
      createdAt
      status
      uncompiledModel
      description
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
