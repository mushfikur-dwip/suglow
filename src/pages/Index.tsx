import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ShopByConcern from "@/components/home/ShopByConcern";
import BestSellingProducts from "@/components/home/BestSellingProducts";
import PromoBanners from "@/components/home/PromoBanners";
import InternationalBrands from "@/components/home/InternationalBrands";
import TrendingProducts from "@/components/home/TrendingProducts";
import Testimonials from "@/components/home/Testimonials";
import NewArrivals from "@/components/home/NewArrivals";
import YouTubeSection from "@/components/home/YouTubeSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroBanner />
        {/* <FeaturedCategories />
        <ShopByConcern /> */}
        <BestSellingProducts />
        <PromoBanners />
        {/* <InternationalBrands /> */}
        <TrendingProducts />
        <Testimonials />
        <NewArrivals />
        {/* <YouTubeSection /> */}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
