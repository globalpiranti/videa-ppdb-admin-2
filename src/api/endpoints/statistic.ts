import client from "../client";

export const getStatistics = (): Promise<{
  pathCount: number;
  waveCount: number;
  todayEnrollmentCount: number;
  todayPaymentCount: number;
  enrollmentStatistics: {
    name: string;
    data: {
      date: string;
      count: number;
    }[];
  }[];
}> => client.get("/statistic").then(({ data }) => data);
