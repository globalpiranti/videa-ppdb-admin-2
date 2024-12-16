import { useForm } from "react-hook-form";
import { BiLock } from "react-icons/bi";
import logo from "../../assets/logo.svg";
import Button from "../../components/button";
import TextInput from "../../components/text_input";
import useApi from "../../hooks/api";
import { sendLinkResetPass } from "../../api/endpoints/reset-password";
import useSwal from "../../hooks/swal";
import { AxiosError } from "axios";

export default function SendEmail() {
  const sendEmailApi = useApi(sendLinkResetPass);

  const swal = useSwal();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: { email: string }) => {
    sendEmailApi(data)
      .then((user) => {
        swal({
          title: "Email Berhasil Terkirim",
          text: `Periksa email ${user.email} untuk melanjutkan reset password`,
          icon: "success",
        });
      })
      .catch((err) => {
        swal({
          title: "Email Tidak Ditemukan " + ` (${(err as AxiosError).status})`,
          text: "Email tidak terdaftar di videa ppdb admin",
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
              Masukkan Email
            </h1>
            <p>Masuk email yang terdaftar di ppdb admin</p>

            <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                containerClassName="mb-6"
                left={() => <BiLock className="text-lg" />}
                placeholder="Email"
                type="email"
                {...register("email", { required: true })}
              />
              <Button
                loading={sendEmailApi.loading}
                className="w-full"
                type="submit"
              >
                Kirim
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
