import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const bannerImages = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop",
    alt: "Beauty Products Sale",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=400&fit=crop",
    alt: "Skincare Collection",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&h=400&fit=crop",
    alt: "Makeup Essentials",
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <section className="container-custom py-4">
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {bannerImages.map((banner) => (
            <div key={banner.id} className="w-full flex-shrink-0">
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background rounded-full flex items-center justify-center shadow-md transition-all"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background rounded-full flex items-center justify-center shadow-md transition-all"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-6 bg-primary"
                  : "bg-background/70 hover:bg-background"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
