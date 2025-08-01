# Deployment Guide - Mohamed Hegazy Portfolio 2025

## 🚀 Deploy to Vercel

### Prerequisites
1. **GitHub Account** - Your code is already pushed to: https://github.com/M7mod-hegazy/my_portofolio2025.git
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Database** - Set up a MongoDB Atlas cluster
4. **Cloudinary Account** - For file uploads (images, CV files)

### Step 1: Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string (replace `<password>` with your actual password)
5. Whitelist Vercel's IP addresses or use `0.0.0.0/0` for all IPs

### Step 2: Set up Cloudinary
1. Go to [Cloudinary](https://cloudinary.com)
2. Create a free account
3. Get your Cloud Name, API Key, and API Secret from the dashboard

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `M7mod-hegazy/my_portofolio2025`
4. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 4: Add Environment Variables
In your Vercel project dashboard, go to Settings → Environment Variables and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
```

### Step 5: Deploy
1. Click "Deploy" - Vercel will automatically build and deploy your site
2. Your site will be available at: `https://your-project-name.vercel.app`

## 🔧 Post-Deployment Setup

### Access Admin Panel
1. Visit `https://your-site.vercel.app/admin`
2. Update your content:
   - About section
   - Skills and technologies
   - Projects
   - Certifications
   - Contact information
   - Upload your CV

### Custom Domain (Optional)
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check that all environment variables are set
   - Ensure MongoDB connection string is correct

2. **API Routes Not Working**
   - Verify `vercel.json` configuration
   - Check environment variables in Vercel dashboard

3. **File Uploads Not Working**
   - Verify Cloudinary credentials
   - Check Cloudinary upload presets

4. **Database Connection Issues**
   - Whitelist Vercel IPs in MongoDB Atlas
   - Check connection string format

### Logs and Debugging
- View deployment logs in Vercel dashboard
- Check function logs for API issues
- Use Vercel CLI for local testing: `vercel dev`

## 📱 Features Available After Deployment

✅ **Responsive Portfolio Website**
✅ **Admin Panel** (`/admin`)
✅ **Dynamic Content Management**
✅ **File Upload System**
✅ **Contact Form**
✅ **Social Media Integration**
✅ **CV Download Functionality**
✅ **3D Interactive Elements**
✅ **Dark/Light Mode**
✅ **SEO Optimized**

## 🔄 Updates and Maintenance

### Making Changes
1. Edit code locally or through GitHub
2. Push changes to main branch
3. Vercel automatically redeploys

### Monitoring
- Monitor site performance in Vercel dashboard
- Check function usage and limits
- Monitor database usage in MongoDB Atlas

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connection

Your portfolio is now ready for the world! 🌟
