import { plainToInstance } from "class-transformer";
import client from "../client";
import Announcement from "../models/announcement";

export const announcement = (status: "ACCEPTED" | "REJECTED") =>
  client
    .get("/announcement/" + status)
    .then(({ data }) =>
      plainToInstance(Announcement, data, { excludeExtraneousValues: true })
    );

export const updateAnnouncement = (data: { data: Announcement }) =>
  client
    .put("/announcement/" + data.data.id, { list: data.data.list })
    .then(({ data }) =>
      plainToInstance(Announcement, data, { excludeExtraneousValues: true })
    );

export const createAnnouncement = (data: { data: Announcement }) =>
  client
    .post("/announcement", data)
    .then(({ data }) =>
      plainToInstance(Announcement, data, { excludeExtraneousValues: true })
    );
