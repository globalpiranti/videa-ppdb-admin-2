import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Form from "./pages/form";
import ComposeForm from "./pages/form/compose";
import Home from "./pages/home";
import Login from "./pages/login";
import Path from "./pages/path";
import PathDetail from "./pages/path/detail";
import Payment from "./pages/payment";
import PaymentDetail from "./pages/payment/detail";
import Enrollment from "./pages/enrollment";
import EnrollmentDetail from "./pages/enrollment/detail";
import PaymentChannel from "./pages/payment-channel";
import Card from "./pages/card";
import SendEmail from "./pages/reset-password/send-email";
import ResetPassword from "./pages/reset-password";
import Announcement from "./pages/announcement";
import User from "./pages/user";
import Settings from "./pages/settings";
import Exam from "./pages/exam";
import ExamDetail from "./pages/exam/detail";

export const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />,
          index: true,
        },
        {
          path: "form",
          children: [
            { path: "", element: <Form />, index: true },
            { path: "add", element: <ComposeForm /> },
            { path: ":id/card", element: <Card /> },
            { path: ":id", element: <ComposeForm /> },
          ],
        },
        {
          path: "path",
          children: [
            {
              path: "",
              element: <Path />,
              index: true,
            },
            {
              path: ":id",
              element: <PathDetail />,
            },
          ],
        },
        {
          path: "exam",
          children: [
            {
              path: "",
              element: <Exam />,
              index: true,
            },
            {
              path: "create",
              element: <ExamDetail />,
            },
          ],
        },
        {
          path: "payment",
          children: [
            {
              path: "",
              element: <Payment />,
              index: true,
            },
            {
              path: ":id",
              element: <PaymentDetail />,
            },
          ],
        },
        {
          path: "enrollment",
          children: [
            {
              path: "",
              element: <Enrollment />,
              index: true,
            },
            {
              path: ":id",
              element: <EnrollmentDetail />,
            },
          ],
        },
        {
          path: "payment-channel",
          element: <PaymentChannel />,
        },
        {
          path: "announcement",
          element: <Announcement />,
        },
        {
          path: "user",
          element: <User />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
      ],
    },
    {
      path: "/forgot-password",
      element: <SendEmail />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
  ],
  {
    basename: "/ppdb/admin",
  }
);
