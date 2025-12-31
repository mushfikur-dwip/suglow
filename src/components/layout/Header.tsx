import { Search, Phone, Heart, ShoppingCart, User, Menu, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-xs md:text-sm py-2 px-4 text-center">
        <p>
          Get J-Beauty 15% (Coupon: <span className="font-semibold">JB15</span>) & K-Beauty & Intl. 10% (Coupon: <span className="font-semibold">KB10</span>) & 5% bKash Cashback
        </p>
      </div>

      {/* Main Header */}
      <div className="bg-background border-b border-border">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary italic">
                Kirei
              </h1>
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for product"
                  className="input-search"
                />
              </div>
            </div>

            {/* Support & Actions */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Support - Hidden on mobile */}
              <div className="hidden lg:flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Support</p>
                  <p className="text-sm font-semibold text-foreground">+880 966 679 110</p>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-3">
                <Link to="/account/wishlist" className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <Heart className="h-5 w-5 text-foreground" />
                </Link>
                <Link to="/cart" className="p-2 hover:bg-secondary rounded-full transition-colors relative">
                  <ShoppingCart className="h-5 w-5 text-foreground" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    0
                  </span>
                </Link>
                <Link to="/account" className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <User className="h-5 w-5 text-foreground" />
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6 text-foreground" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for product"
                className="input-search"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:block border-t border-border">
          <div className="container-custom">
            <div className="flex items-center justify-between py-3">
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium">
                Browse Categories
                <ChevronDown className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-8">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/shop" className="nav-link">Shop</Link>
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
              </div>

              <div className="w-40" /> {/* Spacer */}
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border animate-fade-in">
            <div className="container-custom py-4 space-y-3">
              <Link to="/" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>Shop</Link>
              <Link to="/about" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Link to="/cart" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>Cart</Link>
              <Link to="/account" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>My Account</Link>
              <Link to="/auth" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>Login / Register</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
