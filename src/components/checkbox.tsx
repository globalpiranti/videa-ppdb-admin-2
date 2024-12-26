import { HTMLProps } from "react";

const Checkbox = ({
  containerClassName,
  ...props
}: {
  containerClassName?: string;
} & HTMLProps<HTMLInputElement>) => {
  return (
    <div className={containerClassName}>
      <input
        type="checkbox"
        className="w-6 h-6 outline-none custom-checkbox"
        {...props}
      />
    </div>
  );
};

export default Checkbox;
