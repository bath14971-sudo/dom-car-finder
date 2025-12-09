import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import slide1Bg from "@/assets/slides/slide-1-christmas.jpg";
import slide2Bg from "@/assets/slides/slide-2-newyear.jpg";
import slide3Bg from "@/assets/slides/slide-3-showroom.jpg";
import slide4Bg from "@/assets/slides/slide-4-coupon.jpg";
import slide5Bg from "@/assets/slides/slide-5-service.jpg";
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
  { image: slide1Bg, alt: "Christmas Promotion" },
  { image: slide2Bg, alt: "New Year Celebration" },
  { image: slide3Bg, alt: "Car Plus Showroom" },
  { image: slide4Bg, alt: "Coupon Deals" },
  { image: slide5Bg, alt: "Quality Service" },
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
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Images - all slides preloaded, visibility controlled */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            current === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.image} alt={slide.alt} className="h-full w-full object-cover object-center" />
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Hidden Carousel for API control */}
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="hidden"
      >
        <CarouselContent>
          {slides.map((_, index) => (
            <CarouselItem key={index} />
          ))}
        </CarouselContent>
      </Carousel>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index
                ? "w-8 bg-ocean"
                : "w-2 bg-foreground/30 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>

      {/* Search Bar at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or model..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 h-14 border-2 bg-background/90 backdrop-blur-sm"
            />
          </div>
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-6 gap-2 bg-background/90 backdrop-blur-sm"
            onClick={onFilterClick}
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filter
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
