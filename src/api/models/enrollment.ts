import { Expose, Type } from "class-transformer";
import BaseForm from "../../utils/base_form";
import * as form from "../../utils/form";
import Base from "./base";
import Payment from "./payment";
import Wave from "./wave";

export default class Enrollment extends Base {
  @Expose()
  code!: string;

  @Expose()
  email!: number;

  @Expose()
  status!: "PAYMENT_PENDING" | "DRAFT" | "SUBMITTED" | "ACCEPTED" | "REJECTED";

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
  form!: (
    | form.Calendar
    | form.Checkbox
    | form.Dropdown
    | form.Numeric
    | form.Radio
    | form.Text
    | form.Upload
  )[];

  @Expose()
  wave?: Wave;

  @Expose()
  payment?: Payment;
}
