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
import Dashboard from "./pages/account/Dashboard";
import MyOrders from "./pages/account/MyOrders";
import AccountDetails from "./pages/account/AccountDetails";
import VerifyProduct from "./pages/account/VerifyProduct";
import MyCoupons from "./pages/account/MyCoupons";
import MyWishlist from "./pages/account/MyWishlist";
import MyRewards from "./pages/account/MyRewards";
import NotFound from "./pages/NotFound";

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
          <Route path="/account" element={<Dashboard />} />
          <Route path="/account/orders" element={<MyOrders />} />
          <Route path="/account/details" element={<AccountDetails />} />
          <Route path="/account/verify" element={<VerifyProduct />} />
          <Route path="/account/coupons" element={<MyCoupons />} />
          <Route path="/account/wishlist" element={<MyWishlist />} />
          <Route path="/account/rewards" element={<MyRewards />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
