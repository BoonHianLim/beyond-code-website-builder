import { StatusCodeError } from '../utils/error'
import { GenerateWebsiteReq, ModelType } from '../types/generate'
import OllamaManager from '../managers/ollama'

// import loggerBuilder from '../logger'
// const logger = loggerBuilder(__filename)

const GenerateWebsite = async (req: GenerateWebsiteReq) => {
	if (req.body.type == ModelType.AzureGPT4) {
		// Make a request to Azure chatgpt 4o to generate a website
		return '<html><body>Website generated</body></html>'
	} else if (req.body.type == ModelType.Ollama311B) {
		// Make a request to Ollama to generate a website
		return OllamaManager.GenerateWebsite({
			fileName: req.file.filename,
			options: req.body.options
		})
	} else {
		throw new StatusCodeError(400, 'Invalid options')
	}
}

const GenerateService = {
	GenerateWebsite
}

export default GenerateService
