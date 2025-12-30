import { Play } from "lucide-react";

const YouTubeSection = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-primary/10 via-pink-soft to-secondary/50">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Video Thumbnail */}
          <div className="relative rounded-2xl overflow-hidden shadow-hover group cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
              <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors" />
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm font-medium text-foreground">Beauty Tips & Tutorials</p>
                <p className="text-xs text-muted-foreground">Watch on Kirei Tube</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center md:text-left">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Discover Beauty<br />
              <span className="text-primary">With Kirei Tube</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto md:mx-0">
              Subscribe to our YouTube channel for daily skincare tips, product reviews, and beauty tutorials from industry experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button className="btn-primary">
                Subscribe Now
              </button>
              <button className="btn-outline">
                Watch Latest
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
