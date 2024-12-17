import { z } from "zod";

// Define the schema for Express.Multer.File
export const multerFileSchema = z.object({
	fieldname: z.string(),
	originalname: z.string(),
	encoding: z.string(),
	mimetype: z.string(),
	size: z.number(),
	destination: z.string().optional(),
	filename: z.string().optional(),
	path: z.string(),
	buffer: z.instanceof(Buffer).optional()
})
