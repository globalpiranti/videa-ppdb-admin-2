import { IconType } from "react-icons";
import { ReactNode } from "react";

export const colors = [
  "primary",
  "secondary",
  "info",
  "warning",
  "danger",
  "success",
  "light",
  "dark",
] as const;

export const colorsStyle: Record<(typeof colors)[number], string> = {
  danger: "from-danger-500 to-danger-600 text-danger-100",
  dark: "from-neutral-800 to-neutral-900 text-neutral-100",
  info: "from-info-500 to-info-600 text-info-100",
  light: "from-neutral-200 to-neutral-300 text-neutral-800",
  primary: "from-primary-600 to-primary-700 text-primary-100",
  secondary: "from-secondary-500 to-secondary-600 text-secondary-800",
  success: "from-success-500 to-success-600 text-success-100",
  warning: "from-warning-500 to-warning-600 text-warning-800",
};

export type StatsCardProps = {
  icon: IconType;
  color?: (typeof colors)[number];
  label?: string;
  children?: ReactNode;
};

export function StatsCard({
  color = "primary",
  label,
  children,
  icon: Icon,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded p-3 border border-neutral-300 flex justify-start items-center space-x-3">
      <div
        className={`w-12 h-12 bg-gradient-to-br rounded flex justify-center items-center text-3xl ${colorsStyle[color]}`}
      >
        <Icon />
      </div>
      <div className="flex-1">
        <div className="font-bold text-lg font-montserrat text-neutral-900">
          {children}
        </div>
        <div className="font-ubuntu font-medium text-sm text-neutral-700">
          {label}
        </div>
      </div>
    </div>
  );
}
