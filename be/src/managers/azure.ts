// Refer to https://learn.microsoft.com/en-us/azure/ai-services/openai/quickstart?tabs=command-line%2Cjavascript-keyless%2Ctypescript-keyless%2Cpython-new&pivots=programming-language-typescript
import { AzureOpenAI } from 'openai'
import { ChatCompletionMessageParam, type ChatCompletion } from 'openai/resources/index'

import { Adapter, InternalGenerateWebsiteReq } from 'adapter'
import { AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, IMAGE_LOCATION } from '../constant'
import { encodeImageToBase64 } from '../utils/encode'
import loggerBuilder from '../logger'
const logger = loggerBuilder(__filename)

// You will need to set these environment variables or edit the following values
const endpoint = AZURE_OPENAI_ENDPOINT || 'https://api.openai.com'
const apiKey = AZURE_OPENAI_API_KEY || ''

const getClient = (apiVersion: string, deploymentName: string): AzureOpenAI => {
	return new AzureOpenAI({
		endpoint,
		apiKey,
		apiVersion,
		deployment: deploymentName
	})
}

const getCompletion = async (
	client: AzureOpenAI,
	model: string,
	messages: Array<ChatCompletionMessageParam>,
	max_tokens: number
): Promise<ChatCompletion> => {
	return client.chat.completions.create({
		messages,
		model,
		max_tokens,
		stream: false
	})
}

const GenerateWebsite = async (req: InternalGenerateWebsiteReq) => {
	logger.info('sending request to Azure OpenAI for file %s', req.fileName)
	const apiVersion = '2024-12-01-preview'
	const deploymentName = 'gpt-4o'
	const model = 'gpt-4o-2024-08-06'
	// Required Azure OpenAI deployment name and API version
	const completion = await getCompletion(
		getClient(apiVersion, deploymentName),
		model,
		[
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: 'Please generate a website with html from this image'
					},
					{
						type: 'image_url',
						image_url: {
							url: `data:image/jpeg;base64,${encodeImageToBase64(IMAGE_LOCATION + req.fileName)}`
						}
					}
				]
			}
		],
		1000
	)
	logger.debug('%s completion: %o', req.fileName, JSON.stringify(completion))
	return completion.choices[0].message.content
}

const AzureManager: Adapter = {
	GenerateWebsite
}

export default AzureManager
