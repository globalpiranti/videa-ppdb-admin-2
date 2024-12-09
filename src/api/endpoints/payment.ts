import { plainToInstance } from "class-transformer";
import client from "../client";
import Payment from "../models/payment";

export const listPayment = ({ skip, take }: { skip?: number; take?: number }) =>
  client
    .get("/payment", {
      params: {
        skip,
        take,
      },
    })
    .then(({ data }): Payment[] =>
      (data as unknown[]).map((item) =>
        plainToInstance(Payment, item, { excludeExtraneousValues: true })
      )
    );

export const getPayment = (id: string) =>
  client
    .get(`/payment/${id}`)
    .then(({ data }) =>
      plainToInstance(Payment, data, { excludeExtraneousValues: true })
    );

export const confirmPayment = (id: string) =>
  client
    .patch(`/payment/${id}/confirm`)
    .then(({ data }) =>
      plainToInstance(Payment, data, { excludeExtraneousValues: true })
    );

export const rejectPayment = ({ notes, id }: { id: string; notes: string }) =>
  client
    .patch(`/payment/${id}/reject`, { notes })
    .then(({ data }) =>
      plainToInstance(Payment, data, { excludeExtraneousValues: true })
    );
