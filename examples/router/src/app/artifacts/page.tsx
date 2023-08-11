'use client'
import PageTitle from '@/components/PageTitle'
import Paragraph from '@/components/Paragraph'
import { Button, Spinner } from 'flowbite-react'
import hub from '@ezkljs/hub'
import { useState } from 'react'
import { z } from 'zod'

const artifactsSchema = z.array(
  z.object({
    name: z.string(),
    description: z.string(),
    id: z.string().uuid(),
  }),
)

type Artifacts = z.infer<typeof artifactsSchema>

export default function Artifacts() {
  const [artifacts, setArtifacts] = useState<Artifacts>([])
  const [fetching, setFetching] = useState<boolean>(false)

  const handleClick = async () => {
    setFetching(true)
    const artifacts = await hub.getArtifacts()
    setFetching(false)

    const validatedArtifacts = artifactsSchema.parse(artifacts)
    setArtifacts(validatedArtifacts)
  }

  return (
    <div className='flex flex-col h-full'>
      <PageTitle>Artifacts</PageTitle>
      <Paragraph>Get the artifacts live on hub.</Paragraph>
      <div className='flex items-center'>
        <Button onClick={handleClick} className='w-32'>
          Get Artifacts
        </Button>
        {fetching && <Spinner size='lg' className='ml-10' />}
      </div>
      {artifacts.length > 0 && (
        <code className='mt-8 hljs overflow-scroll'>
          {artifacts.map((artifact) => (
            <div className='mb-10' key={artifact.id}>
              {JSON.stringify(artifact)}
            </div>
          ))}
        </code>
      )}
    </div>
  )
}
