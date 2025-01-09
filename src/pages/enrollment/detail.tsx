import { useEffect } from "react";
import { BiCheck, BiUser, BiX } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { presentationMap } from ".";
import {
  acceptEnrollment,
  getEnrollment,
  rejectEnrollment,
  updateEnrollment,
} from "../../api/endpoints/enrollment";
import TabledInfo from "../../components/tabled_info";
import useApi from "../../hooks/api";
import useLayout from "../../hooks/layout";
import Button from "../../components/button";
import useSwal from "../../hooks/swal";
import { RiShareForwardLine } from "react-icons/ri";
import { FaFileDownload } from "react-icons/fa";

export default function EnrollmentDetail() {
  const { setActive, setTitle } = useLayout();
  const { id } = useParams();
  const { setNeedActions } = useLayout();
  const swal = useSwal();
  const navigate = useNavigate();

  const getEnrollmentApi = useApi(getEnrollment);
  const acceptEnrollmentApi = useApi(acceptEnrollment);
  const rejectEnrollmentApi = useApi(rejectEnrollment);
  const updateEnrollmentApi = useApi(updateEnrollment);

  const updateAcceptance = (accept?: boolean) => {
    if (accept === undefined) {
      updateEnrollmentApi(id!)
        .then(() => {
          getEnrollmentApi(id!).catch(() => {});
          setNeedActions((prev) => {
            return {
              ...prev,
              enroll: prev.enroll !== 0 ? prev.enroll - 1 : 0,
            };
          });
        })
        .catch(() => {});
      return;
    }
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
      <div className="p-5 bg-white relative border-b border-neutral-300 flex justify-start items-center space-x-5">
        {getEnrollmentApi.loading && (
          <div className="flex w-full h-screen absolute top-0 left-0 bg-white/80 justify-center items-center">
            <div className="px-10 py-3 text-neutral-800">
              <div className="loader" />
            </div>
          </div>
        )}
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
          <a
            target="_blank"
            href={`https://wa.me/${getEnrollmentApi.data?.whatsapp}`}
            className="mt-1 text-primary-500 hover:underline"
          >
            {getEnrollmentApi.data?.whatsapp}
          </a>
        </div>

        <div className="flex flex-col gap-3 items-end">
          <div className="flex rounded overflow-hidden border border-neutral-400 p-1 space-x-1">
            {(acceptEnrollmentApi || rejectEnrollmentApi || updateEnrollmentApi)
              .loading ? (
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
                  }}
                  disabled={getEnrollmentApi.data?.status === "REJECTED"}
                >
                  Ditolak
                </Button>
                <Button
                  type="button"
                  coloring={
                    getEnrollmentApi.data?.status === "DRAFT"
                      ? "primary"
                      : "white"
                  }
                  sizing="sm"
                  // left={() => <BiCheck className="text-lg" />}
                  onClick={() => {
                    updateAcceptance(undefined);
                  }}
                  disabled={getEnrollmentApi.data?.status === "DRAFT"}
                >
                  Perbaiki (DRAFT)
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
                  }}
                  disabled={getEnrollmentApi.data?.status === "ACCEPTED"}
                >
                  Diterima
                </Button>
              </>
            )}
          </div>
          <div className="flex gap-2 ">
            <Button
              onClick={() =>
                navigate(`/payment/${getEnrollmentApi.data?.payment?.id}`)
              }
              coloring="primary"
              sizing="sm"
              right={() => <RiShareForwardLine className="text-lg" />}
            >
              Detail Pembayaran
            </Button>
            <a
              target="_blank"
              href={`${
                import.meta.env.VITE_BACKEND_URL
              }/enrollment/list/sheet?id=${getEnrollmentApi.data?.id}&status=${
                getEnrollmentApi.data?.status
              }`}
            >
              <Button
                sizing="sm"
                coloring="success"
                right={() => <FaFileDownload className="text-lg" />}
              >
                Download
              </Button>
            </a>
          </div>
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
