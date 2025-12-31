import { Shield, Award, Wrench, CreditCard, MapPin, Phone, MessageCircle, Users, Car, Trophy, Clock } from "lucide-react";
import ContactForm from "./ContactForm";
import BusinessHours from "./BusinessHours";
import SocialLinks from "./SocialLinks";

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

const stats = [
  { icon: Clock, value: "10+", label: "Years Experience" },
  { icon: Car, value: "500+", label: "Cars Sold" },
  { icon: Users, value: "450+", label: "Happy Customers" },
  { icon: Trophy, value: "#1", label: "Trusted Dealer" },
];

const teamMembers = [
  {
    name: "Sovann Chen",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Dara Kim",
    role: "Sales Manager",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Sreymom Phan",
    role: "Finance Specialist",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Virak Heng",
    role: "Service Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
];

const AboutSection = () => {
  return (
    <>
      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-light">
        <div className="container mx-auto px-4">
          {/* Story & Stats */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-bordered">
              About <span className="text-gradient-ocean">Car Plus</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Founded in 2014, Car Plus has grown from a small family business to one of Phnom Penh&apos;s most trusted car dealerships. Our mission is to provide high-quality vehicles with transparent histories, warranties, and excellent customer service. We believe in building lasting relationships with our customers based on trust and integrity.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-xl bg-card border-2 border-border"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold text-gradient-ocean mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground text-bordered-light">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Team Members */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-bordered">
              Meet Our <span className="text-gradient-ocean">Team</span>
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="text-center p-6 rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all duration-300"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-primary/20"
                  />
                  <h4 className="font-semibold text-foreground">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-bordered mb-6">
              Visit Our <span className="text-gradient-ocean">Showroom</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Come see our selection of quality vehicles in person. Our friendly team is ready to help you find your perfect car.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border-2 border-border">
                <MapPin className="h-6 w-6 text-primary" />
                <p className="font-medium text-foreground">Address</p>
                <p className="text-sm text-muted-foreground text-center">House 393 Oknha Mong Reththy St. (1928), Phnom Penh 12101</p>
              </div>
              
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border-2 border-border">
                <Phone className="h-6 w-6 text-primary" />
                <p className="font-medium text-foreground">Phone</p>
                <p className="text-sm text-muted-foreground">069 927 292</p>
              </div>
              
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border-2 border-border">
                <MessageCircle className="h-6 w-6 text-primary" />
                <p className="font-medium text-foreground">Telegram</p>
                <p className="text-sm text-muted-foreground">@carplus_cambodia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-bordered">
              Get in <span className="text-gradient-ocean">Touch</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Have questions about a car or want to schedule a test drive? Reach out to us and our team will get back to you promptly.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card p-8 rounded-xl border-2 border-border">
              <h3 className="text-xl font-bold mb-6 text-bordered">Send us a Message</h3>
              <ContactForm />
            </div>

            {/* Info Sidebar */}
            <div className="space-y-8">
              <div className="bg-card p-6 rounded-xl border-2 border-border">
                <BusinessHours />
              </div>
              
              <div className="bg-card p-6 rounded-xl border-2 border-border">
                <SocialLinks />
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default AboutSection;
