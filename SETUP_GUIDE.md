# Backend Setup Guide

## Prerequisites
আপনার কম্পিউটারে এগুলো install করা থাকতে হবে:
- Node.js (v18+)
- MySQL (v8+)
- MySQL Workbench বা command line access

## Step 1: MySQL Install করুন

### macOS এ MySQL Install:
```bash
# Homebrew দিয়ে install করুন
brew install mysql

# MySQL শুরু করুন
brew services start mysql

# Root password সেট করুন (optional)
mysql_secure_installation
```

### Windows এ MySQL Install:
1. [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) ডাউনলোড করুন
2. Installer চালিয়ে install করুন
3. MySQL Workbench install করুন

## Step 2: Database তৈরি করুন

### Option A: MySQL Workbench দিয়ে
1. MySQL Workbench খুলুন
2. Local connection এ connect করুন
3. নতুন query tab খুলুন
4. এই commands গুলো চালান:

```sql
-- Database তৈরি করুন
CREATE DATABASE suglow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE suglow_db;

-- Schema file run করুন (file path আপনার অনুযায়ী বদলান)
source /path/to/backend/database/schema.sql;

-- Sample data add করতে চাইলে
source /path/to/backend/database/seed.sql;
```

### Option B: Command Line দিয়ে
```bash
# MySQL এ login করুন
mysql -u root -p

# Password দিয়ে login হলে commands চালান:
CREATE DATABASE suglow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Schema file run করুন
mysql -u root -p suglow_db < backend/database/schema.sql

# Seed data add করুন (optional)
mysql -u root -p suglow_db < backend/database/seed.sql
```

## Step 3: Backend Configuration

1. `backend/.env` file এ আপনার MySQL credentials দিন:

```env
PORT=5000
NODE_ENV=development

# আপনার MySQL credentials এখানে দিন
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=suglow_db
DB_PORT=3306

# JWT secret একটা strong random string দিন
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Admin credentials (প্রথম login এর জন্য)
ADMIN_EMAIL=admin@kirei.com
ADMIN_PASSWORD=admin123

# File upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./public/uploads

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Step 4: Backend Server শুরু করুন

```bash
# Backend folder এ যান
cd backend

# Dependencies install করা থাকলে (already done):
npm install

# Development server শুরু করুন
npm run dev
```

Server চললে আপনি দেখবেন:
```
✅ Database connected successfully
✅ Default admin user created
✅ Default manager user created
🚀 Server running on port 5000
```

## Step 5: Test করুন

### Browser এ test:
```
http://localhost:5000/health
```

Response আসবে:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Thunder Client বা Postman দিয়ে test:

**Login Test:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@kirei.com",
  "password": "admin123"
}
```

Response এ `token` পাবেন যেটা frontend authentication এ ব্যবহার হবে।

## Step 6: Frontend Configuration

Frontend এ backend URL already সেট করা আছে:
```
VITE_API_URL="http://localhost:5000/api"
```

## Step 7: উভয় Server একসাথে চালান

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## Default Login Credentials

### Admin Panel Login:
- **Email:** admin@kirei.com
- **Password:** admin123

### Manager Login:
- **Email:** manager@kirei.com
- **Password:** manager123

## Troubleshooting

### MySQL connection error:
1. MySQL service চালু আছে কিনা check করুন:
   ```bash
   # macOS
   brew services list
   
   # Start করতে
   brew services start mysql
   ```

2. `.env` file এ DB credentials ঠিক আছে কিনা দেখুন

3. Database তৈরি হয়েছে কিনা check করুন:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

### Port 5000 already in use:
1. `.env` file এ PORT পরিবর্তন করুন (e.g., 5001)
2. Frontend `.env` এ `VITE_API_URL` update করুন

### Authentication not working:
1. Backend server চালু আছে কিনা check করুন
2. Browser console এ API errors দেখুন
3. Network tab এ request/response check করুন

## Next Steps

এখন আপনার full-stack application চালু আছে! পরবর্তী পদক্ষেপ:

1. ✅ Backend API endpoints test করুন
2. ✅ Admin panel এ login করুন (http://localhost:5173/admin/login)
3. ✅ Products, categories, orders manage করুন
4. ⏳ Frontend pages এ mock data replace করে API calls যোগ করতে হবে (পরবর্তী task)

## Database Schema Overview

তৈরি হওয়া tables:
- `users` - Customers & Admins
- `addresses` - Shipping/Billing addresses
- `categories` - Product categories
- `products` - Product catalog
- `cart` - Shopping cart
- `wishlist` - User wishlists
- `orders` - Orders
- `order_items` - Order details
- `coupons` - Discount coupons
- `reviews` - Product reviews
- `reward_activities` - Loyalty points
- `contact_messages` - Contact form
- `faqs` - FAQ content

সব কিছু ঠিকভাবে setup হয়েছে কিনা confirm করুন, তারপর আমি frontend integration এর পরবর্তী steps শুরু করব! 🚀
