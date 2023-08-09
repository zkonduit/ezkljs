'use client'

import { z } from 'zod'

import {
  FileInput,
  Label,
  Button,
  Alert,
  Spinner as _Spinner,
} from 'flowbite-react'
import { useState } from 'react'
import { router } from 'ezkl'

export const fileSchema = z.custom<File | null>((value) => {
  if (value === null) return false
  return value instanceof File && value.name.trim() !== ''
}, "File name can't be empty")

const formDataSchema = z.object({
  model: fileSchema,
  settings: fileSchema,
  pk: fileSchema,
})

const uploadArtifactSchema = z.object({
  id: z.string().uuid(),
})

export default function UploadArtifact() {
  const [alert, setAlert] = useState<string>('')
  const [fetching, setFetching] = useState<boolean>(false)
  const [uploadArtifactId, setUploadArtifactId] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const parsedData = {
      model: formData.get('model'),
      settings: formData.get('settings'),
      pk: formData.get('pk'),
    }

    const result = formDataSchema.safeParse(parsedData)

    if (!result.success) {
      setAlert('Please upload all files')
      return
    }

    if (alert) setAlert('')

    if (
      result.data.model === null ||
      result.data.settings === null ||
      result.data.pk === null
    ) {
      setAlert('Please upload all files')
      return
    }

    setFetching(true)
    const uploadArtifactResp = await router.uploadArtifact(
      result.data.model,
      result.data.settings,
      result.data.pk
    )
    setFetching(false)

    const validUploadArtifact = uploadArtifactSchema.parse(uploadArtifactResp)
    setUploadArtifactId(validUploadArtifact.id)
  }

  return (
    <div className='flex justify-center h-5/6 pb-20'>
      {uploadArtifactId ? (
        <div className='w-10/12 flex flex-col'>
          <h1 className='text-2xl mb-6 '>Newly Uploaded Artifact 🥳</h1>
          {uploadArtifactId}
        </div>
      ) : fetching ? (
        <Spinner />
      ) : (
        <UploadArtifactForm handleSubmit={handleSubmit} alert={alert} />
      )}
    </div>
  )
}

function Spinner() {
  return (
    <div className='h-full flex items-center'>
      <_Spinner size='3xl' className='w-28 lg:w-44' />
    </div>
  )
}

function UploadArtifactForm({
  handleSubmit,
  alert,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  alert: string
}) {
  return (
    <div className='w-10/12 flex flex-col'>
      <h1 className='text-2xl mb-6 '>Upload Artifact</h1>
      {alert && (
        <Alert color='info' className='mb-6'>
          {alert}
        </Alert>
      )}
      {/* <Alert color='info' className='mb-6'></Alert> */}
      <form
        onSubmit={handleSubmit}
        className='flex flex-col flex-grow  justify-between'
      >
        {/* MODEL */}
        <div>
          <Label htmlFor='model' value='Select Model File' />
          <FileInput
            helperText='Upload your model as a compiled .ezkl file or as an .onnx file'
            id='model'
            name='model'
            className='my-4'
          />
        </div>
        {/* SETTINGS */}
        <div>
          <Label htmlFor='settings' value='Select Settings File' />
          <FileInput
            helperText='Upload your settings file in JSON format'
            id='settings'
            name='settings'
            className='my-4'
          />
        </div>
        {/* PK */}
        <div>
          <Label htmlFor='pk' value='Select PK File' />
          <FileInput
            helperText='Upload your PK (private key) file'
            id='pk'
            name='pk'
            className='my-4'
          />
        </div>
        <Button type='submit' color='dark' className='w-full self-center mt-4'>
          Create Artifact
        </Button>
      </form>
    </div>
  )
}
