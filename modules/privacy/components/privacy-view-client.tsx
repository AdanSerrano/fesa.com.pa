"use client";

import { memo } from "react";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Home,
  ShieldCheck,
  FileText,
  Mail,
  Phone,
  Globe,
  Scale,
  UserCheck,
  Lock,
  Database,
  Clock,
  ArrowRightLeft,
  Search,
  Ban,
  CheckCircle2,
  Fingerprint,
  Copy,
  Building2,
  ShieldAlert,
  Landmark,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PrivacyLabels } from "../types/privacy.types";

interface PrivacyViewClientProps {
  locale: string;
  labels: PrivacyLabels;
}

const ContactCard = memo(function ContactCard({
  company,
  email,
  phone,
  website,
  delay,
}: {
  company: string;
  email: string;
  phone: string;
  website: string;
  delay: number;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={delay}>
      <div className="group relative h-full overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30">
        <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-bold text-sm">{company}</h4>
          </div>
          <div className="space-y-3 text-sm">
            <a href={`mailto:${email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group/link">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover/link:bg-primary/10 transition-colors">
                <Mail className="h-4 w-4" />
              </div>
              {email}
            </a>
            <a href={`tel:${phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group/link">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover/link:bg-primary/10 transition-colors">
                <Phone className="h-4 w-4" />
              </div>
              {phone}
            </a>
            <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group/link">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover/link:bg-primary/10 transition-colors">
                <Globe className="h-4 w-4" />
              </div>
              {website.replace("https://", "")}
              <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
});
ContactCard.displayName = "ContactCard";

const RightCard = memo(function RightCard({
  icon: Icon,
  title,
  description,
  color,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={delay}>
      <div className="group relative h-full overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20">
        <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative space-y-3">
          <div className={`h-11 w-11 rounded-xl ${color} flex items-center justify-center ring-1 ring-black/5 dark:ring-white/5`}>
            <Icon className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </AnimatedSection>
  );
});
RightCard.displayName = "RightCard";

const SecurityMeasure = memo(function SecurityMeasure({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={delay}>
      <div className="group relative h-full overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-500/20 dark:hover:border-emerald-400/20">
        <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative space-y-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 dark:from-emerald-400/20 dark:to-emerald-400/5 flex items-center justify-center ring-1 ring-emerald-500/10 dark:ring-emerald-400/10">
            <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h4 className="font-bold text-sm">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </AnimatedSection>
  );
});
SecurityMeasure.displayName = "SecurityMeasure";

const SectionDivider = memo(function SectionDivider({
  icon: Icon,
  title,
  subtitle,
  iconColor,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  iconColor: string;
  delay: number;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={delay}>
      <div className="flex items-center gap-4 mb-8">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${iconColor} ring-1 ring-black/5 dark:ring-white/5 shadow-sm`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
});
SectionDivider.displayName = "SectionDivider";

const QuestionBlock = memo(function QuestionBlock({
  number,
  title,
  accentColor,
  children,
  delay,
}: {
  number: number;
  title: string;
  accentColor: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={delay}>
      <div className="group relative overflow-hidden rounded-2xl border bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:bg-card">
        <div className={`absolute top-0 left-0 h-full w-1.5 ${accentColor}`} />
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-4">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentColor} text-white text-sm font-bold flex-shrink-0 shadow-sm`}>
              {number}
            </span>
            <h3 className="font-bold text-lg leading-snug pt-1">{title}</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-4 pl-13">
            {children}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
});
QuestionBlock.displayName = "QuestionBlock";

const BulletList = memo(function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          </div>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
});
BulletList.displayName = "BulletList";

function PrivacyViewClientComponent({ locale, labels }: PrivacyViewClientProps) {
  const rights = [
    { icon: Search, title: labels.q5Right1Title, description: labels.q5Right1Desc, color: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
    { icon: FileText, title: labels.q5Right2Title, description: labels.q5Right2Desc, color: "bg-violet-500/15 text-violet-600 dark:text-violet-400" },
    { icon: Ban, title: labels.q5Right3Title, description: labels.q5Right3Desc, color: "bg-rose-500/15 text-rose-600 dark:text-rose-400" },
    { icon: Fingerprint, title: labels.q5Right4Title, description: labels.q5Right4Desc, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
    { icon: Copy, title: labels.q5Right5Title, description: labels.q5Right5Desc, color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  ];

  const companies = [labels.q3Company1, labels.q3Company2, labels.q3Company3];

  const securityMeasures = [
    { icon: ShieldAlert, title: labels.q8Measure1Title, description: labels.q8Measure1Desc },
    { icon: ShieldCheck, title: labels.q8Measure2Title, description: labels.q8Measure2Desc },
    { icon: Lock, title: labels.q8Measure3Title, description: labels.q8Measure3Desc },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative">
        <div className="absolute inset-0 h-[50vh] bg-gradient-to-b from-primary/8 via-primary/4 to-transparent" />
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[120px] opacity-60" />
        <div className="absolute top-40 left-0 h-[400px] w-[400px] rounded-full bg-violet-500/5 blur-[100px] opacity-50" />

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
            <div className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4 text-xs tracking-wider uppercase px-3 py-1">
                {labels.badge}
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-5 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                {labels.title}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                {labels.subtitle}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                <Clock className="h-3.5 w-3.5" />
                {labels.lastUpdated}: {labels.lastUpdatedDate}
              </div>
            </div>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto space-y-16 sm:space-y-20">

            <section>
              <SectionDivider
                icon={FileText}
                title={labels.generalInfoTitle}
                iconColor="bg-sky-500/15 dark:bg-sky-400/15 text-sky-600 dark:text-sky-400"
                delay={100}
              />
              <div className="space-y-4">
                <QuestionBlock number={1} title={labels.q1Title} accentColor="bg-sky-500" delay={120}>
                  <p>{labels.q1Content}</p>
                </QuestionBlock>
                <QuestionBlock number={2} title={labels.q2Title} accentColor="bg-sky-500" delay={140}>
                  <p>{labels.q2Content}</p>
                </QuestionBlock>
              </div>
            </section>

            <section>
              <SectionDivider
                icon={Mail}
                title={labels.contactSectionTitle}
                iconColor="bg-violet-500/15 dark:bg-violet-400/15 text-violet-600 dark:text-violet-400"
                delay={160}
              />
              <div className="space-y-6">
                <QuestionBlock number={3} title={labels.q3Title} accentColor="bg-violet-500" delay={180}>
                  <p>{labels.q3Content}</p>
                </QuestionBlock>
                <div className="grid gap-4 sm:grid-cols-3">
                  {companies.map((company, index) => (
                    <ContactCard
                      key={company}
                      company={company}
                      email={labels.q3Email}
                      phone={labels.q3Phone}
                      website={labels.q3Website}
                      delay={200 + index * 40}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section>
              <SectionDivider
                icon={Database}
                title={labels.dataUsageTitle}
                iconColor="bg-amber-500/15 dark:bg-amber-400/15 text-amber-600 dark:text-amber-400"
                delay={280}
              />
              <QuestionBlock number={4} title={labels.q4Title} accentColor="bg-amber-500" delay={300}>
                <p>{labels.q4Content}</p>
                <BulletList items={[labels.q4Use1, labels.q4Use2, labels.q4Use3]} />
              </QuestionBlock>
            </section>

            <section>
              <SectionDivider
                icon={Scale}
                title={labels.yourRightsTitle}
                subtitle="ARCO + Portabilidad"
                iconColor="bg-emerald-500/15 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400"
                delay={320}
              />
              <div className="space-y-6">
                <QuestionBlock number={5} title={labels.q5Title} accentColor="bg-emerald-500" delay={340}>
                  <p>{labels.q5Content}</p>
                </QuestionBlock>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {rights.map((right, index) => (
                    <RightCard
                      key={right.title}
                      icon={right.icon}
                      title={right.title}
                      description={right.description}
                      color={right.color}
                      delay={360 + index * 30}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section>
              <SectionDivider
                icon={UserCheck}
                title={labels.yourObligationsTitle}
                iconColor="bg-orange-500/15 dark:bg-orange-400/15 text-orange-600 dark:text-orange-400"
                delay={460}
              />
              <div className="space-y-4">
                <QuestionBlock number={6} title={labels.q6Title} accentColor="bg-orange-500" delay={480}>
                  <p>{labels.q6Content}</p>
                  <BulletList items={[labels.q6Obligation1, labels.q6Obligation2, labels.q6Obligation3]} />
                  <div className="mt-4 rounded-xl bg-muted/50 border border-border/50 p-4">
                    <p className="text-xs italic leading-relaxed">
                      {labels.q6Footer}
                    </p>
                  </div>
                </QuestionBlock>
                <QuestionBlock number={7} title={labels.q7Title} accentColor="bg-orange-500" delay={500}>
                  <p>{labels.q7Content}</p>
                </QuestionBlock>
              </div>
            </section>

            <section>
              <SectionDivider
                icon={Lock}
                title={labels.securityTitle}
                iconColor="bg-teal-500/15 dark:bg-teal-400/15 text-teal-600 dark:text-teal-400"
                delay={520}
              />
              <div className="space-y-6">
                <QuestionBlock number={8} title={labels.q8Title} accentColor="bg-teal-500" delay={540}>
                  <p>{labels.q8Content}</p>
                </QuestionBlock>
                <div className="grid gap-4 sm:grid-cols-3">
                  {securityMeasures.map((measure, index) => (
                    <SecurityMeasure
                      key={measure.title}
                      icon={measure.icon}
                      title={measure.title}
                      description={measure.description}
                      delay={560 + index * 40}
                    />
                  ))}
                </div>
                <QuestionBlock number={9} title={labels.q9Title} accentColor="bg-teal-500" delay={640}>
                  <p>{labels.q9Content}</p>
                </QuestionBlock>
                <QuestionBlock number={10} title={labels.q10Title} accentColor="bg-teal-500" delay={660}>
                  <p>{labels.q10Content}</p>
                </QuestionBlock>
              </div>
            </section>

            <section>
              <SectionDivider
                icon={ArrowRightLeft}
                title={labels.q11Title}
                iconColor="bg-rose-500/15 dark:bg-rose-400/15 text-rose-600 dark:text-rose-400"
                delay={680}
              />
              <div className="space-y-4">
                <QuestionBlock number={11} title={labels.q11Title} accentColor="bg-rose-500" delay={700}>
                  <p>{labels.q11Content}</p>
                  <BulletList items={[labels.q11Condition1, labels.q11Condition2, labels.q11Condition3, labels.q11Condition4]} />
                </QuestionBlock>
                <QuestionBlock number={12} title={labels.q12Title} accentColor="bg-rose-500" delay={720}>
                  <p>{labels.q12Content}</p>
                </QuestionBlock>
              </div>
            </section>

            <AnimatedSection animation="fade-up" delay={740}>
              <div className="relative overflow-hidden rounded-3xl border-2 border-primary/10 bg-gradient-to-br from-primary/8 via-primary/4 to-background p-8 sm:p-12">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-primary/15 blur-[80px]" />
                <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative text-center space-y-5">
                  <div className="inline-flex items-center justify-center">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
                      <Landmark className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">#{13}</Badge>
                  <h3 className="font-bold text-xl sm:text-2xl max-w-lg mx-auto">{labels.q13Title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
                    {labels.q13Content}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={780}>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 sm:p-12 text-center shadow-xl shadow-primary/20">
                <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
                <div className="absolute bottom-0 right-0 h-full w-full bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_50%)]" />

                <div className="relative space-y-5">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm mx-auto">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    {labels.contactSectionTitle}
                  </h3>
                  <p className="text-white/80 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                    {labels.q3Content}
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button size="lg" variant="secondary" className="shadow-lg" asChild>
                      <a href={`mailto:${labels.q3Email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        {labels.q3Email}
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white" asChild>
                      <Link href={`/${locale}/contact`}>
                        {labels.phone}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </div>
    </div>
  );
}

export const PrivacyViewClient = memo(PrivacyViewClientComponent);
PrivacyViewClient.displayName = "PrivacyViewClient";
