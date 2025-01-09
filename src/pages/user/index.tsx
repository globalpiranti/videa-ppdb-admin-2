import { useEffect } from "react";
import useLayout from "../../hooks/layout";
import TextInput from "../../components/text_input";
import { CgAddR, CgSearch } from "react-icons/cg";
import Button from "../../components/button";
import useModal from "../../hooks/modal";
import Modal, { ModalFooter } from "../../components/modal";
import { RiCheckFill, RiDeleteBin5Line, RiEditBoxLine } from "react-icons/ri";
import List from "../../components/list";
import NotFound from "../../components/not_found";
import {
  createUser,
  deleteUser,
  updateUser,
  users,
} from "../../api/endpoints/user";
import useApi from "../../hooks/api";
import { BiUser } from "react-icons/bi";
import ContextLink from "../../components/context_link";
import useSwal from "../../hooks/swal";
import { useForm } from "react-hook-form";
import User from "../../api/models/user";
import ListWithHeader from "../../components/listwith_header";

const UserManagement = () => {
  const { setActive, setTitle } = useLayout();
  const composeModal = useModal<string>();
  const usersApi = useApi(users);
  const deleteUserApi = useApi(deleteUser);
  const createUserApi = useApi(createUser);
  const updateUserApi = useApi(updateUser);

  const swal = useSwal();

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<User>();

  const onSubmit = (data: User) => {
    (composeModal.state.value ? updateUserApi : createUserApi)(data)
      .then(() => {
        composeModal.control.hide();
        usersApi({}).catch(() => {});
        swal({
          icon: "success",
          title: "Berhasil",
          text: "Pengguna telah berhasil disimpan",
        });
      })
      .catch(() => {
        swal({
          icon: "error",
          title: "Gagal",
          text: "Email atau whatsapp sudah terdaftar",
        });
      });
  };

  const onDelete = (id: string, name: string) => {
    swal({
      title: "Hapus User?",
      text:
        "Anda akan menghapus pengguna: " +
        name +
        ", tindakan ini tidak bisa dibatalkan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      customClass: {
        confirmButton: "!bg-danger-600",
      },
    }).then((result) => {
      if (result.isConfirmed)
        deleteUserApi(id)
          .then(() => {
            usersApi({}).catch(() => {});
          })
          .catch(() => {});
    });
  };

  useEffect(() => {
    setActive("Pengguna");
    setTitle("Pengguna");

    usersApi({}).catch(() => {});
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
          type="button"
          left={() => <CgAddR />}
          onClick={() => {
            reset({ fullname: "", email: "", whatsapp: "", password: "" });
            composeModal.state.set(undefined);
            composeModal.control.show();
          }}
        >
          Buat Baru
        </Button>
      </div>

      {!usersApi.loading && !usersApi.data?.length ? (
        <NotFound />
      ) : (
        usersApi.data?.map((item, index) => (
          <ListWithHeader
            onClick={() => {
              reset(item);
              composeModal.state.set(item.id);
              composeModal.control.show();
            }}
            to={`#`}
            icon={BiUser}
            details={[
              {
                element: item.fullname,
                className: "w-[30%]",
              },
              {
                element: item.email,
              },
              {
                element: item.whatsapp,
              },
            ]}
            popup={
              <>
                <ContextLink
                  onClick={(e) => {
                    e.preventDefault();
                    reset(item);
                    composeModal.state.set(item.id);
                    composeModal.control.show();
                  }}
                  icon={RiEditBoxLine}
                  to="/"
                >
                  Edit
                </ContextLink>
                <ContextLink
                  onClick={(e) => {
                    e.preventDefault();
                    if (index === 0) return;
                    onDelete(item.id, item.fullname);
                  }}
                  icon={RiDeleteBin5Line}
                  to="/"
                >
                  Hapus
                </ContextLink>
              </>
            }
            key={`${index}`}
          />
        ))
      )}

      <Modal
        control={composeModal.control}
        icon={BiUser}
        title={composeModal.state.value ? "Ubah Pengguna" : "Tambah Pengguna"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            containerClassName="mb-5"
            label="Nama Lengkap"
            message={errors.fullname?.message}
            {...register("fullname", { required: "Nama Pengguna Harus Diisi" })}
            placeholder="John Doe"
          />
          <TextInput
            containerClassName="mb-5"
            label="Email"
            message={errors.email?.message}
            {...register("email", { required: "Email Harus Diisi" })}
            placeholder="K7i9M@example.com"
          />
          <TextInput
            containerClassName="mb-5"
            label="Nomor Whatsapp"
            message={errors.whatsapp?.message}
            {...register("whatsapp", {
              required: "Nomor Whatsapp Harus Diisi",
            })}
            type="number"
            placeholder="+6281234567890"
          />
          <TextInput
            containerClassName="mb-5"
            label="Password"
            type="password"
            message={errors.password?.message}
            {...register("password", { required: "Password Harus Diisi" })}
            placeholder="Password"
          />
        </form>

        <ModalFooter>
          <Button
            loading={(createUserApi || updateUserApi).loading}
            type="button"
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
            left={() => <RiCheckFill />}
          >
            Simpan
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default UserManagement;
