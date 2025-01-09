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
  watch: UseFormWatch<Partial<Exam>>;
  setValue: UseFormSetValue<Partial<Exam>>;
}) => {
  return (
    <div
      key={index}
      className="grid grid-cols-2 py-8 border-neutral-400 border-b gap-4"
    >
      <div></div>
      <div>
        <div className="flex mb-4 items-center justify-end gap-4">
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
                containerClassName="w-[180px]"
              />
            )}
          />
          <Button
            onClick={() => {
              remove(index);
            }}
            coloring="danger"
            sizing="sm"
            right={() => <FiPlus className="text-lg" />}
          >
            Hapus
          </Button>
        </div>
        <Controller
          name={`forms.${index}.options`}
          control={control}
          rules={{ required: "Soal harus diisi" }}
          render={({ field: { value: options, onChange } }) => (
            <div className="flex gap-2 justify-end">
              {(options || []).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {((options as unknown as string[])?.length || 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const i = ((options as string[]) || [])?.length - 1;
                        ((options as string[]) || []).splice(i, 1);
                        onChange(options);
                        if (watch(`forms.${index}.answer`) === i) {
                          setValue(`forms.${index}.answer`, undefined);
                        }
                      }}
                      className="w-8 h-8 flex justify-center items-center bg-neutral-200 border border-neutral-300 rounded-full"
                    >
                      -
                    </button>
                  )}
                  <div className="flex gap-2 w-full items-center">
                    <Controller
                      control={control}
                      name={`forms.${index}.answer`}
                      rules={{ required: true }}
                      render={({ field: { value: correct, onChange } }) => (
                        <>
                          {(options instanceof Array
                            ? (options as unknown as string[])
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
              ))}
              {((options as unknown as string[])?.length || 0) < 5 && (
                <button
                  type="button"
                  onClick={() =>
                    onChange([
                      ...((options as string[]) || []),
                      mapping[(options as unknown as string[])?.length || 0],
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
