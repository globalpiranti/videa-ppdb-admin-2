import { Expose, Type } from "class-transformer";
import Base from "./base";

export class AnnouncementList {
  @Expose()
  title!: string;

  @Expose()
  description!: string;
}

export default class Announcement extends Base {
  @Expose()
  @Type(() => AnnouncementList)
  list!: AnnouncementList[];

  @Expose()
  status!: "ACCEPTED" | "REJECTED";
}
