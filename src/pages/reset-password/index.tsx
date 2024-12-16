import { useForm } from "react-hook-form";
import { BiLock } from "react-icons/bi";
import logo from "../../assets/logo.svg";
import Button from "../../components/button";
import TextInput from "../../components/text_input";
import useSwal from "../../hooks/swal";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useApi from "../../hooks/api";
import { checkToken, updatePassword } from "../../api/endpoints/reset-password";

export default function ResetPassword() {
  const token = useLocation().search.split("=")[1];
  const checkTokenApi = useApi(checkToken);
  const navigate = useNavigate();
  const swal = useSwal();
  const updatePasswordApi = useApi(updatePassword);

  useEffect(() => {
    checkTokenApi(token)
      .then(() => {})
      .catch(() => {
        swal({
          title: "Token Tidak Valid",
          text: "Token tidak valid atau kadaluarsa, ulangi proses reset password kembali",
          icon: "error",
        });
        navigate("/login");
      });
  }, []);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (data: { password: string }) => {
    updatePasswordApi({ password: data.password, token })
      .then(() => {
        swal({
          title: "Reset Password Berhasil",
          text: "Lanjutkan ke halaman login untuk masuk ke dashboard",
          icon: "success",
        });
        navigate("/login");
      })
      .catch(() => {
        swal({
          title: "Gagal",
          text: "Periksa koneksi internet dan data yang Anda masukkan",
          icon: "error",
        });
      });
  };

  return (
    <div className="bg-neutral-200 min-h-screen flex justify-center items-center">
      <div className="w-full md:w-[540px] bg-neutral-50 rounded flex justify-start items-stretch overflow-hidden">
        <div className="flex-1">
          <div className="p-8 pb-6 flex justify-between">
            <img src={logo} className="h-8 w-auto mb-12" />
            <span className="text-neutral-600 font-bold text-lg font-ubuntu">
              PPDB
            </span>
          </div>
          <div className="px-12 pb-20">
            <h1 className="font-montserrat text-2xl font-bold text-neutral-900">
              Reset Password
            </h1>
            <p>Masukkan password baru</p>

            <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                containerClassName="mb-6"
                left={() => <BiLock className="text-lg" />}
                placeholder="Password"
                type="password"
                {...register("password", { required: true })}
              />
              <Button className="w-full" type="submit">
                Kirim
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
