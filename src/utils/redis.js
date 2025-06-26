import Redis from "ioredis"
import 'dotenv/config';

const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  maxRetriesPerRequest: null
});

export default redis;