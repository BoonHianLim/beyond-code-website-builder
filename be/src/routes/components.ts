import Express from 'express'
import path from 'path'
const router = Express.Router()

router.get('/import-sketch', (req, res) => {
	res.sendFile(path.join(__dirname, '..', '..', 'public', 'components', 'import-sketch.html'))
})

export default router