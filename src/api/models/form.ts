import { Expose, Type } from "class-transformer";
import * as form from "../../utils/form";
import Attachment from "./attachment";
import Base from "./base";
import BaseForm from "../../utils/base_form";

export default class Form extends Base {
  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Type(() => BaseForm, {
    discriminator: {
      property: "input",
      subTypes: Object.keys(form).map((item) => ({
        value: form[item as keyof typeof form],
        name: item.toLowerCase(),
      })),
    },
  })
  @Expose()
  forms!: (
    | form.Calendar
    | form.Checkbox
    | form.Dropdown
    | form.Numeric
    | form.Radio
    | form.Text
    | form.Upload
  )[];

  @Expose()
  logo?: Attachment | null;

  @Expose()
  card?: {
    id: string;
    params: string[];
  } | null;
}
