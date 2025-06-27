# Vidio

**Vidio** is a robust backend application built to power a video-streaming platform. It offers comprehensive APIs for user management, video publishing, and content interaction. Designed with scalability and performance in mind, Vidio integrates advanced technologies like **AWS S3**, **Cloudinary**, and **Multer** for efficient file handling and storage. Additionally, the application leverages the **MongoDB aggregate pipeline** to enable efficient querying and data transformation, providing a seamless user experience.

---

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB (with Mongoose ORM)
- **Authentication**: JSON Web Tokens (JWT) and bcrypt for password hashing.
- **File Uploads**: Multer for handling uploads, integrated with AWS S3 and Cloudinary for cloud storage.

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
    MONGO_URI=your_mongo_uri
    PORT=your_port
    JWT_SECRET=your_jwt_secret
    ACCESS_TOKEN_EXPIRATION=your_access_token_expiration
    REFRESH_TOKEN_EXPIRATION=your_refresh_token_expiration
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    CLOUDINARY_URL=your_cloudinary_url
    CORS_ORIGIN=your_cors_origin
    AWS_ACCESS_KEY_ID=your_aws_access_key_id
    AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
    AWS_REGION=your_aws_region
    AWS_BUCKET_NAME=your_aws_bucket_name
    ```

3. **Start development server**
    ```bash
    npm run dev
    ```

## Middlewares

1. **verifyToken**  
   This middleware ensures secure access by verifying JWT tokens from the request's cookies or headers. It decodes the token, retrieves the user from the database, and attaches the user object to the `req` object. Unauthorized requests are blocked with appropriate error handling.

2. **upload**  
   A Multer-based middleware to handle file uploads. It stores uploaded files in the `./public/uploads` directory and appends a timestamp to the original filename to ensure uniqueness.


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
| GET    | `/watch/:videoId`         | Get details of a specific video by ID.                                      |                                                |
| PATCH  | `/togglePublish/:videoId` | Toggle the publish status of a specific video by ID.                        | `verifyToken`                                  |

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



