import { GenerateWebsiteReq } from '../types/generate'
import AzureService from './azure'
// import loggerBuilder from '../logger'
// const logger = loggerBuilder(__filename)

const GenerateWebsite = async (req: GenerateWebsiteReq) => {
	const file = req.file
    AzureService.GenerateWebsite(file)
	return '<html><body>Website generated</body></html>'
}

const GenerateService = {
	GenerateWebsite
}

export default GenerateService
