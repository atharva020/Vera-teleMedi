# Vercel Deployment Guide

## Required Environment Variables

Make sure to add these environment variables in your Vercel project settings:

### Supabase Configuration
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### How to Get Supabase Credentials:
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deployment Steps

1. **Push your code to GitHub/GitLab/Bitbucket**
2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository
3. **Add Environment Variables** (see above)
4. **Deploy**
   - Vercel will automatically detect Next.js
   - Click "Deploy"

## Troubleshooting

### If you see the default Next.js page:
1. Check that environment variables are set correctly
2. Verify the build completed successfully
3. Check Vercel deployment logs for errors
4. Ensure all dependencies are in `package.json`

### Common Issues:
- **Build fails**: Check that all environment variables are set
- **Redirect loops**: Clear browser cache and cookies
- **Database errors**: Verify Supabase credentials are correct

## After Deployment

1. Test the login functionality
2. Verify database connections work
3. Check that cookies are being set (in browser DevTools)
4. Test patient and doctor dashboards

