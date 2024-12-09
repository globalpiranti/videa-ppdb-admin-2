import { instanceToPlain, plainToInstance } from "class-transformer";
import client from "../client";
import Path from "../models/path";

export const getPath = (id: string) =>
  client
    .get(`/path/${id}`)
    .then(({ data }) =>
      plainToInstance(Path, data, { excludeExtraneousValues: true })
    );

export const listPath = () =>
  client
    .get("/path")
    .then(({ data }): Path[] =>
      (data as unknown[]).map((item) =>
        plainToInstance(Path, item, { excludeExtraneousValues: true })
      )
    );

export const createPath = (data: Path) =>
  client
    .post("/path", { ...instanceToPlain(data), form: data.form?.id })
    .then(({ data }) =>
      plainToInstance(Path, data, { excludeExtraneousValues: true })
    );

export const updatePath = (data: Path) =>
  client
    .put(`/path/${data.id}`, { ...instanceToPlain(data), form: data.form?.id })
    .then(({ data }) =>
      plainToInstance(Path, data, { excludeExtraneousValues: true })
    );

export const deletePath = (id: string) =>
  client
    .delete(`/path/${id}`)
    .then(({ data }) =>
      plainToInstance(Path, data, { excludeExtraneousValues: true })
    );
