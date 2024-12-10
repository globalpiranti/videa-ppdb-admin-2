import moment from "moment/min/moment-with-locales";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { CgAddR } from "react-icons/cg";
import { PiWaveSineBold } from "react-icons/pi";
import {
  RiCheckFill,
  RiDeleteBin5Line,
  RiEditBoxLine,
  RiGitBranchFill,
} from "react-icons/ri";
import { useParams } from "react-router-dom";
import { getPath } from "../../api/endpoints/path";
import {
  createWave,
  deleteWave,
  listWave,
  updateWave,
} from "../../api/endpoints/wave";
import Wave from "../../api/models/wave";
import Button from "../../components/button";
import DateInput from "../../components/date_input";
import Modal, { ModalFooter } from "../../components/modal";
import NotFound from "../../components/not_found";
import NumberInput from "../../components/number_input";
import TextInput from "../../components/text_input";
import useApi from "../../hooks/api";
import useLayout from "../../hooks/layout";
import useModal from "../../hooks/modal";
import useSwal from "../../hooks/swal";
import List from "../../components/list";
import { NumericFormat } from "react-number-format";
import ContextLink from "../../components/context_link";
import TextareaInput from "../../components/textarea_input";

export default function PathDetail() {
  const { setActive, setTitle } = useLayout();
  const { id } = useParams();
  const composeModal = useModal<string>();
  const swal = useSwal();

  const getPathApi = useApi(getPath);
  const listWaveApi = useApi(listWave);
  const createWaveApi = useApi(createWave);
  const updateWaveApi = useApi(updateWave);
  const deleteWaveApi = useApi(deleteWave);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Wave>({
    defaultValues: new Wave(),
  });

  const submit = handleSubmit((data) => {
    (composeModal.state.value ? updateWaveApi : createWaveApi)({
      pathId: id!,
      data,
    })
      .then(() => {
        listWaveApi(id!).catch(() => {});
        composeModal.control.hide();
        swal({
          icon: "success",
          title: "Berhasil",
          text: "Gelombang telah berhasil disimpan",
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

  const onDelete = (waveId: string) => {
    swal({
      title: "Hapus Gelombang?",
      text: "Anda akan menghapus gelombang pendaftaran, tindakan ini tidak bisa dibatalkan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      customClass: {
        confirmButton: "!bg-danger-600",
      },
    }).then((result) => {
      if (result.isConfirmed)
        deleteWaveApi({ pathId: id!, id: waveId })
          .then(() => {
            listWaveApi(id!).catch(() => {});
          })
          .catch(() => {});
    });
  };

  useEffect(() => {
    getPathApi(id!).catch(() => {});
    listWaveApi(id!).catch(() => {});
  }, [id]);

  useEffect(() => {
    setActive("Jalur Pendaftaran");
    setTitle("Detail Jalur");
  }, []);

  return (
    <>
      <div className="p-5 bg-white border-b border-neutral-300 flex justify-start items-center space-x-5">
        <div className="w-16 h-16 bg-neutral-300 rounded flex justify-center items-center text-4xl border border-neutral-400">
          <RiGitBranchFill />
        </div>
        <div className="flex-1">
          <div className="font-bold text-xl text-neutral-900 font-ubuntu">
            {getPathApi.data?.name}
          </div>
          <div className="mt-1">
            {getPathApi.data?.startedAt.format("DD MMMM YYYY")} &mdash;{" "}
            {getPathApi.data?.finishedAt.format("DD MMMM YYYY")}
          </div>
        </div>
        <Button
          type="button"
          sizing="sm"
          className="ml-auto"
          left={() => <CgAddR />}
          onClick={() => {
            reset(new Wave());
            composeModal.state.set(undefined);
            composeModal.control.show();
          }}
        >
          Tambah Gelombang
        </Button>
      </div>
      {!listWaveApi.loading && !listWaveApi.data?.length ? (
        <NotFound />
      ) : (
        <div>
          <div className="font-bold font-montserrat p-5 text-neutral-900">
            Daftar Gelombang
          </div>
          {listWaveApi.data?.map((item, index) => (
            <List
              icon={PiWaveSineBold}
              details={[
                { element: `0/${item.quota} Pendaftar`, className: "w-[25%]" },
                {
                  element: (
                    <NumericFormat
                      value={item.price}
                      displayType="text"
                      prefix="Rp"
                      thousandSeparator=","
                    />
                  ),
                  className: "w-[15%]",
                },
                {
                  element: `${item.openedAt.format(
                    "DD MMM YYYY"
                  )} - ${item.closedAt.format("DD MMM YYYY")}`,
                  className: "flex-1",
                },
              ]}
              popup={
                <>
                  <ContextLink
                    onClick={(e) => {
                      e.preventDefault();
                      reset(item);
                      composeModal.state.set(item.id);
                      composeModal.control.show();
                    }}
                    icon={RiEditBoxLine}
                    to="/"
                  >
                    Ubah
                  </ContextLink>
                  <ContextLink
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(item.id);
                    }}
                    icon={RiDeleteBin5Line}
                    to="/"
                  >
                    Hapus
                  </ContextLink>
                </>
              }
              key={`${index}`}
            >
              {item.name}
            </List>
          ))}
        </div>
      )}
      <Modal
        control={composeModal.control}
        icon={PiWaveSineBold}
        title={composeModal.state.value ? "Ubah Gelombang" : "Tambah Gelombang"}
      >
        <TextInput
          label="Nama Gelombang"
          containerClassName="mb-5"
          message={errors.name?.message}
          {...register("name", { required: "Tidak boleh kosong" })}
        />
        <TextareaInput
          label="Ketentuan Gelombang"
          containerClassName="mb-5"
          message={errors.provision?.message}
          {...register("provision", { required: "Tidak boleh kosong" })}
        />
        <Controller
          control={control}
          name="quota"
          rules={{ required: "Tidak boleh kosong" }}
          render={({ field: { value, onChange } }) => (
            <NumberInput
              value={value}
              onValueChange={({ value }) => onChange(value)}
              label="Kuota"
              thousandSeparator=","
              containerClassName="mb-5"
              message={errors.quota?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="price"
          rules={{ required: "Tidak boleh kosong" }}
          render={({ field: { value, onChange } }) => (
            <NumberInput
              value={value}
              onValueChange={({ value }) => onChange(value)}
              label="Harga Formulir"
              thousandSeparator=","
              containerClassName="mb-5"
              left={() => "Rp"}
              message={errors.price?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="openedAt"
          rules={{ required: "Tidak boleh kosong" }}
          render={({ field: { value, onChange } }) => (
            <DateInput
              value={value?.toDate()}
              onChange={(val) => onChange(moment(val))}
              label="Dibuka Pada"
              containerClassName="mb-5"
              message={errors.openedAt?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="closedAt"
          rules={{ required: "Tidak boleh kosong" }}
          render={({ field: { value, onChange } }) => (
            <DateInput
              value={value?.toDate()}
              onChange={(val) => onChange(moment(val))}
              label="Ditutup Pada"
              containerClassName="mb-5"
              message={errors.closedAt?.message}
            />
          )}
        />

        <ModalFooter>
          <Button
            type="button"
            loading={(createWaveApi || updateWaveApi).loading}
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
