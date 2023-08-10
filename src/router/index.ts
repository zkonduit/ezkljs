import getArtifacts from './getArtifacts'
import getProof from './getproof'
import healthCheck from './healthCheck'
import initiateProof from './initiateProof'
import uploadArtifact from './uploadArtifact'

export type Router = {
  healthCheck: typeof healthCheck
  uploadArtifact: typeof uploadArtifact
  getArtifacts: typeof getArtifacts
  initiateProof: typeof initiateProof
  getProof: typeof getProof
}

export const router: Router = {
  healthCheck,
  uploadArtifact,
  getArtifacts,
  initiateProof,
  getProof,
}
