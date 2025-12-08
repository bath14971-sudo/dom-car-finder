import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
}

const slides = [
  {
    title: "Welcome to",
    highlight: "Car Plus",
    description: "Your trusted source for quality vehicles in Phnom Penh. Browse our curated collection of reliable daily drivers and luxury rides.",
    stats: [
      { value: "50+", label: "Vehicles" },
      { value: "500+", label: "Happy Customers" },
      { value: "5+", label: "Years Experience" },
    ],
  },
  {
    title: "Premium",
    highlight: "Selection",
    description: "Discover our handpicked collection of luxury and performance vehicles. Every car undergoes rigorous quality inspection.",
    stats: [
      { value: "100%", label: "Quality Checked" },
      { value: "24/7", label: "Support" },
      { value: "Best", label: "Prices" },
    ],
  },
  {
    title: "Easy",
    highlight: "Financing",
    description: "Flexible payment options and competitive financing rates. Get behind the wheel of your dream car today.",
    stats: [
      { value: "0%", label: "Down Payment" },
      { value: "Fast", label: "Approval" },
      { value: "Low", label: "Interest" },
    ],
  },
  {
    title: "Trusted",
    highlight: "Service",
    description: "From purchase to maintenance, we're with you every step. Experience exceptional after-sales support.",
    stats: [
      { value: "Free", label: "Warranty" },
      { value: "Expert", label: "Technicians" },
      { value: "Genuine", label: "Parts" },
    ],
  },
];

const HeroSection = ({
  searchQuery,
  onSearchChange,
  onFilterClick,
}: HeroSectionProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-play
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Luxury car showroom" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
      </div>

      {/* Carousel Content */}
      <div className="relative z-10 container mx-auto px-4">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="w-full max-w-3xl mx-auto"
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="text-center space-y-8 animate-fade-in">
                  <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-bordered">
                      {slide.title}{" "}
                      <span className="text-gradient-ocean">{slide.highlight}</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      {slide.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-center gap-12 pt-4">
                    {slide.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="text-center">
                        <p className="text-3xl font-bold text-gradient-ocean text-bordered-primary">
                          {stat.value}
                        </p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </Carousel>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-8 bg-ocean"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mt-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or model..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 h-14 border-2"
            />
          </div>
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-6 gap-2"
            onClick={onFilterClick}
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filter
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-primary" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
