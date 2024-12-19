import { Expose } from "class-transformer";
import Base from "./base";

export default class User extends Base {
  @Expose()
  fullname!: string;

  @Expose()
  whatsapp!: string;

  @Expose()
  email!: string;

  @Expose()
  password?: string;

  @Expose()
  token?: string;
}
