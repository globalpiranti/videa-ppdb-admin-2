import { plainToInstance } from "class-transformer";
import client from "../client";
import FormCategory from "../models/form_category";

export const formCategories = ({ formId }: { formId: string }) =>
  client
    .get("/form/category/" + formId)
    .then(({ data }): FormCategory[] =>
      (data as unknown[]).map((item) =>
        plainToInstance(FormCategory, item, { excludeExtraneousValues: true })
      )
    );

export const createFormCategory = (data: FormCategory) =>
  client
    .post("/form/category", data)
    .then(({ data }) =>
      plainToInstance(FormCategory, data, { excludeExtraneousValues: true })
    );

export const updateFormCategory = (data: FormCategory) =>
  client
    .put(`/form/category/${data.id}`, data)
    .then(({ data }) =>
      plainToInstance(FormCategory, data, { excludeExtraneousValues: true })
    );

export const deleteFormCategory = (id: string) =>
  client
    .delete(`/form/category/${id}`)
    .then(({ data }) =>
      plainToInstance(FormCategory, data, { excludeExtraneousValues: true })
    );
