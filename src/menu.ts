import { IconType } from "react-icons";
import {
  RiAppsLine,
  RiBankCard2Line,
  RiFileCheckLine,
  RiGitBranchLine,
  RiUser6Line,
  RiWallet2Line,
} from "react-icons/ri";
import { LinkProps } from "react-router-dom";

type Menu = {
  title: string;
  icon: IconType;
};

const menus: (Menu & LinkProps)[] = [
  {
    title: "Dashboard",
    icon: RiAppsLine,
    to: "/",
  },
  {
    title: "Formulir",
    icon: RiFileCheckLine,
    to: "/form",
  },
  {
    title: "Jalur Pendaftaran",
    icon: RiGitBranchLine,
    to: "/path",
  },
  {
    title: "Pendaftar",
    icon: RiUser6Line,
    to: "/enrollment",
  },
  {
    title: "Pembayaran",
    icon: RiWallet2Line,
    to: "/payment",
  },
  {
    title: "Metode Pembayaran",
    icon: RiBankCard2Line,
    to: "/payment-channel",
  },
];

export default menus;