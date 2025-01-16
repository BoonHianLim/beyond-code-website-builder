import { readFileSync } from 'fs'

export const encodeImageToBase64 = (imagePath: string): string => {
	const imageBuffer = readFileSync(imagePath)
	return imageBuffer.toString('base64')
}
