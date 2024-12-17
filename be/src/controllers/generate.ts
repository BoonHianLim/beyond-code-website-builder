import { Request, Response } from 'express'

const GenerateWebsite = async (req: Request, res: Response) => {
	try {
		// Generate website here
		res.status(200).json({ message: 'Website generated' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Internal server error' })
	}
}

const GeneratorController = {
	GenerateWebsite
}

export default GeneratorController
