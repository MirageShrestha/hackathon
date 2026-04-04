interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ElementType;
}

export const SectionHeader = ({ title, subtitle, icon: Icon }: SectionHeaderProps) => (
  <div className="mb-6">
    <div className="flex items-center gap-2.5 mb-1">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      )}
      <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
    </div>
    <p className="text-sm text-muted-foreground ml-[42px]">{subtitle}</p>
  </div>
);
