import { useEffect } from "react";
import { BiCheck, BiInfoCircle, BiX } from "react-icons/bi";
import { PiHandWithdrawDuotone, PiReceiptDuotone } from "react-icons/pi";
import { NumericFormat } from "react-number-format";
import { useParams } from "react-router-dom";
import {
  confirmPayment,
  getPayment,
  rejectPayment,
} from "../../api/endpoints/payment";
import Button from "../../components/button";
import Info from "../../components/info";
import useApi from "../../hooks/api";
import useLayout from "../../hooks/layout";
import { status } from "../../api/models/payment";
import useSwal from "../../hooks/swal";
import useModal from "../../hooks/modal";
import Modal from "../../components/modal";
import TextareaInput from "../../components/textarea_input";

const statusMap: Record<
  (typeof status)[number],
  { className: string; as: string } | null
> = {
  WAITING_CONFIRMATION: null,
  PAID: {
    className: "border-success-600 text-success-600 bg-success-50",
    as: "DIBAYAR",
  },
  REJECTED: {
    className: "border-danger-600 text-danger-600 bg-danger-50",
    as: "DITUNDA",
  },
  UNPAID: {
    className: "border-warning-600 text-warning-600 bg-warning-50",
    as: "BELUM BAYAR",
  },
};

export default function PaymentDetail() {
  const { setActive, setTitle, setNeedActions } = useLayout();
  const { id } = useParams();
  const swal = useSwal();

  const getPaymentApi = useApi(getPayment);
  const confirmPaymentApi = useApi(confirmPayment);
  const rejectPaymentApi = useApi(rejectPayment);

  const rejectModal = useModal({ defaultState: "" });

  const confirm = () => {
    swal({
      icon: "question",
      title: "Konfirmasi Pembayaran",
      text: "Anda akan menyatakan pembayaran ini telah berhasil dan valid",
      showCancelButton: true,
      confirmButtonText: "Lanjutkan",
    }).then((result) => {
      if (result.isConfirmed)
        confirmPaymentApi(id!)
          .then(() => {
            getPaymentApi(id!).catch(() => {});
            setNeedActions((prev) => {
              return {
                ...prev,
                enroll: prev.enroll !== 0 ? prev.enroll - 1 : 0,
              };
            });
          })
          .catch(() => {});
    });
  };

  const reject = () => {
    rejectPaymentApi({ id: id!, notes: rejectModal.state.value! })
      .then(() => {
        getPaymentApi(id!).catch(() => {});
        rejectModal.control.hide();
        setNeedActions((prev) => {
          return {
            ...prev,
            enroll: prev.enroll !== 0 ? prev.enroll - 1 : 0,
          };
        });
      })
      .catch(() => {});
  };

  useEffect(() => {
    getPaymentApi(id!).catch(() => {});
  }, [id]);

  useEffect(() => {
    setActive("Pembayaran");
    setTitle("Detail Pembayaran");
  }, []);

  return (
    <>
      <div className="p-5 relative bg-white border-b border-neutral-300 flex justify-start items-center space-x-5">
        {getPaymentApi.loading && (
          <div className="flex w-full z-10 h-screen absolute top-0 left-0 bg-white/80 justify-center items-center">
            <div className="px-10 py-3 text-neutral-800">
              <div className="loader" />
            </div>
          </div>
        )}
        <div className="w-16 h-16 bg-neutral-300 rounded flex justify-center items-center text-4xl border border-neutral-400">
          <PiReceiptDuotone />
        </div>
        <div className="flex-1">
          <div className="font-bold text-xl text-neutral-900 font-ubuntu">
            {getPaymentApi.data?.invoiceNumber}
          </div>
          <div className="mt-1">
            {getPaymentApi.data?.createdAt.format("dddd, DD MMMM YYYY HH:mm")}
          </div>
        </div>
        {getPaymentApi.data?.status === "WAITING_CONFIRMATION" ? (
          <div className="flex justify-start items-center space-x-3">
            <Button
              type="button"
              left={() => <BiX className="text-lg" />}
              sizing="sm"
              coloring="danger"
              onClick={() => {
                rejectModal.state.set("");
                rejectModal.control.show();
              }}
            >
              Tolak
            </Button>
            <Button
              type="button"
              left={() => <BiCheck className="text-lg" />}
              sizing="sm"
              onClick={confirm}
              loading={confirmPaymentApi.loading}
            >
              Konfirmasi
            </Button>
          </div>
        ) : getPaymentApi.data ? (
          <div
            className={`border-2 rounded py-3 px-8 text-sm font-ubuntu font-bold transform rotate-12 ${
              statusMap[getPaymentApi.data!.status]?.className
            }`}
          >
            {statusMap[getPaymentApi.data!.status]?.as}
          </div>
        ) : null}
      </div>
      <div className="flex-1 flex justify-start items-stretch">
        <div className="border-r border-neutral-400 w-1/2">
          <div className="p-5 font-bold font-montserrat text-neutral-900 flex justify-start items-center space-x-2 border-b border-neutral-400">
            <BiInfoCircle className="text-primary-600" />
            <span>Detail</span>
          </div>
          <div className="p-8">
            <Info title="Email">{getPaymentApi.data?.enrollment?.email}</Info>
            <Info title="Gelombang">
              {getPaymentApi.data?.enrollment?.wave?.name}
            </Info>
            <Info title="Jalur">
              {getPaymentApi.data?.enrollment?.wave?.path?.name}
            </Info>
            <Info title="Total">
              <NumericFormat
                value={getPaymentApi.data?.amount}
                prefix="Rp"
                thousandSeparator=","
                displayType="text"
              />
            </Info>
          </div>
        </div>
        {Boolean(getPaymentApi.data?.confirmation) ? (
          <div className="flex-1">
            <div className="p-5 font-bold font-montserrat text-neutral-900 flex justify-start items-center space-x-2 border-b border-neutral-400">
              <BiInfoCircle className="text-primary-600" />
              <span>Pembayaran</span>
            </div>
            <div className="p-8">
              <Info title="Metode">
                {getPaymentApi.data?.confirmation?.paymentMethod}
              </Info>
              <Info title="Tanggal">
                {getPaymentApi.data?.confirmation?.paymentDate?.format(
                  "DD/MM/YYYY HH:mm"
                )}
              </Info>
              <Info title="Pengirim">
                {getPaymentApi.data?.confirmation?.name}
              </Info>
              <Info title="No. Rekening">
                {getPaymentApi.data?.confirmation?.senderNumber}
              </Info>
              <Info title="No. Referensi">
                {getPaymentApi.data?.confirmation?.refNumber}
              </Info>
              <Info title="Catatan">
                {getPaymentApi.data?.confirmation?.notes || "-"}
              </Info>
              <Info title="Nominal">
                <NumericFormat
                  value={getPaymentApi.data?.confirmation?.amount}
                  prefix="Rp"
                  thousandSeparator=","
                  displayType="text"
                />
              </Info>
            </div>
            <div className="p-5 font-bold font-montserrat text-neutral-900 flex justify-start items-center space-x-2 border-b border-neutral-400">
              <BiInfoCircle className="text-primary-600" />
              <span>Lampiran</span>
            </div>
            <div className="p-8">
              <img
                src={getPaymentApi.data?.confirmation?.attachment.url}
                className="w-full h-auto"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-5">
            <PiHandWithdrawDuotone className="text-9xl text-warning-700" />
            <div className="text-center mt-5">Belum melakukan pembayaran</div>
          </div>
        )}
      </div>
      <Modal control={rejectModal.control} title="Tolak Pembayaran">
        <TextareaInput
          rowSpan={3}
          placeholder="Alasan"
          containerClassName="mb-5"
          value={rejectModal.state.value}
          onChange={(e) => rejectModal.state.set(e.currentTarget.value)}
        />
        <Button
          type="button"
          loading={rejectPaymentApi.loading}
          onClick={reject}
        >
          Lanjutkan
        </Button>
      </Modal>
    </>
  );
}
