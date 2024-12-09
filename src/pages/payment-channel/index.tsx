import { useEffect } from "react";
import useLayout from "../../hooks/layout";
import TextInput from "../../components/text_input";
import { CgAddR, CgSearch } from "react-icons/cg";
import NotFound from "../../components/not_found";
import Button from "../../components/button";
import useApi from "../../hooks/api";
import {
  createPaymentChannel,
  deletePaymentChannel,
  listPaymentChannel,
  updatePaymentChannel,
} from "../../api/endpoints/payment_channel";
import PaymentChannelList from "../../components/payment_channel_list";
import Modal, { ModalFooter } from "../../components/modal";
import useModal from "../../hooks/modal";
import { RiBankCard2Fill, RiCheckFill } from "react-icons/ri";
import TextareaInput from "../../components/textarea_input";
import ImageInput from "../../components/image_input";
import { Controller, useForm } from "react-hook-form";
import PaymentChannelModel from "../../api/models/payment_channel";
import useSwal from "../../hooks/swal";

export default function PaymentChannel() {
  const { setActive, setTitle } = useLayout();
  const composeModal = useModal();
  const swal = useSwal();

  const listPaymentChannelApi = useApi(listPaymentChannel);
  const createPaymentChannelApi = useApi(createPaymentChannel);
  const updatePaymentChannelApi = useApi(updatePaymentChannel);
  const deletePaymentChannelApi = useApi(deletePaymentChannel);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm<PaymentChannelModel>();

  const submit = handleSubmit((data) => {
    (data.id ? updatePaymentChannelApi : createPaymentChannelApi)(data)
      .then(() => {
        composeModal.control.hide();
        listPaymentChannelApi({}).catch(() => {});
        swal({
          icon: "success",
          title: "Berhasil",
          text: "Metode pembayaran telah berhasil disimpan",
        });
      })
      .catch(() => {
        swal({
          icon: "error",
          title: "Gagal",
          text: "Periksa kembali data yang Anda masukkan",
        });
      });
  });

  const onDelete = (id: string) => {
    swal({
      title: "Hapus Metode Pembayaran?",
      text: "Anda akan menghapus metode pembayaran, tindakan ini tidak bisa dibatalkan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      customClass: {
        confirmButton: "!bg-danger-600",
      },
    }).then((result) => {
      if (result.isConfirmed)
        deletePaymentChannelApi(id)
          .then(() => {
            listPaymentChannelApi({}).catch(() => {});
          })
          .catch(() => {});
    });
  };

  useEffect(() => {
    setActive("Metode Pembayaran");
    setTitle("Metode Pembayaran");

    listPaymentChannelApi({}).catch(() => {});
  }, []);

  return (
    <>
      <div className="flex justify-start items-center p-5 space-x-3">
        <TextInput
          left={() => <CgSearch />}
          placeholder="Cari..."
          containerClassName="flex-1"
        />
        <Button
          type="button"
          left={() => <CgAddR />}
          onClick={() => {
            reset(new PaymentChannelModel());
            composeModal.control.show();
          }}
        >
          Tambah
        </Button>
      </div>
      {!listPaymentChannelApi.loading && !listPaymentChannelApi.data?.length ? (
        <NotFound />
      ) : (
        <div className="grid grid-flow-row grid-cols-4 gap-5 p-5 pt-0">
          {listPaymentChannelApi.data?.map((item, index) => (
            <PaymentChannelList
              key={`${index}`}
              imgSrc={item.icon?.url || ""}
              name={item.name}
              description={item.description}
              onDelete={() => onDelete(item.id)}
              onUpdate={() => {
                reset(item);
                composeModal.control.show();
              }}
            />
          ))}
        </div>
      )}
      <Modal
        control={composeModal.control}
        icon={RiBankCard2Fill}
        title={`${watch("id") ? "Ubah" : "Tambah"} Metode Pembayaran`}
      >
        <TextInput
          label="Nama"
          placeholder="BCA 021*****"
          containerClassName="mb-5"
          message={errors.name?.message}
          {...register("name", { required: "Tidak boleh kosong" })}
        />
        <TextareaInput
          label="Deskripsi"
          placeholder="a.n Parhan"
          containerClassName="mb-5"
          message={errors.description?.message}
          {...register("description", { required: "Tidak boleh kosong" })}
        />
        <Controller
          control={control}
          name="icon"
          rules={{ required: "Tidak boleh kosong" }}
          render={({ field: { value, onChange } }) => (
            <ImageInput
              label="Icon Pembayaran"
              containerClassName="mb-5"
              value={value || undefined}
              onChange={onChange}
              message={errors.icon?.message}
            />
          )}
        />
        <ModalFooter>
          <Button
            loading={
              (updatePaymentChannelApi || createPaymentChannelApi).loading
            }
            type="button"
            onClick={submit}
            left={() => <RiCheckFill />}
          >
            Simpan
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
