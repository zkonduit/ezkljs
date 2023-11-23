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

export const urlSchema = z.string().url()

// Get Artifacts Input
export const getArtifactsInputSchema = z.object({
  first: z.number().int().positive().optional(),
  skip: z.number().int().nonnegative().optional(),
  url: urlSchema.optional(),
})
export type GetArtifactsInput = z.infer<typeof getArtifactsInputSchema>

// Artifact
export const artifactSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  id: z.string(),
  organization: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
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

export const hexString = z.string().refine(
  (value) => {
    return value.startsWith('0x') && /^[0-9A-Fa-f]+$/.test(value.slice(2))
  },
  {
    message: 'String must represent a hexadecimal number and start with 0x.',
  },
)

// Get Proof Details
export const getProofDetailsSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['SUCCESS']),
  proof: z.string(),
  instances: z.array(hexString),
  // transcriptType: z.literal('evm'),
  transcriptType: z.union([z.literal('evm'), z.literal('EVM')]),
  // strategy: z.enum(['single', 'aggregate']),
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
    id: z.string().uuid(),
    status: z.string(),
  }),
})
export type InitiateProofResponse = z.infer<typeof initiateProofResponseSchema>

// Upload Artifact
export const genArtifactSchema = z.object({
  id: z.string().uuid(),
})

export const genArtifactResponseSchema = z.object({
  generateArtifact: genArtifactSchema,
})
