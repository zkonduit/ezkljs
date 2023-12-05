// import healthCheck from './healthCheck'
import getArtifact from './getArtifact'
import getArtifacts from './getArtifacts'
import getProof from './getProof'
import getProofs from './getProofs'
import initiateProof from './initiateProof'
import uploadArtifact from './uploadArtifact'
import genArtifact from './genArtifact'
import getOrganization from './getOrganization'
import getArtifactSettings from './getArtifactSettings'
import getArtifactONNX from './getArtifactONNX'
import deleteArtifact from './deleteArtifact'
import deleteProof from './deleteProof'

export type Hub = {
  // healthCheck: typeof healthCheck
  uploadArtifact: typeof uploadArtifact
  getArtifact: typeof getArtifact
  getArtifacts: typeof getArtifacts
  getArtifactSettings: typeof getArtifactSettings
  deleteArtifact: typeof deleteArtifact
  initiateProof: typeof initiateProof
  getProof: typeof getProof
  getProofs: typeof getProofs
  deleteProof: typeof deleteProof
  genArtifact: typeof genArtifact
  getOrganization: typeof getOrganization
  getArtifactONNX: typeof getArtifactONNX
}

const hub: Hub = {
  // healthCheck,
  uploadArtifact,
  getArtifact,
  getArtifacts,
  getArtifactSettings,
  getArtifactONNX,
  deleteArtifact,
  initiateProof,
  deleteProof,
  getProof,
  getProofs,
  genArtifact,
  getOrganization,
}

export default hub
