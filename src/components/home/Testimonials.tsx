import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Ahmed",
    avatar: "S",
    rating: 5,
    text: "It's a must for every skincare lover. The products are authentic and the delivery is super fast!",
    bgColor: "bg-primary/10",
  },
  {
    id: 2,
    name: "Fatima Khan",
    avatar: "F",
    rating: 5,
    text: "LOVE IT! Best K-beauty store in Bangladesh. Customer service is amazing and products are always fresh.",
    bgColor: "bg-primary",
    textColor: "text-primary-foreground",
  },
  {
    id: 3,
    name: "Nadia Islam",
    avatar: "N",
    rating: 5,
    text: "I've been ordering from Kirei for over a year now. Never disappointed with the quality and authenticity.",
    bgColor: "bg-secondary",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="py-12 bg-background">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setCurrentIndex(Math.min(testimonials.length - 1, currentIndex + 1))}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`${testimonial.bgColor} ${testimonial.textColor || 'text-foreground'} rounded-2xl p-6 relative animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Quote className={`h-8 w-8 mb-4 ${testimonial.textColor ? 'opacity-50' : 'text-primary/30'}`} />
              
              <p className="mb-6 text-sm md:text-base leading-relaxed">
                {testimonial.text}
              </p>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${testimonial.textColor ? 'bg-background/20' : 'bg-primary/20'} flex items-center justify-center font-semibold`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
