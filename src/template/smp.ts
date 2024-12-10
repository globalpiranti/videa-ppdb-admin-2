import Form from "../api/models/form";
import { Calendar, Dropdown, Radio, Text, Upload } from "../utils/form";

const template: {
  name: string;
  forms: Form["forms"];
} = {
  name: "Template PPDB SMP Umum",
  forms: [
    {
      input: "text",
      label: "Nama Lengkap",
      type: "short_text",
      required: true,
    } as Text,
    {
      input: "radio",
      label: "Jenis Kelamin",
      options: ["Laki-laki", "Perempuan"],
      required: true,
    } as Radio,
    {
      input: "text",
      label: "Tempat Lahir",
      type: "short_text",
      required: true,
    } as Text,
    {
      input: "calendar",
      label: "Tanggal Lahir",
      required: true,
    } as Calendar,
    {
      input: "dropdown",
      label: "Agama",
      required: true,
      options: ["Islam", "Katolik", "Protestan", "Hindu", "Budha", "Konghucu"],
    } as Dropdown,
    {
      input: "text",
      type: "long_text",
      label: "Alamat",
      required: true,
    } as Text,
    {
      input: "text",
      type: "short_text",
      label: "No. Telp/HP",
      required: true,
    } as Text,
    {
      input: "text",
      type: "short_text",
      label: "Asal Sekolah",
      required: true,
    } as Text,
    {
      input: "upload",
      label: "SKL (optional)",
      required: false,
      extensions: ["pdf"],
    } as Upload,
    {
      input: "upload",
      label: "Pas Foto",
      required: true,
      extensions: ["jpg", "jpeg", "png"],
    } as Upload,
  ],
};

export default template;
