"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Mail, MessageSquare, Send, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("Contact");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-background to-muted/20">
      <main className="container px-4 py-8 sm:py-12 md:py-16 sm:px-6 w-full">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <AnimatedSection animation="fade-up" delay={0}>
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
                {t("title")}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                {t("subtitle")}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {/* Contact Info Cards */}
            <div className="space-y-4 sm:space-y-6 lg:col-span-1">
              <AnimatedSection animation="fade-right" delay={100}>
                <Card className="border-border/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm sm:text-base">{t("email")}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                          soporte@nexus.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-right" delay={200}>
                <Card className="border-border/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm sm:text-base">{t("phone")}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          +1 (555) 123-4567
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-right" delay={300}>
                <Card className="border-border/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm sm:text-base">{t("location")}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {t("locationValue")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            {/* Contact Form */}
            <AnimatedSection animation="fade-up" delay={200} className="lg:col-span-2">
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">{t("sendMessage")}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {t("formDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <form className="space-y-4 sm:space-y-6">
                    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm">{t("name")}</Label>
                        <Input
                          id="name"
                          placeholder={t("namePlaceholder")}
                          className="h-10 sm:h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm">{t("email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t("emailPlaceholder")}
                          className="h-10 sm:h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm">{t("subject")}</Label>
                      <Input
                        id="subject"
                        placeholder={t("subjectPlaceholder")}
                        className="h-10 sm:h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm">{t("message")}</Label>
                      <Textarea
                        id="message"
                        placeholder={t("messagePlaceholder")}
                        rows={5}
                        className="resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto">
                      <Send className="mr-2 h-4 w-4" />
                      {t("send")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </main>
    </div>
  );
}
