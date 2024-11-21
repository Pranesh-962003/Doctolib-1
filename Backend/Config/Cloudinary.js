import {v2 as cloudinary} from 'cloudinary'
const connectClodinary = async() =>{

    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_NAME,
        api_key:process.env.CLOUDINARY_API_KET,
        api_secret:process.env.CLOUDINARY_SECRETE_KET
    })
}


export default connectClodinary;