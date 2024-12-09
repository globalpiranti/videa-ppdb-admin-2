import { CookiesProvider } from "react-cookie";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "reflect-metadata";
import { ModalProvider } from "./components/modal";
import UserProvider from "./components/user_provider";
import "./index.css";
import { router } from "./router";
import moment from "moment/min/moment-with-locales";
import "overlayscrollbars/overlayscrollbars.css";

moment.locale("id");

createRoot(document.getElementById("root")!).render(
  <CookiesProvider>
    <UserProvider>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </UserProvider>
  </CookiesProvider>
);
