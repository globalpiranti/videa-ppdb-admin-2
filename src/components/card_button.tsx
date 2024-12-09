import { HTMLProps } from "react";
import { IconType } from "react-icons";

export default function CardButton({
  icon: Icon,
  children,
  className,
  type,
  ...props
}: {
  icon: IconType;
  children: string;
} & HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type={type as "button" | "submit" | "reset" | undefined}
      className={
        "border border-neutral-300 bg-white rounded w-full flex justify-start items-center " +
        className
      }
    >
      <span className="h-full w-12 bg-neutral-200 border-r border-neutral-300 text-2xl flex justify-center items-center text-primary-600">
        <Icon />
      </span>
      <span className="flex-1 py-3 px-5 text-left font-ubuntu font-medium">
        {children}
      </span>
    </button>
  );
}
