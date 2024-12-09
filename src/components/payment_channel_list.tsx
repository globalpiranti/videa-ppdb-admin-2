import { BiDotsVertical } from "react-icons/bi";
import { RiDeleteBin4Fill, RiEditBoxFill } from "react-icons/ri";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ContextLink from "./context_link";

export default function PaymentChannelList({
  name,
  description,
  onDelete,
  onUpdate,
  imgSrc,
}: {
  imgSrc: string;
  name: string;
  description: string;
  onDelete: () => void;
  onUpdate: () => void;
}) {
  return (
    <div className="relative rounded border border-neutral-300 bg-white overflow-hidden hover:border-primary-600">
      <div className="aspect-square bg-neutral-100 p-5 flex justify-center items-center">
        <img src={imgSrc} className="w-full h-auto" />
      </div>
      <div className="p-5 border-t border-neutral-200 flex justify-start items-end">
        <div className="flex-1">
          <div className="font-medium font-ubuntu">{name}</div>
          <div className="flex justify-start items-center space-x-1 mt-0.5">
            <span className="text-sm line-clamp-1">{description}</span>
          </div>
        </div>
        <Popup
          trigger={
            <button
              type="button"
              className="p-2 -mr-4 -mb-2 relative z-10 bg-transparent hover:bg-neutral-200 rounded-full"
            >
              <BiDotsVertical />
            </button>
          }
          position="top center"
        >
          <ContextLink
            to="/"
            onClick={(e) => {
              e.preventDefault();
              onUpdate();
            }}
            icon={RiEditBoxFill}
          >
            Ubah
          </ContextLink>
          <ContextLink
            to="/"
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            icon={RiDeleteBin4Fill}
          >
            Hapus
          </ContextLink>
        </Popup>
      </div>
    </div>
  );
}
