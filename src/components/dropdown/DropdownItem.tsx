import { HTMLProps, ReactNode } from "react";
import { IconType } from "react-icons";

export type DropdownItemProps = {
  children?: ReactNode;
  iconClassName?: string;
  icon?: IconType;
  type?: "submit" | "reset" | "button";
};

export default function DropdownItem({
  children,
  className,
  icon: Icon,
  iconClassName,
  ...props
}: DropdownItemProps & HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded flex items-center py-4 justify-start text-left bg-white hover:bg-neutral-100 text-neutral-600 text-sm ${className}`}
    >
      {Icon && (
        <div
          className={`w-12 flex items-center justify-center text-neutral-800`}
        >
          <Icon className={`text-lg mb-0.5 ${iconClassName}`} />
        </div>
      )}
      <div className={Icon ? "pr-5" : "px-5"}>{children}</div>
    </button>
  );
}
