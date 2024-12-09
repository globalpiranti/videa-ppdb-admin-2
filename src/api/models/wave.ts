import { Expose, Transform, Type } from "class-transformer";
import Base from "./base";
import moment, { type Moment } from "moment/min/moment-with-locales";
import Path from "./path";

export default class Wave extends Base {
  @Expose()
  name!: string;

  @Expose()
  provision!: string;

  @Expose()
  quota!: number;

  @Expose()
  price!: number;

  @Expose()
  @Type(() => Date)
  @Transform(({ value }) => moment(value), { toClassOnly: true })
  openedAt!: Moment;

  @Expose()
  @Type(() => Date)
  @Transform(({ value }) => moment(value), { toClassOnly: true })
  closedAt!: Moment;

  @Expose()
  path?: Path;
}
