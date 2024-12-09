import moment from "moment/min/moment-with-locales";
import { FC, HTMLProps } from "react";

type DateInputProps = {
  label?: string;
  left?: FC;
  containerClassName?: string;
  message?: string;
  value?: Date;
  onChange?: (value: Date) => void;
};

export default function DateInput({
  label,
  left: Left,
  containerClassName,
  message,
  value,
  onChange,
  ...props
}: Omit<HTMLProps<HTMLInputElement>, keyof DateInputProps> & DateInputProps) {
  return (
    <div className={containerClassName}>
      {label && <label>{label}</label>}
      <div
        className={`relative w-full flex justify-start items-stretch bg-white rounded border ${
          message
            ? "border-danger-500"
            : "border-neutral-300 focus-within:border-primary-300"
        } focus-within:bg-primary-50 overflow-hidden`}
      >
        {Left && (
          <div className="pl-3 flex justify-center items-center">
            <Left />
          </div>
        )}
        <input
          {...props}
          value={value ? moment(value).format("YYYY-MM-DD") : undefined}
          onChange={
            onChange
              ? (e) => {
                  onChange(moment(e.currentTarget.value).toDate());
                }
              : undefined
          }
          type="date"
          className="flex-1 h-12 px-3 outline-none bg-transparent"
        />
      </div>
      {message && <div className="text-sm text-danger-600 mt-1">{message}</div>}
    </div>
  );
}
