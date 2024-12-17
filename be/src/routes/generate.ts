import Express from 'express'
import multer from 'multer'
import GeneratorController from '../controllers/generate'

const router = Express.Router()
const upload = multer({ dest: './public/data/uploads/' })

router.post('/generate-website', upload.single('file'), GeneratorController.GenerateWebsite)

export default router
