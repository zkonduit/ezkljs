import { z } from 'zod'

const fileSchema = z.custom<File | null>((value) => {
  if (value === null) return false
  return value instanceof File && value.name.trim() !== ''
}, "File name can't be empty")

export const formDataSchema = z.object({
  artifactId: z.string(),
  inputFile: fileSchema,
})

export const intiateProofSchema = z.object({
  status: z.literal('PENDING'),
  taskId: z.string().uuid(),
})

const fourElementsArray = z.array(z.number().int()).length(4)

export const witnessSchema = z.object({
  inputs: z.array(z.array(fourElementsArray)),
  outputs: z.array(z.array(fourElementsArray)),
  maxLookupInputs: z.number().int(),
})

export const getProofSchema = z.object({
  taskId: z.string().uuid(),
  status: z.enum(['SUCCESS']),
  proof: z.string(),
  instances: z.array(z.number().nonnegative()),
  transcriptType: z.literal('evm'),
  strategy: z.enum(['single', 'aggregate']),
})

export type GetProof = z.infer<typeof getProofSchema>
export type InitiateProof = z.infer<typeof intiateProofSchema>
