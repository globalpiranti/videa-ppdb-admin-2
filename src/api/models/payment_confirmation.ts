import { Expose, Transform, Type } from "class-transformer";
import moment, { type Moment } from "moment/min/moment-with-locales";
import Attachment from "./attachment";
import Base from "./base";

export default class PaymentConfirmation extends Base {
  @Expose()
  paymentMethod!: string;

  @Expose()
  @Type(() => Date)
  @Transform(({ value }) => moment(value), { toClassOnly: true })
  paymentDate!: Moment;

  @Expose()
  name!: string;

  @Expose()
  senderNumber!: string;

  @Expose()
  refNumber!: string;

  @Expose()
  amount!: number;

  @Expose()
  notes!: string;

  @Expose()
  attachment!: Attachment;
}
