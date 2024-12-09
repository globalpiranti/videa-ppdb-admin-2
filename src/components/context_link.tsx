import { IconType } from "react-icons";
import { Link, LinkProps } from "react-router-dom";

export default function ContextLink({
  className = "",
  children,
  icon: Icon,
  ...props
}: {
  icon: IconType;
  children: string;
} & LinkProps) {
  return (
    <Link
      {...props}
      className={`py-2 px-3 text-sm bg-transparent hover:bg-primary-100 flex justify-start items-center rounded space-x-3 ${className} whitespace-nowrap`}
    >
      <Icon className="text-lg" />
      <span className="flex-1">{children}</span>
    </Link>
  );
}
