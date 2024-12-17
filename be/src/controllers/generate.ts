import { Request, Response } from 'express'

import loggerBuilder from '../logger'
const logger = loggerBuilder(__filename)

const GenerateWebsite = async (req: Request, res: Response) => {
	try {
        logger.info("Generating website")
		// Generate website here
		res.status(200).json({ message: 'Website generated' })
	} catch (err) {
		logger.error(err)
		res.status(500).json({ message: 'Internal server error' })
	}
}

const GeneratorController = {
	GenerateWebsite
}

export default GeneratorController
