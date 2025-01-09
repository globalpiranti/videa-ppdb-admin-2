import { FC, HTMLProps } from "react";

type ButtonProps = {
  loading?: boolean;
  sizing?: keyof typeof sizingStyles;
  coloring?: keyof typeof coloringStyles;
  left?: FC;
  right?: FC;
};

const sizes = ["sm", "base"] as const;
const color = ["primary", "danger", "white", "success", "dark"] as const;

const sizingStyles: Record<(typeof sizes)[number], string> = {
  sm: "h-10 px-3 text-sm space-x-2",
  base: "h-12 px-5 text-base space-x-3",
};

const coloringStyles: Record<(typeof color)[number], string> = {
  primary: "bg-primary-600 text-white",
  danger: "bg-danger-600 text-white",
  success: "bg-success-600 text-white",
  white: "bg-white text-neutral-800",
  dark: "bg-neutral-800 text-white",
};

export default function Button({
  loading,
  children,
  sizing = "base",
  left: Left,
  right: Right,
  className,
  coloring = "primary",
  ...props
}: ButtonProps & HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={Boolean(props.disabled || loading)}
      type="submit"
      className={`${sizingStyles[sizing]} ${coloringStyles[coloring]} rounded flex justify-center items-center font-medium ${className}`}
    >
      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          {Left && <Left />} {children && <span>{children}</span>}{" "}
          {Right && <Right />}
        </>
      )}
    </button>
  );
}
