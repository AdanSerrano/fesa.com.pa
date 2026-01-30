"use client";

import { memo, useActionState } from "react";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Zap,
  Send,
  Home,
  MessageSquare,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { sendContactMessageAction, type ContactFormState } from "../actions/contact.actions";
import { cn } from "@/lib/utils";

interface ContactViewClientProps {
  locale: string;
  labels: {
    badge: string;
    title: string;
    subtitle: string;
    email: string;
    emailValue: string;
    phone: string;
    phoneValue: string;
    location: string;
    locationValue: string;
    sendMessage: string;
    formDescription: string;
    name: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    subject: string;
    subjectPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    businessHoursTitle: string;
    businessHoursValue: string;
    responseTime: string;
    responseTimeValue: string;
    followUs: string;
    faqTitle: string;
    faq1Question: string;
    faq1Answer: string;
    faq2Question: string;
    faq2Answer: string;
    faq3Question: string;
    faq3Answer: string;
    successTitle: string;
    successMessage: string;
    errorTitle: string;
    errorMessage: string;
    breadcrumbHome: string;
  };
}

const ContactInfoCard = memo(function ContactInfoCard({
  icon: Icon,
  title,
  value,
  href,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  href?: string;
  delay: number;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
        <p className="text-base font-medium mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );

  return (
    <AnimatedSection animation="fade-up" delay={delay}>
      {href ? (
        <Link href={href} className="block group">
          <Card className="border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30">
            <CardContent className="p-5">{content}</CardContent>
          </Card>
        </Link>
      ) : (
        <Card className="border-border/50 group">
          <CardContent className="p-5">{content}</CardContent>
        </Card>
      )}
    </AnimatedSection>
  );
});
ContactInfoCard.displayName = "ContactInfoCard";

const QuickInfoCard = memo(function QuickInfoCard({
  icon: Icon,
  title,
  value,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  delay: number;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={delay}>
      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-sm font-medium">{value}</p>
        </div>
      </div>
    </AnimatedSection>
  );
});
QuickInfoCard.displayName = "QuickInfoCard";

const initialState: ContactFormState = {
  success: false,
  message: "",
};

function ContactViewClientComponent({ locale, labels }: ContactViewClientProps) {
  const [state, formAction, isPending] = useActionState(sendContactMessageAction, initialState);

  const faqs = [
    { question: labels.faq1Question, answer: labels.faq1Answer },
    { question: labels.faq2Question, answer: labels.faq2Answer },
    { question: labels.faq3Question, answer: labels.faq3Answer },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 h-[50vh] bg-gradient-to-br from-primary/5 via-primary/10 to-background" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl opacity-50" />
      <div className="absolute top-1/4 left-0 h-64 w-64 rounded-full bg-primary/5 blur-2xl opacity-50" />

      <div className="container mx-auto px-4 py-6 sm:py-10 relative">
        <AnimatedSection animation="fade-down" delay={0}>
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/${locale}`} className="flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5" />
                    {labels.breadcrumbHome}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{labels.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </AnimatedSection>

        <AnimatedSection animation="fade-down" delay={50}>
          <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <MessageSquare className="h-4 w-4" />
              {labels.badge}
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              {labels.title}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              {labels.subtitle}
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <ContactInfoCard
                  icon={Mail}
                  title={labels.email}
                  value={labels.emailValue}
                  href={`mailto:${labels.emailValue}`}
                  delay={100}
                />
                <ContactInfoCard
                  icon={Phone}
                  title={labels.phone}
                  value={labels.phoneValue}
                  href={`tel:${labels.phoneValue.replace(/\s/g, "")}`}
                  delay={150}
                />
                <ContactInfoCard
                  icon={MapPin}
                  title={labels.location}
                  value={labels.locationValue}
                  delay={200}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <QuickInfoCard
                  icon={Clock}
                  title={labels.businessHoursTitle}
                  value={labels.businessHoursValue}
                  delay={250}
                />
                <QuickInfoCard
                  icon={Zap}
                  title={labels.responseTime}
                  value={labels.responseTimeValue}
                  delay={300}
                />
              </div>

              <AnimatedSection animation="fade-up" delay={350}>
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      {labels.faqTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Accordion type="single" collapsible className="w-full">
                      {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                          <AccordionTrigger className="text-sm text-left hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            <AnimatedSection animation="fade-up" delay={200} className="lg:col-span-3">
              <Card className="border-border/50 shadow-xl">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    {labels.sendMessage}
                  </CardTitle>
                  <CardDescription>
                    {labels.formDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {state.success ? (
                    <div className="text-center py-12">
                      <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{labels.successTitle}</h3>
                      <p className="text-muted-foreground">{labels.successMessage}</p>
                    </div>
                  ) : (
                    <form action={formAction} className="space-y-5">
                      {state.message && !state.success && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                          <XCircle className="h-4 w-4 flex-shrink-0" />
                          {labels.errorMessage}
                        </div>
                      )}

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">{labels.name}</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder={labels.namePlaceholder}
                            className={cn(
                              "h-11",
                              state.errors?.name && "border-destructive focus-visible:ring-destructive"
                            )}
                            disabled={isPending}
                          />
                          {state.errors?.name && (
                            <p className="text-xs text-destructive">{state.errors.name[0]}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{labels.email}</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={labels.emailPlaceholder}
                            className={cn(
                              "h-11",
                              state.errors?.email && "border-destructive focus-visible:ring-destructive"
                            )}
                            disabled={isPending}
                          />
                          {state.errors?.email && (
                            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">{labels.subject}</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder={labels.subjectPlaceholder}
                          className={cn(
                            "h-11",
                            state.errors?.subject && "border-destructive focus-visible:ring-destructive"
                          )}
                          disabled={isPending}
                        />
                        {state.errors?.subject && (
                          <p className="text-xs text-destructive">{state.errors.subject[0]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{labels.message}</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder={labels.messagePlaceholder}
                          rows={5}
                          className={cn(
                            "resize-none",
                            state.errors?.message && "border-destructive focus-visible:ring-destructive"
                          )}
                          disabled={isPending}
                        />
                        {state.errors?.message && (
                          <p className="text-xs text-destructive">{state.errors.message[0]}</p>
                        )}
                      </div>

                      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending}>
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {labels.sending}
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {labels.send}
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ContactViewClient = memo(ContactViewClientComponent);
ContactViewClient.displayName = "ContactViewClient";
