export interface Artifact {
  name: string
  description: string
  id: string
}
export interface ProveResponse {
  prove: {
    taskId: string
    status: string
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

declare function artifacts(): Promise<Artifact[]>
declare function prove(id: string, input: Buffer): Promise<ProveResponse>
declare function getProof(taskId: string): Promise<ProofDetails>

declare const Router: {
  artifacts: typeof artifacts
  prove: typeof prove
  getProof: typeof getProof
}

import { Lib } from '../src'
import { Helper } from '../src'

export { Router, Helper, Lib }
