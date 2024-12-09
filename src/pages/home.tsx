import moment from "moment";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useEffect, useMemo } from "react";
import { AxisOptions, Chart } from "react-charts";
import { HiUserAdd } from "react-icons/hi";
import {
  PiGitBranchBold,
  PiHandWithdraw,
  PiReceiptDuotone,
  PiUserBold,
  PiWaveSawtoothBold,
} from "react-icons/pi";
import { NumericFormat } from "react-number-format";
import { Link } from "react-router-dom";
import { listEnrollment } from "../api/endpoints/enrollment";
import { listPayment } from "../api/endpoints/payment";
import { getStatistics } from "../api/endpoints/statistic";
import List from "../components/list";
import { StatsCard } from "../components/stats_card";
import useApi from "../hooks/api";
import useLayout from "../hooks/layout";
import { DailyData, Series } from "../utils/chart";
import { presentationMap } from "./enrollment";
import { statusMap } from "./payment";

export default function Home() {
  const { setActive, setTitle } = useLayout();

  const listEnrollmentApi = useApi(listEnrollment);
  const listPaymentApi = useApi(listPayment);
  const statisticsApi = useApi(getStatistics);

  const primaryAxis = useMemo(
    (): AxisOptions<DailyData> => ({
      getValue: (datum) => datum.date,
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<DailyData>[] => [
      {
        getValue: (datum) => datum.count,
        elementType: "area",
      },
    ],
    []
  );

  useEffect(() => {
    setActive("Dashboard");
    setTitle("Dashboard");

    listEnrollmentApi({ skip: 0, take: 10 }).catch(() => {});
    listPaymentApi({ skip: 0, take: 10 }).catch(() => {});
    statisticsApi({}).catch(() => {});
  }, []);

  return (
    <>
      <div className="p-5 grid grid-flow-row grid-cols-4 gap-5">
        <StatsCard icon={PiGitBranchBold} label="Jalur Pendaftaran">
          {statisticsApi.data?.pathCount || 0}
        </StatsCard>
        <StatsCard
          color="secondary"
          icon={PiWaveSawtoothBold}
          label="Gelombang"
        >
          {statisticsApi.data?.waveCount || 0}
        </StatsCard>
        <StatsCard color="success" icon={PiUserBold} label="Pendaftar Hari Ini">
          {statisticsApi.data?.todayEnrollmentCount || 0}
        </StatsCard>
        <StatsCard
          color="danger"
          icon={PiHandWithdraw}
          label="Pembayaran Hari Ini"
        >
          <NumericFormat
            prefix="Rp"
            thousandSeparator=","
            displayType="text"
            value={statisticsApi.data?.todayPaymentCount || 0}
          />
        </StatsCard>
      </div>
      <div className="p-5 pt-0 flex justify-start items-stretch space-x-5">
        <div className="flex flex-col flex-1 h-[28rem] bg-white rounded border border-neutral-300">
          <div className="p-5 border-b border-neutral-200 text-neutral-900 font-montserrat font-bold">
            Statistik Pendaftar
          </div>
          <div className="p-5 flex-1">
            <div className="w-full h-full">
              {Boolean(statisticsApi.data?.enrollmentStatistics.length) && (
                <Chart
                  options={{
                    data: statisticsApi.data!.enrollmentStatistics.map(
                      (item) => ({
                        label: item.name,
                        data: item.data.map((item) => ({
                          date: moment(item.date).toDate(),
                          count: item.count,
                        })),
                      })
                    ) as Series[],
                    primaryAxis,
                    secondaryAxes,
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/3 h-[28rem] bg-white rounded border border-neutral-300">
          <div className="p-5 border-b border-neutral-200 flex justify-start items-center">
            <span className="text-neutral-900 font-montserrat font-bold flex-1">
              Pendaftar Baru
            </span>
            <Link
              to="/enrollment"
              className="text-sm text-info-600 hover:underline tracking-wide"
            >
              Lebih &raquo;
            </Link>
          </div>
          <OverlayScrollbarsComponent
            className="flex-1"
            options={{ scrollbars: { autoHide: "leave" } }}
            defer
          >
            <div className="flex-1">
              {listEnrollmentApi.data?.map((item, index) => {
                const Render = presentationMap[item.form[0].input];
                return (
                  <div
                    key={`${index}`}
                    className="border-b border-neutral-200 p-5 flex justify-start items-center space-x-5"
                  >
                    <div className="w-12 h-12 bg-gradient-to-b from-secondary-500 to-secondary-600 rounded flex justify-center items-center text-2xl text-secondary-800">
                      <HiUserAdd />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-neutral-900">
                        <Render value={item.form[0].value} />
                      </div>
                      <div className="text-sm">{item.wave?.path?.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </OverlayScrollbarsComponent>
        </div>
      </div>
      <div className="p-5 pt-0 flex justify-start items-stretch space-x-5">
        <div className="flex flex-col flex-1 bg-white rounded border border-neutral-300">
          <div className="p-5 border-b border-neutral-200 flex justify-start items-center">
            <span className="text-neutral-900 font-montserrat font-bold flex-1">
              Pembayaran Baru
            </span>
            <Link
              to="/payment"
              className="text-sm text-info-600 hover:underline tracking-wide"
            >
              Lebih &raquo;
            </Link>
          </div>
          <div className="flex-1">
            {listPaymentApi.data?.map((item, index) => (
              <List
                key={`${index}`}
                icon={PiReceiptDuotone}
                details={[
                  {
                    className: "w-[25%]",
                    element: item.createdAt.format("DD MMMM YYYY HH:mm"),
                  },
                  {
                    className: "w-[15%]",
                    element: (
                      <NumericFormat
                        value={item.amount}
                        prefix="Rp"
                        thousandSeparator=","
                        displayType="text"
                      />
                    ),
                  },
                  {
                    className: `w-[15%] text-right ${
                      statusMap[item.status].color
                    }`,
                    element: statusMap[item.status].as,
                  },
                ]}
                to={`/payment/${item.id}`}
              >
                {item.invoiceNumber}
              </List>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
