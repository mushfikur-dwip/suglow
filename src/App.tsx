import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import Contact from "./pages/Contact";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Dashboard from "./pages/account/Dashboard";
import MyOrders from "./pages/account/MyOrders";
import OrderDetails from "./pages/account/OrderDetails";
import AccountDetails from "./pages/account/AccountDetails";
import VerifyProduct from "./pages/account/VerifyProduct";
import MyCoupons from "./pages/account/MyCoupons";
import MyWishlist from "./pages/account/MyWishlist";
import MyRewards from "./pages/account/MyRewards";
import SavedAddresses from "./pages/account/SavedAddresses";
import NotificationSettings from "./pages/account/NotificationSettings";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminAddProduct from "./pages/admin/AddProduct";
import AdminEditProduct from "./pages/admin/EditProduct";
import AdminOnlineOrders from "./pages/admin/OnlineOrders";
import AdminCustomers from "./pages/admin/Customers";
import AdminCoupons from "./pages/admin/Coupons";
import AdminStock from "./pages/admin/Stock";
import AdminSettings from "./pages/admin/Settings";
import AdminPOS from "./pages/admin/POS";
import AdminReviews from "./pages/admin/Reviews";
import AdminPromotions from "./pages/admin/Promotions";
import AdminPurchase from "./pages/admin/Purchase";
import AdminDamages from "./pages/admin/Damages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Protected Account Routes */}
            <Route path="/account" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/account/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
            <Route path="/account/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
            <Route path="/account/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
            <Route path="/account/details" element={<ProtectedRoute><AccountDetails /></ProtectedRoute>} />
            <Route path="/account/verify" element={<ProtectedRoute><VerifyProduct /></ProtectedRoute>} />
            <Route path="/account/coupons" element={<ProtectedRoute><MyCoupons /></ProtectedRoute>} />
            <Route path="/account/wishlist" element={<ProtectedRoute><MyWishlist /></ProtectedRoute>} />
            <Route path="/account/rewards" element={<ProtectedRoute><MyRewards /></ProtectedRoute>} />
            <Route path="/account/addresses" element={<ProtectedRoute><SavedAddresses /></ProtectedRoute>} />
            <Route path="/account/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
            <Route path="/admin/products" element={<ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>} />
            <Route path="/admin/products/add" element={<ProtectedAdminRoute><AdminAddProduct /></ProtectedAdminRoute>} />
            <Route path="/admin/products/edit/:id" element={<ProtectedAdminRoute><AdminEditProduct /></ProtectedAdminRoute>} />
            <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOnlineOrders /></ProtectedAdminRoute>} />
            <Route path="/admin/customers" element={<ProtectedAdminRoute><AdminCustomers /></ProtectedAdminRoute>} />
            <Route path="/admin/coupons" element={<ProtectedAdminRoute><AdminCoupons /></ProtectedAdminRoute>} />
            <Route path="/admin/stock" element={<ProtectedAdminRoute><AdminStock /></ProtectedAdminRoute>} />
            <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />
            <Route path="/admin/pos" element={<ProtectedAdminRoute><AdminPOS /></ProtectedAdminRoute>} />
            <Route path="/admin/reviews" element={<ProtectedAdminRoute><AdminReviews /></ProtectedAdminRoute>} />
            <Route path="/admin/promotions" element={<ProtectedAdminRoute><AdminPromotions /></ProtectedAdminRoute>} />
            <Route path="/admin/purchase" element={<ProtectedAdminRoute><AdminPurchase /></ProtectedAdminRoute>} />
            <Route path="/admin/damages" element={<ProtectedAdminRoute><AdminDamages /></ProtectedAdminRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
