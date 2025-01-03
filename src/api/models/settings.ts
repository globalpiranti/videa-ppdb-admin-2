import { Expose } from "class-transformer";
import Base from "./base";
import Attachment from "./attachment";

type BannerInfo = {
  title: string;
  description: string;
  image: Attachment | undefined;
};

type Banner = {
  top: BannerInfo;
  bottom: BannerInfo;
};

type Contact = {
  email: string[];
  phone: string[];
  address: string;
};

export default class Settings extends Base {
  @Expose()
  banner!: Banner;

  @Expose()
  contact!: Contact;
}
