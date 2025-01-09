import { ReactNode } from "react";
import { IconType } from "react-icons";
import { BiDotsVertical } from "react-icons/bi";
import { Link, LinkProps } from "react-router-dom";
import Popup from "reactjs-popup";
import { PopupProps } from "reactjs-popup/dist/types";

export default function ListWithHeader({
  details,
  popupOptions,
  popup,
  to,
  onClick,
}: {
  icon: IconType;
  details: {
    className?: string;
    element: ReactNode;
  }[];
  popupOptions?: PopupProps;
  popup?: ReactNode;
  to?: LinkProps["to"];
  onClick?: () => void;
}) {
  return (
    <>
      <div className="p-5 border-b border-neutral-300 hover:border-transparent flex justify-start items-center bg-transparent hover:bg-primary-100 relative">
        <div className={`grid grid-cols-6 items-center w-full`}>
          {details.map((item, index) => (
            <div key={`${index}`} className={`text-sm ${item.className || ""}`}>
              {item.element}
            </div>
          ))}
        </div>
        {Boolean(popup) && (
          <div className="px-5 w-[10%] flex justify-end">
            <Popup
              trigger={
                <button
                  type="button"
                  className="p-2 bg-transparent hover:bg-primary-200 rounded-full relative z-10"
                >
                  <BiDotsVertical />
                </button>
              }
              position="left top"
              {...popupOptions}
            >
              {popup}
            </Popup>
          </div>
        )}
        {Boolean(to) && (
          <Link
            onClick={onClick}
            to={to!}
            className="absolute top-0 left-0 w-full h-full"
          />
        )}
      </div>
    </>
  );
}
