import { useForm } from "react-hook-form";
import { BiLock, BiUser } from "react-icons/bi";
import { issueNewToken } from "../api/endpoints/auth";
import illustration from "../assets/illustration.svg";
import logo from "../assets/logo.svg";
import Button from "../components/button";
import TextInput from "../components/text_input";
import useApi from "../hooks/api";
import useSwal from "../hooks/swal";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const swal = useSwal();
  const navigate = useNavigate();
  const issueNewTokenApi = useApi(issueNewToken);
  const [cookies, setCookies] = useCookies(["token"]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const login = (params: Parameters<typeof issueNewTokenApi>[0]) => {
    issueNewTokenApi(params)
      .then((user) => {
        setCookies("token", user.token, {
          path: "/ppdb/admin",
          maxAge: 60 * 60 * 24 * 365,
        });
      })
      .catch(() => {
        swal({
          title: "Autentikasi Gagal",
          text: "Kombinasi email dan password tidak ditemukan",
          icon: "error",
        });
      });
  };

  useEffect(() => {
    if (cookies.token) {
      navigate("/", {
        replace: true,
      });
    }
  }, [cookies]);

  return (
    <div className="bg-neutral-200 min-h-screen flex justify-center items-center">
      <div className="w-[940px] bg-neutral-50 rounded flex justify-start items-stretch overflow-hidden">
        <div className="w-1/2 bg-white flex justify-center items-center p-8 shadow">
          <img src={illustration} className="w-[80%] h-auto" />
        </div>
        <div className="flex-1">
          <div className="p-8 pb-6 flex justify-between">
            <img src={logo} className="h-8 w-auto mb-12" />
            <span className="text-neutral-600 font-bold text-lg font-ubuntu">
              PPDB
            </span>
          </div>
          <div className="px-12 pb-20">
            <h1 className="font-montserrat text-2xl font-bold text-neutral-900">
              Login
            </h1>
            <p>Masuk dengan akun admin Anda untuk melanjutkan</p>

            <form className="mt-8" onSubmit={handleSubmit(login)}>
              <TextInput
                containerClassName="mb-5"
                left={() => <BiUser className="text-lg" />}
                placeholder="Email / No. Handphone"
                {...register("username", { required: true })}
              />
              <TextInput
                containerClassName="mb-6"
                left={() => <BiLock className="text-lg" />}
                placeholder="Password"
                type="password"
                {...register("password", { required: true })}
              />
              <Button
                className="w-full"
                type="submit"
                loading={issueNewTokenApi.loading}
              >
                Masuk
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
