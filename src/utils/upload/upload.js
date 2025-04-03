const cloudinary = require("cloudinary").v2;
const dotEnv = require("dotenv");
dotEnv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (file) =>{
    try {
        const res = await cloudinary.uploader.upload(file);
        return res;
    }catch (error) {
        console.log(error.message)
    }
}

module.exports = {uploadFile}