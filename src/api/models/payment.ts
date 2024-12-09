import { Expose, Type } from "class-transformer";
import Base from "./base";
import Enrollment from "./enrollment";
import PaymentConfirmation from "./payment_confirmation";

export const status = [
  "UNPAID",
  "WAITING_CONFIRMATION",
  "REJECTED",
  "PAID",
] as const;

export default class Payment extends Base {
  @Expose()
  invoiceNumber!: string;

  @Expose()
  amount!: number;

  @Expose()
  status!: (typeof status)[number];

  @Expose()
  notes!: string | null;

  @Type(() => Enrollment)
  @Expose()
  enrollment?: Enrollment;

  @Type(() => PaymentConfirmation)
  @Expose()
  confirmation?: PaymentConfirmation;
}
