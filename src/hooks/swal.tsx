import { IconType } from "react-icons";
import { CgClose } from "react-icons/cg";
import {
  PiCheckBold,
  PiExclamationMarkBold,
  PiInfoBold,
  PiQuestionMarkBold,
  PiXBold,
} from "react-icons/pi";
import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const icons: Record<SweetAlertIcon, IconType> = {
  success: PiCheckBold,
  error: PiXBold,
  info: PiInfoBold,
  question: PiQuestionMarkBold,
  warning: PiExclamationMarkBold,
};

export default function useSwal() {
  return ({
    icon,
    cancelButtonText = "Batal",
    confirmButtonText = "Oke",
    ...config
  }: SweetAlertOptions) => {
    const Icon = icon ? icons[icon] : icons["success"];
    return MySwal.fire({
      ...config,
      iconHtml: <Icon />,
      icon,
      cancelButtonText,
      confirmButtonText,
      closeButtonHtml: (
        <div className="text-base text-neutral-500 hover:text-neutral-800 border border-neutral-300 bg-neutral-100 w-8 h-8 m-8 mt-10 flex justify-center items-center rounded">
          <CgClose />
        </div>
      ),
      showCloseButton: true,
    });
  };
}
