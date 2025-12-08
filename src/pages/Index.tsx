import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import CarCard from "@/components/CarCard";
import AboutSection from "@/components/AboutSection";
import FilterPanel, { FilterState, defaultFilters } from "@/components/FilterPanel";
import { carsData, CarStatus } from "@/data/cars";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CarStatus | "all">("all");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filteredCars = useMemo(() => {
    return carsData.filter((car) => {
      const matchesSearch =
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = activeCategory === "all" || car.status === activeCategory;

      // Advanced filters
      const matchesYearMin = filters.yearMin === null || car.year >= filters.yearMin;
      const matchesYearMax = filters.yearMax === null || car.year <= filters.yearMax;
      const matchesFuelType = filters.fuelType === null || car.fuelType === filters.fuelType;
      const matchesColor = filters.color === null || car.color === filters.color;
      const matchesPrice = car.price >= filters.priceMin && car.price <= filters.priceMax;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesYearMin &&
        matchesYearMax &&
        matchesFuelType &&
        matchesColor &&
        matchesPrice
      );
    });
  }, [searchQuery, activeCategory, filters]);

  const handleFilterClick = () => {
    setFilterPanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={handleFilterClick}
        />

        {/* Inventory Section */}
        <section id="inventory" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Featured <span className="text-gradient-gold">Inventory</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our handpicked selection of quality vehicles. Each car comes with warranty and full documentation.
              </p>
            </div>

            <div className="mb-10">
              <CategoryFilter
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {filteredCars.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car, index) => (
                  <div
                    key={car.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No cars found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        <AboutSection />
      </main>

      <Footer />

      <FilterPanel
        open={filterPanelOpen}
        onOpenChange={setFilterPanelOpen}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
};

export default Index;
