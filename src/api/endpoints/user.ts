import { plainToInstance } from "class-transformer";
import client from "../client";
import User from "../models/user";

export const users = () =>
  client
    .get("/user-management")
    .then(({ data }): User[] =>
      (data as unknown[]).map((item) =>
        plainToInstance(User, item, { excludeExtraneousValues: true })
      )
    );

export const createUser = (data: User) =>
  client
    .post("/user-management", data)
    .then(({ data }) =>
      plainToInstance(User, data, { excludeExtraneousValues: true })
    );

export const deleteUser = (id: string) =>
  client
    .delete(`/user-management/${id}`)
    .then(({ data }) =>
      plainToInstance(User, data, { excludeExtraneousValues: true })
    );

export const updateUser = (data: User) =>
  client
    .put(`/user-management/${data.id}`, data)
    .then(({ data }) =>
      plainToInstance(User, data, { excludeExtraneousValues: true })
    );
