import { plainToInstance } from "class-transformer";
import client from "../client";
import Settings from "../models/settings";

export const settings = () =>
  client
    .get("/settings")
    .then(({ data }) =>
      plainToInstance(Settings, data, { excludeExtraneousValues: true })
    );

export const updateSettings = (data: Settings) =>
  client
    .put("/settings/" + data.id, data)
    .then(({ data }) =>
      plainToInstance(Settings, data, { excludeExtraneousValues: true })
    );
