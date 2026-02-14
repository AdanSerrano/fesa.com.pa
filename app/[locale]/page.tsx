import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ClientsMarquee } from "@/components/landing/clients-marquee";
import { StatsSection } from "@/components/landing/stats-section";
import { CertificationsSection } from "@/components/landing/certifications-section";
import { FAQSection } from "@/components/landing/faq-section";
import { MobileQuickLinks } from "@/components/landing/mobile-quick-links";
import { BackToTop } from "@/components/landing/back-to-top";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getServicesPageDataAction } from "@/modules/services/actions/services.actions";
import { HomeServicesSection } from "@/modules/services/components/home-services-section";
import { getProductsPageDataAction } from "@/modules/products/actions/products.actions";
import { HomeProductsSection } from "@/modules/products/components/home-products-section";
import { getHomeNewsDataAction } from "@/modules/news/actions/news.actions";
import { HomeNewsSection } from "@/modules/news/components/home-news-section";
import { getFeaturedCatalogsAction } from "@/modules/catalogs/actions/catalogs.actions";
import { HomeCatalogsSection } from "@/modules/catalogs/components/home-catalogs-section";
import { HeroButtons } from "@/components/landing/hero-buttons";
import { CtaButtons } from "@/components/landing/cta-buttons";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Link } from "@/i18n/navigation";
import {
  Briefcase,
  Package,
  Newspaper,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Award,
  Globe,
  ExternalLink,
  Store,
  Send,
  MapPin,
  Database,
  IdCard,
  Zap,
  ShieldCheck,
  Target,
  TrendingUp,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  alternates: {
    canonical: APP_URL,
  },
};

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("HomePage");
  const tServices = await getTranslations("PublicServices");
  const tProducts = await getTranslations("PublicProducts");
  const tNews = await getTranslations("PublicNews");
  const tCatalogs = await getTranslations("PublicCatalogs");

  const [servicesData, productsData, newsData, catalogsData] = await Promise.all([
    getServicesPageDataAction(),
    getProductsPageDataAction(),
    getHomeNewsDataAction(),
    getFeaturedCatalogsAction(4),
  ]);

  const { categories, featuredServices } = servicesData;
  const { categories: productCategories, featuredProducts } = productsData;
  const { categories: newsCategories, featuredNews } = newsData;

  const valuePillars = [
    {
      icon: Zap,
      title: t("pillars.productivity.title"),
      description: t("pillars.productivity.description"),
      color: "from-brand-500 to-brand-600",
    },
    {
      icon: ShieldCheck,
      title: t("pillars.security.title"),
      description: t("pillars.security.description"),
      color: "from-brand-600 to-brand-700",
    },
    {
      icon: TrendingUp,
      title: t("pillars.savings.title"),
      description: t("pillars.savings.description"),
      color: "from-brand-700 to-brand-800",
    },
    {
      icon: Target,
      title: t("pillars.revenue.title"),
      description: t("pillars.revenue.description"),
      color: "from-brand-800 to-brand-900",
    },
  ];

  const ecosystem = [
    {
      icon: Store,
      name: "Fesa Store",
      description: t("ecosystem.store"),
      href: "https://app.fesastore.com.pa",
      color: "from-brand-500 to-brand-600",
      badge: t("ecosystem.storeBadge"),
    },
    {
      icon: Send,
      name: "Fesa Transfer",
      description: t("ecosystem.transfer"),
      href: "https://transfer.fesa.com.pa",
      color: "from-brand-600 to-brand-700",
      badge: null,
    },
    {
      icon: MapPin,
      name: "Fesa Tracking",
      description: t("ecosystem.tracking"),
      href: "https://tracking.fesa.com.pa",
      color: "from-brand-700 to-brand-800",
      badge: null,
    },
    {
      icon: Database,
      name: "Fesa Storage",
      description: t("ecosystem.storage"),
      href: "https://storage.fesa.com.pa",
      color: "from-brand-800 to-brand-900",
      badge: null,
    },
    {
      icon: IdCard,
      name: "Fesa ID",
      description: t("ecosystem.id"),
      href: "https://id.fesa.com.pa",
      color: "from-brand-400 to-brand-500",
      badge: null,
    },
  ];

  const quickLinks = [
    { icon: Briefcase, label: t("quickLinks.services"), href: "/services" },
    { icon: Package, label: t("quickLinks.products"), href: "/products" },
    { icon: BookOpen, label: t("quickLinks.catalogs"), href: "/catalogs" },
    { icon: Newspaper, label: t("quickLinks.news"), href: "/news" },
  ];

  const mobileQuickLinks = [
    { icon: "briefcase", label: t("quickLinks.services"), href: "/services" },
    { icon: "package", label: t("quickLinks.products"), href: "/products" },
    { icon: "bookOpen", label: t("quickLinks.catalogs"), href: "/catalogs" },
    { icon: "newspaper", label: t("quickLinks.news"), href: "/news" },
  ];

  const statsLabels = {
    title: t("statsSection.title"),
    subtitle: t("statsSection.subtitle"),
    stat1Label: t("statsSection.stat1"),
    stat2Label: t("statsSection.stat2"),
    stat3Label: t("statsSection.stat3"),
    stat4Label: t("statsSection.stat4"),
  };

  const certifications = t.raw("certifications") as { icon: string; name: string; description: string }[];
  const faqs = t.raw("faqs") as { question: string; answer: string }[];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="relative h-[calc(100dvh-4rem)] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 hero-mesh-bg">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20 animate-glow">
            <div className="aspect-square w-[32rem] rounded-full bg-gradient-to-br from-primary to-brand-600" />
          </div>
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 blur-3xl opacity-20 animate-float-delayed">
            <div className="aspect-square w-[28rem] rounded-full bg-gradient-to-tr from-primary to-brand-800" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-10 animate-glow">
            <div className="aspect-square w-[24rem] rounded-full bg-gradient-to-br from-brand-400 to-brand-700" />
          </div>

          <div className="relative max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
              <div className="text-center lg:text-left">
                <AnimatedSection animation="fade-up" delay={0}>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6 badge-glow">
                    <Sparkles className="h-4 w-4" />
                    {t("badge")}
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={100}>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                    {t("title")}{" "}
                    <span className="text-gradient-animate">
                      {t("titleHighlight")}
                    </span>
                  </h1>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={200}>
                  <p className="mt-6 text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    {t("subtitle")}
                  </p>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={300}>
                  <div className="mt-8">
                    <HeroButtons />
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={400}>
                  <div className="mt-8 flex items-center justify-center lg:justify-start gap-x-2 sm:gap-x-5 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 shrink-0" />
                      <span>{t("heroFeatures.feature1")}</span>
                    </div>
                    <span className="text-border">·</span>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 shrink-0" />
                      <span>{t("heroFeatures.feature2")}</span>
                    </div>
                    <span className="text-border">·</span>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 shrink-0" />
                      <span>{t("heroFeatures.feature3")}</span>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={500}>
                  <MobileQuickLinks links={mobileQuickLinks} />
                </AnimatedSection>
              </div>

              <AnimatedSection animation="fade-left" delay={200}>
                <div className="hidden lg:block">
                  <div className="relative">
                    <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 to-brand-600/20 rounded-3xl blur-3xl animate-glow" />
                    <div className="relative grid grid-cols-2 gap-4">
                      {quickLinks.map((link, index) => {
                        const floatClass = [
                          "animate-float-hero-1",
                          "animate-float-hero-2",
                          "animate-float-hero-3",
                          "animate-float-hero-4",
                        ][index];
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={`group flex h-full min-h-[200px] flex-col items-center justify-center gap-4 p-8 rounded-3xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-3 hero-card-glow gradient-border-animated ${floatClass}`}
                          >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/20 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:ring-primary/40">
                              <link.icon className="h-7 w-7" />
                            </div>
                            <span className="text-base font-semibold text-center">{link.label}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="bg-muted/40 py-6 border-y border-border/50">
          <ClientsMarquee title={t("clientsMarquee")} />
        </section>

        <section className="py-20 sm:py-28 bg-gradient-to-b from-muted/10 via-brand-100/25 to-background dark:from-muted/10 dark:via-brand-950/20 dark:to-background section-divider-wave">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <AnimatedSection animation="fade-up" delay={0}>
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4">
                  <Award className="mr-2 h-3.5 w-3.5" />
                  {t("pillarsSection.badge")}
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  {t("pillarsSection.title")}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  {t("pillarsSection.subtitle")}
                </p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-transparent to-brand-500" />
                  <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6)", backgroundSize: "200% auto" }} />
                  <div className="h-0.5 w-12 rounded-full bg-gradient-to-l from-transparent to-brand-500" />
                </div>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {valuePillars.map((pillar, index) => (
                <AnimatedSection key={pillar.title} animation="fade-up" delay={index * 100}>
                  <div className="group relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Card className="relative h-full border-2 transition-all duration-300 hover:border-brand-600/30 hover:shadow-xl hover:-translate-y-1 overflow-hidden card-glow-hover">
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${pillar.color}`} />
                      <CardContent className="p-6 sm:p-8 text-center">
                        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${pillar.color} text-white mb-5 transition-transform group-hover:scale-110 shadow-lg`}>
                          <pillar.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-brand-600 transition-colors">
                          {pillar.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {pillar.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <HomeServicesSection
          categories={categories}
          featuredServices={featuredServices}
          locale={locale}
          labels={{
            sectionTitle: tServices("homeSectionTitle"),
            sectionSubtitle: tServices("homeSectionSubtitle"),
            categoriesTitle: tServices("categoriesTitle"),
            featuredTitle: tServices("featuredTitle"),
            viewAll: tServices("viewAll"),
            viewMore: tServices("viewMore"),
          }}
        />

        <HomeProductsSection
          categories={productCategories}
          featuredProducts={featuredProducts}
          locale={locale}
          labels={{
            sectionTitle: tProducts("homeSectionTitle"),
            sectionSubtitle: tProducts("homeSectionSubtitle"),
            categoriesTitle: tProducts("categoriesTitle"),
            featuredTitle: tProducts("featuredTitle"),
            viewAll: tProducts("viewAll"),
            viewMore: tProducts("viewMore"),
          }}
        />

        <StatsSection labels={statsLabels} />

        <section className="py-20 sm:py-28 bg-gradient-to-b from-brand-100/30 via-background to-brand-100/15 dark:from-brand-950/30 dark:via-background dark:to-brand-950/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <AnimatedSection animation="fade-up" delay={0}>
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4">
                  <Globe className="mr-2 h-3.5 w-3.5" />
                  {t("ecosystemSection.badge")}
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  {t("ecosystemSection.title")}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  {t("ecosystemSection.subtitle")}
                </p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-transparent to-brand-500" />
                  <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6)", backgroundSize: "200% auto" }} />
                  <div className="h-0.5 w-12 rounded-full bg-gradient-to-l from-transparent to-brand-500" />
                </div>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {ecosystem.map((app, index) => {
                const isComingSoon = app.href === "#";
                return (
                  <AnimatedSection key={app.name} animation="fade-up" delay={index * 100}>
                    <a
                      href={isComingSoon ? undefined : app.href}
                      target={app.href.startsWith("http") ? "_blank" : undefined}
                      rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={`group block h-full ${isComingSoon ? "opacity-60 grayscale pointer-events-none" : ""}`}
                    >
                      <Card className={`h-full transition-all duration-300 overflow-hidden ${isComingSoon ? "" : "hover:shadow-xl hover:-translate-y-2 hover:border-brand-600/30 card-glow-hover ecosystem-card-shine"}`}>
                        <CardContent className="p-6 text-center relative">
                          {app.badge && (
                            <Badge
                              variant="secondary"
                              className="absolute top-3 right-3 text-xs"
                            >
                              {app.badge}
                            </Badge>
                          )}
                          {isComingSoon && !app.badge && (
                            <Badge
                              variant="outline"
                              className="absolute top-3 right-3 text-xs"
                            >
                              {t("ecosystemSection.comingSoon")}
                            </Badge>
                          )}
                          <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${app.color} text-white mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                            <app.icon className="h-8 w-8" />
                          </div>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-brand-600 transition-colors">
                            {app.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {app.description}
                          </p>
                          {app.href.startsWith("http") && (
                            <div className="mt-4 flex items-center justify-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {t("ecosystemSection.visitApp")}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </a>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        <HomeNewsSection
          categories={newsCategories}
          featuredNews={featuredNews}
          locale={locale}
          labels={{
            sectionTitle: tNews("homeSectionTitle"),
            sectionSubtitle: tNews("homeSectionSubtitle"),
            categoriesTitle: tNews("categoriesTitle"),
            featuredTitle: tNews("featuredTitle"),
            viewAll: tNews("viewAll"),
            viewMore: tNews("viewMore"),
          }}
        />

        <HomeCatalogsSection
          catalogs={catalogsData}
          labels={{
            title: tCatalogs("homeSectionTitle"),
            description: tCatalogs("homeSectionDescription"),
            badge: tCatalogs("homeSectionBadge"),
            viewCatalogs: tCatalogs("viewCatalogs"),
            viewAll: tCatalogs("viewAll"),
            modalTitle: tCatalogs("modalTitle"),
            selectCatalog: tCatalogs("selectCatalog"),
            view: tCatalogs("view"),
            pages: tCatalogs("pages"),
            year: tCatalogs("year"),
          }}
        />

        <CertificationsSection
          labels={{
            badge: t("certificationsSection.badge"),
            title: t("certificationsSection.title"),
            subtitle: t("certificationsSection.subtitle"),
          }}
          certifications={certifications}
        />

        <FAQSection
          labels={{
            badge: t("faqSection.badge"),
            title: t("faqSection.title"),
            subtitle: t("faqSection.subtitle"),
          }}
          faqs={faqs}
        />

        <section className="py-24 sm:py-32 relative overflow-hidden bg-brand-950">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-brand-950 to-brand-900/60 animate-gradient" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-brand-600/15 blur-[120px] animate-glow" />
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-brand-400/10 blur-[100px] animate-float-delayed" />
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-48 w-48 rounded-full bg-brand-500/8 blur-[80px] animate-float" />

          <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
            <AnimatedSection animation="slide-up" delay={0}>
              <div className="text-center max-w-3xl mx-auto">
                <Badge className="mb-6 px-4 py-2 bg-brand-500/15 text-brand-300 border-brand-400/20 hover:bg-brand-500/20">
                  <Phone className="mr-2 h-4 w-4" />
                  {t("ctaSection.badge")}
                </Badge>
                <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  {t("ctaSection.title")}
                </h2>
                <p className="mb-10 text-brand-200/70 text-lg max-w-xl mx-auto">
                  {t("ctaSection.subtitle")}
                </p>

                <CtaButtons />

                <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-brand-200/70">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-400" />
                    <span>{t("ctaSection.benefit1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-400" />
                    <span>{t("ctaSection.benefit2")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-400" />
                    <span>{t("ctaSection.benefit3")}</span>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-brand-700/30">
                  <p className="text-sm text-brand-300/60 mb-4">{t("ctaSection.contactDirect")}</p>
                  <div className="flex flex-wrap items-center justify-center gap-6">
                    <a
                      href="https://wa.me/50768761381"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-brand-400 hover:text-brand-300 hover:underline transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      +507 220-0011
                    </a>
                    <a
                      href="mailto:fesa.tecnologia@fesa.com.pa"
                      className="inline-flex items-center gap-2 text-sm font-medium text-brand-400 hover:text-brand-300 hover:underline transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      fesa.tecnologia@fesa.com.pa
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
