import { plainToInstance } from "class-transformer";
import client from "../client";
import Enrollment from "../models/enrollment";
import { Row } from "../row";

export type FilteringParams = {
  search?: string;
  path?: string;
  wave?: string;
  status?: string;
  skip?: number;
  take?: number;
  token?: string;
};

export const listEnrollment = ({
  skip,
  take,
  status,
  search,
  path,
  wave,
}: FilteringParams): Promise<Row<Enrollment>> =>
  client
    .get("/enrollment", {
      params: {
        skip,
        take,
        status,
        search,
        path,
        wave,
      },
    })
    .then(({ data }) => data);

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

export const updateEnrollment = (id: string) =>
  client
    .patch(`/enrollment/${id}/update`)
    .then(({ data }) =>
      plainToInstance(Enrollment, data, { excludeExtraneousValues: true })
    );

export const rejectEnrollment = (id: string) =>
  client
    .patch(`/enrollment/${id}/reject`)
    .then(({ data }) =>
      plainToInstance(Enrollment, data, { excludeExtraneousValues: true })
    );

export const needActionEnrollments = () =>
  client
    .get("/enrollment/list/need-action")
    .then(({ data }): Enrollment[] =>
      (data as unknown[]).map((item) =>
        plainToInstance(Enrollment, item, { excludeExtraneousValues: true })
      )
    );
