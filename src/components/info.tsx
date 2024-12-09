import { ReactNode } from "react";

export default function Info({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="pb-3 mb-3 border-b border-dashed border-neutral-400 flex justify-start items-start">
      <span className="flex-1">{title}</span>
      <span className="font-medium text-neutral-900">{children}</span>
    </div>
  );
}
