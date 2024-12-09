import { Expose, Transform, Type } from "class-transformer";
import { TextType } from "./text_type";
import Attachment from "../api/models/attachment";
import BaseForm from "./base_form";
import moment, { type Moment } from "moment/min/moment-with-locales";

export class Numeric extends BaseForm<string, "numeric"> {
  input = "numeric" as const;

  @Expose()
  format?: string;
}

export class Text extends BaseForm<string, "text"> {
  input = "text" as const;

  @Expose()
  type: (typeof TextType)[number] = "short_text";
}

export class Calendar extends BaseForm<Moment, "calendar"> {
  input = "calendar" as const;

  @Type(() => Date)
  @Transform(({ value }) => moment(value), { toClassOnly: true })
  @Expose()
  declare value: Moment;
}

export class Dropdown extends BaseForm<string, "dropdown"> {
  input = "dropdown" as const;

  @Expose()
  options: string[] = [];
}

export class Radio extends BaseForm<string, "radio"> {
  input = "radio" as const;

  @Expose()
  options: string[] = [];
}

export class Checkbox extends BaseForm<string[], "checkbox"> {
  input = "checkbox" as const;

  @Transform(({ value }) => (!Array.isArray(value) ? [`${value}`] : value), {
    toClassOnly: true,
  })
  @Expose()
  declare value: string[];

  @Expose()
  options: string[] = [];
}

export class Upload extends BaseForm<Attachment, "upload"> {
  input = "upload" as const;

  @Type(() => Attachment)
  @Expose()
  declare value: Attachment;

  @Expose()
  extensions?: string[];
}
