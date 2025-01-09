import { ComponentProps, ReactNode } from "react";
import {
  ControlProps,
  MenuProps,
  OptionProps,
  OptionsOrGroups,
  components,
} from "react-select";
import AsyncSelect from "react-select/async";
import { OptionType } from "./select_input";

type AsyncSelectFieldProps = {
  label?: string;
  containerClassName?: string;
  icon?: ReactNode;
  className?: string;
  options?: OptionsOrGroups<OptionType, never>;
  value?: string | string[] | number | number[];
  message?: string;
};

const Control = ({ children, ...rest }: ControlProps) => (
  <components.Control
    {...rest}
    getStyles={() => ({})}
    className={`flex w-full h-12 border border-neutral-300 rounded relative shadow-none! bg-white`}
  >
    {children}
  </components.Control>
);

export default function AsyncSelectInput({
  label,
  containerClassName = "",
  options = [],
  value = "",
  message = "",
  ...props
}: AsyncSelectFieldProps & ComponentProps<AsyncSelect>) {
  const Option = ({ children, ...rest }: OptionProps) => (
    <components.Option
      {...rest}
      getStyles={() => ({})}
      className="p-3 h rounded hover:bg-primary-100 cursor-pointer"
    >
      {children}
    </components.Option>
  );

  const Menu = ({ children, ...rest }: MenuProps) => (
    <components.Menu
      {...rest}
      getStyles={() => ({})}
      className="p-1 bg-white rounded border border-neutral-400 absolute z-10 w-full mt-1"
    >
      {children}
    </components.Menu>
  );

  return (
    <div className={containerClassName}>
      {label && <label>{label}</label>}
      <AsyncSelect
        classNamePrefix={message ? "selectfield-error" : "selectfield"}
        value={
          props.isMulti && Array.isArray(value)
            ? (options || []).filter((el) =>
                (value || []).find((value) => el.value === value)
              ) || []
            : options.find((option) => option.value === value)
        }
        options={options}
        components={{
          Control,
          Option,
          Menu,
        }}
        placeholder="Pilih"
        {...props}
      />
      {message && <div className="text-xs text-danger-600">{message}</div>}
    </div>
  );
}
