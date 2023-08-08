export const GET_ARTIFACTS_QUERY = `
  query Artifacts($first: Int, $skip: Int) {
    artifacts(first: $first, skip: $skip) {
      name
      description
      id
    }
  }
`

export const GET_PROOF_QUERY = `query GetProof($taskId: String!){
  getProof(taskId: $taskId) {
    taskId
    status
    proof
    transcriptType
    witness {
      inputs
      outputs
      maxLookupInputs
    }
  }
}`
