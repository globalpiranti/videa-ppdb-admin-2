import { Expose } from "class-transformer";
import Base from "./base";
import Enrollment from "./enrollment";
import Exam from "./exam";

export type Sheet = {
  value: string;
  answer: number;
};

export default class ExamWork extends Base {
  @Expose()
  sheets!: Sheet[];

  @Expose()
  score?: number;

  @Expose()
  enrollment!: Enrollment;

  @Expose()
  exam!: Exam;
}
