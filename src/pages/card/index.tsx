import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { RiCheckFill, RiEye2Line, RiSettings2Fill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { listTemplates, saveCard } from "../../api/endpoints/card";
import { getForm } from "../../api/endpoints/form";
import SelectInput from "../../components/select_input";
import useApi from "../../hooks/api";
import useLayout from "../../hooks/layout";
import Button from "../../components/button";
import useSwal from "../../hooks/swal";

export default function Card() {
  const { setActive, setTitle } = useLayout();
  const { id } = useParams();
  const swal = useSwal();

  const templatesApi = useApi(listTemplates);
  const getFormApi = useApi(getForm);
  const saveCardApi = useApi(saveCard);

  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    formId: string;
    id: string;
    params: string[];
  }>({
    defaultValues: {
      formId: id!,
      id: "basic",
      params: [] as string[],
    },
  });

  const save = handleSubmit((data) =>
    saveCard(data)
      .then(() => {
        swal({
          icon: "success",
          title: "Berhasil",
          text: "Desain kartu telah berhasil disimpan",
        });
      })
      .catch(() => {})
  );

  const params = useMemo(() => {
    return templatesApi.data && templatesApi.data[watch("id")];
  }, [watch("id"), templatesApi.data]);

  useEffect(() => {
    setActive("Formulir");
    setTitle("Desain Kartu");

    getFormApi(id!)
      .then((data) => {
        reset({
          formId: data.id,
          id: data.card?.id || "basic",
          params: data.card?.params || [],
        });
      })
      .catch(() => {});

    templatesApi({}).catch(() => {});
  }, []);

  return (
    <div className="flex justify-start items-start space-x-5 p-5">
      <div className="w-2/5 bg-white border border-neutral-300 rounded">
        <div className="h-16 px-5 border-b border-neutral-300 bg-neutral-50 flex justify-start items-center space-x-3">
          <RiEye2Line className="text-primary-500" />
          <h2 className="flex-1 font-semibold font-montserrat text-neutral-900">
            Preview
          </h2>
        </div>
        <div className="p-5">
          <Controller
            control={control}
            rules={{ required: "Tidak boleh kosong" }}
            name={`id`}
            render={({ field: { value, onChange } }) => (
              <SelectInput
                message={errors.id?.message}
                containerClassName="mb-5"
                placeholder="Pilih Template"
                options={
                  templatesApi.data
                    ? Object.keys(templatesApi.data).map((item) => ({
                        label: templatesApi.data![item].name,
                        value: item,
                      }))
                    : []
                }
                value={value}
                onChange={(value) =>
                  onChange((value as { value: string }).value)
                }
              />
            )}
          />
          <div className="flex justify-center">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/v1/card/preview/${watch(
                "id"
              )}`}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white border border-neutral-300 rounded">
        <div className="h-16 px-5 border-b border-neutral-300 bg-neutral-50 flex justify-start items-center space-x-3">
          <RiSettings2Fill className="text-primary-500" />
          <h2 className="flex-1 font-semibold font-montserrat text-neutral-900">
            Setting
          </h2>
        </div>
        <div className="p-5">
          {params?.params.map((item, index) => (
            <Controller
              key={`${index}`}
              control={control}
              rules={{ required: "Tidak boleh kosong" }}
              name={`params.${index}`}
              render={({ field: { value, onChange } }) => (
                <SelectInput
                  message={errors.params && errors.params[index]?.message}
                  containerClassName="mb-5"
                  label={item.field}
                  options={getFormApi.data?.forms.map((item) => ({
                    label: item.label,
                    value: item.label,
                  }))}
                  value={value}
                  onChange={(value) =>
                    onChange((value as { value: string }).value)
                  }
                />
              )}
            />
          ))}
          <div className="flex justify-end items-center">
            <Button
              type="button"
              onClick={() => save()}
              left={() => <RiCheckFill />}
              loading={saveCardApi.loading}
            >
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
