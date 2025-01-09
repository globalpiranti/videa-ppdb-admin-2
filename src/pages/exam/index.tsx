import { useEffect } from "react";
import useLayout from "../../hooks/layout";
import Button from "../../components/button";
import ListWithHeader from "../../components/listwith_header";
import useApi from "../../hooks/api";
import { deleteExam, examList } from "../../api/endpoints/exam";
import { PiExam } from "react-icons/pi";
import NotFound from "../../components/not_found";
import { useNavigate } from "react-router-dom";
import ContextLink from "../../components/context_link";
import { RiDeleteBin4Fill } from "react-icons/ri";
import useSwal from "../../hooks/swal";
import { BiDotsVertical } from "react-icons/bi";
import Popup from "reactjs-popup";

const Exam = () => {
  const { setActive, setTitle } = useLayout();
  const navigate = useNavigate();
  const swal = useSwal();
  const listExamApi = useApi(examList);
  const deleteExamApi = useApi(deleteExam);

  const onDelete = (id: string, name: string) => {
    swal({
      title: "Apakah anda yakin?",
      text: "Anda akan menghapus soal ujian " + name,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Hapus",
    }).then((res) => {
      if (res.isConfirmed) {
        deleteExamApi(id)
          .then(() => {
            listExamApi({}).catch(() => {});
          })
          .catch(() => {});
      }
    });
  };

  useEffect(() => {
    setTitle("Soal Ujian");
    setActive("Soal Ujian");

    listExamApi({}).catch(() => {});
  }, []);
  return (
    <div className="m-4 h-[80vh] overflow-hidden">
      <div className="flex rounded border bg-white justify-between items-center border-neutral-400 px-4 py-3">
        <h2 className="font-semibold text-xl">Daftar Soal</h2>
        <Button
          onClick={() => navigate("create")}
          sizing="sm"
          coloring="success"
        >
          Tambah Soal
        </Button>
      </div>
      <div className="h-screen overflow-y-auto bg-white border border-neutral-400 pb-52 mt-6">
        <div className="grid grid-cols-6 p-3 bg-neutral-200 sticky top-0 z-10 border-neutral-400 border-b font-semibold pl-4 items-center w-full">
          <div>#</div>
          <div>Nama</div>
          <div>Jalur Pendaftaran</div>
          <div>Mulai Pada</div>
          <div>Berakhir Pada</div>
          <div>Aksi</div>
        </div>
        {(listExamApi.loading || deleteExamApi.loading) && (
          <div className="flex justify-center items-center h-full">
            <div className="px-10 py-3 text-neutral-800">
              <div className="loader" />
            </div>
          </div>
        )}
        {(!listExamApi.data || listExamApi.data.length === 0) && (
          <div className="mt-8">
            <NotFound />
          </div>
        )}
        {(listExamApi.data || [])?.map((item, index) => (
          <ListWithHeader
            key={`${index}`}
            details={[
              {
                element: (
                  <div className="flex gap-2 items-center">
                    <span className="text-lg font-semibold">{index + 1}.</span>
                  </div>
                ),
              },
              { element: item.name },
              { element: item.paths.map((path) => path.name).join(", ") },
              { element: item.startAt.format("DD/MM/YYYY HH:mm") },
              { element: item.finishAt.format("DD/MM/YYYY HH:mm") },
              {
                element: (
                  <Popup
                    trigger={
                      <button
                        type="button"
                        className="p-2 -mr-4 -mb-2 relative z-10 bg-transparent hover:bg-primary-200 rounded-full"
                      >
                        <BiDotsVertical />
                      </button>
                    }
                    position="left top"
                  >
                    <ContextLink
                      className="text-danger-600"
                      to="/"
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete(item.id, item.name);
                      }}
                      icon={RiDeleteBin4Fill}
                    >
                      Hapus
                    </ContextLink>
                  </Popup>
                ),
              },
            ]}
            icon={PiExam}
            to={`${item.id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Exam;
