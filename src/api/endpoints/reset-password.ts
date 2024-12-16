import { plainToInstance } from "class-transformer";
import User from "../models/user";
import client from "../client";

export const sendLinkResetPass = (data: { email: string }) =>
  client
    .post("/reset-password/send-email", data)
    .then(({ data }) =>
      plainToInstance(User, data, { excludeExtraneousValues: true })
    );

export const checkToken = (token: string) =>
  client
    .get("/reset-password/check-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) =>
      plainToInstance(User, data, { excludeExtraneousValues: true })
    );

export const updatePassword = (data: { password: string; token: string }) =>
  client
    .put(
      "/reset-password",
      {
        password: data.password,
      },
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    )
    .then(({ data }) =>
      plainToInstance(User, data, { excludeExtraneousValues: true })
    );
