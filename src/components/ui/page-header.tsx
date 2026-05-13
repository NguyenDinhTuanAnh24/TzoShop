import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui-tokens";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, icon, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000] lg:flex-row lg:items-center lg:justify-between lg:p-7", className)}>
      <div className="flex items-center gap-6">
        {icon && (
          <div className="flex h-16 w-16 items-center justify-center border-4 border-black bg-[#FFD93D] text-black shadow-[4px_4px_0px_0px_#000]">
            {icon}
          </div>
        )}
        <div>
          <h1 className={cn(ui.h2, "uppercase")}>{title}</h1>
          {description && (
            <p className="mt-2 font-bold text-black/70">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
