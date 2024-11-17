import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadFile = async (filePath) => {

    if (!filePath) {
        throw new Error("File path is required");
    }

    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const uploadResult = await cloudinary.uploader
            .upload(filePath, {
                resource_type: "auto",
            }
            )
            .catch((error) => {
                console.log(error);
            });

        return uploadResult;
    }
    catch (error) {
        fs.unlinkSync(filePath);
        console.log(error);
    }
}

export default uploadFile;