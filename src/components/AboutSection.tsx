import { Shield, Award, Wrench, CreditCard, MapPin, Phone, MessageCircle } from "lucide-react";
import GoogleMap from "./GoogleMap";

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
    <section id="about" className="py-24 bg-gradient-light">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-bordered">
            About <span className="text-gradient-ocean">Car Plus</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            At Car Plus, we specialise in sourcing reliable cars from trusted suppliers. 
            Our mission is to provide high-quality vehicles with transparent histories, warranties, 
            and excellent customer service. Located in Phnom Penh, we offer flexible financing 
            and a friendly team ready to assist you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground text-bordered-light">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Location Section with Google Map */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-bordered">
              Visit Our <span className="text-gradient-ocean">Showroom</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Come see our selection of quality vehicles in person. Our friendly team is ready to help you find your perfect car.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Address</p>
                  <p className="text-muted-foreground">Street 271, Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh, Cambodia</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <p className="text-muted-foreground">+855 12 345 678</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Telegram</p>
                  <p className="text-muted-foreground">@carplus_cambodia</p>
                </div>
              </div>
            </div>
          </div>
          
          <GoogleMap className="w-full h-[400px] rounded-xl" />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;