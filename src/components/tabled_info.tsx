import { ReactNode } from "react";

export default function TabledInfo({
  title,
  children,
  titleClassName,
}: {
  title: string;
  titleClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex justify-start items-stretch">
      <div
        className={`p-5 border-r border-neutral-300 bg-white ${titleClassName}`}
      >
        {title}
      </div>
      <div className="p-5 flex-1 font-medium text-neutral-900 bg-neutral-50">
        {children}
      </div>
    </div>
  );
}
