import dotenv from 'dotenv'
dotenv.config()

export const IMAGE_LOCATION = './public/data/uploads/'
export const SERVER_PORT = process.env.SERVER_PORT 
export const NODE_ENV = process.env.NODE_ENV 
export const LOG_LEVEL = process.env.LOG_LEVEL 
export const OLLAMA_HOST = process.env.OLLAMA_HOST