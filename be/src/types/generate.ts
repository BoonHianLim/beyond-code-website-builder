import { z } from 'zod'
import { multerFileSchema } from './multerFile'

export type GenerateWebsiteReq = z.infer<typeof GenerateWebsiteReqSchema>

export enum ModelType {
	AzureGPT4 = 'AzureGPT4',
	Ollama311B = 'Ollama311B',
}
export const GenerateWebsiteReqSchema = z.object({
	file: multerFileSchema,
	type: z.nativeEnum(ModelType),
	options: z.record(z.string(), z.unknown()),
})
