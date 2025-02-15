import mongoose from "mongoose";

const college_registration_Schema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },

    rollNumber:{
        type:String,
        required:true,
        unique:true
    },

    fee:{
        totalFee: {type:Number,default: 10000},
        remainingFee: {type:Number, default: 10000},
        paidFee: {type:Number, default: 0},
    },

    name: { type: String, 
        required: true,
    },

    
    password: { type: String, 
        required: true 
    },


});

const college_registration = new mongoose.model("registration_data", college_registration_Schema);
export {college_registration};


  



