export const INITIATED_PROOF_MUTATION = `mutation InitiateProof($id: String!, $input: Upload!) {
  initiateProof(id: $id, input: $input) { 
    taskId 
    status 
  }
}`

export const UPLOAD_ARTIFACTE_MUTATION = `mutation UploadArtifact($model: Upload!, $settings: Upload!, $pk: Upload!) {
  uploadArtifactLegacy(
    name: "test"
    description: "test"
    srs: perpetual_powers_of_tau_11 
    model: $model
    settings: $settings
    pk: $pk 
  ) {
     id
  }
}`

export const GEN_ARTIFACT_MUTATION = `mutation GenerateArtifact(
  $uncompiledModel: Upload!,
  $input: Upload!,
) {
  generateArtifact(
    name: "test"
    description: "test"
    uncompiledModel: $uncompiledModel
    input: $input
  ) {
    artifact {
      id
    }
  }
}`
