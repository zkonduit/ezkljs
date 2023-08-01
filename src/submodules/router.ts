import request from '../utils/request'
import isValidHexString from '../utils/isValidHexString'

const URL = 'https://hub.ezkl.xyz/graphql '

export interface Artifact {
  name: string
  description: string
  id: string
}

async function artifacts() {
  const { artifacts } = await request<{ artifacts: Artifact[] }>(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query Artifacts {
          artifacts {
            name
            description
            id
          }
        }
      `,
    }),
  })
  return artifacts
}

export interface ProveResponse {
  prove: {
    taskId: string
    status: string
  }
}

async function prove(id: string, input: Buffer) {
  const operations = {
    query: `mutation Prove($id: String!, $input: Upload!) {
      prove(id: $id, input: $input) { 
        taskId 
        status 
      }}`,
    variables: {
      id,
      input,
    },
  }

  const map = {
    input: ['variables.input'],
  }

  const body = new FormData()
  body.append('operations', JSON.stringify(operations))
  body.append('map', JSON.stringify(map))
  body.append('input', new Blob([input]))

  const { prove: proofStatus } = await request<ProveResponse>(URL, {
    method: 'POST',
    body,
  })

  return proofStatus
}

export interface Witness {
  inputs: number[][]
  outputs: number[][]
  maxLookupInputs: number
}

export interface ProofDetails {
  taskId: string
  status: 'SUCCESS' | 'PENDING' | 'FAILED'
  proof: string
  witness: Witness
}

async function getProof(taskId: string) {
  const { proof: proofDetails } = await request<{ proof: ProofDetails }>(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetProof($taskId: String!){
          proof(taskId: $taskId) {
            taskId
            status
            proof
            witness {
              inputs
              outputs
              maxLookupInputs
            }
          }
        }
      `,
      variables: {
        taskId,
      },
    }),
  })

  if (!isValidHexString(proofDetails.proof)) {
    throw new Error('Invalid proof')
  }

  return proofDetails
}

export const Router = { artifacts, prove, getProof }
