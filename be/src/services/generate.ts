import fs from 'fs'

import { StatusCodeError } from '../utils/error'
import { GenerateWebsiteReq, ModelType } from '../types/generate'
import OllamaManager from '../managers/ollama'
import AzureManager from '../managers/azure'

// import loggerBuilder from '../logger'
// const logger = loggerBuilder(__filename)

const GenerateWebsite = async (req: GenerateWebsiteReq) => {
	let html: string;
	if (req.body.type == ModelType.AzureGPT4) {
		// Make a request to Azure chatgpt 4o to generate a website
		html = await AzureManager.GenerateWebsite({
			fileName: req.file.filename,
			options: req.body.options
		})
	} else if (req.body.type == ModelType.Ollama311B) {
		// Make a request to Ollama to generate a website
		html = await OllamaManager.GenerateWebsite({
			fileName: req.file.filename,
			options: req.body.options
		})
	} else {
		throw new StatusCodeError(400, 'Invalid options')
	}
	fs.writeFileSync('output.html', html)
	return html
}

const GenerateService = {
	GenerateWebsite
}

export default GenerateService
