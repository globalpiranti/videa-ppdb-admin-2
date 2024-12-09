import { instanceToPlain, plainToInstance } from "class-transformer";
import client from "../client";
import PaymentChannel from "../models/payment_channel";

export const listPaymentChannel = () =>
  client
    .get("/payment-channel")
    .then(({ data }): PaymentChannel[] =>
      (data as unknown[]).map((item) =>
        plainToInstance(PaymentChannel, item, { excludeExtraneousValues: true })
      )
    );

export const createPaymentChannel = (data: PaymentChannel) =>
  client
    .post("/payment-channel", {
      ...instanceToPlain(data),
      icon: data.icon!.id,
    })
    .then(({ data }) =>
      plainToInstance(PaymentChannel, data, { excludeExtraneousValues: true })
    );

export const updatePaymentChannel = (data: PaymentChannel) =>
  client
    .put(`/payment-channel/${data.id}`, {
      ...instanceToPlain(data),
      icon: data.icon!.id,
    })
    .then(({ data }) =>
      plainToInstance(PaymentChannel, data, { excludeExtraneousValues: true })
    );

export const deletePaymentChannel = (id: string) =>
  client
    .delete(`/payment-channel/${id}`)
    .then(({ data }) =>
      plainToInstance(PaymentChannel, data, { excludeExtraneousValues: true })
    );
