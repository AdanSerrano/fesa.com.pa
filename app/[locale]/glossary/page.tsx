import { memo } from "react";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

interface GlossaryTerm {
  term: string;
  definition: string;
  message?: string;
  examples?: string[];
  advantages?: string[];
  note?: string;
}

interface GlossarySectionData {
  title: string;
  terms: GlossaryTerm[];
  sectionNote?: string;
}

interface GlossaryClosing {
  title: string;
  before?: string;
  after?: string;
  lines?: string[];
}

interface GlossaryBlockData {
  title: string;
  subtitle: string;
  sections: GlossarySectionData[];
  closing: GlossaryClosing;
}

interface TermCardProps {
  term: string;
  definition: string;
  message?: string;
  examples?: string[];
  advantages?: string[];
  note?: string;
  examplesLabel: string;
  advantagesLabel: string;
}

const TermCard = memo(function TermCardComponent({
  term,
  definition,
  message,
  examples,
  advantages,
  note,
  examplesLabel,
  advantagesLabel,
}: TermCardProps) {
  return (
    <div className="rounded-lg bg-muted/30 p-4 space-y-2">
      <div>
        <span className="font-semibold text-foreground">{term}:</span>{" "}
        <span className="text-muted-foreground">{definition}</span>
      </div>

      {message && (
        <div className="border-l-2 border-primary/60 pl-3 text-sm font-medium text-primary">
          {message}
        </div>
      )}

      {examples && examples.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-sm">
          <span className="text-muted-foreground font-medium">
            {examplesLabel}:
          </span>
          {examples.map((example) => (
            <span
              key={example}
              className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {example}
            </span>
          ))}
        </div>
      )}

      {advantages && advantages.length > 0 && (
        <div className="text-sm space-y-1">
          <span className="text-muted-foreground font-medium">
            {advantagesLabel}:
          </span>
          <ul className="list-disc list-inside text-muted-foreground ml-1 space-y-0.5">
            {advantages.map((adv) => (
              <li key={adv}>{adv}</li>
            ))}
          </ul>
        </div>
      )}

      {note && (
        <p className="text-sm italic text-muted-foreground/80">{note}</p>
      )}
    </div>
  );
});
TermCard.displayName = "TermCard";

interface GlossarySectionProps {
  number: number;
  title: string;
  terms: GlossaryTerm[];
  sectionNote?: string;
  examplesLabel: string;
  advantagesLabel: string;
}

const GlossarySection = memo(function GlossarySectionComponent({
  number,
  title,
  terms,
  sectionNote,
  examplesLabel,
  advantagesLabel,
}: GlossarySectionProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">
        {number}. {title}
      </h3>

      <div className="space-y-2">
        {terms.map((t) => (
          <TermCard
            key={t.term}
            term={t.term}
            definition={t.definition}
            message={t.message}
            examples={t.examples}
            advantages={t.advantages}
            note={t.note}
            examplesLabel={examplesLabel}
            advantagesLabel={advantagesLabel}
          />
        ))}
      </div>

      {sectionNote && (
        <div className="rounded-md bg-primary/5 border border-primary/20 px-4 py-2.5 text-sm font-medium text-primary">
          {sectionNote}
        </div>
      )}
    </section>
  );
});
GlossarySection.displayName = "GlossarySection";

interface ClosingCardProps {
  closing: GlossaryClosing;
  beforeLabel?: string;
  afterLabel?: string;
}

const ClosingCard = memo(function ClosingCardComponent({
  closing,
  beforeLabel,
  afterLabel,
}: ClosingCardProps) {
  return (
    <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 space-y-4">
      <h3 className="text-lg font-bold text-primary">{closing.title}</h3>

      {closing.before && closing.after && (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="shrink-0 mt-0.5 text-red-500 font-bold">✕</span>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                {beforeLabel}:
              </span>
              <p className="text-foreground">{closing.before}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="shrink-0 mt-0.5 text-green-500 font-bold">✓</span>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                {afterLabel}:
              </span>
              <p className="text-foreground font-medium">{closing.after}</p>
            </div>
          </div>
        </div>
      )}

      {closing.lines && closing.lines.length > 0 && (
        <ul className="space-y-2">
          {closing.lines.map((line) => (
            <li key={line} className="flex items-start gap-2">
              <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-foreground">{line}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
ClosingCard.displayName = "ClosingCard";

interface GlossaryBlockProps {
  block: GlossaryBlockData;
  examplesLabel: string;
  advantagesLabel: string;
  beforeLabel: string;
  afterLabel: string;
}

const GlossaryBlock = memo(function GlossaryBlockComponent({
  block,
  examplesLabel,
  advantagesLabel,
  beforeLabel,
  afterLabel,
}: GlossaryBlockProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {block.title}
        </h2>
        <p className="text-muted-foreground mt-1">{block.subtitle}</p>
      </div>

      {block.sections.map((section, idx) => (
        <GlossarySection
          key={section.title}
          number={idx + 1}
          title={section.title}
          terms={section.terms}
          sectionNote={section.sectionNote}
          examplesLabel={examplesLabel}
          advantagesLabel={advantagesLabel}
        />
      ))}

      <ClosingCard
        closing={block.closing}
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
      />
    </div>
  );
});
GlossaryBlock.displayName = "GlossaryBlock";

function buildBlock(
  t: Awaited<ReturnType<typeof getTranslations>>,
  prefix: string
): GlossaryBlockData {
  const sectionsRaw = t.raw(`${prefix}.sections`) as Array<{
    title: string;
    sectionNote?: string;
    terms: Array<{
      term: string;
      definition: string;
      message?: string;
      examples?: string[];
      advantages?: string[];
      note?: string;
    }>;
  }>;

  const closingRaw = t.raw(`${prefix}.closing`) as {
    title: string;
    before?: string;
    after?: string;
    lines?: string[];
  };

  return {
    title: t(`${prefix}.title`),
    subtitle: t(`${prefix}.subtitle`),
    sections: sectionsRaw.map((s) => ({
      title: s.title,
      sectionNote: s.sectionNote,
      terms: s.terms.map((term) => ({
        term: term.term,
        definition: term.definition,
        message: term.message,
        examples: term.examples,
        advantages: term.advantages,
        note: term.note,
      })),
    })),
    closing: closingRaw,
  };
}

interface GlossaryPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GlossaryPage({ params }: GlossaryPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("Glossary");

  const techBlock = buildBlock(t, "tech");
  const progBlock = buildBlock(t, "prog");

  const examplesLabel = t("labels.examples");
  const advantagesLabel = t("labels.advantages");
  const beforeLabel = t("labels.before");
  const afterLabel = t("labels.after");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-primary sm:text-3xl">
              Fesa
            </span>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground sm:text-base">
              {t("pageTitle")}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 space-y-16">
        <GlossaryBlock
          block={techBlock}
          examplesLabel={examplesLabel}
          advantagesLabel={advantagesLabel}
          beforeLabel={beforeLabel}
          afterLabel={afterLabel}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-sm text-muted-foreground">
              ···
            </span>
          </div>
        </div>

        <GlossaryBlock
          block={progBlock}
          examplesLabel={examplesLabel}
          advantagesLabel={advantagesLabel}
          beforeLabel={beforeLabel}
          afterLabel={afterLabel}
        />
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>Fesa — Formas Eficientes S.A.</p>
      </footer>
    </div>
  );
}
