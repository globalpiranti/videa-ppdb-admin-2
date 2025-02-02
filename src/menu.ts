import { IconType } from "react-icons";
import { FaRegUserCircle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineAnnouncement } from "react-icons/md";
import { PiExam } from "react-icons/pi";
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
    title: "Soal Ujian",
    icon: PiExam,
    to: "/exam",
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
  {
    title: "Pengumuman",
    icon: MdOutlineAnnouncement,
    to: "/announcement",
  },
  {
    title: "Pengguna",
    icon: FaRegUserCircle,
    to: "/user",
  },
  {
    title: "Pengaturan",
    icon: IoSettingsOutline,
    to: "/settings",
  },
];

export default menus;
