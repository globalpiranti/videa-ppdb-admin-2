import { Expose } from "class-transformer";
import Attachment from "./attachment";
import Base from "./base";

export default class PaymentChannel extends Base {
  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  icon!: Attachment | null;
}
