import ffmpeg from 'fluent-ffmpeg';

export const getVideoDuration = async (filePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) return reject(err);
            resolve(Math.floor(metadata.format.duration || 0));
        });
    });
};

export const getVideoResolution = async (filePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) return reject(err);
            const stream = metadata.streams.find(s => s.width && s.height);
            resolve({ width: stream.width, height: stream.height });
        });
    });
};