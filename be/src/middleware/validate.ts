// refer to https://github.com/edwinhern/express-typescript-2024/blob/03e2d78426963d278b55329cb56cc95e2821aba2/src/common/utils/httpHandlers.ts
import { Request, Response, NextFunction } from 'express'
import { z, ZodSchema } from 'zod'
import loggerBuilder from '../logger'
const logger = loggerBuilder(__filename)

export const ValidateRequestHandler = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
	try {
		// Validate request here
		schema.parse({ body: req.body, query: req.query, params: req.params, file: req.file })
		next()
	} catch (err) {
		if (err instanceof z.ZodError) {
			const message = (err as z.ZodError).issues.map((issue) => issue.message).join(', ')
			logger.error('ValidateRequestHandler parse failure %o', message)
			res.status(400).json({ message })
		} else {
			logger.error('ValidateRequestHandler parse failure %o', err)
			res.status(400).json({ message: 'Bad Request' })
		}
	}
}
