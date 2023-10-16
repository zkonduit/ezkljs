export const GET_ARTIFACTS_QUERY = `
  query Artifacts($first: Int, $skip: Int) {
    artifacts(first: $first, skip: $skip) {
      name
      description
      id
    }
  }
`

export const GET_ORGANIZATIONS_AND_ARTIFACTS_BY_ID = `
  query getOrganizationsAndArtifacts($first: Int, $skip: Int, $organizationId: String!) {
    organizations(first: $first, skip: $skip, id: $organizationId) {
      name
      id
      artifacts {
        id
        name
        description
      }
    }
  }
`

export const GET_PROOF_QUERY = `query GetProof($taskId: String!){
  getProof(taskId: $taskId) {
    taskId
    status
    proof
    instances
    transcriptType
    strategy
  }
}`
