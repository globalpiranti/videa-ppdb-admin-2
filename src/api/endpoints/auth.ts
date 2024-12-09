import { plainToInstance } from "class-transformer";
import client from "../client";
import User from "../models/user";

export const issueNewToken = (data: { username: string; password: string }) =>
  client
    .post("/auth", data)
    .then(({ data }) =>
      plainToInstance(User, data, { excludeExtraneousValues: true })
    );

export const checkToken = (token: string) =>
  client
    .get("/auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) =>
      plainToInstance(User, data, { excludeExtraneousValues: true })
    );

export const revokeToken = () =>
  client
    .delete("/auth")
    .then(({ data }) =>
      plainToInstance(User, data, { excludeExtraneousValues: true })
    );
