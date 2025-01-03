import { useEffect } from "react";
import useLayout from "../../hooks/layout";
import TextareaInput from "../../components/textarea_input";
import useApi from "../../hooks/api";
import { settings, updateSettings } from "../../api/endpoints/settings";
import { useForm } from "react-hook-form";
import type SettingModel from "../../api/models/settings";
import ImageInput from "../../components/image_input";
import TextInput from "../../components/text_input";
import Button from "../../components/button";
import { IoIosArrowDown } from "react-icons/io";
import useSwal from "../../hooks/swal";

const Settings = () => {
  const { setActive, setTitle } = useLayout();
  const settingsApi = useApi(settings);
  const updateSettingsApi = useApi(updateSettings);
  const swal = useSwal();

  const { register, reset, watch, setValue, handleSubmit } =
    useForm<SettingModel>();

  const onSave = (data: SettingModel) => {
    updateSettingsApi(data)
      .then(() => {
        swal({
          icon: "success",
          title: "Berhasil",
          text: "Berhasil Menyimpan Pengaturan",
        });
      })
      .catch(() => {
        swal({
          icon: "error",
          title: "Gagal",
          text: "Periksa kembali data yang Anda masukkan",
        });
      });
  };

  useEffect(() => {
    settingsApi({})
      .then((data) => {
        reset(data);
      })
      .catch(() => {});
    setActive("Pengaturan");
    setTitle("Pengaturan");
  }, []);

  console.log(watch());
  return (
    <>
      <div className="p-4 lg:p-8">
        <div className="bg-white border border-neutral-300 rounded p-4 lg:p-8">
          <h2 className="text-xl font-bold pb-4 border-b">Manajemen Konten</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="mt-4 flex flex-col gap-4">
              <h3 className="text-lg font-semibold">1. Banner Atas</h3>
              <TextareaInput {...register("banner.top.title")} label="Judul" />
              <TextareaInput
                {...register("banner.top.description")}
                label="Deskripsi"
                rows={5}
              />
              <ImageInput
                label="Gambar"
                containerClassName="mb-5"
                value={watch("banner.top.image") || undefined}
                onChange={(val) => setValue("banner.top.image", val)}
              />
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <h3 className="text-lg font-semibold">2. Banner Bawah</h3>
              <TextareaInput
                {...register("banner.bottom.title")}
                label="Judul"
              />
              <TextareaInput
                {...register("banner.bottom.description")}
                label="Deskripsi"
                rows={5}
              />
              <ImageInput
                label="Gambar"
                containerClassName="mb-5"
                value={watch("banner.bottom.image") || undefined}
                onChange={(val) => setValue("banner.bottom.image", val)}
              />
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold pb-4 border-b">
              Informasi Kontak
            </h2>
            <div className="mt-6 grid lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold">Email</h3>
                <div className="flex gap-2">
                  <div className="grid">
                    {((watch("contact.email") as string[]) || []).map(
                      (_, idx) => (
                        <div key={idx} className="flex gap-2 mb-4">
                          <h5>{idx + 1}.</h5>
                          <TextInput {...register(`contact.email.${idx}`)} />
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        const newEmails = [...(watch("contact.email") || [])];
                        newEmails.pop();
                        setValue(`contact.email`, newEmails);
                      }}
                      className="border border-neutral-300 hover:bg-primary-50 hover:text-primary-600 rounded hover:border-primary-600"
                    >
                      <IoIosArrowDown className="text-lg rotate-180" />
                    </button>
                    <button
                      onClick={() => {
                        const newEmails = [...(watch("contact.email") || [])];
                        newEmails.push("");
                        setValue(`contact.email`, newEmails);
                      }}
                      className="border border-neutral-300 hover:bg-primary-50 hover:text-primary-600 rounded hover:border-primary-600"
                    >
                      <IoIosArrowDown className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">No Telpon / Whatsapp</h3>
                <div className="flex gap-2">
                  <div className="grid">
                    {((watch("contact.phone") as string[]) || []).map(
                      (_, idx) => (
                        <div key={idx} className="flex gap-2 mb-4">
                          <h5>{idx + 1}.</h5>
                          <TextInput {...register(`contact.phone.${idx}`)} />
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        const newPhones = [...(watch("contact.phone") || [])];
                        newPhones.pop();
                        setValue(`contact.phone`, newPhones);
                      }}
                      className="border border-neutral-300 hover:bg-primary-50 hover:text-primary-600 rounded hover:border-primary-600"
                    >
                      <IoIosArrowDown className="text-lg rotate-180" />
                    </button>
                    <button
                      onClick={() => {
                        const newPhones = [...(watch("contact.phone") || [])];
                        newPhones.push("");
                        setValue(`contact.phone`, newPhones);
                      }}
                      className="border border-neutral-300 hover:bg-primary-50 hover:text-primary-600 rounded hover:border-primary-600"
                    >
                      <IoIosArrowDown className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>

              <TextareaInput {...register("contact.address")} label="Alamat" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => {
                handleSubmit(onSave)();
              }}
              type="button"
              loading={updateSettingsApi.loading}
            >
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
