# suGlow Backend API

Node.js + Express + MySQL backend for suGlow E-commerce platform.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment variables:**
- Copy `.env` file and update the database credentials
- Change `JWT_SECRET` to a secure random string
- Update `DB_PASSWORD` with your MySQL password

3. **Create database and tables:**
```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source database/schema.sql

# (Optional) Run seed data
source database/seed.sql
```

4. **Start the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:slug` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get order details (requires auth)
- `GET /api/orders/all` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/customers` - Get all customers
- `GET /api/admin/reviews` - Get product reviews
- `PUT /api/admin/reviews/:id/status` - Update review status

## Default Credentials

### Admin
- Email: `admin@kirei.com`
- Password: `admin123`

### Manager
- Email: `manager@kirei.com`
- Password: `manager123`

## Database Schema

The database includes the following tables:
- `users` - User accounts (customers & admins)
- `addresses` - Shipping and billing addresses
- `categories` - Product categories
- `products` - Product catalog
- `cart` - Shopping cart items
- `wishlist` - User wishlists
- `orders` - Order information
- `order_items` - Order line items
- `coupons` - Discount coupons
- `reviews` - Product reviews
- `reward_activities` - Reward points tracking
- `contact_messages` - Contact form submissions
- `faqs` - Frequently asked questions

## File Upload

Product images are stored in `public/uploads/` directory. The upload endpoint accepts:
- Image formats: JPEG, JPG, PNG, WEBP
- Max file size: 5MB

## Environment Variables

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=suglow_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
```

## Notes

- All admin routes require authentication with admin/manager role
- JWT tokens expire after 24 hours (configurable)
- CORS is enabled for the frontend URL specified in .env
- File uploads are limited to 5MB per file
