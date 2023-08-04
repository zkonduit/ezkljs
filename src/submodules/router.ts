import request from '../utils/request'
import { isValidHexString } from '../utils/stringValidators'

const URL = 'https://hub.ezkl.xyz/graphql'

const healthyStatus = {
  res: "Welcome to the ezkl hub's backend!",
  status: 'ok',
} as const

type HealthCheckResponse = typeof healthyStatus

// void healthCheck()
// void getArtifacts()

async function healthCheck() {
  try {
    const data = await request<HealthCheckResponse>('https://hub.ezkl.xyz/')
    if (data.status !== 'ok') {
      throw new Error('Health check failed')
    }
    return data
  } catch (e) {
    console.error(e)
  }
}

export interface Artifact {
  name: string
  description: string
  id: string
}

async function uploadArtifact(
  model: Buffer | File,
  settings: Buffer | File,
  pk: Buffer | File,
) {
  const operations = {
    query: `mutation($model: Upload!, $settings: Upload!, $pk: Upload!) {
      uploadArtifact(
        name: "test"
        description: "test"
        srs: perpetual_powers_of_tau_11 
        model: $model
        settings: $settings
        pk: $pk 
      ) {
         id
      }
    }`,
    variables: {
      model,
      settings,
      pk,
    },
  }

  const map = {
    model: ['variables.model'],
    settings: ['variables.settings'],
    pk: ['variables.pk'],
  }

  const body = new FormData()
  body.append('operations', JSON.stringify(operations))
  body.append('map', JSON.stringify(map))
  body.append('model', new Blob([model]))
  body.append('settings', new Blob([settings]))
  body.append('pk', new Blob([pk]))

  try {
    // const resp = await fetch('https://hub.ezkl.xyz/graphql', options)
    // const data = await resp.json()
    const data = await request<{ uploadArtifact: { id: string } }>(URL, {
      unwrapData: true,
      method: 'POST',
      body,
    })

    return data
  } catch (e) {
    console.error(e)
  }
}

async function getArtifacts() {
  try {
    const { artifacts } = await request<{ artifacts: Artifact[] }>(URL, {
      unwrapData: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query Artifacts($first: Int, $skip: Int) {
            artifacts(first: $first, skip: $skip) {
              name
              description
              id
            }
          }
        `,
        variables: {
          first: 100, // replace with the value you want
          skip: 0, // replace with the value you want
        },
      }),
    })
    return artifacts
  } catch (e) {
    console.error(e)
  }
}

export interface InitiateProofResponse {
  initiateProof: {
    taskId: string
    status: string
  }
}

async function initiateProof(id: string, input: Buffer | File) {
  const operations = {
    query: `mutation InitiateProof($id: String!, $input: Upload!) {
      initiateProof(id: $id, input: $input) { 
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

  try {
    const { initiateProof } = await request<InitiateProofResponse>(URL, {
      unwrapData: true,
      method: 'POST',
      body,
    })

    return initiateProof
  } catch (e) {
    console.error(e)
  }
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
  console.log('taskId!!!', taskId)
  try {
    const { getProof: proofDetails } = await request<{
      getProof: ProofDetails
    }>(URL, {
      unwrapData: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query GetProof($taskId: String!){
            getProof(taskId: $taskId) {
              taskId
              status
              proof
              witness {
                inputs
                outputs
                maxLookupInputs
              }
            }
          }`,
        variables: {
          taskId,
        },
      }),
    })

    if (!isValidHexString(proofDetails.proof)) {
      // throw new Error('Invalid proof')
      console.error('Invalid proof')
    }

    return proofDetails
  } catch (e) {
    console.error(e)
  }
}

export const Router = {
  healthCheck,
  uploadArtifact,
  getArtifacts,
  initiateProof,
  getProof,
}
