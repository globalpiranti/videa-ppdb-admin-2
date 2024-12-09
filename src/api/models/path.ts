import { Expose, Transform, Type } from "class-transformer";
import Base from "./base";
import moment, { type Moment } from "moment/min/moment-with-locales";
import Form from "./form";

export default class Path extends Base {
  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  @Type(() => Date)
  @Transform(({ value }) => moment(value), { toClassOnly: true })
  startedAt!: Moment;

  @Expose()
  @Type(() => Date)
  @Transform(({ value }) => moment(value), { toClassOnly: true })
  finishedAt!: Moment;

  @Expose()
  waveCount?: number;

  @Expose()
  form?: Form;
}
