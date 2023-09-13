import { z } from 'zod'

// Define a schema for the health check response using Zod
export const healthyHealthCheckResponseSchema = z.object({
  res: z.literal("Welcome to the ezkl hub's backend!"),
  status: z.literal('ok'),
})

// Healthy Health Check Response
export type HealthyHealthCheckResponse = z.infer<
  typeof healthyHealthCheckResponseSchema
>

// Get Artifacts Input
export const getArtifactsInputSchema = z.object({
  first: z.number().int().positive().optional(),
  skip: z.number().int().nonnegative().optional(),
})
export type GetArtifactsInput = z.infer<typeof getArtifactsInputSchema>

// Artifact
export const artifactSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  id: z.string(),
})
export type Artifact = z.infer<typeof artifactSchema>

// Artifacts Response
export const artifactsResponseSchema = z.object({
  artifacts: z.array(artifactSchema),
})
export type ArtifactsResponse = z.infer<typeof artifactsResponseSchema>

// UUID
export const uuidSchema = z.string().uuid()
export type UUID = z.infer<typeof uuidSchema>

// Four Elements Tuple
export const fourElementsArray = z
  .array(z.number().int().nonnegative())
  .length(4)

// Witness
// const witnessSchema = z.o
//   outputs: z.array(z.array(fourElementsArray)),
//   maxLookupInputs: z.number().int().nonnegative(),
// })

// Get Proof Details
export const getProofDetailsSchema = z.object({
  taskId: z.string().uuid(),
  status: z.enum(['SUCCESS']),
  proof: z.string(),
  instances: z.array(z.number().nonnegative()),
  transcriptType: z.literal('evm'),
  strategy: z.enum(['single', 'aggregate']),
})
export type GetProofDetails = z.infer<typeof getProofDetailsSchema>

export const getProofResponseSchema = z.object({
  getProof: getProofDetailsSchema,
})

// File or Buffer
export const fileOrBufferSchema = z.custom<Buffer | File>()
export type FileOrBuffer = z.infer<typeof fileOrBufferSchema>

// Upload Artifact
export const uploadArtifactSchema = z.object({
  uploadArtifactLegacy: z.object({
    id: z.string().uuid(),
  }),
})

// Initiate Proof Input
export const initiateProofInputSchema = z.object({
  artifactId: uuidSchema,
  inputFile: fileOrBufferSchema,
})

// Initiate Proof Response
export const initiateProofResponseSchema = z.object({
  initiateProof: z.object({
    taskId: z.string().uuid(),
    status: z.string(),
  }),
})

export type InitiateProofResponse = z.infer<typeof initiateProofResponseSchema>

// Upload Artifact
export const genArtifactSchema = z.object({
  artifact: z.object({
    id: z.string().uuid(),
  }),
})

export const genArtifactResponseSchema = z.object({
  generateArtifact: genArtifactSchema,
})
