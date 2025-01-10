import { Ollama } from 'ollama';

import { Adapter, InternalGenerateWebsiteReq } from 'adapter'
import { IMAGE_LOCATION, OLLAMA_HOST } from '../constant';
import loggerBuilder from '../logger'
const logger = loggerBuilder(__filename)

const ollamaHost = OLLAMA_HOST || 'http://localhost:8888'
const ollama = new Ollama({ host: ollamaHost })

const GenerateWebsite = async (req: InternalGenerateWebsiteReq) => {
    logger.info('sending request to ollama for file %s', IMAGE_LOCATION + req.fileName)
	// Make a request to Azure chatgpt 4o to generate a website
	const response = await ollama.generate({
		model: 'llama3.2-vision',
		prompt: 'Please generate a website from this image',
		images: [IMAGE_LOCATION + req.fileName],
		stream: false
	})
	return response.response
}
const OllamaManager: Adapter = {
    GenerateWebsite
}

export default OllamaManager