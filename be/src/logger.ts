import path from 'path'
import pino from 'pino'
// To use process env statically, we need to import dotenv 
import dotenv from 'dotenv'
import { LOG_LEVEL, NODE_ENV } from './constant'
dotenv.config()

// check if is in production
const isProduction = NODE_ENV === 'production'

const pinoLogger = pino(
	isProduction
		? {}
		: {
				level: LOG_LEVEL || 'info',
				transport: {
					target: 'pino-pretty',
					options: {
						colorize: true,
						ignore: 'pid,hostname,filename',
						translateTime: 'SYS:standard',
						levelFirst: true,
						singleLine: true,
						messageFormat: '{filename}: {msg}'
					}
				}
			}
)

const loggerBuilder = (__filename: string) => {
	return pinoLogger.child({ filename: path.relative(process.cwd() + '/dist', __filename) })
}
export default loggerBuilder
