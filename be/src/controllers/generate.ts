import { Request, Response } from 'express'

import loggerBuilder from '../logger'
import { GenerateWebsiteReq } from '../types/generate'
import GenerateService from '../services/generate'

const logger = loggerBuilder(__filename)

const GenerateWebsite = async (req: Request<GenerateWebsiteReq>, res: Response) => {
	try {
		logger.info('Generating website')
		const resp = await GenerateService.GenerateWebsite(req.body)
		// Generate website here
		res.status(200).json(resp)
	} catch (err) {
		logger.error(err)
		res.status(500).json({ message: 'Internal server error' })
	}
}

const GeneratorController = {
	GenerateWebsite
}

export default GeneratorController
