import { z } from 'zod'
import { multerFileSchema } from './multerFile'

export type GenerateWebsiteReq = z.infer<typeof GenerateWebsiteReqSchema>

export const GenerateWebsiteReqSchema = z.object({
	file: multerFileSchema,
})
