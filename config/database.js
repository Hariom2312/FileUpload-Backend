const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = async(req,res)=>{
  try{
     await mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    console.log("DATABASE CONNECTED SUCCESSFULLY !!");
  }catch(err){
   console.log("DB Connection Issue");
   console.error(err);
   process.exit(1);
  }
}

module.exports = dbConnect;