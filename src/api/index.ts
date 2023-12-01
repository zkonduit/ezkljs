import getArtifact from './getArtifact'
import getArtifacts from './getArtifacts'
import getProof from './getProof'
import healthCheck from './healthCheck'
import initiateProof from './initiateProof'
import uploadArtifact from './uploadArtifact'
import genArtifact from './genArtifact'
import getOrganization from './getOrganization'

export type Hub = {
  healthCheck: typeof healthCheck
  uploadArtifact: typeof uploadArtifact
  getArtifact: typeof getArtifact
  getArtifacts: typeof getArtifacts
  initiateProof: typeof initiateProof
  getProof: typeof getProof
  genArtifact: typeof genArtifact
  getOrganization: typeof getOrganization
}

const hub: Hub = {
  healthCheck,
  uploadArtifact,
  getArtifact,
  getArtifacts,
  initiateProof,
  getProof,
  genArtifact,
  getOrganization,
}

export default hub
