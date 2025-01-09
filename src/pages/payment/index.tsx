import { useEffect, useRef, useState } from "react";
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
import moment from "moment";
import { FilteringParams } from "../../api/endpoints/enrollment";
import { Controller, useForm } from "react-hook-form";
import SelectInput, { OptionType } from "../../components/select_input";
import ReactPaginate from "react-paginate";

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
  const [currentPage, setCurrentPage] = useState(1);
  const take = 20;
  const tableRef = useRef<HTMLDivElement | null>(null);

  const listPaymentApi = useApi(listPayment);

  const { control, reset, handleSubmit, watch, setValue } =
    useForm<FilteringParams>({
      defaultValues: {
        search: "",
        path: "",
        wave: "",
        status: "",
      },
    });

  const onFiltering = (data: FilteringParams) => {
    listPaymentApi(data).catch(() => {});
  };
  const handlePageClick = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    const skip = (newPage - 1) * take;
    setCurrentPage(newPage);
    tableRef.current?.scrollTo({ top: 0 });
    handleSubmit((data) => onFiltering({ ...data, skip, take }))();
  };

  useEffect(() => {
    setActive("Pembayaran");
    setTitle("Pembayaran");

    listPaymentApi({ take }).catch(() => {});
  }, []);

  return (
    <div className="w-full h-[90vh] overflow-hidden">
      <div className="flex justify-start items-center p-5 space-x-3">
        <Controller
          name="search"
          control={control}
          rules={{ required: false }}
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={value}
              onChange={onChange}
              left={() => <CgSearch />}
              placeholder="Cari..."
              containerClassName="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(onFiltering)();
                }
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="status"
          rules={{ required: false }}
          render={({ field: { value, onChange } }) => (
            <SelectInput
              className="w-[160px]"
              placeholder="Semua"
              value={value}
              options={[
                { label: "Semua", value: "" },
                { label: "Menunggu Konfirmasi", value: "WAITING_CONFIRMATION" },
                { label: "Dibayar", value: "PAID" },
                { label: "Belum Bayar", value: "UNPAID" },
                { label: "Ditolak", value: "REJECTED" },
              ]}
              onChange={(val) => {
                onChange((val as OptionType).value);
                handleSubmit(onFiltering)();
              }}
            />
          )}
        />
      </div>
      {!listPaymentApi.loading && !listPaymentApi.data?.rows?.length ? (
        <NotFound />
      ) : (
        <div
          ref={tableRef}
          className="pb-52 bg-white mx-6 h-screen border overflow-y-auto border-neutral-400 rounded"
        >
          <div className="grid grid-cols-7 p-3 bg-neutral-200 sticky top-0 z-10 border-neutral-400 border-b font-semibold pl-4 items-center w-full">
            <div className="col-span-3">No Invoice</div>
            <div className="col-span-2">Tanggal Pembayaran</div>
            <div className="col-span-1">Nominal</div>
            <div className="col-span-1">Status</div>
          </div>
          {listPaymentApi.loading && (
            <div className="flex justify-center items-center h-full">
              <div className="px-10 py-3 text-neutral-800">
                <div className="loader" />
              </div>
            </div>
          )}
          {listPaymentApi.data?.rows?.map((item, index) => (
            <List
              key={`${index}`}
              icon={PiReceiptDuotone}
              details={[
                {
                  className: "w-[30%]",
                  element: moment(item.createdAt).format("DD MMMM YYYY HH:mm"),
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
                  className: `w-[15%] text-left ${
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

          <ReactPaginate
            previousLabel="&laquo;"
            renderOnZeroPageCount={null}
            breakLabel="..."
            nextLabel="&raquo;"
            pageCount={listPaymentApi.data?.pages ?? 0}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            className=" flex flex-wrap mt-8 justify-center lg:justify-end items-center space-x-2 px-3 pb-3"
            previousLinkClassName="inline-block w-8 h-8 flex justify-center items-center bg-primary-100 text-primary-800 border border-primary-300 rounded text-xs font-normal my-1"
            nextLinkClassName="inline-block w-8 h-8 flex justify-center items-center bg-primary-100 text-primary-800 border border-primary-300 rounded text-xs font-normal my-1"
            pageLinkClassName="inline-block w-8 h-8 flex justify-center items-center bg-primary-100 text-primary-800 border border-primary-300 rounded text-xs font-normal my-1"
            activeLinkClassName="!bg-neutral-100 !border-neutral-300 !text-neutral-600"
          />
        </div>
      )}
    </div>
  );
}
