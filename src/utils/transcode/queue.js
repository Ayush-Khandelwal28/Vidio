import { Queue } from 'bullmq';
import redis from '../redis.js';

export const transcodeQueue = new Queue('transcodeVideo', { connection: redis });

const addVideoToQueue = async ({
    videoId,
    inputPath
}) => {
    await transcodeQueue.add('transcode', {
        videoId,
        inputPath
    });
};

export default addVideoToQueue;
