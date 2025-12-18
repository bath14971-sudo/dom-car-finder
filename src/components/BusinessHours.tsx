import { Clock } from "lucide-react";

const businessHours = [
  { day: "Monday", hours: "8:00 AM - 8:00 PM" },
  { day: "Tuesday", hours: "8:00 AM - 8:00 PM" },
  { day: "Wednesday", hours: "8:00 AM - 8:00 PM" },
  { day: "Thursday", hours: "8:00 AM - 8:00 PM" },
  { day: "Friday", hours: "8:00 AM - 8:00 PM" },
  { day: "Saturday", hours: "8:00 AM - 6:00 PM" },
  { day: "Sunday", hours: "8:00 AM - 6:00 PM" },
];

const BusinessHours = () => {
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1; // Convert to Monday = 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Business Hours</h3>
      </div>
      
      <div className="space-y-2">
        {businessHours.map((item, index) => (
          <div
            key={item.day}
            className={`flex justify-between items-center py-2 px-3 rounded-lg ${
              index === dayIndex
                ? "bg-primary/10 border border-primary/30"
                : "hover:bg-muted/50"
            }`}
          >
            <span className={`text-sm ${index === dayIndex ? "font-medium text-primary" : "text-muted-foreground"}`}>
              {item.day}
            </span>
            <span className={`text-sm ${index === dayIndex ? "font-medium text-foreground" : "text-muted-foreground"}`}>
              {item.hours}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessHours;
