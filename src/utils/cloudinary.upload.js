import {v2 as cloudinary}  from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import fs from 'fs'
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET,
});

const cloudinaryUpload = async (filePath, folder) => {
    try {
        if(!filePath){
            throw new Error('Path not found');
        }
        let result = await new Promise((resolve, reject) =>{
            cloudinary.uploader.upload_large(filePath, {
                resource_type : 'auto', folder : folder
            },(error, result) =>{
                if(error){
                    reject(error);
                }
                resolve(result);
            })
        });
        fs.unlink(filePath, (error) => {
            if (error) {
                console.error('Error deleting local file:', error);
            } else {
                console.log('Local file deleted successfully:', filePath);
            }
        });

        return result;
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        throw error;
    }
};
const destroyFile = async (public_id) => {
    try {
        // Delete the file using its public ID
        const deletionResult = cloudinary.api.delete_resources(public_id, {resource_type : "video", type : "upload"});
        console.log('Deletion result:', deletionResult);
        return deletionResult;
      } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw error;
      }
}
export {cloudinaryUpload,destroyFile}