const { default: mongoose } = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const fileSchema = new mongoose.Schema(
    {
       name:{
        type:String,
        required:true,
       },
       
       imageUrl:{
        type:String,
       },

       videoUrl:{
        type:String,
       },

       tags:{
        type:String,
       },

       email:{
        type:String,
        required:true,
       }
    }
);

// post middleware
fileSchema.post("save",async function(doc){
   
    try{
      // console.log("Doc :" ,doc);

      //  transporter
      let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        // port:process.env.PORT,
        auth: {
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASSWORD,
        }
       });
      //  console.log("transporter  :" ,transporter);

    // import from mail file
    // const transporter = require("./mail.js");

    //    send mail
    let info = await transporter.sendMail({
      from:'Hariom Bamboriya',
      to:doc.email,
      subject:"New File Uploaded on Cloudinary",
      html:`<h2>Hello</h2> <p>File Uploaded view Here: <a href="${doc.imageUrl}">${doc.imageUrl}</a></p>`
    });
    console.log("info" ,info);

   }catch(err){
    console.error(err);
    // return res.status(500).json({
    //     success:false,
    //     message:"post middleware not work"
    // });
   }

})

module.exports = mongoose.model("File",fileSchema);