import express from 'express'
import vaccineDetailRouter from './vaccineDetail'
const router = express.Router()

router.use("/vaccine", vaccineDetailRouter)

export default router