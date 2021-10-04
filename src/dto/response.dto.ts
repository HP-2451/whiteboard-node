export interface responseData{
    success: Boolean,
    message: String,
    data?: Object
}

export interface User {
    fullName: string;
    email: string;
    contact: string;
    address1: string;
    address2: string;
    landmark: string;
    state: string;
    city: string;
    pinCode: string;
  }
  
  export interface VaccinationDetail {
    _id: string;
    userId: string;
    vaccine: string;
    vaccinatedDate: string;
    ageGroup: string;
    symptoms: string;
    medicines: string;
    rating: number;
    feedback: string;
  }