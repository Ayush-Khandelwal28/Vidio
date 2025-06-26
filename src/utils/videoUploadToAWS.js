import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import 'dotenv/config';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const uploadVideo = async (filePath, videoId, resolutionLabel = 'original') => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }

        const fileName = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath);
        const fileType = path.extname(fileName).slice(1);

        let key;
        if (resolutionLabel === 'original') {
            key = `videos/original/${fileName}`;
        } else {
            if (!videoId) throw new Error("videoId is required for transcoded uploads");
            key = `videos/transcoded/${videoId}/${resolutionLabel}`;
        }

        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: fileContent,
            ContentType: `video/${fileType}`,
        });

        await s3.send(uploadCommand);

        const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        console.log('File uploaded successfully to:', publicUrl);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw error;
    }
};

export default uploadVideo;
