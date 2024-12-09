import { Expose } from "class-transformer";
import Base from "./base";

export default class Attachment extends Base {
  @Expose()
  name!: string;

  @Expose()
  mime!: string;

  @Expose()
  size!: number;

  @Expose()
  key!: string;

  @Expose()
  url!: string;
}
