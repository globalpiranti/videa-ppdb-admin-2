import { instanceToPlain, plainToInstance } from "class-transformer";
import client from "../client";
import Form from "../models/form";

export const listForm = () =>
  client
    .get("/form")
    .then(({ data }): Form[] =>
      (data as unknown[]).map((item) =>
        plainToInstance(Form, item, { excludeExtraneousValues: true })
      )
    );

export const getForm = (id: string) =>
  client
    .get(`/form/${id}`)
    .then(({ data }) =>
      plainToInstance(Form, data, { excludeExtraneousValues: true })
    );

export const deleteForm = (id: string) =>
  client
    .delete(`/form/${id}`)
    .then(({ data }) =>
      plainToInstance(Form, data, { excludeExtraneousValues: true })
    );

export const createForm = (data: Form) =>
  client
    .post("/form", instanceToPlain(data))
    .then(({ data }) =>
      plainToInstance(Form, data, { excludeExtraneousValues: true })
    );

export const updateForm = ({ id, ...data }: Form) =>
  client
    .put(`/form/${id}`, instanceToPlain(data))
    .then(({ data }) =>
      plainToInstance(Form, data, { excludeExtraneousValues: true })
    );
