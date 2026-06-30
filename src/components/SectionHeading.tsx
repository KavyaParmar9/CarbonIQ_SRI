type SectionHeadingProps = {
  title: string;
  description: string;
};

export default function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="pb-4">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">CarbonIQ</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
