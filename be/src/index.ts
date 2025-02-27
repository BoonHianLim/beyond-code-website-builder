
import express from 'express'
import cors from 'cors'

import GeneratorRouter from './routes/generate'
import ComponentRouter from './routes/components'
import { ExpressErrorHandler } from './middleware/errorHandler'
import loggerBuilder from './logger'
import { SERVER_PORT } from './constant'
import path from 'path'
const logger = loggerBuilder(__filename)

const port = SERVER_PORT || '8080'
const app = express()

app.use(express.json())

// Allow CORS for localhost
const corsOptions = {
	origin: 'http://localhost:3000', // Replace with your frontend's URL if needed
	methods: 'GET,PUT,PATCH,POST,DELETE',
	credentials: true // Allow cookies or Authorization headers
}

app.use(cors(corsOptions))
app.use(ExpressErrorHandler);
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(ExpressErrorHandler);
// Paths
app.get('/', (req, res) => {
	res.send('Server is running')
});
app.use('/', GeneratorRouter)
app.use('/components', ComponentRouter)

app.listen(port, () => {
	logger.info(`server started at http://localhost:${port}`)
})
