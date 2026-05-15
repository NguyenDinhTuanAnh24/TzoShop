import { cn } from "@/lib/utils";

type AppLoaderProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
  className?: string;
};

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

export function AppLoader({
  label,
  size = "md",
  variant = "default",
  className,
}: AppLoaderProps) {
  const colorClass =
    variant === "white"
      ? "border-white/40 border-t-white"
      : "border-indigo-100 border-t-indigo-600";

  return (
    <div className={cn("inline-flex items-center justify-center gap-3", className)}>
      <span
        className={cn(
          "inline-block animate-spin rounded-full",
          sizeMap[size],
          colorClass
        )}
        aria-hidden="true"
      />

      {label ? (
        <span className="text-sm font-semibold text-slate-600">{label}</span>
      ) : null}
    </div>
  );
}

export function PageLoader({ label = "Đang tải..." }: { label?: string }) {
  return (
    <div className="flex min-h-[280px] w-full items-center justify-center px-4 sm:min-h-[320px]">
      <div className="rounded-3xl border border-slate-200 bg-white/90 px-6 py-5 shadow-[0_18px_45px_-24px_rgba(79,70,229,0.35)] backdrop-blur-xl">
        <AppLoader label={label} size="md" />
      </div>
    </div>
  );
}

export function ButtonLoader({
  variant = "white",
}: {
  variant?: "white" | "default";
}) {
  return <AppLoader size="sm" variant={variant} />;
}

