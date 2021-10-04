import { Request, Response } from "express";
import User from "../models/user";
import { messages } from "../constants/message";
import VaccineDetail from "../models/vaccineDetail";
import { responseData, VaccinationDetail } from "../dto/response.dto";
import fs from 'fs';
export const insertVaccineDetail = async (
  request: Request,
  response: Response
) => {
  try {
    const {
      fullName,
      email,
      contact,
      vaccine,
      vaccinatedDate,
      ageGroup,
      address1,
      address2,
      landmark,
      symptoms,
      state,
      city,
      pinCode,
      medicines,
      rating,
      feedback,
      pdfData
    } = request.body;

    const userExist = await User.findOne({ email });
    
    let userId;
    if (!userExist) {
      const user = await User.create({
        fullName,
        email,
        contact,
        address1,
        address2,
        landmark,
        state,
        city,
        pinCode
      });
      userId = user._id;
    }else{
        userId = userExist?._id;
    }
    const vaccineDetail = await VaccineDetail.create({
      userId,
      vaccine,
      vaccinatedDate,
      ageGroup,
      symptoms,
      medicines,
      rating,
      feedback
    });
    
    const responseData: responseData = {
      success: true,
      message: messages.SUCCESS,
      data: vaccineDetail,
    };
    
    // var decoded = dataUriToBuffer(pdfData);
    // console.log(decoded);
    // const parsed = parseDataUrl(pdfData);
    // console.log(parsed.filename);
    
    // var writeStream = fs.createWriteStream('survey.pdf')
    // writeStream.write(Buffer.from(pdfData, 'base64'));

    // // writeStream.write("Thank You.");
    // writeStream.end();
    // var fs = require('fs');
    // var dataurl= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = pdfData.toString().match(regex);
    var ext = matches[1];
    var data = matches[2];
    var buffer = Buffer.from(data, 'base64');
    fs.writeFileSync('survey-detail.' + ext.substring(0,3), buffer);
    
    return response.status(200).send(responseData);
  } catch (err: any) {
    const responseData: responseData = {
        success: false,
        message: err.message
      };

    return response.status(500).send(responseData);
  }
};

export const getVaccine = async (request: Request, response: Response ) => {
    try {
        const {id} = request.params
        const user = await User.findOne({ _id: id });
        const {type} = request.query
        let responseData: responseData = {
            success: true,
            message: messages.USER_NOT_FOUND,
          };
        if(!user) return response.status(200).send(responseData)
        
        const vaccinationDetail: Array<object> = await VaccineDetail.find({userId: id})

        responseData = {
            success: true,
            message: messages.SUCCESS,
            data: type ? {user,vaccinationDetail:vaccinationDetail[vaccinationDetail.length-1]}: {user,vaccinationDetail}
          };

        return response.status(200).send(responseData);
      } catch (err: any) {
        const responseData: responseData = {
            success: false,
            message: err.message
          };
        return response.status(500).send(responseData);
      }
};

export const getVaccineDetail = async (request: Request, response: Response ) => {
  try {
      const {id} = request.params
      const vaccinationDetail: any = await VaccineDetail.findOne({_id: id})
      const user = await User.findOne({_id: vaccinationDetail?.userId})
      const responseData: responseData = {
          success: true,
          message: messages.SUCCESS,
          data: vaccinationDetail ? {user,vaccinationDetail} : []
        };
      return response.status(200).send(responseData);
    } catch (err: any) {
      const responseData: responseData = {
          success: false,
          message: err.message
        };
      return response.status(500).send(responseData);
    }
};

export const updateVaccineDetail = async (request: Request, response: Response ) => {
  try {
      const {id} = request.params
      const {fullName,
        email,
        contact,
        vaccine,
        vaccinatedDate,
        ageGroup,
        address1,
        address2,
        landmark,
        symptoms,
        state,
        city,
        pinCode,
        medicines,
        rating,
        feedback,
        userId,
        } = request.body

      let uCondition = { fullName, email, contact, address1, address2, landmark, state, city, pinCode}
      let vCondition = { vaccine, vaccinatedDate, ageGroup, symptoms, medicines, rating, feedback}
      const updateUserDetail = await User.updateOne({_id: userId}, uCondition)
      const updateVaccinationDetail = await VaccineDetail.findOneAndUpdate({_id: id},vCondition)
      console.log(updateVaccinationDetail);
      
      const responseData: responseData = {
          success: true,
          message: messages.SUCCESS,
          data: updateVaccinationDetail
        };
      return response.status(200).send(responseData);
    } catch (err: any) {
      const responseData: responseData = {
          success: false,
          message: err.message
        };
      return response.status(500).send(responseData);
    }
};


export const deleteVaccineDetail = async (request: Request, response: Response ) => {
  try {
      const {id} = request.params
      const vaccinationDetail = await VaccineDetail.deleteOne({_id: id})
      const responseData: responseData = {
          success: true,
          message: messages.SUCCESS,
        };
      return response.status(200).send(responseData);
    } catch (err: any) {
      const responseData: responseData = {
          success: false,
          message: err.message
        };
      return response.status(500).send(responseData);
    }
};

export const deleteMultipleVaccineDetail = async (request: Request, response: Response ) => {
  try {
      const {id} = request.body
      console.log(id);
      
      const vaccinationDetail = await VaccineDetail.deleteMany({_id: id})
      console.log(vaccinationDetail);
      
      const responseData: responseData = {
          success: true,
          message: messages.SUCCESS,
        };
      return response.status(200).send(responseData);
    } catch (err: any) {
      const responseData: responseData = {
          success: false,
          message: err.message
        };
      return response.status(500).send(responseData);
    }
};

export const getAllVaccineSurvey = async (request: Request, response: Response ) => {
  try {
      let responseResult: any  = [];
      const vaccinationDetail: any = await VaccineDetail.find()
      for(var i=0; i<vaccinationDetail.length; i++){
        const user = await User.findOne({ _id: vaccinationDetail[i].userId });
        let document = vaccinationDetail[i].toObject()
        document.user = user
        responseResult.push(document)
      }
      const responseData: responseData = {
          success: true,
          message: messages.SUCCESS,
          data: responseResult
        };
      return response.status(200).send(responseData);
    } catch (err: any) {
      const responseData: responseData = {
          success: false,
          message: err.message
        };
      return response.status(500).send(responseData);
    }
};

export const searchVaccineSurveyByUserName = async (request: Request, response: Response ) => {
  try {
      let responseResult: any  = [];
      const vaccinationDetail: any = await VaccineDetail.find()
      const {name, type} = request.query
      console.log(name);
      for(var i=0; i<vaccinationDetail.length; i++){
        console.log(vaccinationDetail[i]);
        
        let  user;
        if(type === "Name"){
          user = await User.findOne({ _id: vaccinationDetail[i].userId, fullName: { $regex: name , $options: 'i'}});
        }else if(type === "Email"){
          user = await User.findOne({ _id: vaccinationDetail[i].userId, email: { $regex: name , $options: 'i'}});
        }else{
          user = await User.findOne({ _id: vaccinationDetail[i].userId, contact: { $regex: name , $options: 'i'}});
        }
        let document = vaccinationDetail[i].toObject()
        if(user){
          document.user = user
          responseResult.push(document)
        }
      }
      const responseData: responseData = {
          success: true,
          message: messages.SUCCESS,
          data: responseResult
        };
      return response.status(200).send(responseData);
    } catch (err: any) {
      const responseData: responseData = {
          success: false,
          message: err.message
        };
      return response.status(500).send(responseData);
    }
};

export const filterByVaccine = async (request: Request, response: Response ) => {
  try {
      let responseResult: any  = [];
      const {vaccine} = request.query
      console.log(vaccine);
      
      const vaccinationDetail: any = await VaccineDetail.find({ $or:[ 
        {vaccine}, {vaccinatedDate: vaccine} 
      ]})
      console.log(vaccinationDetail);
      
      for(var i=0; i<vaccinationDetail.length; i++){
        const user = await User.findOne({ _id: vaccinationDetail[i].userId });
        let document = vaccinationDetail[i].toObject()
        document.user = user
        responseResult.push(document)
      }
      const responseData: responseData = {
          success: true,
          message: messages.SUCCESS,
          data: responseResult
        };
      return response.status(200).send(responseData);
    } catch (err: any) {
      const responseData: responseData = {
          success: false,
          message: err.message
        };
      return response.status(500).send(responseData);
    }
};


