import path from 'path'
import pino from 'pino'

// check if is in production
const isProduction = process.env.NODE_ENV === 'production'

const pinoLogger = pino(
	isProduction
		? {}
		: {
				transport: {
					target: 'pino-pretty',
					options: {
						colorize: true,
						ignore: 'pid,hostname,filename',
						translateTime: 'SYS:standard',
                        levelFirst: true,
                        singleLine: true,
                        messageFormat: '{filename}: {msg}',
					}
				},
			}
)

const loggerBuilder = (__filename: string) => {
    return pinoLogger.child({ filename: path.relative(process.cwd() + "/dist", __filename) })
}
export default loggerBuilder
