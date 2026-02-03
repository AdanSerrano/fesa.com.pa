import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ClientsMarquee } from "@/components/landing/clients-marquee";
import { StatsSection } from "@/components/landing/stats-section";
import { TrustedBySection } from "@/components/landing/trusted-by-section";
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
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: ShieldCheck,
      title: t("pillars.security.title"),
      description: t("pillars.security.description"),
      color: "from-green-500 to-green-600",
    },
    {
      icon: TrendingUp,
      title: t("pillars.savings.title"),
      description: t("pillars.savings.description"),
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Target,
      title: t("pillars.revenue.title"),
      description: t("pillars.revenue.description"),
      color: "from-orange-500 to-orange-600",
    },
  ];

  const ecosystem = [
    {
      icon: Store,
      name: "Fesa Store",
      description: t("ecosystem.store"),
      href: "https://app.fesastore.com.pa",
      color: "from-blue-500 to-blue-600",
      badge: t("ecosystem.storeBadge"),
    },
    {
      icon: Send,
      name: "Fesa Transfer",
      description: t("ecosystem.transfer"),
      href: "#",
      color: "from-green-500 to-green-600",
      badge: null,
    },
    {
      icon: MapPin,
      name: "Fesa Tracking",
      description: t("ecosystem.tracking"),
      href: "#",
      color: "from-orange-500 to-orange-600",
      badge: null,
    },
    {
      icon: Database,
      name: "Fesa Storage",
      description: t("ecosystem.storage"),
      href: "#",
      color: "from-purple-500 to-purple-600",
      badge: null,
    },
    {
      icon: IdCard,
      name: "Fesa ID",
      description: t("ecosystem.id"),
      href: "https://id.fesa.com.pa",
      color: "from-red-500 to-red-600",
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
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute left-1/2 top-1/3 -z-10 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[1000px] rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-60 blur-[100px]" />
          <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />

          <div className="max-w-7xl mx-auto px-4 py-20 md:px-6 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                <AnimatedSection animation="fade-down" delay={0}>
                  <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t("badge")}
                  </Badge>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={100}>
                  <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.1]">
                    {t("title")}{" "}
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                        {t("titleHighlight")}
                      </span>
                      <svg
                        className="absolute -bottom-2 left-0 w-full h-3 text-primary/30"
                        viewBox="0 0 200 12"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 10 Q 50 0, 100 10 T 200 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                      </svg>
                    </span>
                  </h1>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={200}>
                  <p className="mb-8 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                    {t("subtitle")}
                  </p>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={300}>
                  <HeroButtons />
                </AnimatedSection>

                <AnimatedSection animation="fade" delay={400}>
                  <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{t("heroFeatures.feature1")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{t("heroFeatures.feature2")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{t("heroFeatures.feature3")}</span>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={500}>
                  <MobileQuickLinks links={mobileQuickLinks} />
                </AnimatedSection>
              </div>

              <AnimatedSection animation="fade-left" delay={300}>
                <div className="relative hidden lg:block">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-2xl" />
                  <div className="relative grid grid-cols-2 gap-4">
                    {quickLinks.map((link, index) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group flex h-full min-h-[180px] flex-col items-center justify-center gap-4 p-6 rounded-2xl border bg-card/80 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3">
                          <link.icon className="h-8 w-8" />
                        </div>
                        <span className="text-base font-semibold text-center">{link.label}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="border-y bg-muted/30 py-4">
          <ClientsMarquee title={t("clientsMarquee")} />
        </section>

        <section className="py-20 sm:py-28 border-b bg-gradient-to-b from-background via-muted/20 to-background">
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
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {valuePillars.map((pillar, index) => (
                <AnimatedSection key={pillar.title} animation="fade-up" delay={index * 100}>
                  <div className="group relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Card className="relative h-full border-2 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${pillar.color}`} />
                      <CardContent className="p-6 sm:p-8 text-center">
                        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${pillar.color} text-white mb-5 transition-transform group-hover:scale-110 shadow-lg`}>
                          <pillar.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
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

        <section className="py-20 sm:py-28 border-b bg-gradient-to-b from-muted/30 via-background to-muted/20">
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
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {ecosystem.map((app, index) => (
                <AnimatedSection key={app.name} animation="fade-up" delay={index * 100}>
                  <a
                    href={app.href}
                    target={app.href.startsWith("http") ? "_blank" : undefined}
                    rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group block h-full"
                  >
                    <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 overflow-hidden">
                      <CardContent className="p-6 text-center relative">
                        {app.badge && (
                          <Badge
                            variant={app.badge === "Próximamente" ? "outline" : "secondary"}
                            className="absolute top-3 right-3 text-xs"
                          >
                            {app.badge}
                          </Badge>
                        )}
                        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${app.color} text-white mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                          <app.icon className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
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
              ))}
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

        <section className="py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />

          <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
            <AnimatedSection animation="slide-up" delay={0}>
              <div className="text-center max-w-3xl mx-auto">
                <Badge variant="secondary" className="mb-6 px-4 py-2">
                  <Phone className="mr-2 h-4 w-4" />
                  {t("ctaSection.badge")}
                </Badge>
                <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-bold">
                  {t("ctaSection.title")}
                </h2>
                <p className="mb-10 text-muted-foreground text-lg max-w-xl mx-auto">
                  {t("ctaSection.subtitle")}
                </p>

                <CtaButtons />

                <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>{t("ctaSection.benefit1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>{t("ctaSection.benefit2")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>{t("ctaSection.benefit3")}</span>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-muted-foreground/10">
                  <p className="text-sm text-muted-foreground mb-4">{t("ctaSection.contactDirect")}</p>
                  <div className="flex flex-wrap items-center justify-center gap-6">
                    <a
                      href="https://wa.me/50768761381"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      +507 220-0011
                    </a>
                    <a
                      href="mailto:info@fesa.com.pa"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      info@fesa.com.pa
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
