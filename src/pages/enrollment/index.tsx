import { Moment } from "moment";
import { FC, useEffect, useRef, useState } from "react";
import { BiDownload, BiUser } from "react-icons/bi";
import { CgSearch } from "react-icons/cg";
import {
  FilteringParams,
  listEnrollment,
} from "../../api/endpoints/enrollment";
import Attachment from "../../api/models/attachment";
import EnrollmentModel from "../../api/models/enrollment";
import NotFound from "../../components/not_found";
import TextInput from "../../components/text_input";
import useApi from "../../hooks/api";
import useLayout from "../../hooks/layout";
import ListWithHeader from "../../components/ListWithHeader";
import SelectInput, { OptionType } from "../../components/select_input";
import { listPath } from "../../api/endpoints/path";
import { Controller, useForm } from "react-hook-form";
import Button from "../../components/button";
import { listWave } from "../../api/endpoints/wave";
import ReactPaginate from "react-paginate";
import { FaFileDownload } from "react-icons/fa";

export type PresentationProps = {
  value: EnrollmentModel["form"][number]["value"];
};

export const presentationMap: Record<
  EnrollmentModel["form"][number]["input"],
  FC<PresentationProps>
> = {
  upload: ({ value }) => (
    <a
      href={(value as Attachment)?.url}
      target="_blank"
      className="text-info-600 flex items-center space-x-2"
    >
      <BiDownload /> <span className="text-sm">Download</span>
    </a>
  ),
  text: ({ value }) => value as string,
  radio: ({ value }) => value as string,
  numeric: ({ value }) => value as string,
  dropdown: ({ value }) => value as string,
  checkbox: ({ value }) => (value as string[]).join(", "),
  calendar: ({ value }) => (value as Moment).format("DD MMMM YYYY"),
};

export default function Enrollment() {
  const { setActive, setTitle } = useLayout();
  const take = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef<HTMLDivElement | null>(null);

  const listPathApi = useApi(listPath);
  const listEnrollmentApi = useApi(listEnrollment);
  const listWavesApi = useApi(listWave);
  // const downloadSheetApi = useApi(getEnrollmentSheet);

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
    setTimeout(() => {
      listEnrollmentApi(data).catch(() => {});
      if (data.path && data.path !== "") {
        listWavesApi(data.path).catch(() => {});
      }
    }, 500);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    const skip = (newPage - 1) * take;
    setCurrentPage(newPage);
    tableRef.current?.scrollTo({ top: 0 });
    handleSubmit((data) => onFiltering({ ...data, skip, take }))();
  };

  // const handleDownloadSheet = () => {
  //   downloadSheetApi({
  //     path: watch("path"),
  //     wave: watch("wave"),
  //     status: watch("status"),
  //     search: watch("search"),
  //   }).catch(() => {});
  // };

  useEffect(() => {
    setActive("Pendaftar");
    setTitle("Pendaftar");

    listEnrollmentApi({}).catch(() => {});
    listPathApi({}).catch(() => {});
  }, []);

  return (
    <div className="w-full h-[90vh] overflow-hidden">
      <div className="flex justify-between items-center p-5 space-x-3">
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
          name="path"
          control={control}
          rules={{ required: false }}
          render={({ field: { value, onChange } }) => (
            <SelectInput
              placeholder="Jalur"
              value={value}
              options={
                listPathApi.data
                  ?.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                    };
                  })
                  .concat({ label: "Semua Jalur", value: "" })
                  .reverse() ?? []
              }
              onChange={(val) => {
                setValue("wave", "");
                onChange((val as OptionType).value);
                handleSubmit(onFiltering)();
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="wave"
          rules={{ required: false }}
          render={({ field: { value, onChange } }) => (
            <SelectInput
              placeholder="Semua Gelombang"
              value={value}
              options={
                listWavesApi.data
                  ?.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                    };
                  })
                  .concat({ label: "Semua Gelombang", value: "" })
                  .reverse() ?? []
              }
              onChange={(val) => {
                onChange((val as OptionType).value);
                handleSubmit(onFiltering)();
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
              value={value}
              options={[
                { label: "Semua (Sudah Bayar)", value: "" },
                { label: "Belum Bayar", value: "PAYMENT_PENDING" },
                { label: "Belum Submit", value: "DRAFT" },
                { label: "Belum Diperiksa", value: "SUBMITTED" },
                { label: "Diterima", value: "ACCEPTED" },
                { label: "Ditolak", value: "REJECTED" },
              ]}
              onChange={(val) => {
                onChange((val as OptionType).value);
                handleSubmit(onFiltering)();
              }}
            />
          )}
        />
        <Button
          onClick={() => {
            reset({
              search: "",
              path: "",
              wave: "",
              status: "",
            });
            setCurrentPage(1);
            handleSubmit((data) => onFiltering({ ...data, skip: 0, take }))();
          }}
        >
          Reset
        </Button>
        <a
          target="_blank"
          href={`${
            import.meta.env.VITE_BACKEND_URL
          }/enrollment/list/sheet?path=${watch("path")}&wave=${watch(
            "wave"
          )}&status=${watch("status")}&search=${watch("search")}`}
        >
          <Button
            coloring="success"
            left={() => <FaFileDownload className="text-xl" />}
          ></Button>
        </a>
      </div>
      {!listEnrollmentApi.loading && !listEnrollmentApi.data?.rows?.length ? (
        <NotFound />
      ) : (
        <div
          ref={tableRef}
          className="w-[calc(100%-40px)] h-screen overflow-y-auto bg-white border border-neutral-400 pb-52 mx-4"
        >
          <div className="grid grid-cols-6 p-3 bg-neutral-200 sticky top-0 z-10 border-neutral-400 border-b font-semibold pl-4 items-center w-full">
            <div>#</div>
            <div>Nama Pendaftar</div>
            <div>No Registrasi</div>
            <div>Whatsapp</div>
            <div>Status</div>
            <div>Aksi</div>
          </div>
          {listEnrollmentApi.loading && (
            <div className="flex justify-center items-center h-full">
              <div className="px-10 py-3 text-neutral-800">
                <div className="loader" />
              </div>
            </div>
          )}
          {(listEnrollmentApi.data?.rows || [])?.map((item, index) => (
            <ListWithHeader
              key={`${index}`}
              details={[
                {
                  element: (
                    <div className="flex gap-2 items-center">
                      <span className="text-lg">
                        {(currentPage! - 1) * take + index + 1} .
                      </span>
                      <img
                        src={
                          item.avatar ||
                          "https://e7.pngegg.com/pngimages/81/570/png-clipart-profile-logo-computer-icons-user-user-blue-heroes-thumbnail.png"
                        }
                        className="w-10 h-10 rounded-full object-cover"
                        alt="User Avatar"
                      />
                    </div>
                  ),
                },
                { element: item.name },
                { element: item.regNumber },
                { element: item?.whatsapp },
                {
                  element: (
                    <button
                      className={`py-1 font-semibold px-2 rounded-full ${
                        item.status === "ACCEPTED"
                          ? "text-success-600 bg-success-100"
                          : item.status === "SUBMITTED"
                          ? "text-primary-600 bg-primary-100"
                          : item.status === "REJECTED" ||
                            item.status === "PAYMENT_PENDING"
                          ? "text-danger-600 bg-danger-100"
                          : "text-warning-600 bg-warning-100"
                      }`}
                    >
                      {item.status === "ACCEPTED"
                        ? "Diterima"
                        : item.status === "SUBMITTED"
                        ? "Belum Diperiksa"
                        : item.status === "REJECTED"
                        ? "Ditolak"
                        : item.status === "DRAFT"
                        ? "Belum Submit"
                        : item.status === "PAYMENT_PENDING"
                        ? "Belum Bayar"
                        : ""}
                    </button>
                  ),
                },
                {
                  element: (
                    <div className="relative">
                      <a
                        target="_blank"
                        href={`https://wa.me/${item?.whatsapp}`}
                        className="px-2 py-1 absolute -top-3 z-[5] rounded-full bg-success-600 text-white text-sm font-semibold"
                      >
                        Hubungi
                      </a>
                    </div>
                  ),
                },
              ]}
              icon={BiUser}
              to={`/enrollment/${item.id}`}
            />
          ))}
          <ReactPaginate
            previousLabel="&laquo;"
            renderOnZeroPageCount={null}
            breakLabel="..."
            nextLabel="&raquo;"
            pageCount={listEnrollmentApi.data?.pages ?? 0}
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
