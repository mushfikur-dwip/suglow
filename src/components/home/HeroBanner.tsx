import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const banners = [
  {
    id: 1,
    title: "5th Year Anniversary SALE",
    subtitle: "Up to 50% OFF on Premium Beauty Products",
    buttonText: "Shop Now",
    bgClass: "bg-gradient-to-r from-primary/20 via-pink-soft to-secondary",
  },
  {
    id: 2,
    title: "New Arrivals Collection",
    subtitle: "Discover the latest K-Beauty & J-Beauty trends",
    buttonText: "Explore",
    bgClass: "bg-gradient-to-r from-secondary via-pink-medium/30 to-primary/10",
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="relative overflow-hidden">
      <div className={`${banners[currentSlide].bgClass} transition-all duration-500`}>
        <div className="container-custom py-12 md:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-lg animate-fade-in">
              <span className="inline-block bg-primary text-primary-foreground text-sm font-semibold px-4 py-1 rounded-full mb-4">
                Limited Time Offer
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
                {banners[currentSlide].title}
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                {banners[currentSlide].subtitle}
              </p>
              <button className="btn-primary">
                {banners[currentSlide].buttonText}
              </button>
            </div>

            <div className="relative w-full md:w-1/2 aspect-video md:aspect-square max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl" />
              <div className="absolute inset-4 bg-gradient-to-tl from-secondary to-pink-soft rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-float">
                    <span className="text-4xl md:text-6xl">💄</span>
                  </div>
                  <p className="font-display text-xl md:text-2xl font-semibold text-foreground">
                    Premium Beauty
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background rounded-full flex items-center justify-center shadow-soft transition-all"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background rounded-full flex items-center justify-center shadow-soft transition-all"
      >
        <ChevronRight className="h-5 w-5 text-foreground" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-6 bg-primary"
                : "bg-foreground/30 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
