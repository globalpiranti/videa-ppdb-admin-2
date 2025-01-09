import { plainToInstance } from "class-transformer";
import client from "../client";
import Payment from "../models/payment";
import { Row } from "../row";

export const listPayment = ({
  skip,
  take,
  search,
  status,
}: {
  skip?: number;
  take?: number;
  search?: string;
  status?: string;
}): Promise<Row<Payment>> =>
  client
    .get("/payment", {
      params: {
        skip,
        take,
        search,
        status,
      },
    })
    .then(({ data }) => data);

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

export const needActionPayments = () =>
  client
    .get("/payment/list/need-action")
    .then(({ data }): Payment[] =>
      (data as unknown[]).map((item) =>
        plainToInstance(Payment, item, { excludeExtraneousValues: true })
      )
    );
