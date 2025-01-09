import { useEffect } from "react";
import useLayout from "../../hooks/layout";
import Button from "../../components/button";
import ListWithHeader from "../../components/ListWithHeader";
import useApi from "../../hooks/api";
import { examList } from "../../api/endpoints/exam";
import { PiExam } from "react-icons/pi";
import NotFound from "../../components/not_found";
import { useNavigate } from "react-router-dom";

const Exam = () => {
  const { setActive, setTitle } = useLayout();
  const listExamApi = useApi(examList);
  const navigate = useNavigate();

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
        {listExamApi.loading && (
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
                    <span className="text-lg">index + 1</span>
                  </div>
                ),
              },
              { element: item.name },
              { element: item.path.name },
              { element: item.startAt.format("DD-MM-YYYY") },
              { element: item.finishAt.format("DD-MM-YYYY") },
            ]}
            icon={PiExam}
            to={`/enrollment/${item.id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Exam;
