import { instanceToPlain, plainToInstance } from "class-transformer";
import client from "../client";
import Exam from "../models/exam";

export const examList = () =>
  client
    .get("/exam")
    .then(({ data }): Exam[] =>
      (data as unknown[]).map((item) =>
        plainToInstance(Exam, item, { excludeExtraneousValues: true })
      )
    );

export const createExam = (data: Exam) =>
  client
    .post("/exam", { ...instanceToPlain(data), path: data.path?.id })
    .then(({ data }) =>
      plainToInstance(Exam, data, { excludeExtraneousValues: true })
    );

export const updateExam = (data: Exam) =>
  client
    .put(`/exam/${data.id}`, { ...instanceToPlain(data), path: data.path?.id })
    .then(({ data }) =>
      plainToInstance(Exam, data, { excludeExtraneousValues: true })
    );

export const deleteExam = (id: string) =>
  client
    .delete(`/exam/${id}`)
    .then(({ data }) =>
      plainToInstance(Exam, data, { excludeExtraneousValues: true })
    );
