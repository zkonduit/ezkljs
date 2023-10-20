'use client'
import Paragraph from '@/components/Paragraph'
import {
  Button,
  FileInput,
  Label,
  Spinner,
  TextInput,
  Tabs,
} from 'flowbite-react'
import hub from '@ezkljs/hub'
import { useState } from 'react'
import {
  type GetProof,
  type InitiateProof,
  formDataSchema,
  getProofSchema,
  intiateProofSchema,
} from './parsers'
import { GQL_URL } from '@/constants'

// Truncate Proof string
function showFirstAndLast(str: string, show: number): string {
  if (str.length <= show * 2) return str // If the string is already 10 characters or fewer, return it as is.
  return str.slice(0, show) + ' . . . ' + str.slice(-show)
}

export default function Prove() {
  // State
  const [fetchingInitiateProof, setFetchingInitiateProof] =
    useState<boolean>(false)
  const [fetchingGetProof, setFetchingGetProof] = useState<boolean>(false)
  const [initiatedProof, setInitiatedProof] = useState<InitiateProof>()
  const [proof, setProof] = useState<GetProof>()

  // Form submit handlers defined in parent scope to manage page alerts
  const handleSubmitInitiateProof = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const formInputs = {
      artifactId: formData.get('artifactId'),
      inputFile: formData.get('inputFile'),
    }

    const validatedFormInputs = formDataSchema.safeParse(formInputs)

    if (!validatedFormInputs.success) {
      return
    }

    if (validatedFormInputs.data.inputFile === null) {
      return
    }

    setFetchingInitiateProof(true)
    try {
      /* =================== HUB API ==================== */
      const initiatedProofResp = await hub.initiateProof({
        artifactId: validatedFormInputs.data.artifactId,
        inputFile: validatedFormInputs.data.inputFile,
        url: GQL_URL,
      })
      /* ================================================ */

      const validInitiatedProof = intiateProofSchema.parse(initiatedProofResp)

      setInitiatedProof(validInitiatedProof)
    } catch (error) {
      console.error('An error occurred:', error)
    } finally {
      setFetchingInitiateProof(false)
    }
  }

  const handleSubmitGetProof = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const formInputs = {
      taskId: formData.get('taskId'),
    }
    const { taskId } = formInputs
    try {
      if (taskId === null || typeof taskId !== 'string') {
        return
      }
      setFetchingGetProof(true)
      /* ================= HUB API =================== */
      const getProofResp = await hub.getProof({
        id: taskId,
        url: GQL_URL,
      })
      /* ============================================= */
      setFetchingGetProof(false)

      const validProof = getProofSchema.parse(getProofResp)

      setProof(validProof)
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <div>
      <Tabs.Group className='w-full text-2xl' style='fullWidth'>
        <Tabs.Item title='Initiate Proof'>
          <Paragraph className='text-sm'>
            Proving is done in two steps Initiate Proof and Get Proof
          </Paragraph>
          <InitiateProof
            handleSubmit={handleSubmitInitiateProof}
            initiatedProof={initiatedProof}
            fetching={fetchingInitiateProof}
          />
        </Tabs.Item>
        <Tabs.Item title='Get Proof'>
          <Paragraph className='text-sm'>
            Proving is done in two steps Initiate Proof and Get Proof
          </Paragraph>
          <GetProof
            fetching={fetchingGetProof}
            defaultTaskId={initiatedProof?.id}
            proof={proof}
            handleSubmit={handleSubmitGetProof}
          />
        </Tabs.Item>
      </Tabs.Group>
    </div>
  )
}

function InitiateProof({
  handleSubmit,
  initiatedProof,
  fetching,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  initiatedProof: InitiateProof | undefined
  fetching: boolean
}) {
  return (
    <>
      <form onSubmit={handleSubmit} className='mb-4'>
        <div className='mb-8'>
          <Label htmlFor='artifactId' value='Artifact ID' />
          <TextInput id='artifactId' name='artifactId' />
        </div>

        <div className='mb-10'>
          <Label htmlFor='inputFile' value='Select Input File' />
          <FileInput
            helperText='Upload your input JSON file'
            id='inputFile'
            name='inputFile'
            className='my-4'
          />
        </div>

        {!fetching ? (
          <Button type='submit'>Initiate Proof</Button>
        ) : (
          <Spinner size='xl' />
        )}
      </form>
      {initiatedProof?.status && (
        <div className='text-sm h-24 flex flex-col justify-between mt-8'>
          <h1 className='text-xl'>Initiated Proof</h1>
          <p>Status: {initiatedProof.status}</p>
          <p>Task ID: {initiatedProof.id}</p>
        </div>
      )}
    </>
  )
}

function GetProof({
  defaultTaskId,
  handleSubmit,
  proof,
  fetching,
}: {
  defaultTaskId?: string
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  fetching: boolean
  proof: GetProof | undefined
}) {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='mb-12'>
          <Label htmlFor='taskId' value='Task ID' />
          <TextInput id='taskId' name='taskId' defaultValue={defaultTaskId} />
        </div>
        {!fetching ? (
          <Button type='submit'>Get Proof</Button>
        ) : (
          <Spinner size='xl' />
        )}
      </form>
      {proof?.status === 'SUCCESS' && (
        <div className='text-sm h-24 flex flex-col justify-between mt-8'>
          <h1 className='text-xl'>Proof</h1>
          <p>Task ID: {proof.id}</p>
          <p>Status: {proof.status}</p>
          <p className='break-words'>
            Proof: {showFirstAndLast(proof.proof, 10)}
          </p>
        </div>
      )}
    </>
  )
}
