import { Expose, Transform, Type } from "class-transformer";
import Base from "./base";
import moment, { type Moment } from "moment";
import ExamWork from "./exam_work";
import Path from "./path";
import Attachment from "./attachment";

export type ExamForm = {
  type: "multiple_choice" | "essay";
  choices: string[];
  answer?: number;
  point?: number;
};

export default class Exam extends Base {
  @Expose()
  name!: string;

  @Expose()
  forms!: ExamForm[];

  @Expose()
  pdf!: Attachment;

  @Expose()
  works?: ExamWork[];

  @Expose()
  paths!: Path[];

  @Expose()
  @Type(() => Date)
  @Transform(({ value }) => moment(value), { toClassOnly: true })
  startAt!: Moment;

  @Expose()
  @Type(() => Date)
  @Transform(({ value }) => moment(value), { toClassOnly: true })
  finishAt!: Moment;
}
