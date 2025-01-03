import { useEffect, useState } from "react";
import { BiPowerOff } from "react-icons/bi";
import { CgUser } from "react-icons/cg";
import { Link, Outlet } from "react-router-dom";
import logo from "../assets/mini-logo.svg";
import { LayoutContext } from "../hooks/layout";
import useUser from "../hooks/user";
import menus from "../menu";
import useSwal from "../hooks/swal";
import { needActionEnrollments } from "../api/endpoints/enrollment";
import useApi from "../hooks/api";
import { needActionPayments } from "../api/endpoints/payment";

export default function Layout() {
  const [title, setTitle] = useState<string>();
  const [active, setActive] = useState<string>("Dashboard");
  const { validate, context, logout } = useUser();
  const listNeedActionEnrollment = useApi(needActionEnrollments);
  const listNeedActionPayment = useApi(needActionPayments);
  const [needActions, setNeedActions] = useState({
    enroll: 0,
    payment: 0,
  });
  const swal = useSwal();

  useEffect(() => {
    validate().then(() => {
      listNeedActionEnrollment({})
        .then((data) => {
          setNeedActions({
            ...needActions,
            enroll: data.length,
          });
        })
        .catch(() => {});

      listNeedActionPayment({})
        .then((data) => {
          setNeedActions({
            ...needActions,
            payment: data.length,
          });
        })
        .catch(() => {});
    });

    document.getElementById("root")?.classList.remove("load-portal");
  }, []);

  if (!context.user)
    return (
      <div className="load-portal">
        <div className="loader"></div>
        <div style={{ marginTop: 16 }}>Memuat data...</div>
      </div>
    );

  return (
    <LayoutContext.Provider
      value={{
        title,
        setTitle,
        active,
        setActive,
        needActions,
        setNeedActions,
      }}
    >
      <div className="min-w-[280px] fixed top-0 left-0 bottom-0 bg-white border-r border-neutral-300 flex flex-col">
        <div className="h-16 border-b border-neutral-300 flex items-center px-5">
          <img src={logo} className="h-8 w-auto" />
          <div className="font-bold text-neutral-900 font-montserrat ml-2 text-lg">
            PPDB
          </div>
        </div>
        <div className="flex-1 p-2 flex flex-col space-y-1">
          {menus.map(({ title, icon: Icon, ...item }, index) => (
            <Link
              key={`${index}`}
              className={`rounded ${
                active === title
                  ? "bg-primary-700"
                  : "bg-white hover:bg-neutral-200"
              } font-ubuntu flex justify-start relative items-center overflow-hidden group`}
              {...item}
            >
              <span
                className={`h-12 w-12 flex justify-center items-center text-xl ${
                  active === title
                    ? "bg-primary-800 text-secondary-400"
                    : "text-neutral-900 group-hover:bg-neutral-300"
                }`}
              >
                <Icon />
              </span>
              <span
                className={`flex-1 border-l pl-3 ${
                  active === title
                    ? "text-neutral-100 border-transparent"
                    : "text-neutral-800 border-neutral-300 hover:border-transparent"
                }`}
              >
                {title}
              </span>

              {((title === "Pendaftar" && needActions.enroll > 0) ||
                (title === "Pembayaran" && needActions.payment > 0)) && (
                <>
                  <div
                    className={`absolute w-[24px] h-[24px] font-medium flex justify-center items-center rounded-full top-2 right-2 ${
                      title === active
                        ? "text-warning-500 border border-warning-500"
                        : "text-primary-500 border border-primary-500"
                    }`}
                  >
                    {title === "Pembayaran"
                      ? needActions.payment
                      : needActions.enroll}
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full min-h-screen flex justify-start items-stretch bg-neutral-100">
        <div className="w-[280px]"></div>
        <div className="flex-1 relative flex flex-col">
          <div className="h-16 bg-white border-b border-neutral-300 flex items-center justify-start px-5 sticky top-0 left-0 right-0 z-10">
            <div className="flex-1 font-montserrat font-bold text-neutral-900">
              {title}
            </div>
            <div className="text-sm mr-5 flex items-center py-2 px-3 border border-neutral-200 rounded-full text-neutral-700">
              <CgUser className="mr-2 text-lg text-info-800 mb-0.5" />
              {context.user?.fullname}
            </div>
            <button
              onClick={() => {
                swal({
                  icon: "warning",
                  title: "Logout",
                  text: "Anda yakin ingin keluar dari akun ini?",
                  showCancelButton: true,
                  cancelButtonText: "Batal",
                  confirmButtonText: "Keluar",
                  customClass: {
                    confirmButton: "!bg-danger-600",
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    logout();
                  }
                });
              }}
              type="button"
              className="w-8 h-8 bg-danger-600 border border-danger-700 rounded flex justify-center items-center text-white"
            >
              <BiPowerOff />
            </button>
          </div>
          <Outlet />
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
