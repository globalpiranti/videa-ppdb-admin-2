export type DailyData = {
  date: Date;
  count: number;
};

export type Series = {
  label: string;
  data: DailyData[];
};

export default function generateSequentialData(
  days: number,
  startCount: number,
  endCount: number
): DailyData[] {
  const data: DailyData[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const count =
      Math.floor(Math.random() * (endCount - startCount + 1)) + startCount;

    data.push({
      date,
      count,
    });
  }

  return data.reverse();
}
