import { Expose, Transform, Type } from "class-transformer";
import moment, { type Moment } from "moment/min/moment-with-locales";

export default abstract class Base {
  @Expose()
  id!: string;

  @Expose()
  @Type(() => Date)
  @Transform(({ value }) => moment(value), { toClassOnly: true })
  createdAt!: Moment;

  @Expose()
  @Type(() => Date)
  @Transform(({ value }) => moment(value), { toClassOnly: true })
  updatedAt!: Moment;
}
