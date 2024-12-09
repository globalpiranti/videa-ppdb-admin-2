import { Expose } from "class-transformer";

export default abstract class BaseForm<Value, Name> {
  input!: Name;

  @Expose()
  label!: string;

  @Expose()
  value?: Value;

  @Expose()
  required?: boolean = false;
}
