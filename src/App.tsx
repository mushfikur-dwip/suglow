import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AccountDetails from "./pages/account/AccountDetails";
import VerifyProduct from "./pages/account/VerifyProduct";
import MyCoupons from "./pages/account/MyCoupons";
import MyWishlist from "./pages/account/MyWishlist";
import MyRewards from "./pages/account/MyRewards";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/account" element={<Dashboard />} />
          <Route path="/account/orders" element={<MyOrders />} />
          <Route path="/account/details" element={<AccountDetails />} />
          <Route path="/account/verify" element={<VerifyProduct />} />
          <Route path="/account/coupons" element={<MyCoupons />} />
          <Route path="/account/wishlist" element={<MyWishlist />} />
          <Route path="/account/rewards" element={<MyRewards />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOnlineOrders />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/stock" element={<AdminStock />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/pos" element={<AdminPOS />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/promotions" element={<AdminPromotions />} />
          <Route path="/admin/purchase" element={<AdminPurchase />} />
          <Route path="/admin/damages" element={<AdminDamages />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
