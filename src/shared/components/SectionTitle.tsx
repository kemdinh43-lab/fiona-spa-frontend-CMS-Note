interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  headingLevel?: "h1" | "h2";
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  headingLevel = "h2"
}: SectionTitleProps) {
  const Heading = headingLevel;

  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-olive">{eyebrow}</p>
      ) : null}
      <Heading className="font-display text-3xl font-bold text-cocoa md:text-4xl">{title}</Heading>
      {description ? <p className="mt-4 text-base leading-7 text-taupe">{description}</p> : null}
    </div>
  );
}
