import { Request, Response } from "express";
import joi from '@hapi/joi'
import { nextTick } from "process";
import { responseData } from "../dto/response.dto";

const validationSchema = joi.object({
    fullName: joi.string().required(),
    email: joi.string().email().lowercase().required(),
    contact: joi.string().min(10).max(10),
    address1: joi.string().required(),
    address2: joi.string(),
    landmark: joi.string(),
    vaccine: joi.string().required(),
    vaccinatedDate: joi.string().required(),
    ageGroup: joi.string().required(),
    symptoms: joi.string().required(),
    medicines: joi.string().required(),
    state: joi.string().required(),
    city: joi.string().required(),
    pinCode: joi.string().required(),
    rating: joi.number(),
    feedback: joi.string()
})
export const validator = (request: Request, response: Response, next: any) => {

    try{
         validationSchema.validate(request.body)
         next()
    }catch(err:any){
        console.log(err.details);
        const responseData : responseData = {
            success: false,
            message: err.details
        }
        return response.status(400).send(responseData)
    }
    
   
}