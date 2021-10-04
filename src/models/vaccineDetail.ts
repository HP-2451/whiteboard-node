import mongoose from "mongoose";

const vaccineDetail = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    vaccine: {
      type: String,
      required: true,
    },
    vaccinatedDate: {
      type: String,
    },
    ageGroup:{
        type: String
    },
    symptoms:{
        type: String
    },
    medicines:{
        type:String
    },
    rating:{
        type: Number
    },
    feedback:{
        type: String
    }
  },
  { autoCreate: true }
);

const VaccineDetail = mongoose.model("vaccine_detail", vaccineDetail);

export default VaccineDetail;
