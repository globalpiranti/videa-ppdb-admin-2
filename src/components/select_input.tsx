import { ComponentProps } from "react";
import Select, {
  ControlProps,
  MenuProps,
  OptionProps,
  OptionsOrGroups,
  components,
} from "react-select";

export type OptionType = {
  value: string | number | null;
  label: string;
};

type SelectInputProps = {
  label?: string;
  containerClassName?: string;
  className?: string;
  options?: OptionsOrGroups<OptionType, never>;
  value?: string | string[] | number | number[];
  message?: string;
};

export default function SelectInput({
  label,
  containerClassName = "",
  options = [],
  value = "",
  message = "",
  ...props
}: SelectInputProps & ComponentProps<Select>) {
  const Control = ({ children, ...rest }: ControlProps) => (
    <components.Control
      {...rest}
      getStyles={() => ({})}
      className={`flex w-full h-12 bg-white rounded border border-neutral-300 focus-within:border-primary-300 focus-within:bg-primary-50 relative shadow-none!`}
    >
      {children}
    </components.Control>
  );

  const Option = ({ children, ...rest }: OptionProps) => (
    <components.Option
      {...rest}
      getStyles={() => ({})}
      className="p-3 rounded hover:bg-primary-100 cursor-pointer"
    >
      {children}
    </components.Option>
  );

  const Menu = ({ children, ...rest }: MenuProps) => (
    <components.Menu
      {...rest}
      getStyles={() => ({})}
      className="p-1 bg-white rounded border border-neutral-400 absolute z-20 w-full mt-1"
    >
      {children}
    </components.Menu>
  );

  return (
    <div className={containerClassName}>
      {label && <label>{label}</label>}
      <Select
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
        placeholder={"Pilih"}
        {...props}
      />
      {message && <div className="text-xs text-danger-600">{message}</div>}
    </div>
  );
}
