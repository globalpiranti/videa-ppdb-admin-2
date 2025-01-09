import {
  HTMLProps,
  LegacyRef,
  Ref,
  forwardRef,
  useImperativeHandle,
  useRef,
  FC,
} from "react";

export type DateTimeProps = {
  containerClassName?: string;
  label?: string;
  leftItem?: FC;
  rightItem?: FC;
  message?: string;
};

const DateTime = forwardRef(
  (
    {
      containerClassName = "",
      label,
      leftItem: LeftItem,
      rightItem: RightItem,
      message,
      ...props
    }: DateTimeProps & HTMLProps<HTMLInputElement>,
    ref: Ref<HTMLInputElement | undefined>
  ) => {
    const inputRef = useRef<HTMLInputElement>();

    useImperativeHandle(ref, () => inputRef.current, []);

    return (
      <div className={containerClassName}>
        {label ? <label>{label}</label> : null}
        <div
          onClick={() => {
            inputRef.current?.focus();
          }}
          className="cursor-text h-10 w-full flex justify-start items-center overflow-hidden rounded-md border border-neutral-400"
        >
          {LeftItem ? (
            <div className="pl-3">
              <LeftItem />
            </div>
          ) : null}
          <input
            {...props}
            type="datetime-local"
            ref={inputRef as LegacyRef<HTMLInputElement>}
            className="flex-1 h-full py-1 px-3 outline-none bg-transparent"
          />
          {RightItem ? (
            <div className="pr-3">
              <RightItem />
            </div>
          ) : null}
        </div>
        {message ? (
          <div className="mt-1 text-xs text-danger-600">{message}</div>
        ) : null}
      </div>
    );
  }
);

export default DateTime;
