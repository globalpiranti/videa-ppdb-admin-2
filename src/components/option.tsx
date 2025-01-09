import { ChangeEvent } from "react";

const Options = ({
  value,
  onChange,
  checked,
  containerClassName,
}: {
  value: string;
  onChange: (val: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  containerClassName: string;
}) => {
  return (
    <div className={containerClassName}>
      <input
        className="w-6 h-6"
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};

export default Options;
