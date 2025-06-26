import { Worker } from 'bullmq';
import redis from '../redis.js';
import { transcodeVideo } from './transcode.js';

console.log('Worker started...');

const worker = new Worker(
  'transcodeVideo',
  async (job) => {
    const { videoId, inputPath } = job.data;
    await transcodeVideo({ videoId, inputPath });
  },
  { connection: redis }
);

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});
