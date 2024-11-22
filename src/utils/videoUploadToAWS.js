import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getVideoDurationInSeconds } from 'get-video-duration';
import 'dotenv/config';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const uploadVideo = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }

        // Get video duration before upload
        const durationInSeconds = await getVideoDurationInSeconds(filePath);

        const fileName = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath);
        const fileType = path.extname(fileName).slice(1);
        const key = `videos/${fileName}`;

        // Upload to S3 with duration metadata
        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: fileContent,
            ContentType: `video/${fileType}`,
            Metadata: {
                'duration-seconds': durationInSeconds.toString()
            }
        });

        await s3.send(uploadCommand);
        
        const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        console.log('File uploaded successfully to:', publicUrl);
        
        return {
            url: publicUrl,
            durationInSeconds
        };
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw error;
    }
};

export default uploadVideo;