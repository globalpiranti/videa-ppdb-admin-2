import { FC, HTMLProps, forwardRef } from "react";

type TextInputProps = {
  label?: string;
  left?: FC;
  containerClassName?: string;
  message?: string;
};

const TextInput = forwardRef<
  HTMLInputElement,
  TextInputProps & HTMLProps<HTMLInputElement>
>(({ label, left: Left, containerClassName, message, ...props }, ref) => (
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
        ref={ref}
        className="flex-1 h-12 px-3 outline-none bg-transparent"
      />
    </div>
    {message && <div className="text-sm text-danger-600 mt-1">{message}</div>}
  </div>
));

export default TextInput;
