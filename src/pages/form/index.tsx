import { useEffect } from "react";
import { CgAddR, CgSearch } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import TextInput from "../../components/text_input";
import useLayout from "../../hooks/layout";
import NotFound from "../../components/not_found";
import useApi from "../../hooks/api";
import { deleteForm, listForm } from "../../api/endpoints/form";
import FormList from "../../components/form_list";
import useSwal from "../../hooks/swal";

export default function Form() {
  const { setActive, setTitle } = useLayout();
  const navigate = useNavigate();
  const swal = useSwal();

  const listFormApi = useApi(listForm);
  const deleteFormApi = useApi(deleteForm);

  const onDelete = (id: string) => {
    swal({
      title: "Hapus Form?",
      text: "Anda akan menghapus form, tindakan ini tidak bisa dibatalkan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      customClass: {
        confirmButton: "!bg-danger-600",
      },
    }).then((result) => {
      if (result.isConfirmed)
        deleteFormApi(id).then(() => {
          listFormApi({}).catch(() => {});
        });
    });
  };

  useEffect(() => {
    setActive("Formulir");
    setTitle("Formulir");

    listFormApi({}).catch(() => {});
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
          onClick={() => navigate("/form/add")}
          type="button"
          left={() => <CgAddR />}
        >
          Buat Baru
        </Button>
      </div>
      {!listFormApi.loading && !listFormApi.data?.length ? (
        <NotFound />
      ) : (
        <div className="grid grid-flow-row grid-cols-4 gap-5 p-5 pt-0">
          {listFormApi.data?.map((item) => (
            <FormList
              id={`${item.id}`}
              title={item.name}
              created={item.createdAt}
              key={`${item.id}`}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
