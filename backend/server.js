import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import wishlistRoutes from './routes/wishlist.js';
import rewardsRoutes from './routes/rewards.js';
import addressRoutes from './routes/addresses.js';
import notificationRoutes from './routes/notifications.js';
import purchaseRoutes from './routes/purchase.js';
import stockRoutes from './routes/stock.js';
import reviewRoutes from './routes/reviews.js';
import returnRoutes from './routes/returns.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import database
import db from './config/database.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/returns', returnRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Create default admin user if not exists
const createDefaultAdmin = async () => {
  try {
    const [users] = await db.query('SELECT id FROM users WHERE email = ?', [process.env.ADMIN_EMAIL]);
    
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await db.query(
        'INSERT INTO users (email, password, first_name, last_name, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        [process.env.ADMIN_EMAIL, hashedPassword, 'Admin', 'User', 'admin', 'active']
      );
      console.log('✅ Default admin user created');
    }

    // Create manager if not exists
    const [managers] = await db.query('SELECT id FROM users WHERE email = ?', ['manager@suGlow.com']);
    if (managers.length === 0) {
      const hashedPassword = await bcrypt.hash('manager123', 10);
      await db.query(
        'INSERT INTO users (email, password, first_name, last_name, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        ['manager@suGlow.com', hashedPassword, 'Manager', 'User', 'manager', 'active']
      );
      console.log('✅ Default manager user created');
    }
  } catch (error) {
    console.error('Error creating default users:', error.message);
  }
};

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  
  // Create default admin user
  await createDefaultAdmin();
});

export default app;
