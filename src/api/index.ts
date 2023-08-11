import getArtifacts from './getArtifacts'
import getProof from './getproof'
import healthCheck from './healthCheck'
import initiateProof from './initiateProof'
import uploadArtifact from './uploadArtifact'

export type Hub = {
  healthCheck: typeof healthCheck
  uploadArtifact: typeof uploadArtifact
  getArtifacts: typeof getArtifacts
  initiateProof: typeof initiateProof
  getProof: typeof getProof
}

const hub: Hub = {
  healthCheck,
  uploadArtifact,
  getArtifacts,
  initiateProof,
  getProof,
}

export default hub
