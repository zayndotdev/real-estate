# Cloudinary Image Upload Setup Guide

This guide will help you set up Cloudinary for image uploads in your React Estate application.

## 📋 Prerequisites

- A Cloudinary account (free tier is sufficient)
- Node.js and npm installed
- MongoDB connection configured

## 🚀 Step 1: Create Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (Google/GitHub sign-up is available)
3. Once logged in, go to your **Dashboard**
4. You'll see the following credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 🔐 Step 2: Add Cloudinary Credentials to .env

Add the following environment variables to your `.env` file in the root directory:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Important:** Replace `your_cloud_name_here`, `your_api_key_here`, and `your_api_secret_here` with your actual Cloudinary credentials.

## 📦 Step 3: Verify Installation

The following packages are already installed:
- `cloudinary` - Cloudinary SDK
- `multer` - File upload middleware

If you need to install them manually:
```bash
npm install cloudinary multer
```

## 🔧 Step 4: Start Your Server

Make sure your server is running:

```bash
npm run dev
```

## ✅ Step 5: Test Image Upload

1. Start your frontend application
2. Navigate to the Profile page
3. Click on your profile picture
4. Select an image file (JPG, PNG, etc.)
5. The image will be uploaded to Cloudinary
6. Click "UPDATE" to save the profile with the new image

## 📁 File Structure

The following files have been created/modified:

### Backend:
- `api/utils/cloudinary.js` - Cloudinary configuration
- `api/routes/upload.route.js` - Image upload route
- `api/middleware/verifyToken.js` - JWT authentication middleware
- `api/controllers/user.controller.js` - User update controller
- `api/routes/user.route.js` - User routes with update endpoint

### Frontend:
- `client/src/pages/Profile.jsx` - Profile page with image upload
- `client/src/redux/user/userSlice.js` - Redux actions for user updates

## 🔒 Security Features

- JWT token authentication for protected routes
- File size limit: 5MB
- Only image files are accepted
- Automatic cleanup of temporary files
- Secure file uploads to Cloudinary

## 🎨 Features

- **Image Upload**: Click on profile picture to upload a new image
- **Profile Update**: Update email and password
- **Real-time Preview**: See uploaded image before saving
- **Loading States**: Visual feedback during upload and update
- **Error Handling**: Comprehensive error messages

## 🐛 Troubleshooting

### Error: "CLOUDINARY_CLOUD_NAME is not defined"
- Make sure you've added Cloudinary credentials to your `.env` file
- Restart your server after adding environment variables

### Error: "Failed to upload image"
- Check your Cloudinary credentials
- Verify your internet connection
- Check Cloudinary dashboard for any service issues

### Error: "File size too large"
- Maximum file size is 5MB
- Compress your image or use a smaller file

### Image not updating in Header
- The Header component should automatically update when Redux store updates
- Try refreshing the page if the image doesn't update immediately

## 📝 Notes

- Images are stored in the `mern-profile-pics` folder in your Cloudinary account
- Temporary files are automatically deleted after upload
- The uploads directory (`api/uploads/`) is gitignored and should not be committed

## 🔗 Useful Links

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Cloudinary Dashboard](https://cloudinary.com/console)

