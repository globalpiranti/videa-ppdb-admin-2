import {
  LegacyRef,
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { IconType } from "react-icons";
import { RiCloseFill } from "react-icons/ri";
import { ModalContext, ModalControl } from "../hooks/modal";

export function ModalProvider({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div ref={ref as LegacyRef<HTMLDivElement>}></div>
      {mounted && (
        <ModalContext.Provider
          value={{
            container: ref as MutableRefObject<HTMLDivElement>,
          }}
        >
          {children}
        </ModalContext.Provider>
      )}
    </>
  );
}

export function ModalFooter({ children }: { children?: ReactNode }) {
  return (
    <div className="-mx-5 mt-8 -mb-5 bg-neutral-200 p-5 rounded-b flex sticky -bottom-5 left-0 right-0">
      {children}
    </div>
  );
}

export default function Modal({
  control,
  title,
  icon: Icon,
  children,
}: {
  children?: ReactNode;
  control: ModalControl;
  title: string;
  icon?: IconType;
}) {
  const { container } = useContext(ModalContext);

  return createPortal(
    <>
      {control.shown && (
        <button
          type="button"
          onClick={() => control.hide()}
          className="cursor-default z-20 fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-sm"
        ></button>
      )}
      <div
        className={`z-20 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center p-5 transition duration-300 transform overflow-auto pointer-events-none ${
          !control.shown
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="w-full lg:w-[640px] bg-white rounded shadow max-h-full flex flex-col pointer-events-auto">
          <div className="bg-primary-600 p-5 flex justify-start items-center relative border-b border-primary-700 rounded-t">
            <div className="rounded-r-full h-1 w-1/4 bg-secondary-600 absolute bottom-0 left-0 transform translate-y-1/2"></div>
            {Icon && (
              <div className="w-8 h-8 rounded bg-primary-700 mr-5 flex justify-center items-center text-secondary-500">
                <Icon />
              </div>
            )}
            <div className="flex-1 h-full font-montserrat font-bold text-white text-lg">
              {title}
            </div>
            <button
              type="button"
              className="py-1 px-2 -mr-2 text-primary-800 text-2xl"
              onClick={() => control.hide()}
            >
              <RiCloseFill />
            </button>
          </div>
          <div className="p-5 flex-1 overflow-auto relative">{children}</div>
        </div>
      </div>
    </>,
    container.current
  );
}
