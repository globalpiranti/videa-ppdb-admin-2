import { useEffect, useMemo } from "react";
import { CgAddR, CgSearch } from "react-icons/cg";
import {
  RiCheckFill,
  RiDeleteBin5Line,
  RiEditBoxLine,
  RiGitBranchFill,
} from "react-icons/ri";
import {
  createPath,
  deletePath,
  listPath,
  updatePath,
} from "../../api/endpoints/path";
import Button from "../../components/button";
import ContextLink from "../../components/context_link";
import DateInput from "../../components/date_input";
import List from "../../components/list";
import Modal, { ModalFooter } from "../../components/modal";
import NotFound from "../../components/not_found";
import TextInput from "../../components/text_input";
import useApi from "../../hooks/api";
import useLayout from "../../hooks/layout";
import useModal from "../../hooks/modal";
import { Controller, useForm } from "react-hook-form";
import { default as PathModel } from "../../api/models/path";
import moment from "moment/min/moment-with-locales";
import useSwal from "../../hooks/swal";
import { listForm } from "../../api/endpoints/form";
import SelectInput from "../../components/select_input";

export default function Path() {
  const { setActive, setTitle } = useLayout();
  const composeModal = useModal<string>();
  const swal = useSwal();

  const listPathApi = useApi(listPath);
  const createPathApi = useApi(createPath);
  const updatePathApi = useApi(updatePath);
  const deletePathApi = useApi(deletePath);
  const form = useApi(listForm);

  const formOptions = useMemo(
    () =>
      form.data
        ? form.data.map((item) => ({ label: item.name, value: item.id }))
        : [],
    [form.data]
  );

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<PathModel>({
    defaultValues: new PathModel(),
  });

  const onDelete = (id: string) => {
    swal({
      title: "Hapus Jalur?",
      text: "Anda akan menghapus jalur pendaftaran, tindakan ini tidak bisa dibatalkan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      customClass: {
        confirmButton: "!bg-danger-600",
      },
    }).then((result) => {
      if (result.isConfirmed)
        deletePathApi(id)
          .then(() => {
            listPathApi({}).catch(() => {});
          })
          .catch(() => {});
    });
  };

  const submit = handleSubmit((data) => {
    (composeModal.state.value ? updatePathApi : createPathApi)(data)
      .then(() => {
        composeModal.control.hide();
        listPathApi({}).catch(() => {});
        swal({
          icon: "success",
          title: "Berhasil",
          text: "Jalur pendaftaran telah berhasil disimpan",
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

  useEffect(() => {
    setActive("Jalur Pendaftaran");
    setTitle("Jalur Pendaftaran");

    listPathApi({}).catch(() => {});
    form({}).catch(() => {});
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
            reset(new PathModel());
            composeModal.state.set(undefined);
            composeModal.control.show();
          }}
        >
          Buat Baru
        </Button>
      </div>
      {!listPathApi.loading && !listPathApi.data?.length ? (
        <NotFound />
      ) : (
        listPathApi.data?.map((item, index) => (
          <List
            to={`/path/${item.id}`}
            icon={RiGitBranchFill}
            details={[
              {
                element: item.waveCount
                  ? `${item.waveCount} Gelombang`
                  : "Tidak ada gelombang",
                className: "w-[30%]",
              },
              {
                element: `${item.startedAt.format(
                  "DD MMM YYYY"
                )} - ${item.finishedAt.format("DD MMM YYYY")}`,
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
        ))
      )}
      <Modal
        control={composeModal.control}
        icon={RiGitBranchFill}
        title={composeModal.state.value ? "Ubah Jalur" : "Tambah Jalur"}
      >
        <TextInput
          containerClassName="mb-5"
          label="Nama Jalur"
          message={errors.name?.message}
          {...register("name", {
            required: "Tidak boleh kosong",
          })}
        />
        <Controller
          control={control}
          name="form"
          rules={{ required: "Tidak boleh kosong" }}
          render={({ field: { value, onChange } }) => (
            <SelectInput
              label="Formulir"
              containerClassName="mb-5"
              options={formOptions}
              message={errors.form?.message}
              value={value?.id}
              onChange={(value) =>
                onChange(
                  form.data?.find(
                    (item) => item.id === (value as { value: string }).value
                  )
                )
              }
            />
          )}
        />
        <Controller
          control={control}
          name="startedAt"
          rules={{ required: "Tidak boleh kosong" }}
          render={({ field: { value, onChange } }) => (
            <DateInput
              label="Dibuka Pada"
              containerClassName="mb-5"
              message={errors.startedAt?.message}
              value={value?.toDate()}
              onChange={(e) => onChange(moment(e))}
            />
          )}
        />
        <Controller
          control={control}
          name="finishedAt"
          rules={{ required: "Tidak boleh kosong" }}
          render={({ field: { value, onChange } }) => (
            <DateInput
              label="Ditutup Pada"
              containerClassName="mb-5"
              message={errors.finishedAt?.message}
              value={value?.toDate()}
              onChange={(e) => onChange(moment(e))}
            />
          )}
        />
        <ModalFooter>
          <Button
            loading={(createPathApi || updatePathApi).loading}
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
