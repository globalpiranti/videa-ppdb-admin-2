import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { IconType } from "react-icons";
import { CgAdd } from "react-icons/cg";
import {
  PiCalendarFill,
  PiCheckSquareFill,
  PiRadioButtonFill,
  PiTextboxFill,
  PiUploadFill,
  PiWarning,
} from "react-icons/pi";
import {
  RiCheckFill,
  RiDeleteBin2Line,
  RiEditBoxFill,
  RiInformation2Line,
  RiPagesFill,
  RiPagesLine,
} from "react-icons/ri";
import { TbNumber123, TbSelector } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import { createForm, getForm, updateForm } from "../../api/endpoints/form";
import Form from "../../api/models/form";
import Button from "../../components/button";
import CardButton from "../../components/card_button";
import Modal, { ModalFooter } from "../../components/modal";
import SelectInput from "../../components/select_input";
import SwitchInput from "../../components/switch_input";
import TextInput from "../../components/text_input";
import TextareaInput from "../../components/textarea_input";
import useApi from "../../hooks/api";
import useLayout from "../../hooks/layout";
import useModal from "../../hooks/modal";
import useSwal from "../../hooks/swal";
import * as FormType from "../../utils/form";
import { TextTypeMap } from "../../utils/text_type";

const defaultDetailValue: Partial<Form["forms"][number]> = {
  label: "",
  options: [],
  type: "short_text",
  extensions: [],
  format: "",
  required: false,
};

const FormInputMap: Record<string, { icon: IconType; name: string }> = {
  calendar: {
    icon: PiCalendarFill,
    name: "Kolom Tanggal",
  },
  checkbox: {
    icon: PiCheckSquareFill,
    name: "Pilihan Ceklis",
  },
  dropdown: {
    icon: TbSelector,
    name: "Menu Pilihan",
  },
  numeric: {
    icon: TbNumber123,
    name: "Kolom Angka",
  },
  radio: {
    icon: PiRadioButtonFill,
    name: "Tombol Opsi",
  },
  text: {
    icon: PiTextboxFill,
    name: "Kolom Teks",
  },
  upload: {
    icon: PiUploadFill,
    name: "Kolom Upload",
  },
};

const FormInput = ({
  onChange,
}: {
  onChange: (value: Form["forms"][number]) => void;
}) => (
  <div className="grid grid-flow-row grid-cols-2 gap-5">
    {Object.keys(FormType).map((item, index) => (
      <CardButton
        onClick={() => {
          onChange(new FormType[item as keyof typeof FormType]());
        }}
        type="button"
        icon={
          FormInputMap[item.toLowerCase() as keyof typeof FormInputMap].icon
        }
        key={`${index}`}
      >
        {FormInputMap[item.toLowerCase() as keyof typeof FormInputMap].name}
      </CardButton>
    ))}
  </div>
);

export default function ComposeForm() {
  const { id } = useParams();
  const { setActive, setTitle } = useLayout();
  const navigate = useNavigate();
  const swal = useSwal();
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [dragged, setDragged] = useState<number>();
  const [dropTarget, setDropTarget] = useState<number>();

  const typeModal = useModal<number>();
  const formModal = useModal<number>();

  const getFormApi = useApi(getForm);
  const createFormApi = useApi(createForm);
  const updateFormApi = useApi(updateForm);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: new Form(),
  });
  const { fields, append, update, move, remove } = useFieldArray({
    control,
    name: "forms",
    rules: { required: "Tidak boleh kosong" },
  });

  const {
    control: formDetailControl,
    register: formDetailRegister,
    reset: formDetailReset,
    watch: formDetailWatch,
    handleSubmit: formDetailSubmit,
    formState: { errors: formDetailErrors },
  } = useForm<Form["forms"][number]>({ defaultValues: defaultDetailValue });

  const removeForm = () => {
    swal({
      icon: "warning",
      title: "Hapus Kolom Form?",
      html: `Anda akan menghapus kolom isian <b>${
        fields[formModal.state.value!].label
      }</b>`,
      showCancelButton: true,
      confirmButtonText: "Hapus",
      customClass: {
        confirmButton: "!bg-danger-600",
      },
    }).then((result) => {
      if (result.isConfirmed) return remove(formModal.state.value!);

      formModal.control.show();
    });
  };

  const submitForm = (data: Form) =>
    (id ? updateFormApi : createFormApi)(data)
      .then((data) => {
        setSaved(true);
        navigate(`/form/${data.id}`, { replace: true });
        swal({
          icon: "success",
          title: "Berhasil",
          text: "Formulir telah berhasil disimpan",
        });
      })
      .catch(() => {
        swal({
          icon: "error",
          title: "Gagal",
          text: "Periksa kembali koneksi internet dan data yang Anda masukkan",
        });
      });

  useEffect(() => {
    setMounted(false);
    setTitle(id ? "Edit Formulir" : "Tambah Formulir");
    setActive("Formulir");

    (async () => {
      if (id) {
        await getFormApi(id).then((data) => {
          reset(data);

          return data;
        });
      }
    })();
  }, [id]);

  useEffect(() => {
    setSaved(true);
    const { unsubscribe } = watch(() => {
      if (mounted) {
        setSaved(false);
      } else {
        setMounted(true);
      }
    });
    return () => unsubscribe();
  }, [watch, mounted]);

  if (getFormApi.loading)
    return (
      <div className="flex-1 flex justify-center items-center text-center">
        Memuat form...
      </div>
    );

  return (
    <>
      <div className="flex-1 flex justify-start items-start p-5 space-x-5">
        <div className="w-2/5 bg-white border border-neutral-300 rounded overflow-hidden">
          <div className="h-16 px-5 border-b border-neutral-300 bg-neutral-50 flex justify-start items-center space-x-3">
            <RiInformation2Line className="text-primary-500" />
            <h2 className="flex-1 font-semibold font-montserrat text-neutral-900">
              Informasi
            </h2>
          </div>
          <div className="p-5">
            <TextInput
              label="Nama Formulir"
              containerClassName="mb-5"
              message={errors.name?.message}
              {...register("name", { required: "Tidak boleh kosong" })}
            />
            <TextareaInput
              message={errors.description?.message}
              label="Deskripsi Formulir"
              {...register("description", { required: "Tidak boleh kosong" })}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-white border border-neutral-300 rounded overflow-hidden">
            <div className="h-16 px-5 border-b border-neutral-300 bg-neutral-50 flex justify-start items-center space-x-3">
              <RiPagesLine className="text-primary-500" />
              <h2 className="flex-1 font-semibold font-montserrat text-neutral-900">
                Desain Formulir
              </h2>
              <Button
                sizing="sm"
                onClick={() => {
                  formModal.state.set(undefined);

                  formDetailReset(defaultDetailValue);
                  formDetailReset(new FormType.Text());
                  formModal.control.show();
                }}
                left={() => <CgAdd className="text-base" />}
                className="transform translate-x-2"
              />
            </div>
            <div className="py-3">
              {fields.length ? (
                fields.map((value, index) => (
                  <div
                    className="px-5 py-2 grid"
                    key={`${value.id}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setDragImage(
                        e.currentTarget.children[0],
                        28,
                        0
                      );
                      setDragged(index);
                    }}
                    onDragEnd={() => setDragged(undefined)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragged !== index) setDropTarget(index);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setDropTarget(undefined);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragged(undefined);
                      setDropTarget(undefined);
                      if (
                        typeof dragged === "number" &&
                        typeof dropTarget === "number" &&
                        dragged >= 0 &&
                        dropTarget >= 0
                      )
                        move(dragged, dropTarget);
                    }}
                    onClick={() => {
                      formModal.state.set(index);

                      formDetailReset(defaultDetailValue);
                      formDetailReset(value);
                      formModal.control.show();
                    }}
                  >
                    <CardButton
                      type="button"
                      className={`${
                        dragged === index ? "opacity-30" : "opacity-100"
                      } ${
                        dropTarget === index
                          ? "!border-primary-500 !bg-primary-100"
                          : ""
                      }`}
                      icon={FormInputMap[value.input].icon}
                    >
                      {value.label}
                    </CardButton>
                  </div>
                ))
              ) : (
                <div className="p-5 text-center">Belum ada data</div>
              )}
            </div>
          </div>
          {errors.forms?.root?.message && (
            <div className="text-sm text-danger-600 mt-1">
              {errors.forms.root.message}
            </div>
          )}
        </div>
      </div>
      <div className="bg-white px-5 py-3 sticky bottom-0 left-0 right-0 border-t border-neutral-300 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {!saved && (
            <>
              <PiWarning className="text-danger-500" />
              <span className="text-sm">Perubahan belum disimpan</span>
            </>
          )}
        </div>
        <Button
          type="button"
          onClick={() => handleSubmit(submitForm)()}
          left={() => <RiCheckFill />}
          loading={(createFormApi || updateFormApi).loading}
        >
          Simpan
        </Button>
      </div>
      <Modal title="Atur Form" control={formModal.control} icon={RiEditBoxFill}>
        <form
          onSubmit={formDetailSubmit((value) => {
            if (typeof formModal.state.value === "number") {
              update(formModal.state.value, value);
            } else {
              append(value);
            }

            formModal.control.hide();
          })}
        >
          <div className="grid">
            <Controller
              control={formDetailControl}
              name="input"
              render={({ field: { value } }) =>
                value ? (
                  <CardButton
                    onClick={() => {
                      typeModal.state.set(formModal.state.value);
                      typeModal.control.show();
                    }}
                    type="button"
                    className="mb-5"
                    icon={FormInputMap[value].icon}
                  >
                    {FormInputMap[value].name}
                  </CardButton>
                ) : (
                  <></>
                )
              }
            />
          </div>
          <TextInput
            containerClassName="mb-5"
            label="Label"
            message={formDetailErrors.label?.message}
            {...formDetailRegister(`label`, { required: "Tidak boleh kosong" })}
          />
          {formDetailWatch("input") === "text" && (
            <Controller
              control={formDetailControl}
              name="type"
              rules={{ required: "Tidak boleh kosong" }}
              render={({ field: { value, onChange } }) => (
                <SelectInput
                  value={value}
                  containerClassName="mb-5"
                  label="Jenis"
                  message={(formDetailErrors as any).type?.message}
                  options={Object.keys(TextTypeMap).map((item) => ({
                    label: TextTypeMap[item as keyof typeof TextTypeMap],
                    value: item,
                  }))}
                  onChange={(value) =>
                    onChange((value as { value: string }).value)
                  }
                />
              )}
            />
          )}
          {formDetailWatch("input") === "numeric" && (
            <TextInput
              containerClassName="mb-5"
              label="Format"
              placeholder="####-####-#### (Opsional)"
              {...formDetailRegister("format")}
            />
          )}
          {(formDetailWatch("input") === "dropdown" ||
            formDetailWatch("input") === "checkbox" ||
            formDetailWatch("input") === "radio") && (
            <Controller
              control={formDetailControl}
              name="options"
              rules={{
                required: "Tidak boleh kosong",
              }}
              render={({ field: { value, onChange } }) => (
                <TextareaInput
                  containerClassName="mb-5"
                  label="Pilihan"
                  placeholder={`Laki-laki\nPerempuan`}
                  message={(formDetailErrors as any).options?.message}
                  value={value.join("\n")}
                  onChange={(e) => {
                    onChange(e.currentTarget.value.split("\n"));
                  }}
                />
              )}
            />
          )}

          {formDetailWatch("input") === "upload" && (
            <Controller
              control={formDetailControl}
              name="extensions"
              render={({ field: { value, onChange } }) => (
                <TextareaInput
                  containerClassName="mb-5"
                  label="Ekstensi Diizinkan"
                  placeholder={`png\njpg\njpeg`}
                  message={(formDetailErrors as any).options?.message}
                  value={value?.join("\n")}
                  onChange={(e) => {
                    onChange(e.currentTarget.value.split("\n"));
                  }}
                />
              )}
            />
          )}
          <Controller
            control={formDetailControl}
            name={`required`}
            render={({ field: { value, onChange } }) => (
              <SwitchInput
                labelPosition="right"
                value={value}
                onChange={onChange}
                label="Kolom Wajib"
              />
            )}
          />
          <ModalFooter>
            <Button type="submit" left={() => <RiCheckFill />}>
              Simpan
            </Button>
            {typeof formModal.state.value === "number" && (
              <Button
                type="button"
                left={() => <RiDeleteBin2Line />}
                className="ml-auto"
                coloring="danger"
                onClick={() => removeForm()}
              >
                Hapus
              </Button>
            )}
          </ModalFooter>
        </form>
      </Modal>
      <Modal title="Pilih Tipe" icon={RiPagesFill} control={typeModal.control}>
        <FormInput
          onChange={(val) => {
            formDetailReset(defaultDetailValue);
            formDetailReset(val);
            typeModal.control.hide();
          }}
        />
      </Modal>
    </>
  );
}
