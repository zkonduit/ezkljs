export const INITIATED_PROOF_MUTATION = `mutation InitiateProof($id: String!, $input: Upload!) {
  initiateProof(id: $id, input: $input) { 
    id
    status 
  }
}`

export const UPLOAD_ARTIFACTE_MUTATION = `mutation UploadArtifact($name: String!, $description: String!, $model: Upload!, $settings: Upload!, $pk: Upload!, $organizationId: String!) {
  uploadArtifactLegacy(
    name: $name
    description: $description
    srs: perpetual_powers_of_tau_11 
    model: $model
    settings: $settings
    pk: $pk 
    organizationId: $organizationId
  ) {
     id
  }
}`

export const GEN_ARTIFACT_MUTATION = `mutation GenerateArtifact(
  $name: String!,
  $description: String!,
  $uncompiledModel: Upload!,
  $input: Upload!,
  $organizationId: String!,
  $inputVisibility: String!,
  $outputVisibility: String!,
  $paramVisibility: String!,
) {
  generateArtifact(
    name: $name
    description: $description
    uncompiledModel: $uncompiledModel
    input: $input
    organizationId: $organizationId
    inputVisibility: $inputVisibility
    outputVisibility: $outputVisibility
    paramVisibility: $paramVisibility
  ) {
    id
  }
}`
