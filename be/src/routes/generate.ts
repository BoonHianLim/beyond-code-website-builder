import Express from 'express'
import multer from 'multer'
import GeneratorController from '../controllers/generate'
import { ValidateRequestHandler } from '../middleware/validate'
import { GenerateWebsiteReqSchema } from '../types/generate'
import { IMAGE_LOCATION } from '../constant'

const router = Express.Router()
const upload = multer({ dest: IMAGE_LOCATION })

router.post(
	'/generate-website',
	upload.single('file'),
	ValidateRequestHandler(GenerateWebsiteReqSchema),
	GeneratorController.GenerateWebsite
)

export default router
