import { plainToInstance } from "class-transformer";
import client from "../client";
import CardTemplate from "../models/card_template";
import Form from "../models/form";

export const listTemplates = () =>
  client
    .get("/card/templates")
    .then(({ data }): { [key: string]: CardTemplate } => data);

export const saveCard = ({
  formId,
  ...data
}: {
  formId: string;
  id: string;
  params: string[];
}) =>
  client
    .post(`/card/${formId}`, data)
    .then(({ data }) =>
      plainToInstance(Form, data, { excludeExtraneousValues: true })
    );
