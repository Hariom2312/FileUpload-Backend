const express = require("express");
const router = express.Router();

const {localFileUpload, imageUpload, videoUpload,imageSizeReduser} = require("../Controller/fileUpload");

// Handler
router.get("/file",(req,res)=>{
    res.send("Default Page ");
})

router.post("/localFileUpload",localFileUpload);
router.post("/imageUpload",imageUpload);
router.post("/videoUpload",videoUpload);
router.post("/imageSizeReduser",imageSizeReduser);

// Exports
module.exports = router;

