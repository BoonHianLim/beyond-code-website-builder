import path from 'path'
import pino from 'pino'
// To use process env statically, we need to import dotenv
import dotenv from 'dotenv'
import { LOG_LEVEL, NODE_ENV } from './constant'
dotenv.config()

// check if is in production
const isProduction = NODE_ENV === 'production'

const newFileName = () => {
	const today = new Date()
	return (
		'log-' +
		today.getUTCFullYear().toString() +
		(today.getUTCMonth() + 1).toString().padStart(2, '0') +
		today.getUTCDate().toString().padStart(2, '0') +
		'.log'
	)
}
const transport = pino.transport({
	targets: [
		{
			level: LOG_LEVEL || 'info',
			target: 'pino-pretty',
			options: {
				colorize: true,
				ignore: 'pid,hostname,filename',
				translateTime: 'SYS:standard',
				levelFirst: true,
				singleLine: true,
				messageFormat: '{filename}: {msg}'
			}
		},
		{
			level: 'trace',
			target: 'pino/file',
			options: {
				destination: path.join(process.cwd(), 'logs', newFileName()),
				mkdir: true, // to create the logs folder if not exist
				append: true
				// rotate: {
				// 	threshold: 10485760, // 10MB
				// 	compress: true,
				// 	interval: '1d', // daily rotation
				// 	maxFiles: 7 // keep 7 back copies
				// }
			}
		}
	]
})
const pinoLogger = pino({ level: 'trace' }, isProduction ? {} : transport)

const loggerBuilder = (__filename: string) => {
	return pinoLogger.child({ filename: path.relative(process.cwd() + '/dist', __filename) })
}
export default loggerBuilder
