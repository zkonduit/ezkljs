import { z } from 'zod'

const fileSchema = z.custom<File | null>((value) => {
  if (value === null) return false
  return value instanceof File && value.name.trim() !== ''
}, "File name can't be empty")

export const formDataSchema = z.object({
  model: fileSchema,
  settings: fileSchema,
  pk: fileSchema,
})

export const uploadArtifactSchema = z.object({
  id: z.string().uuid(),
})
