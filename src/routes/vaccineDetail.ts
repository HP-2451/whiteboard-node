import express from 'express'
import * as vaccineDetailController from '../controllers/vaccineDetail.controller'
import {body} from 'express-validator'
import { exists } from 'fs'
import { validator } from '../middlewares/validator'
const vaccineDetailRouter = express.Router()

vaccineDetailRouter.post("/create", vaccineDetailController.insertVaccineDetail)
vaccineDetailRouter.get("/submit/detail/:id", vaccineDetailController.getVaccine)
vaccineDetailRouter.get("/detail/:id", vaccineDetailController.getVaccineDetail)
vaccineDetailRouter.put("/update/:id", vaccineDetailController.updateVaccineDetail)
vaccineDetailRouter.delete("/delete/:id", vaccineDetailController.deleteVaccineDetail)
vaccineDetailRouter.post("/delete", vaccineDetailController.deleteMultipleVaccineDetail)
vaccineDetailRouter.get("/", vaccineDetailController.getAllVaccineSurvey)
vaccineDetailRouter.get("/search", vaccineDetailController.searchVaccineSurveyByUserName)
vaccineDetailRouter.get("/filter", vaccineDetailController.filterByVaccine)
export default vaccineDetailRouter