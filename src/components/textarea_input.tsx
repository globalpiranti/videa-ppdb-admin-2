import { HTMLProps, forwardRef } from "react";

type TextareaInputProps = {
  label?: string;
  containerClassName?: string;
  message?: string;
};

const TextareaInput = forwardRef<
  HTMLTextAreaElement,
  TextareaInputProps & HTMLProps<HTMLTextAreaElement>
>(({ label, message, containerClassName, ...props }, ref) => (
  <div className={containerClassName}>
    {label && <label>{label}</label>}
    <div className="relative w-full flex justify-start items-stretch bg-white rounded border border-neutral-300 focus-within:border-primary-300 focus-within:bg-primary-50 overflow-hidden">
      <textarea
        {...props}
        ref={ref}
        className="flex-1 p-3 outline-none bg-transparent"
      />
    </div>
    {message && <div className="text-sm text-danger-600 mt-1">{message}</div>}
  </div>
));

export default TextareaInput;
