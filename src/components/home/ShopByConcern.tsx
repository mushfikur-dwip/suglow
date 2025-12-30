const concerns = [
  {
    id: 1,
    name: "Hyperpigmentation",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400",
  },
  {
    id: 2,
    name: "Skin care & Acne",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400",
  },
  {
    id: 3,
    name: "Dryness",
    image: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=400",
  },
  {
    id: 4,
    name: "Fine Wrinkle",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400",
  },
  {
    id: 5,
    name: "Firmness",
    image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400",
  },
];

const ShopByConcern = () => {
  return (
    <section className="py-12 bg-secondary/30">
      <div className="container-custom">
        <h2 className="section-title text-center mb-10">Shop By Concern</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {concerns.map((concern, index) => (
            <div
              key={concern.id}
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-square rounded-full overflow-hidden mb-3 shadow-card group-hover:shadow-hover transition-all duration-300">
                <img
                  src={concern.image}
                  alt={concern.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <p className="text-center text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors">
                {concern.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByConcern;
