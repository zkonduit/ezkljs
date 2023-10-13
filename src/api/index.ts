import getArtifacts from './getArtifacts'
import getProof from './getProof'
import healthCheck from './healthCheck'
import initiateProof from './initiateProof'
import uploadArtifact from './uploadArtifact'
import genArtifact from './genArtifact'

export type Hub = {
  healthCheck: typeof healthCheck
  uploadArtifact: typeof uploadArtifact
  getArtifacts: typeof getArtifacts
  initiateProof: typeof initiateProof
  getProof: typeof getProof
  genArtifact: typeof genArtifact
}

const hub: Hub = {
  healthCheck,
  uploadArtifact,
  getArtifacts,
  initiateProof,
  getProof,
  genArtifact,
}

export default hub
