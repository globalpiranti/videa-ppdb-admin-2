import { Controller, useFieldArray, useForm } from "react-hook-form";
import { default as ExamModel } from "../../api/models/exam";
import { useEffect, useRef, useState } from "react";
import useLayout from "../../hooks/layout";
import Button from "../../components/button";
import useApi from "../../hooks/api";
import { createExam, examDetail } from "../../api/endpoints/exam";
import Form from "./form";
import { RiArrowRightLine } from "react-icons/ri";
import TextInput from "../../components/text_input";
import { useDropzone } from "react-dropzone";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { ToolbarSlot, toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import type Attachment from "../../api/models/attachment";
import useModal from "../../hooks/modal";
import Modal, { ModalFooter } from "../../components/modal";
import DateTime from "../../components/date_time";
import SelectInput, { OptionType } from "../../components/select_input";
import { uploadFile } from "../../api/endpoints/file";
import { useNavigate, useParams } from "react-router-dom";
import { listPath } from "../../api/endpoints/path";
import useSwal from "../../hooks/swal";
import moment from "moment";
import Path from "../../api/models/path";

const ExamDetail = () => {
  const { setActive, setTitle } = useLayout();
  const [addNumber, setAddNumber] = useState("1");
  const [pdf, setPdf] = useState<string | null>(null);
  const uploadFileApi = useApi(uploadFile(() => {}));
  const toolbarPluginInstance = toolbarPlugin();
  const examModal = useModal();
  const { Toolbar, renderDefaultToolbar } = toolbarPluginInstance;
  const navigate = useNavigate();
  const swal = useSwal();
  const { id } = useParams();

  const createExamApi = useApi(createExam);
  const listPathsApi = useApi(listPath);
  const examDetailApi = useApi(examDetail);

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    register,
  } = useForm<ExamModel>();

  const {
    fields: forms,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "forms",
  });

  const onDrop = useRef<(file: File) => void>();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onDrop.current && onDrop.current(files[0] as File),
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  const onSubmit = (data: ExamModel) => {
    uploadFileApi([data.pdf as unknown as File])
      .then((attachment) => {
        createExamApi({ ...data, pdf: attachment[0] })
          .then(() => {
            examModal.control.hide();
            navigate("/exam");
          })
          .catch(() => {
            swal({
              title: "Gagal",
              text: "Periksa koneksi internet dan data yang Anda masukkan",
              icon: "error",
            });
          });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setActive("Soal Ujian");
    setTitle("Buat Soal");

    listPathsApi({}).catch(() => {});
  }, []);

  useEffect(() => {
    if (id) {
      examDetailApi(id).then((data) => {
        reset({
          ...data,
          startAt: moment(data?.startAt).format("YYYY-MM-DDTHH:mm"),
          finishAt: moment(data?.finishAt).format("YYYY-MM-DDTHH:mm"),
          paths: data?.paths?.map((path) => path.id) as unknown as Path[],
        });
      });
    }
  }, [id]);

  console.log(watch());

  useEffect(() => {
    if (watch("pdf") instanceof File) {
      setPdf(URL.createObjectURL(watch("pdf") as unknown as File));
    } else if (watch("pdf")) {
      setPdf((watch("pdf") as Attachment).url!);
    } else {
      setPdf(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("pdf")]);

  return (
    <div className="m-5">
      <div className="bg-white relative h-[73vh] overflow-hidden border border-neutral-400">
        <div className="grid grid-cols-3">
          <div className="col-span-2 border-r pb-52 h-screen border-neutral-400">
            <Controller
              control={control}
              name="pdf"
              rules={{ required: "Tidak boleh kosong" }}
              render={({ field: { onChange } }) => {
                onDrop.current = onChange;
                if (pdf)
                  return (
                    <div className="h-full bg-white relative overflow-auto">
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <div className="bg-white mb-2 p-3 pr-5 flex items-center shadow justify-start space-x-3 sticky top-0 z-10">
                          <Toolbar>
                            {renderDefaultToolbar((slot: ToolbarSlot) => {
                              return Object.assign({}, slot, {
                                SwitchTheme: () => <></>,
                                Open: () => <></>,
                              });
                            })}
                          </Toolbar>
                          <Button
                            type="button"
                            coloring="dark"
                            sizing="sm"
                            onClick={() => onChange(null)}
                          >
                            Ganti
                          </Button>
                        </div>
                        <div className="flex-1">
                          <Viewer
                            plugins={[toolbarPluginInstance]}
                            fileUrl={pdf}
                          />
                        </div>
                      </Worker>
                    </div>
                  );
                return (
                  <div className="w-full h-full">
                    <div className="w-full h-full bg-white border border-white p-5">
                      <div
                        className={`w-full h-full border-4 border-dashed border-neutral-300 rounded-lg flex justify-center items-center text-center font-bold text-lg cursor-pointer ${
                          isDragActive
                            ? "bg-info-50 border-info-300"
                            : "hover:border-neutral-600"
                        } p-5`}
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <span className="text-info-800">Lepaskan disini</span>
                        ) : (
                          "Tarik atau klik untuk memilih file"
                        )}
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </div>
          <div className="col-span-1 overflow-y-auto py-4 h-[75vh]">
            {(forms || []).map((_, index) => (
              <Form
                key={index}
                setValue={setValue}
                control={control}
                remove={remove}
                index={index}
                watch={watch}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 py-2 border border-t-0 border-neutral-400 flex justify-start items-center bg-white">
        <TextInput
          type="text"
          value={addNumber}
          containerClassName="w-12"
          className="text-center"
          onChange={(e) => setAddNumber((e.target as HTMLInputElement).value)}
        />
        <Button
          type="button"
          sizing="sm"
          className="ml-3 mr-auto"
          onClick={() => {
            const allForm = [...(watch("forms") || [])];
            const last = allForm?.pop();
            for (let i = 0; i < Number(addNumber); i++) {
              append({
                point: last?.point || 1,
                type: last?.type || "multiple_choice",
                choices: last?.choices || [],
                answer: last?.answer || 0,
              });
            }
          }}
        >
          Tambah
        </Button>
        <Button
          onClick={() => examModal.control.show()}
          type="button"
          right={() => <RiArrowRightLine className="text-base" />}
          className="flex justify-center items-center space-x-2"
          sizing="sm"
        >
          Lanjut
        </Button>
      </div>

      <Modal control={examModal.control} title="Detail Ujian">
        <form className="space-y-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Tidak boleh kosong" }}
            render={({ field: { value, onChange } }) => (
              <TextInput
                label="Nama Ujian"
                value={value}
                onChange={(e) => onChange((e.target as HTMLInputElement).value)}
                message={errors.name?.message}
              />
            )}
          />
          {/* <Controller
            control={control}
            name="startAt"
            rules={{ required: "Tidak boleh kosong" }}
            render={({ field: { value, onChange } }) => (
              <DateTime
                label={"Mulai"}
                containerClassName="mb-5"
                message={errors.startAt?.message}
                value={(value || moment()).format("DD/MM/YYYY")}
                onChange={(val) => onChange(val)}
              />
            )}
          />
          <Controller
            control={control}
            name="finishAt"
            rules={{ required: "Tidak boleh kosong" }}
            render={({ field: { value, onChange } }) => (
              <DateTime
                label={"Berakhir"}
                containerClassName="mb-5"
                message={errors.finishAt?.message}
                value={(value || moment()).format("DD/MM/YYYY")}
                onChange={(val) => onChange(val)}
              />
            )}
          /> */}
          <DateTime
            label={"Mulai"}
            containerClassName="mb-5"
            message={errors.startAt?.message}
            {...register("startAt", { required: "Tidak boleh kosong" })}
          />
          <DateTime
            label={"Selesai"}
            containerClassName="mb-5"
            message={errors.finishAt?.message}
            {...register("finishAt", { required: "Tidak boleh kosong" })}
          />
          <Controller
            control={control}
            name="paths"
            rules={{ required: "Tidak boleh kosong" }}
            render={({ field: { value, onChange } }) => (
              <SelectInput
                label="Jalur Pendaftaran"
                options={(listPathsApi.data || []).map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={value as unknown as string[]}
                onChange={(val) => {
                  onChange((val as OptionType[]).map((item) => item.value));
                }}
                message={errors.paths?.message}
                isMulti
              />
            )}
          />
        </form>
        <ModalFooter>
          <div className="flex justify-end">
            <Button
              loading={createExamApi.loading || uploadFileApi.loading}
              type="button"
              onClick={() => handleSubmit(onSubmit)()}
            >
              Simpan
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ExamDetail;
