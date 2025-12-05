# Deployment Guide

This guide covers deploying the Campaign Generator application to production.

## Prerequisites

- Node.js 18+ installed
- Supabase account and project
- OpenAI API key
- Vercel account (for frontend) or other hosting provider
- Railway/Heroku account (for backend) or other hosting provider

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### Backend (.env)
```env
PORT=3001
NODE_ENV=production
SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_KEY=your_production_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=https://your-frontend-domain.com
```

## Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Run Database Migrations**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `docs/database-setup.sql`
   - Run the SQL script

3. **Configure Authentication**
   - Go to Authentication → Settings
   - Enable email authentication
   - Configure any additional providers as needed
   - Set up redirect URLs for your production domain

## Backend Deployment

### Option 1: Railway

1. **Connect Repository**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Set Environment Variables**
   - Go to Railway dashboard
   - Add all required environment variables
   - Set PORT to $PORT (Railway provides this)

### Option 2: Heroku

1. **Create Heroku App**
   ```bash
   # Install Heroku CLI
   # Create app
   heroku create your-campaign-api
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set SUPABASE_URL=your_url
   heroku config:set SUPABASE_SERVICE_KEY=your_key
   heroku config:set OPENAI_API_KEY=your_key
   heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
   
   # Deploy
   git subtree push --prefix backend heroku main
   ```

### Option 3: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository
   - Select the backend folder as source
   - Configure environment variables

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # From frontend directory
   cd frontend
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Add environment variables in Settings → Environment Variables
   - Redeploy after adding variables

### Option 2: Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Base directory: `frontend`

2. **Environment Variables**
   - Add all NEXT_PUBLIC_* variables in Netlify dashboard

## Domain Configuration

1. **Custom Domains**
   - Configure custom domains in your hosting provider
   - Update CORS settings in backend
   - Update redirect URLs in Supabase

2. **SSL Certificates**
   - Most hosting providers handle SSL automatically
   - Verify HTTPS is enabled for both frontend and backend

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Environment variables set correctly
- [ ] Authentication working
- [ ] API endpoints responding
- [ ] CORS configured properly
- [ ] SSL certificates active
- [ ] Domain names pointing correctly
- [ ] Rate limiting configured
- [ ] Error monitoring set up (optional: Sentry)
- [ ] Analytics set up (optional: Vercel Analytics)

## Monitoring and Maintenance

### Health Checks
- Backend: `GET /api/health`
- Frontend: Check if pages load correctly

### Logs
- **Vercel**: View function logs in dashboard
- **Railway**: Use `railway logs`
- **Heroku**: Use `heroku logs --tail`

### Updates
1. Test changes locally
2. Deploy to staging environment (optional)
3. Deploy to production
4. Monitor for errors
5. Rollback if needed

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check FRONTEND_URL in backend environment
   - Verify Supabase CORS settings

2. **Authentication Issues**
   - Verify Supabase keys are correct
   - Check redirect URLs in Supabase

3. **API Timeouts**
   - Check OpenAI API key
   - Verify rate limiting settings

4. **Database Connection Issues**
   - Verify Supabase URL and service key
   - Check RLS policies

### Support

For additional help:
- Check application logs
- Review environment variables
- Test API endpoints manually
- Contact your hosting provider support
