import { Link } from "react-router-dom";
import { Heart, Truck, Shield, Award, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-pink-soft py-16">
          <div className="container-custom text-center">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              About suGlow
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your trusted destination for authentic K-Beauty and J-Beauty products in Bangladesh
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020, suGlow was born out of a passion for bringing the best of Korean and Japanese beauty to Bangladesh. The word "suGlow" (綺麗) means "beautiful" in Japanese, reflecting our commitment to helping everyone discover their natural beauty.
                </p>
                <p>
                  We started as a small team of beauty enthusiasts who struggled to find authentic K-Beauty and J-Beauty products locally. This challenge inspired us to create a platform where beauty lovers could access genuine, high-quality products at fair prices.
                </p>
                <p>
                  Today, we're proud to serve thousands of customers across Bangladesh, offering a curated selection of skincare, makeup, and body care products from the most trusted Asian beauty brands.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-soft to-secondary rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl mb-4 block">💄</span>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  5 Years of Beauty Excellence
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-secondary/30 py-12">
          <div className="container-custom">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground text-center mb-10">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-background rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">100% Authentic</h3>
                <p className="text-sm text-muted-foreground">
                  Every product is sourced directly from brands and authorized distributors
                </p>
              </div>

              <div className="bg-background rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Quick and reliable shipping across Bangladesh
                </p>
              </div>

              <div className="bg-background rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Expert Support</h3>
                <p className="text-sm text-muted-foreground">
                  Beauty experts ready to help you find perfect products
                </p>
              </div>

              <div className="bg-background rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Best Prices</h3>
                <p className="text-sm text-muted-foreground">
                  Competitive pricing with regular discounts and offers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="container-custom py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</p>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-muted-foreground">Products</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">100+</p>
              <p className="text-muted-foreground">Brands</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">5</p>
              <p className="text-muted-foreground">Years of Service</p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-secondary/30 py-12">
          <div className="container-custom">
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A passionate team dedicated to bringing you the best beauty experience
              </p>
            </div>
            <div className="flex justify-center">
              <div className="flex items-center gap-4 bg-background rounded-xl p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">25+ Team Members</p>
                  <p className="text-sm text-muted-foreground">Working to serve you better</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container-custom py-12">
          <div className="bg-gradient-to-r from-primary/10 to-pink-soft rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Ready to Start Your Beauty Journey?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Explore our collection of authentic K-Beauty and J-Beauty products
            </p>
            <Link to="/shop" className="btn-primary">
              Shop Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
