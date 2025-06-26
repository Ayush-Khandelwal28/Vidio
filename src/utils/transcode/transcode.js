import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import uploadVideo from '../videoUploadToAWS.js';
import { Video } from '../../models/video.model.js';
import { getVideoDuration, getVideoResolution } from '../videoMetadata.js';
import connectDB from '../../database/index.js';

connectDB().then(() => {
    console.log('Database connected');
}
).catch((err) => {
    console.log(err);
});

const resolutions = [
    { label: '1080p', size: '1920x1080' },
    { label: '720p', size: '1280x720' },
    { label: '480p', size: '854x480' },
    { label: '360p', size: '640x360' },
];

export const transcodeVideo = async ({ videoId, inputPath }) => {
    const outputDir = path.resolve('public/uploads/transcoded', videoId);
    fs.mkdirSync(outputDir, { recursive: true });

    await Video.findByIdAndUpdate(videoId, {
        transcodingStatus: 'in-progress',
    });

    const { width, height } = await getVideoResolution(inputPath);
    const filteredResolutions = resolutions.filter(({ size }) => {
        const [w, h] = size.split('x').map(Number);
        return w <= width && h <= height;
    });

    const uploadedUrls = {};
    let duration = 0;

    try {
        for (const { label, size } of filteredResolutions) {
            const outputPath = path.join(outputDir, `${label}.mp4`);

            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .videoCodec('libx264')
                    .size(size)
                    .outputOptions('-crf 23')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputPath);
            });

            const s3Url = await uploadVideo(outputPath, videoId, label);
            if (!s3Url) {
                throw new Error(`Failed to upload ${label} resolution to S3`);
            }
            uploadedUrls[label] = s3Url;
        }

        duration = await getVideoDuration(inputPath);

        await Video.findByIdAndUpdate(videoId, {
            transcodingStatus: 'completed',
            resolutions: uploadedUrls,
            availableResolutions: Object.keys(uploadedUrls),
            duration,
        });

    } catch (err) {
        console.error('Transcoding failed:', err);

        await Video.findByIdAndUpdate(videoId, {
            transcodingStatus: 'failed',
        });
    }
};
