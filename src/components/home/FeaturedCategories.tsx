import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { id: 1, name: "Toner/Mist", icon: "💧", color: "bg-blue-50" },
  { id: 2, name: "Serum", icon: "✨", color: "bg-purple-50" },
  { id: 3, name: "Skincare", icon: "🧴", color: "bg-pink-50" },
  { id: 4, name: "Ampoule/Essence", icon: "💎", color: "bg-cyan-50" },
  { id: 5, name: "Body Care/Mist", icon: "🌸", color: "bg-rose-50" },
  { id: 6, name: "Sheet Mask", icon: "🎭", color: "bg-green-50" },
  { id: 7, name: "Makeup", icon: "💄", color: "bg-red-50" },
  { id: 8, name: "Sunscreen", icon: "☀️", color: "bg-yellow-50" },
];

const FeaturedCategories = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Featured Categories</h2>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="flex flex-col items-center gap-3 cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${category.color} flex items-center justify-center text-2xl md:text-3xl group-hover:scale-110 group-hover:shadow-card transition-all duration-300`}
              >
                {category.icon}
              </div>
              <span className="text-xs md:text-sm text-center text-foreground/80 group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
