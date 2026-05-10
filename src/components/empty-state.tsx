import Link from "next/link";
import { buttonStyles } from "@/lib/ui-styles";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm w-full">
      <h2 className="text-xl font-black text-slate-950">{title}</h2>

      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        {description}
      </p>

      {actionLabel && actionHref && (
        <div className="mt-6">
          <Link href={actionHref} className={buttonStyles.primary}>
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
