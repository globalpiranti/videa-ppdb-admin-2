import useApi from "../../hooks/api";
import {
  announcement,
  updateAnnouncement,
} from "../../api/endpoints/announcement";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import AnnouncementModel, {
  AnnouncementList,
} from "../../api/models/announcement";
import TextInput from "../../components/text_input";
import Button from "../../components/button";
import { CgAddR } from "react-icons/cg";
import TextareaInput from "../../components/textarea_input";
import { BiMinus } from "react-icons/bi";
import { LuSend } from "react-icons/lu";
import { ChangeEvent, useEffect } from "react";
import useSwal from "../../hooks/swal";

const Accepted = () => {
  const announcementApi = useApi(announcement);
  const announcementUpdateApi = useApi(updateAnnouncement);
  const swal = useSwal();

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<AnnouncementModel>({
    defaultValues: {
      list: [{ title: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "list",
  });

  useEffect(() => {
    announcementApi("REJECTED")
      .then((data) => reset(data))
      .catch(() => {});
  }, []);

  const onSubmit = (data: AnnouncementModel) => {
    announcementUpdateApi({ data })
      .then(() => {
        swal({
          title: "Berhasil Update",
          text: "Pengumuman berhasil di update ",
          icon: "success",
        });
        announcementApi("REJECTED")
          .then((data) => reset(data))
          .catch(() => {});
      })
      .catch(() => {
        swal({
          title: "Gagal Update",
          text: "Periksa kembali data yang anda masukkan",
          icon: "error",
        });
      });
  };

  return (
    <div className="bg-white border border-neutral-300 rounded p-4 lg:p-8">
      <h2 className="text-xl font-bold pb-4 border-b">Pengumuman (DITOLAK)</h2>
      {fields.map((_, idx) => (
        <div key={idx} className="my-6 w-full flex gap-3">
          <h3 className="font-bold">{idx + 1}.</h3>
          <div className="space-y-3 w-full">
            <Controller
              name={`list.${idx}.title`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextInput
                  label="Judul"
                  value={value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onChange(e.target.value);
                  }}
                  className="w-full"
                />
              )}
            />
            {errors.list?.[idx]?.title && (
              <p className="text-danger-500">
                {errors.list[idx].title.message}
              </p>
            )}
            <Controller
              name={`list.${idx}.description`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextareaInput
                  label="Deskripsi"
                  value={value}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                    onChange(e.target.value);
                  }}
                  rows={5}
                />
              )}
            />
            {errors.list?.[idx]?.description && (
              <p className="text-danger-500">
                {errors.list[idx].description.message}
              </p>
            )}
          </div>
        </div>
      ))}
      <div className="flex mt-5 justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            sizing="sm"
            coloring="danger"
            className="hover:bg-danger-700"
            left={() => <BiMinus />}
            onClick={() => {
              remove(fields.length - 1);
            }}
          >
            Kurangi
          </Button>
          <Button
            type="button"
            sizing="sm"
            className="hover:bg-primary-700"
            left={() => <CgAddR />}
            onClick={() => {
              append(new AnnouncementList());
            }}
          >
            Tambah
          </Button>
        </div>
        <Button
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
          type="submit"
          sizing="sm"
          coloring="success"
          className="hover:bg-success-700"
          left={() => <LuSend />}
          loading={announcementUpdateApi.loading}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Accepted;
