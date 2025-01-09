import { useFieldArray, useForm } from "react-hook-form";
import { default as ExamModel } from "../../api/models/exam";
import { useEffect, useState } from "react";
import useLayout from "../../hooks/layout";
import Button from "../../components/button";
import useApi from "../../hooks/api";
import { createExam } from "../../api/endpoints/exam";
import Form from "./form";
import { RiArrowRightLine } from "react-icons/ri";
import TextInput from "../../components/text_input";

const ExamDetail = () => {
  const { setActive, setTitle } = useLayout();
  const [addNumber, setAddNumber] = useState("1");
  const createExamApi = useApi(createExam);
  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<ExamModel>();

  const {
    fields: forms,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "forms",
  });

  useEffect(() => {
    setActive("Soal Ujian");
    setTitle("Buat Soal");
  }, []);

  return (
    <div className="m-5">
      <div className="flex rounded border bg-white justify-between items-center border-neutral-400 px-4 py-3">
        <h2 className="font-semibold text-xl">Buat Soal</h2>
      </div>
      <div className="bg-white relative h-[60vh] overflow-y-scroll border mt-4 border-neutral-400 px-6">
        {(forms || []).map((form, index) => (
          <Form
            key={index}
            setValue={setValue}
            watch={watch}
            index={index}
            control={control}
            remove={remove}
          />
        ))}
      </div>
      <div className="p-5 border-t border-neutral-200 flex justify-start items-center bg-white">
        <TextInput
          type="text"
          value={addNumber}
          containerClassName="w-12"
          className="text-center"
          onChange={(e) => setAddNumber((e.target as HTMLInputElement).value)}
        />
        <Button
          type="button"
          className="ml-3 mr-auto"
          onClick={() => {
            const allForm = [...(watch("forms") || [])];
            const last = allForm?.pop();
            for (let i = 0; i < Number(addNumber); i++) {
              append({
                point: last?.point || 1,
                type: last?.type || "multiple_choice",
                options: last?.options || [],
                answer: last?.answer || 0,
              });
            }
          }}
        >
          Tambah
        </Button>
        <Button
          type="button"
          right={() => <RiArrowRightLine className="text-base" />}
          className="flex justify-center items-center space-x-2"
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
};

export default ExamDetail;
