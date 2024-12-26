import { Expose } from "class-transformer";

export default class FormCategory {
  @Expose()
  id!: string;

  @Expose()
  formId!: string;

  @Expose()
  name!: string;

  @Expose()
  formsIndex!: number[];
}
