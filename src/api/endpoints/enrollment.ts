import { plainToInstance } from "class-transformer";
import client from "../client";
import Enrollment from "../models/enrollment";

export const listEnrollment = ({
  skip,
  take,
}: {
  skip?: number;
  take?: number;
}) =>
  client
    .get("/enrollment", {
      params: {
        skip,
        take,
      },
    })
    .then(({ data }): Enrollment[] =>
      (data as unknown[]).map((item) =>
        plainToInstance(Enrollment, item, { excludeExtraneousValues: true })
      )
    );

export const getEnrollment = (id: string) =>
  client
    .get(`/enrollment/${id}`)
    .then(({ data }) =>
      plainToInstance(Enrollment, data, { excludeExtraneousValues: true })
    );

export const acceptEnrollment = (id: string) =>
  client
    .patch(`/enrollment/${id}/accept`)
    .then(({ data }) =>
      plainToInstance(Enrollment, data, { excludeExtraneousValues: true })
    );

export const rejectEnrollment = (id: string) =>
  client
    .patch(`/enrollment/${id}/reject`)
    .then(({ data }) =>
      plainToInstance(Enrollment, data, { excludeExtraneousValues: true })
    );
