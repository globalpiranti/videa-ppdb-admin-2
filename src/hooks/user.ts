import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { useCookies } from "react-cookie";
import { checkToken, revokeToken } from "../api/endpoints/auth";
import User from "../api/models/user";
import useApi from "./api";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export const UserContext = createContext(
  {} as {
    user: User | undefined;
    setUser: Dispatch<SetStateAction<User | undefined>>;
  }
);

export default function useUser() {
  const context = useContext(UserContext);
  const [cookies, _, removeCookies] = useCookies(["token"]);
  const checkTokenApi = useApi(checkToken);
  const revokeTokenApi = useApi(revokeToken);
  const navigate = useNavigate();

  const logout = async () => {
    await revokeTokenApi({}).catch(() => {});

    removeCookies("token", {
      path: "/ppdb/admin",
      maxAge: 0,
    });
    client.defaults.headers.common.Authorization = undefined;
    navigate("/login", { replace: true });
  };

  const validate = async () => {
    return checkTokenApi(cookies.token)
      .then((user) => {
        client.defaults.headers.common.Authorization = `Bearer ${cookies.token}`;

        context.setUser(user);
        return user;
      })
      .catch((e) => {
        if ((e as AxiosError).response?.status === 401) {
          logout();
        }
      });
  };

  return { validate, context, logout };
}
