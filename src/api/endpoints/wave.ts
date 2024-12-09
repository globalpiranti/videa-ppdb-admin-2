import { instanceToPlain, plainToInstance } from "class-transformer";
import client from "../client";
import Wave from "../models/wave";

export const listWave = (pathId: string) =>
  client
    .get(`/path/${pathId}/waves`)
    .then(({ data }): Wave[] =>
      (data as unknown[]).map((item) =>
        plainToInstance(Wave, item, { excludeExtraneousValues: true })
      )
    );

export const createWave = ({ pathId, data }: { pathId: string; data: Wave }) =>
  client
    .post(`/path/${pathId}/waves`, instanceToPlain(data))
    .then(({ data }) =>
      plainToInstance(Wave, data, { excludeExtraneousValues: true })
    );

export const updateWave = ({ pathId, data }: { pathId: string; data: Wave }) =>
  client
    .put(`/path/${pathId}/waves/${data.id}`, instanceToPlain(data))
    .then(({ data }) =>
      plainToInstance(Wave, data, { excludeExtraneousValues: true })
    );

export const deleteWave = ({ pathId, id }: { pathId: string; id: string }) =>
  client
    .delete(`/path/${pathId}/waves/${id}`)
    .then(({ data }) =>
      plainToInstance(Wave, data, { excludeExtraneousValues: true })
    );
