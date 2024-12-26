import { RiPagesFill } from "react-icons/ri";
import Form from "../../api/models/form";
import Button from "../../components/button";
import Modal, { ModalFooter } from "../../components/modal";
import useModal from "../../hooks/modal";
import TextInput from "../../components/text_input";
import { useForm } from "react-hook-form";
import FormCategory from "../../api/models/form_category";
import { CgChevronRight } from "react-icons/cg";
import CardButton from "../../components/card_button";
import { FaRegListAlt } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { FormInputMap } from "./compose";
import Checkbox from "../../components/checkbox";
import { ChangeEvent, useEffect } from "react";
import useApi from "../../hooks/api";
import {
  createFormCategory,
  updateFormCategory,
} from "../../api/endpoints/form_category";
import useSwal from "../../hooks/swal";
import { useParams } from "react-router-dom";

const Category = ({
  forms,
  category,
  refetchCategory,
}: {
  forms: Form["forms"];
  category: FormCategory | undefined;
  refetchCategory: () => boolean;
}) => {
  const { id } = useParams();
  const categoryModal = useModal<FormCategory>();
  const formsModal = useModal();
  const swal = useSwal();
  const createCategoryAPi = useApi(createFormCategory);
  const updateCategoryApi = useApi(updateFormCategory);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormCategory>();

  const onSubmit = (data: FormCategory) => {
    if ((data.formsIndex || []).length === 0) {
      return;
    }
    (data.id ? updateCategoryApi : createCategoryAPi)(data)
      .then(() => {
        swal({
          title: "Berhasil",
          text: "Kategori form berhasik disimpan",
          icon: "success",
        });
        categoryModal.control.hide();
        reset({
          ...watch(),
          formsIndex: [],
          name: "",
        });
        refetchCategory();
      })
      .catch(() => {
        swal({
          title: "Gagal",
          text: "Periksa koneksi internet dan data yang Anda masukkan",
          icon: "error",
        });
      });
  };

  useEffect(() => {
    if (id) {
      setValue("formId", id);
    }
  }, [id]);

  useEffect(() => {
    if (category) {
      reset(category);
      categoryModal.control.show();
    }
  }, [category]);

  console.log(watch());

  return (
    <>
      <Button
        sizing="sm"
        coloring="primary"
        onClick={() => {
          categoryModal.control.show();
        }}
      >
        Set Kategori
      </Button>

      <Modal
        title="Set Kategori Form"
        icon={RiPagesFill}
        control={categoryModal.control}
      >
        <div className="px-5 py-2">
          <TextInput
            label="Nama Kategori"
            placeholder="Contoh: Data Pribadi atau Data Orang Tua"
            {...register("name", { required: "Nama kategori harus diisi" })}
            message={errors.name?.message}
          />
          <button
            type="button"
            onClick={() => {
              formsModal.control.show();
            }}
            className="flex justify-between items-center rounded hover:bg-neutral-200 my-4 p-4 border border-neutral-200 w-full text-left"
          >
            <div className="flex items-center gap-3">
              <FaRegListAlt className="text-lg text-primary-600" />
              {((watch("formsIndex") as number[]) || []).length > 0 ? (
                <div>
                  {forms.map((item, i) => (
                    <div key={i}>
                      {((watch("formsIndex") as number[]) || []).includes(i) ? (
                        <span className="flex-1 font-ubuntu font-medium">
                          {" " + item.label + ", "}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="flex-1 font-ubuntu font-medium">
                  Dafta Kolom
                </span>
              )}
            </div>
            <CgChevronRight className="text-neutral-600 text-xl" />
          </button>

          {errors.formsIndex?.message && (
            <div className="text-sm text-danger-600 mt-1">
              {errors.formsIndex?.message}
            </div>
          )}

          <div className="flex mt-5 justify-end">
            <Button
              onClick={() => handleSubmit(onSubmit)()}
              type="submit"
              sizing="sm"
              coloring="success"
              className="hover:bg-success-700"
              left={() => <LuSend />}
              disabled={createCategoryAPi.loading || updateCategoryApi.loading}
              loading={createCategoryAPi.loading || updateCategoryApi.loading}
            >
              Simpan
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        icon={FaRegListAlt}
        title="Dafta Kolom"
        control={formsModal.control}
      >
        {(forms || []).map((item, index) => (
          <div className="px-5 py-2 flex gap-6" key={`${index}`}>
            <CardButton
              type="button"
              className="border hover:bg-neutral-200 border-neutral-200"
              icon={FormInputMap[item.input].icon}
            >
              {item.label}
            </CardButton>
            <div className="relative self-center bg-primary-200 rounded">
              <Checkbox
                checked={((watch(`formsIndex`) as number[]) || []).includes(
                  index
                )}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const currentIndexes =
                    (watch("formsIndex") as number[]) || [];

                  if (e.target.checked) {
                    if (!currentIndexes.includes(index)) {
                      const newIndexes = [...currentIndexes, index].sort(
                        (a, b) => a - b
                      );
                      const minIndex = Math.min(...newIndexes);
                      const maxIndex = Math.max(...newIndexes);

                      const filledIndexes = Array.from(
                        { length: maxIndex - minIndex + 1 },
                        (_, i) => minIndex + i
                      );

                      setValue("formsIndex", filledIndexes);
                    }
                  } else {
                    const newIndexes = currentIndexes.filter(
                      (item) => item < index
                    );
                    setValue("formsIndex", newIndexes);
                  }
                }}
                containerClassName="self-center"
              />
            </div>
          </div>
        ))}

        <ModalFooter>
          <Button
            onClick={() => formsModal.control.hide()}
            type="button"
            className="hover:bg-primary-700"
          >
            Simpan
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Category;
