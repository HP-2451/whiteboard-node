import mongoose from "mongoose";

const model = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    contact:{
        type: String
    },
    address1:{
        type: String
    },
    address2:{
        type: String
    },
    landmark:{
        type: String
    },
    state:{
        type: String
    },
    city:{
        type: String
    },
    pinCode:{
        type: String
    }
  },
  { autoCreate: true }
);

const User = mongoose.model("users", model);

export default User;
