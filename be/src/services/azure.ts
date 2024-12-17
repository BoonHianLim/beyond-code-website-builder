import loggerBuilder from '../logger'
const logger = loggerBuilder(__filename)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GenerateWebsite = async (req: unknown) => {
	try {
		// Make a request to Azure chatgpt 4o to generate a website
		return '<html><body>Website generated</body></html>'
	} catch (err) {
		logger.error('Azure generate website error: %o', err)
		return null
	}
}

const AzureService = {
	GenerateWebsite
}

export default AzureService
