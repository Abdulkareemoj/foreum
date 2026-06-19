import { trpc } from "~/lib/trpc";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  const { data: settings } = trpc.settings.getPublicSettings.useQuery();

  const forumName = settings?.forumName ?? "Foreum";
  const logoUrl = settings?.forumLogo;

  if (logoUrl) {
    return (
      <div className={`flex items-center space-x-2 ${className ?? ""}`}>
        <img
          src={logoUrl}
          alt={forumName}
          className="h-8 w-auto max-w-[160px] object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className ?? ""}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <span className="text-lg font-bold text-primary-foreground">
          {forumName.charAt(0).toUpperCase()}
        </span>
      </div>
      <span className="font-heading text-xl font-bold text-foreground">
        {forumName}
      </span>
    </div>
  );
}
