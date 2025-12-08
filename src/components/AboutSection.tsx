import { Shield, Award, Wrench, CreditCard } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Warranty Included",
    description: "Six-month warranty on engine and transmission with every purchase.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "All vehicles are thoroughly inspected and certified before sale.",
  },
  {
    icon: Wrench,
    title: "Full Service History",
    description: "Complete documentation and transparent vehicle histories.",
  },
  {
    icon: CreditCard,
    title: "Flexible Financing",
    description: "Easy payment options with financing available for all customers.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            About <span className="text-gradient-gold">Dom Car Store</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            At Dom Car Store, we specialise in sourcing reliable cars from trusted suppliers. 
            Our mission is to provide high-quality vehicles with transparent histories, warranties, 
            and excellent customer service. Located in Phnom Penh, we offer flexible financing 
            and a friendly team ready to assist you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-glow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
