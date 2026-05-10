import type { LucideIcon } from "lucide-react";

type AppIconProps = {
  icon: LucideIcon;
  className?: string;
  size?: number | string;
  strokeWidth?: number;
};

export function AppIcon({ 
  icon: Icon, 
  className, 
  size, 
  strokeWidth = 2 
}: AppIconProps) {
  return (
    <Icon 
      className={className ?? "h-5 w-5"} 
      size={size} 
      strokeWidth={strokeWidth} 
    />
  );
}
