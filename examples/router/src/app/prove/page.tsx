'use client'
import PageTitle from '@/components/PageTitle'
import Paragraph from '@/components/Paragraph'
import {
  Button,
  Checkbox,
  FileInput,
  Label,
  Spinner,
  TextInput,
  Tabs,
} from 'flowbite-react'
import { fileSchema } from '../upload-artifact/page'
import { z } from 'zod'
import { router } from 'ezkl'
import { useState } from 'react'

// import { useState } from 'react'

const formDataSchema = z.object({
  // artifactId: z.string().uuid(),
  artifactId: z.string(),
  inputFile: fileSchema,
})

const intiateProofSchema = z.object({
  status: z.literal('PENDING'),
  taskId: z.string().uuid(),
})

const fourElementsArray = z.array(z.number().int()).length(4)

const witnessSchema = z.object({
  inputs: z.array(z.array(fourElementsArray)),
  outputs: z.array(z.array(fourElementsArray)),
  maxLookupInputs: z.number().int(),
})

const getProofSchema = z.object({
  taskId: z.string().uuid(),
  status: z.enum(['SUCCESS']),
  proof: z.string(),
  witness: witnessSchema,
})

// const getProofSchemaResponse = z.object({
//   getProof: getProofSchema,
// })

type GetProof = z.infer<typeof getProofSchema>

type InitiateProof = z.infer<typeof intiateProofSchema>

function showFirstAndLast(str: string, show: number): string {
  if (str.length <= show * 2) return str // If the string is already 10 characters or fewer, return it as is.
  return str.slice(0, show) + ' . . . ' + str.slice(-show)
}

export default function Prove() {
  const [fetchingInitiateProof, setFetchingInitiateProof] =
    useState<boolean>(false)
  const [fetchingGetProof, setFetchingGetProof] = useState<boolean>(false)
  const [initiatedProof, setInitiatedProof] = useState<InitiateProof>()
  const [proof, setProof] = useState<GetProof>()

  const handleSubmitInitiateProof = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const parsedData = {
      artifactId: formData.get('artifactId'),
      inputFile: formData.get('inputFile'),
    }

    const result = formDataSchema.safeParse(parsedData)

    if (!result.success) {
      return
    }

    if (result.data.inputFile === null) {
      return
    }

    setFetchingInitiateProof(true)
    try {
      const initiatedProofResp = await router.initiateProof(
        result.data.artifactId,
        result.data.inputFile
      )

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
    const parsedData = {
      taskId: formData.get('taskId'),
    }
    const { taskId } = parsedData
    try {
      if (taskId === null || typeof taskId !== 'string') {
        return
      }
      const getProofResp = await router.getProof(taskId)

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
          <GetProof
            fetching={fetchingGetProof}
            defaultTaskId={initiatedProof?.taskId}
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
          <p>Task ID: {initiatedProof.taskId}</p>
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
        <div className='mb-8'>
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
          <p>Task ID: {proof.taskId}</p>
          <p>Status: {proof.status}</p>
          <p className='break-words'>
            Proof: {showFirstAndLast(proof.proof, 10)}
          </p>
        </div>
      )}
    </>
  )
}
