import { Button } from "@/components/ui/button";
import { CarStatus } from "@/data/cars";

interface CategoryFilterProps {
  activeCategory: CarStatus | "all";
  onCategoryChange: (category: CarStatus | "all") => void;
}

const categories: { value: CarStatus | "all"; label: string }[] = [
  { value: "all", label: "All Cars" },
  { value: "onroad", label: "On-road Cars" },
  { value: "ready", label: "Ready Cars" },
  { value: "luxury", label: "Luxury Cars" },
  { value: "plate", label: "With Plates" },
];

const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant="category"
          data-active={activeCategory === category.value}
          onClick={() => onCategoryChange(category.value)}
          className="transition-all duration-300"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
