"use client";

import { memo, useCallback, useReducer } from "react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQSectionProps {
  labels: {
    badge: string;
    title: string;
    subtitle: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

type FAQState = {
  openIndex: number | null;
};

type FAQAction = { type: "TOGGLE"; index: number };

function faqReducer(state: FAQState, action: FAQAction): FAQState {
  if (action.type === "TOGGLE") {
    return {
      openIndex: state.openIndex === action.index ? null : action.index,
    };
  }
  return state;
}

const FAQItem = memo(function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: { question: string; answer: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={index * 50}>
      <div
        className={cn(
          "border-2 rounded-xl overflow-hidden transition-all duration-300",
          isOpen ? "border-brand-500/30 shadow-lg border-l-4 border-l-brand-500 shadow-brand-500/5" : "border-muted-foreground/10 hover:border-brand-300/30"
        )}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-5 sm:p-6 text-left bg-card hover:bg-muted/30 transition-colors"
          aria-expanded={isOpen}
        >
          <span className="font-semibold pr-4">{faq.question}</span>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-brand-600 shrink-0 transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        </button>
        <div
          className={cn(
            "grid transition-all duration-300",
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <p className="p-5 sm:p-6 pt-0 text-muted-foreground leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
});

function FAQSectionComponent({ labels, faqs }: FAQSectionProps) {
  const [state, dispatch] = useReducer(faqReducer, { openIndex: null });

  const handleToggle = useCallback((index: number) => {
    dispatch({ type: "TOGGLE", index });
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 border-b">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <AnimatedSection animation="fade-up" delay={0}>
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <HelpCircle className="mr-2 h-3.5 w-3.5" />
              {labels.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {labels.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {labels.subtitle}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-1 w-8 rounded-full bg-brand-400" />
              <div className="h-1 w-16 rounded-full bg-brand-500" />
              <div className="h-1 w-8 rounded-full bg-brand-400" />
            </div>
          </div>
        </AnimatedSection>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={index}
              isOpen={state.openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export const FAQSection = memo(FAQSectionComponent);
FAQSection.displayName = "FAQSection";
