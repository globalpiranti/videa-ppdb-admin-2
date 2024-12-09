import { RiCheckFill, RiCloseFill } from "react-icons/ri";

type SwitchInputProps = {
  label?: string;
  labelPosition?: "left" | "right";
  containerClassName?: string;
  value?: boolean;
  message?: string;
  onChange?: (args: boolean) => void;
  labelClassName?: string;
};

export default function SwitchInput({
  label,
  containerClassName = "",
  value = false,
  message = "",
  onChange = () => {},
  labelPosition = "right",
  labelClassName = "",
}: SwitchInputProps) {
  return (
    <div className={containerClassName}>
      <div className="flex items-center space-x-2">
        {label && labelPosition === "left" && (
          <label className={`${labelClassName} text-sm`}>{label}</label>
        )}
        <button
          type="button"
          className={`rounded-full ${
            value ? "bg-primary-200" : "bg-neutral-300"
          } w-16 h-8`}
          onClick={() => {
            onChange(!value);
          }}
        >
          <div
            className={
              "w-1/2 h-full flex items-center justify-center text-2xl rounded-full border transform transition duration-300 " +
              (value
                ? "bg-primary-500 translate-x-full border-primary-600"
                : "bg-white translate-x-0 border-neutral-400")
            }
          >
            {value ? (
              <RiCheckFill className="text-white" />
            ) : (
              <RiCloseFill className="text-neutral-700" />
            )}
          </div>
        </button>
        {label && labelPosition === "right" && (
          <label className={`${labelClassName} text-sm`}>{label}</label>
        )}
      </div>
      {message && <div className="text-xs text-danger-600">{message}</div>}
    </div>
  );
}
