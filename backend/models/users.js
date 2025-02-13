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
        totalFee: {type:Number,},
        remainingFee: {type:Number,},
        paidFee: {type:Number,},
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


  



