import { Moment } from "moment";
import { BiDotsVertical } from "react-icons/bi";
import {
  RiDeleteBin4Fill,
  RiExternalLinkFill,
  RiIdCardFill,
  RiPagesLine,
} from "react-icons/ri";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ContextLink from "./context_link";

export default function FormList({
  id,
  title,
  created,
  onDelete,
}: {
  id: string;
  title: string;
  created: Moment;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="relative rounded border border-neutral-300 bg-white overflow-hidden hover:border-primary-600">
      <div className="aspect-square bg-neutral-100 flex justify-center items-center text-8xl">
        <RiPagesLine className="text-secondary-600" />
      </div>
      <div className="p-5 border-t border-neutral-200 flex justify-start items-end">
        <div className="flex-1">
          <div className="font-medium font-ubuntu">{title}</div>
          <div className="flex justify-start items-center space-x-1 mt-0.5">
            <RiPagesLine className="text-primary-700" />
            <span className="font-light text-sm">
              {created.format("DD/MM/YYYY HH.mm")}
            </span>
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
            to={`/form/${id}`}
            target="_blank"
            icon={RiExternalLinkFill}
          >
            Buka di tab baru
          </ContextLink>
          <ContextLink to={`/form/${id}/card`} icon={RiIdCardFill}>
            Desain Kartu Peserta
          </ContextLink>
          <ContextLink
            to="/"
            onClick={(e) => {
              e.preventDefault();
              onDelete(id);
            }}
            icon={RiDeleteBin4Fill}
          >
            Hapus
          </ContextLink>
        </Popup>
      </div>
      <Link
        to={`/form/${id}`}
        className="absolute top-0 left-0 w-full h-full"
      ></Link>
    </div>
  );
}
