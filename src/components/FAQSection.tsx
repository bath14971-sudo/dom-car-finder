import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What warranty do you offer?",
    answer: "All our vehicles come with a 6-month warranty covering the engine and transmission. Extended warranty options are also available for purchase.",
  },
  {
    question: "Do you offer financing options?",
    answer: "Yes! We partner with several banks to offer flexible financing options. Our team can help you find the best rates and terms for your situation.",
  },
  {
    question: "Can I trade in my current vehicle?",
    answer: "Absolutely! We accept trade-ins and can offer competitive valuations for your current vehicle. Bring it in for a free assessment.",
  },
  {
    question: "How do I schedule a test drive?",
    answer: "You can schedule a test drive by contacting us via phone, Telegram, or using the contact form on our website. We accommodate both weekday and weekend appointments.",
  },
  {
    question: "What documents do I need to purchase a car?",
    answer: "You will need a valid ID, proof of address, and proof of income if financing. Our team will guide you through all the necessary paperwork.",
  },
  {
    question: "Do you deliver cars outside Phnom Penh?",
    answer: "Yes, we offer delivery services throughout Cambodia. Delivery fees vary based on distance. Contact us for a quote.",
  },
];

const FAQSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Frequently Asked Questions</h3>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-border">
            <AccordionTrigger className="text-left text-sm hover:text-primary">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQSection;
