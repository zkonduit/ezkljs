'use client'

import {
  FileInput,
  Label,
  Button,
  Alert,
  Spinner as _Spinner,
} from 'flowbite-react'
import { useState } from 'react'
import hub from '@ezkljs/hub'
import { formDataSchema, uploadArtifactSchema } from './parsers'
import { GQL_URL } from '@/constants'

export default function UploadArtifact() {
  // State
  const [alert, setAlert] = useState<string>('')
  const [fetching, setFetching] = useState<boolean>(false)
  const [uploadArtifactId, setUploadArtifactId] = useState<string>('')

  // Submit Form Handler
  // Defined in parent scope to manager page level alerts
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const formInputs = {
      model: formData.get('model'),
      settings: formData.get('settings'),
      pk: formData.get('pk'),
    }

    // Validate form has valid inputs (zod)
    const validatedFormInputs = formDataSchema.safeParse(formInputs)

    if (!validatedFormInputs.success) {
      setAlert('Please upload all files')
      return
    }

    // Clear alert
    if (alert) setAlert('')

    // Missing data
    if (
      validatedFormInputs.data.model === null ||
      validatedFormInputs.data.settings === null ||
      validatedFormInputs.data.pk === null
    ) {
      setAlert('Please upload all files')
      return
    }

    setFetching(true)
    /* ================== HUB API ====================== */
    const uploadArtifactResp = await hub.uploadArtifact({
      modelFile: validatedFormInputs.data.model,
      settingsFile: validatedFormInputs.data.settings,
      pkFile: validatedFormInputs.data.pk,
      url: GQL_URL,
      name: 'test',
      description: 'test',
      organizationId: '10f565e2-803b-4fe8-b70e-387de38b4cf5',
    })
    /* ================================================= */
    setFetching(false)

    const validUploadArtifact = uploadArtifactSchema.parse(uploadArtifactResp)
    setUploadArtifactId(validUploadArtifact.id)
  }

  /* Three render paths:
    1. Successfully uploaded artifact to hub
    2. Fetching: uploading artifact to hub
    3. Render upload form 
  */
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

// UI Component
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
    <div className='flex flex-col'>
      <h1 className='text-2xl mb-6 '>Upload Artifact</h1>
      {alert && (
        <Alert color='info' className='mb-6'>
          {alert}
        </Alert>
      )}
      <form
        onSubmit={handleSubmit}
        className='flex flex-col flex-grow  justify-between'
      >
        {/* MODEL */}
        <div>
          <Label htmlFor='model' value='Select Model File' />
          <FileInput
            helperText='Upload your model as a compiled .ezkl file'
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
            helperText='Upload your PK (proving key) file'
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
