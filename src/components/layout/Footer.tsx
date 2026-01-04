import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="font-display text-3xl font-bold text-primary italic mb-4">
              suGlow
            </h2>
            <p className="text-background/70 text-sm mb-6">
              We are ensuring a delightful shopping experience for every customer.
            </p>
            <div>
              <p className="font-semibold mb-3">Download App</p>
              <div className="flex gap-2">
                <button className="bg-background/10 hover:bg-background/20 px-3 py-2 rounded-lg text-xs transition-colors">
                  Google Play
                </button>
                <button className="bg-background/10 hover:bg-background/20 px-3 py-2 rounded-lg text-xs transition-colors">
                  App Store
                </button>
              </div>
            </div>
          </div>

          {/* suGlow Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">suGlow</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/shop" className="hover:text-primary transition-colors">Shop</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h3 className="font-semibold text-lg mb-4">My Account</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/account" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/account/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
              <li><Link to="/account/wishlist" className="hover:text-primary transition-colors">My Wishlist</Link></li>
              <li><Link to="/account/coupons" className="hover:text-primary transition-colors">My Coupons</Link></li>
              {/* <li><Link to="/account/rewards" className="hover:text-primary transition-colors">My Rewards</Link></li> */}
              <li><Link to="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/faq" className="hover:text-primary transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/account/verify" className="hover:text-primary transition-colors">Verify Product</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods & Social */}
      <div className="border-t border-background/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-background/70 mr-2">Pay With</span>
              {['VISA', 'MC', 'AMEX', 'bKash', 'Nagad', 'Rocket'].map((method) => (
                <span
                  key={method}
                  className="bg-background/10 px-2 py-1 rounded text-xs"
                >
                  {method}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-background/10">
        <div className="container-custom py-4">
          <p className="text-center text-sm text-background/50">
            suGlow © 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
