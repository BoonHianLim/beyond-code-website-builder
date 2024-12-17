import dotenv from 'dotenv'
import path from 'path'
import express from 'express'
import cors from 'cors'

import GeneratorRouter from './routes/generate'
import loggerBuilder from './logger'
const logger = loggerBuilder(__filename)
dotenv.config()

const port = process.env.SERVER_PORT || '8080'
const app = express()

app.use(express.json())

// Allow CORS for localhost
const corsOptions = {
	origin: 'http://localhost:3000', // Replace with your frontend's URL if needed
	methods: 'GET,PUT,PATCH,POST,DELETE',
	credentials: true // Allow cookies or Authorization headers
}

app.use(cors(corsOptions))

// Paths
app.use('/', GeneratorRouter)

app.listen(port, () => {
	logger.info(`server started at http://localhost:${port}`)
})
