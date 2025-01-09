import {
  Control,
  Controller,
  UseFieldArrayRemove,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import Exam from "../../api/models/exam";
import SelectInput, { OptionType } from "../../components/select_input";
import Button from "../../components/button";
import { FiPlus } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

const mapping = ["A", "B", "C", "D", "E"];

const Form = ({
  //   form,
  index,
  control,
  remove,
  watch,
  setValue,
}: {
  //   form: ExamForm;
  index: number;
  control: Control<Exam, any>;
  remove: UseFieldArrayRemove;
  watch: UseFormWatch<Exam>;
  setValue: UseFormSetValue<Exam>;
}) => {
  return (
    <div className="border-b py-6 px-8 border-neutral-400">
      <div className="flex mb-4 items-center justify-between gap-4">
        <h2 className="font-semibold text-lg">{index + 1}.</h2>
        <Controller
          control={control}
          name={`forms.${index}.type`}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <SelectInput
              value={value}
              onChange={(e) => onChange((e as OptionType).value)}
              options={[
                { label: "Pilihan Ganda", value: "multiple_choice" },
                { label: "Esai", value: "essay" },
              ]}
              containerClassName="w-full"
            />
          )}
        />
        <Button
          onClick={() => {
            remove(index);
          }}
          coloring="danger"
          sizing="sm"
          right={() => <FaRegTrashAlt className="text-lg" />}
        ></Button>
      </div>
      <div className="flex justify-center">
        <Controller
          name={`forms.${index}.choices`}
          control={control}
          rules={{ required: "Soal harus diisi" }}
          render={({ field: { value: choices, onChange } }) => (
            <div className="flex gap-2 justify-end">
              {((choices as unknown as string[])?.length || 0) > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const i = ((choices as string[]) || [])?.length - 1;
                    ((choices as string[]) || []).splice(i, 1);
                    onChange(choices);
                    if (watch(`forms.${index}.answer`) === i) {
                      setValue(`forms.${index}.answer`, undefined);
                    }
                  }}
                  className="w-8 h-8 flex justify-center items-center bg-neutral-200 border border-neutral-300 rounded-full"
                >
                  -
                </button>
              )}
              <div className="flex items-center gap-2">
                <div className="flex gap-2 w-full items-center">
                  <Controller
                    control={control}
                    name={`forms.${index}.answer`}
                    rules={{ required: true }}
                    render={({ field: { value: correct, onChange } }) => (
                      <>
                        {(choices instanceof Array
                          ? (choices as unknown as string[])
                          : []
                        ).map((item, idx) => (
                          <button
                            key={`${idx}`}
                            className={`w-8 h-8 flex justify-center items-center border text-xs rounded-full ${
                              correct === idx
                                ? "bg-success-600 text-white border-success-700"
                                : "bg-white border-neutral-300"
                            }`}
                            onClick={() => {
                              onChange(idx);
                            }}
                            type="button"
                          >
                            {item}
                          </button>
                        ))}
                      </>
                    )}
                  />
                </div>
              </div>
              {((choices as unknown as string[])?.length || 0) < 5 && (
                <button
                  type="button"
                  onClick={() =>
                    onChange([
                      ...((choices as string[]) || []),
                      mapping[(choices as unknown as string[])?.length || 0],
                    ])
                  }
                  className="w-8 h-8 flex justify-center items-center bg-neutral-200 border border-neutral-300 rounded-full"
                >
                  +
                </button>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Form;
