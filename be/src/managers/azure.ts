import loggerBuilder from '../logger'
import { Adapter, InternalGenerateWebsiteReq } from 'adapter'
const logger = loggerBuilder(__filename)

// Refer to https://learn.microsoft.com/en-us/azure/ai-services/openai/quickstart?tabs=command-line%2Cjavascript-keyless%2Ctypescript-keyless%2Cpython-new&pivots=programming-language-typescript
// const getEndpoint = (): string => {
// 	return process.env.AZURE_OPENAI_ENDPOINT || 'www.example.com'
// }

// // Required Azure OpenAI deployment name and API version
// import { DefaultAzureCredential, getBearerTokenProvider } from '@azure/identity'
// import { AzureOpenAI } from 'openai'
// import { type Completion } from 'openai/resources/index'

// const apiVersion = '2024-08-01-preview'
// const deploymentName = 'gpt-35-turbo-instruct'
// // keyless authentication
// const credential = new DefaultAzureCredential()
// const scope = 'https://cognitiveservices.azure.com/.default'
// const azureADTokenProvider = getBearerTokenProvider(credential, scope)

// const getClient = (): AzureOpenAI => {
// 	const endpoint = getEndpoint()
// 	return new AzureOpenAI({
// 		endpoint,
// 		azureADTokenProvider,
// 		apiVersion,
// 		deployment: deploymentName
// 	})
// }

// const getCompletion = async (client: AzureOpenAI, prompt: string[], max_tokens: number): Promise<Completion> => {
// 	return client.completions.create({
// 		prompt,
// 		model: '',
// 		max_tokens
// 	})
// }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GenerateWebsite = async (req: InternalGenerateWebsiteReq) => {
	try {
		// Make a request to Azure chatgpt 4o to generate a website

		return '<html><body>Website generated</body></html>'
	} catch (err) {
		logger.error('Azure generate website error: %o', err)
		return ""
	}
}

const AzureService: Adapter = {
	GenerateWebsite
}

export default AzureService
