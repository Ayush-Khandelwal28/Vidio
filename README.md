# Vidio

**Vidio** is a robust backend application built to power a video-streaming platform. It offers comprehensive APIs for user management, video publishing, and content interaction. Designed with scalability and performance in mind, Vidio integrates advanced technologies like **AWS S3**, **Cloudinary**, **FFmpeg**, and **BullMQ** for efficient file handling, video transcoding, and background job processing. The platform features automatic multi-resolution video transcoding, intelligent resolution filtering, and background processing queues. Additionally, the application leverages the **MongoDB aggregate pipeline** to enable efficient querying and data transformation, providing a seamless user experience.

---

## Key Features

- **Multi-Resolution Video Transcoding**: Automatic transcoding to multiple resolutions (360p, 480p, 720p, 1080p) using FFmpeg
- **Background Processing**: Asynchronous video processing using BullMQ job queues
- **Intelligent Resolution Filtering**: Only transcodes to resolutions supported by the original video
- **Transcoding Status Tracking**: Real-time status updates (in-progress, completed, failed)
- **User Authentication**: JWT-based authentication with refresh tokens
- **Content Management**: Video upload, update, delete, and publish/unpublish functionality
- **Social Features**: Subscriptions, playlists, comments, and user interactions
- **Efficient Querying**: MongoDB aggregation pipelines for complex data operations

---

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB (with Mongoose ORM)
- **Authentication**: JSON Web Tokens (JWT) and bcrypt for password hashing
- **File Uploads**: Multer for handling uploads, integrated with AWS S3 and Cloudinary for cloud storage
- **Video Processing**: FFmpeg and fluent-ffmpeg for video transcoding
- **Background Jobs**: BullMQ for job queue management
- **Caching**: Redis for queue storage and session management

---

## Prerequisites

Before installation, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **Redis** (v6.0 or higher) - Required for background job processing
- **FFmpeg** (v4.0 or higher) - Required for video transcoding

---

## Installation and Setup

1. **Clone the Repository and install dependencies**
   ```bash
   git clone https://github.com/Ayush-Khandelwal28/Vidio.git
   cd vidio
   npm install
   ```

2. **Setup Environment Variables**
    ```bash
    # Database
    MONGO_URI=your_mongo_uri
    
    # Server
    PORT=your_port
    CORS_ORIGIN=your_cors_origin
    
    # JWT Configuration
    JWT_SECRET=your_jwt_secret
    ACCESS_TOKEN_EXPIRATION=1d
    REFRESH_TOKEN_EXPIRATION=7d
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    
    # Cloudinary (for thumbnails)
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    CLOUDINARY_URL=your_cloudinary_url
    
    # AWS S3 (for video storage)
    AWS_ACCESS_KEY_ID=your_aws_access_key_id
    AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
    AWS_REGION=your_aws_region
    AWS_BUCKET_NAME=your_aws_bucket_name
    
    # Redis (for background jobs)
    UPSTASH_REDIS_URL=your_upstash_redis_url
    ```

3. **Start the Application**
   
   **Start the main server:**
   ```bash
   npm run dev
   ```
   
   **Start the video transcoding worker** (in a separate terminal):
   ```bash
   node src/utils/transcode/worker.js
   ```
   
   Note: The worker process handles background video transcoding jobs and should run alongside the main application.

---

## Video Processing Workflow

1. **Upload**: Video and thumbnail are uploaded via `/api/videos/publish`
2. **Initial Storage**: Original video uploaded to AWS S3, thumbnail to Cloudinary
3. **Queue Processing**: Video added to transcoding queue with status 'in-progress'
4. **Transcoding**: Background worker processes video into multiple resolutions using FFmpeg
5. **Storage**: Transcoded versions uploaded to AWS S3
6. **Completion**: Video status updated to 'completed' with available resolutions

## Middlewares

1. **verifyToken**  
   This middleware ensures secure access by verifying JWT tokens from the request's cookies or headers. It decodes the token, retrieves the user from the database, and attaches the user object to the `req` object. Unauthorized requests are blocked with appropriate error handling.

2. **upload**  
   A Multer-based middleware to handle file uploads. It stores uploaded files in the `./public/uploads` directory and appends a timestamp to the original filename to ensure uniqueness.


## Video Transcoding Architecture

### **Core Components**

1. **Transcoding Queue and Worker**
   - BullMQ-based queue system with Redis storage for job management
   - Background worker process for asynchronous video transcoding with automatic retries

2. **Transcoding Engine**
   - FFmpeg-powered multi-resolution processing (360p to 1080p)
   - Intelligent resolution filtering and AWS S3 integration for storage

### **Transcoding Process**

1. **Video Upload**: User uploads video via `/api/videos/publish`
2. **Job Creation**: Video added to BullMQ transcoding queue
3. **Status Update**: Video status set to `in-progress`
4. **Processing**: Worker picks up job and starts FFmpeg transcoding
5. **Multiple Outputs**: Creates versions for supported resolutions
6. **Upload**: All transcoded versions uploaded to AWS S3
7. **Completion**: Video status updated to `completed`, URLs stored in database

## API Endpoints

### **User Routes**

| Method | Endpoint             | Description                                                                                     | Middleware                                      |
|--------|-----------------------|-------------------------------------------------------------------------------------------------|------------------------------------------------|
| POST   | `/register`          | Register a new user with avatar and cover image.                                               | `multer`                                       |
| POST   | `/login`             | Login an existing user.                                                                        |                                                |
| POST   | `/logout`            | Logout the currently logged-in user.                                                           | `verifyToken`                                  |
| POST   | `/refreshToken`      | Refresh the access token using a refresh token.                                                |                                                |
| PATCH  | `/changePassword`    | Change the user's password.                                                                    | `verifyToken`                                  |
| PATCH  | `/updateAvatar`      | Update the user's avatar.                                                                      | `verifyToken`, `multer`                        |
| PATCH  | `/updateCoverImage`  | Update the user's cover image.                                                                 | `verifyToken`, `multer`                        |
| GET    | `/channel/:channelId`| Get the profile of a specific channel by ID.                                                   |                                                |
| GET    | `/watchHistory`      | Get the user's watch history.                                                                  | `verifyToken`                                  |
| GET    | `/me`                | Get details of the currently authenticated user.                                               | `verifyToken`                                  |

---

### **Video Routes**

| Method | Endpoint                  | Description                                                                 | Middleware                                      |
|--------|----------------------------|-----------------------------------------------------------------------------|------------------------------------------------|
| POST   | `/publish`                | Publish a video with file and thumbnail uploads.                            | `verifyToken`, `multer`                        |
| PATCH  | `/update/:videoId`        | Update details of a specific video by ID.                                   | `verifyToken`                                  |
| DELETE | `/delete/:videoId`        | Delete a specific video by ID.                                              | `verifyToken`                                  |
| GET    | `/watch/:videoId`         | Get video details and stream URL with optional resolution selection.        |                                                |
| PATCH  | `/togglePublish/:videoId` | Toggle the publish status of a specific video by ID.                        | `verifyToken`                                  |

#### Video Watch Endpoint Usage:
- `/api/videos/watch/:videoId` - Gets video metadata with original stream URL
- `/api/videos/watch/:videoId?resolution=720p` - Gets video metadata with 720p stream URL
- Available resolutions: `360p`, `480p`, `720p`, `1080p`, `original`


---

### **Subscription Routes**

| Method | Endpoint                 | Description                                                                 | Middleware                                      |
|--------|---------------------------|-----------------------------------------------------------------------------|------------------------------------------------|
| POST   | `/toggle/:channelId`     | Subscribe to or unsubscribe from a channel by ID.                           | `verifyToken`                                  |
| GET    | `/subscribers/:channelId`| Get the list of subscribers for a specific channel by ID.                   |                                                |
| GET    | `/subscribed`            | Get the list of channels the user is subscribed to.                         | `verifyToken`                                  |

---

### **Playlist Routes**

| Method | Endpoint                  | Description                                                                 | Middleware                                      |
|--------|----------------------------|-----------------------------------------------------------------------------|------------------------------------------------|
| POST   | `/create`                 | Create a new playlist.                                                      | `verifyToken`                                  |
| PATCH  | `/update/:playlistId`     | Update the details of a specific playlist by ID.                            | `verifyToken`                                  |
| DELETE | `/delete/:playlistId`     | Delete a specific playlist by ID.                                           | `verifyToken`                                  |
| PATCH  | `/addVideo/:playlistId`   | Add a video to a specific playlist by ID.                                   | `verifyToken`                                  |
| PATCH  | `/removeVideo/:playlistId`| Remove a video from a specific playlist by ID.                              | `verifyToken`                                  |
| GET    | `/myPlaylist`             | Get the playlists created by the current user.                              | `verifyToken`                                  |
| GET    | `/:playlistId`            | Get details of a specific playlist by ID.                                   |                                                |

---

### **Channel Routes**

| Method | Endpoint                  | Description                                                                 | Middleware                                      |
|--------|----------------------------|-----------------------------------------------------------------------------|------------------------------------------------|
| GET    | `/:channelId/videos`      | Get all videos from a specific channel by ID.                               |                                                |
| GET    | `/:channelId/stats`       | Get statistics for a specific channel (total videos, views, subscribers).   |                                                |

---

### **Comment Routes**

| Method | Endpoint     | Description                                                                 | Middleware                                      |
|--------|---------------|-----------------------------------------------------------------------------|------------------------------------------------|
| POST   | `/create`    | Create a new comment.                                                       | `verifyToken`                                  |
| PATCH  | `/update`    | Update an existing comment.                                                 | `verifyToken`                                  |
| DELETE | `/delete`    | Delete a specific comment.                                                  | `verifyToken`                                  |
| GET    | `/all`       | Get all comments for a specific video.                              |                                                |



