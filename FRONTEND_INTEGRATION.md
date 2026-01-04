# Frontend API Integration Guide

## ✅ Completed Integrations

### 1. React Query Hooks Created

#### Product Hooks ([src/hooks/useProducts.ts](src/hooks/useProducts.ts))
- `useProducts(filters)` - Get all products with filtering, sorting, pagination
- `useProduct(slug)` - Get single product by slug
- `useCreateProduct()` - Create new product (admin)
- `useUpdateProduct()` - Update product (admin)
- `useDeleteProduct()` - Delete product (admin)

#### Cart Hooks ([src/hooks/useCart.ts](src/hooks/useCart.ts))
- `useCart()` - Get cart items (works for guests with session ID)
- `useAddToCart()` - Add item to cart
- `useUpdateCartItem()` - Update quantity
- `useRemoveFromCart()` - Remove item from cart
- `useClearCart()` - Clear all cart items

#### Order Hooks ([src/hooks/useOrders.ts](src/hooks/useOrders.ts))
- `useOrders()` - Get user's orders
- `useOrder(id)` - Get order details
- `useCreateOrder()` - Create new order
- `useAllOrders(params)` - Get all orders (admin)
- `useUpdateOrderStatus()` - Update order status (admin)

#### Admin Hooks ([src/hooks/useAdmin.ts](src/hooks/useAdmin.ts))
- `useDashboardStats()` - Get dashboard analytics
- `useCustomers(params)` - Get customers list
- `useReviews(params)` - Get product reviews
- `useUpdateReviewStatus()` - Approve/reject reviews

#### Auth Hooks ([src/hooks/useAuth.ts](src/hooks/useAuth.ts))
- `useLogin()` - User login with role-based redirect
- `useRegister()` - New user registration
- `useProfile()` - Get user profile
- `useUpdateProfile()` - Update user profile
- `useLogout()` - Logout and clear tokens

### 2. Pages Updated with Real API

#### ✅ Shop Page ([src/pages/Shop.tsx](src/pages/Shop.tsx))
**Changes:**
- Uses `useProducts()` hook for real product data
- Implements sorting (price, name, date)
- Pagination with dynamic page count
- Loading states with spinner
- Error handling
- Filter by price range (ready for backend)
- Shows actual product count from API

**Features:**
- Real-time product filtering
- Sort by: Price (asc/desc), Name (a-z), Newest
- Items per page: 12, 24, 48, 96
- Responsive pagination controls
- Product stock status display

#### ✅ ProductDetails Page ([src/pages/ProductDetails.tsx](src/pages/ProductDetails.tsx))
**Changes:**
- Uses `useProduct(slug)` for single product data
- Real image gallery (main image + gallery images from API)
- Add to cart functionality with `useAddToCart()`
- Stock quantity display
- SKU and category information from database
- Product reviews from API
- Toast notifications for cart actions
- Loading and error states

**Features:**
- Dynamic product loading by slug
- Real-time stock information
- Working "Add to Cart" button
- Product image carousel
- Review display (when available)
- Price with sale price handling

### 3. Authentication Integration

#### ✅ Admin Auth Context ([src/contexts/AdminAuthContext.tsx](src/contexts/AdminAuthContext.tsx))
**Changes:**
- Replaced mock auth with real API calls
- JWT token storage in localStorage
- Role-based access (admin/manager only)
- Token expiration handling via API interceptor
- Auto-redirect on token expiry

**Features:**
- Real admin/manager login
- Secure token-based authentication
- Persistent sessions
- Auto-logout on 401 errors

## 🔄 How to Use

### 1. Product Listing (Shop Page)

```tsx
import { useProducts } from '@/hooks/useProducts';

const { data, isLoading, error } = useProducts({
  category: 'skincare',
  minPrice: 500,
  maxPrice: 2000,
  sort: 'price',
  order: 'ASC',
  page: 1,
  limit: 24
});

const products = data?.data || [];
const pagination = data?.pagination || {};
```

### 2. Single Product

```tsx
import { useProduct } from '@/hooks/useProducts';

const { data, isLoading } = useProduct('product-slug');
const product = data?.data;
```

### 3. Add to Cart

```tsx
import { useAddToCart } from '@/hooks/useCart';
import { toast } from 'sonner';

const addToCart = useAddToCart();

const handleAddToCart = () => {
  addToCart.mutate(
    { productId: 123, quantity: 2 },
    {
      onSuccess: () => toast.success('Added to cart!'),
      onError: () => toast.error('Failed to add to cart')
    }
  );
};
```

### 4. Admin Login

```tsx
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const { login } = useAdminAuth();

const handleLogin = async (email, password) => {
  const result = await login(email, password);
  if (result.success) {
    // Redirects automatically
  } else {
    // Show error: result.error
  }
};
```

## 📝 Remaining Pages to Update

### Customer Pages
- [ ] **Auth.tsx** - Login/Register forms (use `useLogin()`, `useRegister()`)
- [ ] **Cart.tsx** - Cart management (use `useCart()`, `useUpdateCartItem()`, `useRemoveFromCart()`)
- [ ] **Checkout.tsx** - Order creation (use `useCreateOrder()`)
- [ ] **account/Dashboard.tsx** - User profile (use `useProfile()`)
- [ ] **account/MyOrders.tsx** - Order history (use `useOrders()`)
- [ ] **account/AccountDetails.tsx** - Profile editing (use `useUpdateProfile()`)

### Admin Pages
- [ ] **admin/Dashboard.tsx** - Analytics (use `useDashboardStats()`)
- [ ] **admin/Products.tsx** - Product CRUD (use `useProducts()`, `useCreateProduct()`, etc.)
- [ ] **admin/Orders.tsx** - Order management (use `useAllOrders()`, `useUpdateOrderStatus()`)
- [ ] **admin/Customers.tsx** - Customer list (use `useCustomers()`)
- [ ] **admin/ProductReviews.tsx** - Review moderation (use `useReviews()`, `useUpdateReviewStatus()`)

### Home Page Components
- [ ] **home/FeaturedCategories.tsx** - Fetch from categories API
- [ ] **home/NewArrivals.tsx** - Use `useProducts({ newArrival: true })`
- [ ] **home/TrendingProducts.tsx** - Use `useProducts({ trending: true })`
- [ ] **home/BestSellingProducts.tsx** - Use `useProducts({ bestSeller: true })`

## 🧪 Testing Guide

### Test Backend API

1. Start backend server:
```bash
cd backend
npm run dev
```

2. Test health endpoint:
```bash
curl http://orange-rook-646425.hostingersite.com/health
```

3. Test admin login:
```bash
curl -X POST http://orange-rook-646425.hostingersite.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@suGlow.com","password":"admin123"}'
```

### Test Frontend

1. Start frontend:
```bash
npm run dev
```

2. Visit pages:
- Shop: http://localhost:8081/shop
- Product: http://localhost:8081/shop/product-slug
- Admin Login: http://localhost:8081/admin/login

### Common Issues

**CORS Error:**
- Check `backend/.env` has correct `FRONTEND_URL`
- Restart backend after changing .env

**401 Unauthorized:**
- Token expired - login again
- Check localStorage has `auth_token`

**Products not loading:**
- Ensure database has products: `SELECT * FROM products;`
- Check backend logs for errors
- Verify API URL in frontend `.env`

**Images not showing:**
- Product images need full URLs or local paths
- Update `main_image` column with valid image URLs

## 🚀 Next Steps

1. Update remaining customer pages (Cart, Checkout, Auth)
2. Update admin dashboard and management pages
3. Add image upload functionality for products
4. Implement search functionality
5. Add filters (categories, brands, skin types)
6. Create categories management page
7. Implement wishlist functionality
8. Add coupon/discount system UI
9. Create rewards/points system UI
10. Add order tracking functionality

## 📦 API Response Formats

### Products List
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sku": "SK-001",
      "name": "Product Name",
      "slug": "product-name",
      "price": 2500.00,
      "sale_price": 2000.00,
      "stock_quantity": 50,
      "main_image": "/images/product.jpg",
      "category_name": "Skincare",
      "brand": "Brand Name"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 24,
    "total": 100,
    "totalPages": 5
  }
}
```

### Single Product
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Product Name",
    "description": "Full description...",
    "price": 2500.00,
    "sale_price": 2000.00,
    "stock_quantity": 50,
    "main_image": "/images/product.jpg",
    "gallery_images": ["/img1.jpg", "/img2.jpg"],
    "category_name": "Skincare",
    "brand": "Brand Name",
    "sku": "SK-001",
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Great product!",
        "first_name": "John",
        "last_name": "Doe"
      }
    ]
  }
}
```

### Cart
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 123,
      "quantity": 2,
      "name": "Product Name",
      "price": 2500.00,
      "sale_price": 2000.00,
      "main_image": "/images/product.jpg",
      "stock_quantity": 50
    }
  ],
  "total": 4000.00
}
```

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Check backend terminal for API errors
3. Verify database tables have data
4. Ensure both servers are running
5. Check `.env` files are configured correctly

---

**Status:** Backend API is fully functional. Frontend integration is 30% complete.
**Next Priority:** Update Cart, Checkout, and Auth pages for customer functionality.
