const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
const fileUpload = require("express-fileupload");

// tempfilePath k liye 
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/',
    // limits: {fileSize: 5 * 1024 * 1024}
}));

// Mount
const Upload = require("./Router/FileUpload");
app.use("/api/v1/upload",Upload);

// DB Connection
const dbConnect = require("./config/database");
dbConnect();

// Cloud se connect krte he
const cloudinary = require("./config/clodinary");
cloudinary.cloudinaryConnect();

app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`);
});


// Default Route
app.get("/",(req,res)=>{
    res.send(`<h2> This is Default Page </h2>`);
});


