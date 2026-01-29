"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Quote, Star } from "lucide-react";

interface TestimonialsSectionProps {
  labels: {
    badge: string;
    title: string;
    subtitle: string;
  };
  testimonials: {
    quote: string;
    author: string;
    role: string;
    company: string;
  }[];
}

const TestimonialCard = memo(function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  index: number;
}) {
  const colors = [
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-purple-500 to-purple-600",
  ];

  return (
    <AnimatedSection animation="fade-up" delay={index * 100}>
      <Card className="h-full border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 overflow-hidden group">
        <CardContent className="p-6 sm:p-8 relative">
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors[index % colors.length]}`} />
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <Quote className="h-8 w-8 text-primary/20 mb-4" />
          <p className="text-muted-foreground leading-relaxed mb-6 italic">
            "{testimonial.quote}"
          </p>
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center text-white font-bold text-lg`}>
              {testimonial.author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold">{testimonial.author}</p>
              <p className="text-sm text-muted-foreground">
                {testimonial.role} · {testimonial.company}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
});

function TestimonialsSectionComponent({ labels, testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 border-b bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <AnimatedSection animation="fade-up" delay={0}>
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Quote className="mr-2 h-3.5 w-3.5" />
              {labels.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {labels.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {labels.subtitle}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export const TestimonialsSection = memo(TestimonialsSectionComponent);
TestimonialsSection.displayName = "TestimonialsSection";
