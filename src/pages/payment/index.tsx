import { useEffect } from "react";
import { CgSearch } from "react-icons/cg";
import { PiReceiptDuotone } from "react-icons/pi";
import { NumericFormat } from "react-number-format";
import { listPayment } from "../../api/endpoints/payment";
import { status } from "../../api/models/payment";
import List from "../../components/list";
import NotFound from "../../components/not_found";
import TextInput from "../../components/text_input";
import useApi from "../../hooks/api";
import useLayout from "../../hooks/layout";

export const statusMap: Record<
  (typeof status)[number],
  {
    color: string;
    as: string;
  }
> = {
  PAID: {
    color: "text-success-600",
    as: "DIBAYAR",
  },
  REJECTED: {
    color: "text-danger-600",
    as: "DITUNDA",
  },
  UNPAID: {
    color: "text-warning-700",
    as: "BELUM BAYAR",
  },
  WAITING_CONFIRMATION: {
    color: "text-info-600",
    as: "MENUNGGU",
  },
};

export default function Payment() {
  const { setActive, setTitle } = useLayout();

  const listPaymentApi = useApi(listPayment);

  useEffect(() => {
    setActive("Pembayaran");
    setTitle("Pembayaran");

    listPaymentApi({}).catch(() => {});
  }, []);

  return (
    <>
      <div className="flex justify-start items-center p-5 space-x-3">
        <TextInput
          left={() => <CgSearch />}
          placeholder="Cari..."
          containerClassName="flex-1"
        />
      </div>
      {!listPaymentApi.loading && !listPaymentApi.data?.length ? (
        <NotFound />
      ) : (
        listPaymentApi.data?.map((item, index) => (
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
                className: `w-[15%] text-right ${statusMap[item.status].color}`,
                element: statusMap[item.status].as,
              },
            ]}
            to={`/payment/${item.id}`}
          >
            {item.invoiceNumber}
          </List>
        ))
      )}
    </>
  );
}
