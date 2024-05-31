const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

exports.localFileUpload = async (req, res) => {
  try {
    // Fetch File from request
    const file = req.files.hariomfile;
    console.log("File kuch is tarah he ->:", file);

    // create path where file need to be store or server
    let path =
      __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
    console.log("path -> ", path);

    // add path to the move function
    file.mv(path, (err) => {
      console.log(err);
    });

    // create a succesfull response
    return res.status(200).json({
      success: true,
      message: "Local File Uploaded Successfully !!",
    });
  } catch (error) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "local File Upload Failed ",
    });
  }
};

async function uploadFileToCloudinary(file, folder,quality,filenameChange,height,width) {
  const options = { folder };
  console.log("TempFilePath :", file.tempFilePath);
  options.resourse_type = "auto";
  options.original_filename = filenameChange;
  options.height = height;
  options.width = width;
  if(quality){
    options.quality = quality;
   }
   
   return await cloudinary.uploader.upload(file.tempFilePath, options);
}

function isSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

// Image Upload
exports.imageUpload = async (req, res) => {
  try {
    // fetch data
    const { name, tags, imageUrl, email } = req.body;
    console.log(name, tags, imageUrl, email);

    const file = req.files.imageFile;
    console.log(file);

    // Validation
    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log("FileType :", fileType);

    if (!isSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "file formate not supported",
      });
    }

    // Check file size (5 MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the limit of 5 MB",
      });
    }
    // Upload file
    console.log("Uploding..");
    const uploadedResult = await uploadFileToCloudinary(file, "hariom_Folder");
    console.log(uploadedResult);

    // DB me enter save krna he
    const fileData = await File.create({
      name,
      tags,
      imageUrl: uploadedResult.secure_url,
      email,
    });
    return res.status(500).json({
      success: true,
      Data: fileData,
      imageUrl: uploadedResult.secure_url,
      message: "Image File Upload Succesfully !!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed image not upload",
    });
  }
};

// Video Upload
exports.videoUpload = async (req, res) => {
  try {
    // fetch data
    const { name, tags, email, videoURL } = req.body;
    console.log(name, tags, email, videoURL);

    const file = req.files.videoFile;
    console.log("file", file);

    // Validation
    const supportedType = ["mp4", "mov"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log("fileType :", fileType);

    // Check file size (5 MB limit)
    //  if (file.size > 5 * 1024 * 1024) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "File size exceeds the limit of 5 MB",
    //     });
    // }

    if (!isSupported(fileType, supportedType)) {
      return res.status(400).json({
        success: false,
        message: "File formate not supported",
      });
    }

    console.log("Yha tk sab theek he");
    // const uploadedResult = await uploadFileToCloudinary(file,"hariom_Folder");
    const uploadedResult = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "hariom_Folder", // Change to your desired folder name
      resource_type: "video",
    });
    console.log(uploadedResult);

    // DB me entry save krna he
    const fileData = await File.create({
      name,
      tags,
      videoUrl: uploadedResult.secure_url,
      email,
    });

    res.json({
      success: true,
      Data: fileData,
      video_URL: uploadedResult.secure_url,
      message: "Video File Uploaded Succesfully !!",
    });
  } catch (err) {
    console.log(err);
    console.error(err);
    res.status(400).json({
      success: false,
      message: "Failed to Upload Video",
    });
  }
};




// Image Reduser
exports.imageSizeReduser = async (req, res) => {
  try {
    //    Fetch data
    const { name, tags, email } = req.body;
    console.log(name, tags, email);

    const file = req.files.imageFile;

    const supportedType = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();

    if (!isSupported(fileType, supportedType)) {
      return res.status(400).json({
        success: false,
        message: "File Formate not supported",
      });
    } 

    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the limit of 5 MB",
      });
    }

    const AfterCompress = await uploadFileToCloudinary(file, "hariom_Folder",50,"codingNinjasPhotos",200,100);
    console.log(AfterCompress);

    // store Data into DB
    const FileDB = await File.create({
      name,
      tags,
      imageUrl:AfterCompress.secure_url,
      email,
    });

    return res.status(200).json({
        success:true,
        Data:FileDB,
        imageUrl:AfterCompress.secure_url,
        message:"After Compressed File Uploaded Successfully !!"
    })
  } catch (error) {
    console.log(error);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Image could not be compressed",
    });
  }
};
