# Hostinger Deployment Guide

## Project Structure
- Frontend: React + Vite
- Backend: Node.js + Express  
- Database: MySQL

## Frontend Deployment

### 1. Build the frontend
```bash
cd /Users/mushfikurrahman/Desktop/Mushfikur\ Rahman/Journey\ To\ Web/Laravel\ Website/suGlow/suglow
npm run build
```

This creates a `dist` folder with static files.

### 2. Upload to Hostinger
- Upload contents of `dist` folder to `public_html` directory
- Or create a subdirectory like `public_html/app`

### 3. Create .htaccess in public_html
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Backend Deployment

### 1. Setup Node.js Application (in Hostinger cPanel)
- Go to "Software" → "Setup Node.js App"
- Application root: `/home/username/backend` (or your path)
- Application URL: `api.yourdomain.com` or `/api`
- Application startup file: `server.js`
- Node.js version: 18.x or later
- Click "Create"

### 2. Upload Backend Files
Upload these files to the backend directory:
- controllers/
- routes/
- middleware/
- config/
- public/images/
- server.js
- package.json
- .env

### 3. Install Dependencies
In Hostinger terminal or SSH:
```bash
cd ~/backend
npm install
```

### 4. Setup Environment Variables (.env)
```env
PORT=5001
NODE_ENV=production
DB_HOST=localhost
DB_USER=your_hostinger_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=https://yourdomain.com
```

### 5. Setup MySQL Database
- Go to cPanel → MySQL Databases
- Create database: `yourusername_suglow`
- Create user with password
- Import your SQL dump file

### 6. Update Database Connection
Make sure `backend/config/database.js` uses environment variables.

## Environment Variables for Frontend

Create `.env.production` in frontend root:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

Or if backend is on same domain:
```env
VITE_API_URL=https://yourdomain.com/api
```

Then rebuild:
```bash
npm run build
```

## Alternative: Deploy to Other Platforms

If Hostinger doesn't support Node.js well:

### Frontend → Vercel/Netlify (Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd suglow
vercel
```

### Backend → Railway/Render (Free tier available)
- Push backend to separate Git repo
- Connect to Railway/Render
- They auto-deploy Node.js apps

### Database → Use Hostinger MySQL
- Keep MySQL on Hostinger
- Connect backend to it via connection string

## Quick Deploy Commands

### Build Frontend
```bash
cd suglow
npm run build
# Upload dist/ to public_html
```

### Deploy Backend (if Node.js supported)
```bash
cd backend  
npm install --production
pm2 start server.js --name suglow-api
```

## Testing After Deployment

1. Test API: `https://yourdomain.com/api/health`
2. Test Frontend: `https://yourdomain.com`
3. Check console for API connection errors
4. Verify image uploads work
