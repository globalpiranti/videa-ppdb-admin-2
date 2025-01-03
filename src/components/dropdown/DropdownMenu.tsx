/* eslint-disable react-hooks/exhaustive-deps */
import {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { DropdownAnimation, DropdownPosition } from "./types";

type DropdownMenuProps = {
  children?: ReactNode;
  position?: DropdownPosition;
  animation?: DropdownAnimation;
  className?: string;
  onShown?: () => void;
  onClose?: () => void;
};

export type DropdownMenuRefObject = {
  toggle: () => void;
  show: (args?: {
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
  }) => void;
  close: () => void;
  onBlur: React.FocusEventHandler<HTMLDivElement>;
};

const DropdownMenu = forwardRef(
  (
    {
      children,
      position = DropdownPosition.BottomRight,
      animation = DropdownAnimation.FromTop,
      className = "",
      onShown,
      onClose,
    }: DropdownMenuProps,
    ref
  ) => {
    const [hide, setHide] = useState(true);
    const [animate, setAnimate] = useState(false);
    const [style, setStyle] = useState({});
    const [mount, setMount] = useState(false);

    const open = () => {
      setHide(false);
    };

    const close = () => {
      setAnimate(false);
    };

    useImperativeHandle(
      ref,
      (): DropdownMenuRefObject => ({
        toggle: () => {
          if (hide) {
            open();
          } else {
            close();
          }
        },
        show: (position = {}) => {
          setStyle(position);
        },
        close,
        onBlur: (event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            close();
          }
        },
      }),
      [hide]
    );

    useEffect(() => {
      if (!hide) {
        setAnimate(true);
        if (onShown) onShown();
      }
    }, [hide]);

    useEffect(() => {
      if (!animate) {
        const timeout = setTimeout(() => {
          setHide(true);
          if (onClose) onClose();
        }, 500);

        return () => {
          clearTimeout(timeout);
        };
      }
    }, [animate]);

    useEffect(() => {
      if (mount) {
        open();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [style]);

    useEffect(() => {
      setMount(true);
    }, []);

    return (
      <div
        className={`${
          hide ? "hidden" : "block"
        } z-20 ${position} w-52 bg-white rounded border shadow border-neutral-300 my-3 text-sm flex flex-col transform transition duration-500 max-h-64 overflow-auto ${
          animate ? "translate-y-0 opacity-100" : animation
        } ${className}`}
        style={style}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    );
  }
);

export default DropdownMenu;
