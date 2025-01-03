import { useEffect } from "react";
import { BiCheck, BiUser, BiX } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { presentationMap } from ".";
import {
  acceptEnrollment,
  getEnrollment,
  rejectEnrollment,
} from "../../api/endpoints/enrollment";
import TabledInfo from "../../components/tabled_info";
import useApi from "../../hooks/api";
import useLayout from "../../hooks/layout";
import Button from "../../components/button";
import useSwal from "../../hooks/swal";

export default function EnrollmentDetail() {
  const { setActive, setTitle } = useLayout();
  const { id } = useParams();
  const { setNeedActions } = useLayout();
  const swal = useSwal();

  const getEnrollmentApi = useApi(getEnrollment);
  const acceptEnrollmentApi = useApi(acceptEnrollment);
  const rejectEnrollmentApi = useApi(rejectEnrollment);

  const updateAcceptance = (accept: boolean) => {
    swal({
      title: (accept ? "Terima" : "Belum Terima") + " Pendaftar?",
      html: `Anda akan mengubah status pendaftar ini menjadi <b>${
        accept ? "Diterima" : "Belum Diterima"
      }</b>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Lanjutkan",
    }).then((result) => {
      if (result.isConfirmed)
        (accept ? acceptEnrollmentApi : rejectEnrollmentApi)(id!)
          .then(() => {
            getEnrollmentApi(id!).catch(() => {});
          })
          .catch(() => {});
    });
  };

  useEffect(() => {
    getEnrollmentApi(id!).catch(() => {});
  }, [id]);

  useEffect(() => {
    setActive("Pendaftar");
    setTitle("Data Pendaftar");
  }, []);

  return (
    <>
      <div className="p-5 bg-white border-b border-neutral-300 flex justify-start items-center space-x-5">
        <div className="w-16 h-16 bg-neutral-300 rounded flex justify-center items-center text-4xl border border-neutral-400">
          {getEnrollmentApi.data?.avatar ? (
            <img
              src={getEnrollmentApi.data?.avatar}
              className="w-full h-full object-cover"
              alt=""
            />
          ) : (
            <BiUser />
          )}
        </div>
        <div className="flex-1">
          <div className="font-bold text-xl text-neutral-900 font-ubuntu">
            {getEnrollmentApi.data?.name}
          </div>
          <div className="mt-1">{getEnrollmentApi.data?.email}</div>
        </div>

        <div className="flex rounded overflow-hidden border border-neutral-400 p-1 space-x-1">
          {(acceptEnrollmentApi || rejectEnrollmentApi).loading ? (
            <div className="px-10 py-3 text-neutral-400">
              <div className="loader" />
            </div>
          ) : (
            <>
              <Button
                type="button"
                coloring={
                  getEnrollmentApi.data?.status === "REJECTED"
                    ? "danger"
                    : "white"
                }
                sizing="sm"
                left={() => <BiX className="text-lg" />}
                onClick={() => {
                  updateAcceptance(false);
                  setNeedActions((prev) => {
                    return {
                      ...prev,
                      enroll: prev.enroll !== 0 ? prev.enroll - 1 : 0,
                    };
                  });
                }}
                disabled={getEnrollmentApi.data?.status === "REJECTED"}
              >
                Belum Diterima
              </Button>
              <Button
                type="button"
                coloring={
                  getEnrollmentApi.data?.status === "ACCEPTED"
                    ? "success"
                    : "white"
                }
                sizing="sm"
                left={() => <BiCheck className="text-lg" />}
                onClick={() => {
                  updateAcceptance(true);
                  setNeedActions((prev) => {
                    return {
                      ...prev,
                      enroll: prev.enroll !== 0 ? prev.enroll - 1 : 0,
                    };
                  });
                }}
                disabled={getEnrollmentApi.data?.status === "ACCEPTED"}
              >
                Diterima
              </Button>
            </>
          )}
        </div>
      </div>
      <div>
        <TabledInfo titleClassName="w-64" title="Jalur Pendaftaran">
          {getEnrollmentApi.data?.wave?.path?.name}
        </TabledInfo>
        <TabledInfo titleClassName="w-64" title="Gelombang">
          {getEnrollmentApi.data?.wave?.name}
        </TabledInfo>
        {getEnrollmentApi.data?.form?.map((item, index) => {
          const Presentation = presentationMap[item.input];

          return (
            <TabledInfo
              key={`${index}`}
              titleClassName="w-64"
              title={item.label}
            >
              <Presentation value={item.value} />
            </TabledInfo>
          );
        })}
      </div>
    </>
  );
}
