import { GenerateWebsiteReq } from '../types/generate'
import AzureService from './azure'
// import loggerBuilder from '../logger'
// const logger = loggerBuilder(__filename)

const GenerateWebsite = async (req: GenerateWebsiteReq) => {
	const file = req.file
	const resp = await AzureService.GenerateWebsite(file)
	return resp
}

const GenerateService = {
	GenerateWebsite
}

export default GenerateService
