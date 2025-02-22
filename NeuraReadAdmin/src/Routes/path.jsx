import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

import DashboardLayout from "../Layout/DashboardLayout";
import AuthLayout from "../Layout/AuthLayout";

import LoadingScreen from "../Components/LoadingScreen";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { element: <LoginPage />, path: "login" },
        { element: <RegisterPage />, path: "register" },
        { element: <ForgotPasswordPage />, path: "forgot-password" },
        { element: <ResetPasswordPage />, path: "reset-password" },
      ],
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { element: <Dashboard replace />, path: "dashboard", index: true },
        { element: <User />, path: "user" },
        { element: <Profile />, path: "profile" },
        { element: <ContactsPage />, path: "contacts/:userId" },
        { element: <GalleryPage />, path: "gallery/:userId" },

        { element: <AllBooksCategoryPage />, path: "books-category" },
        { element: <AllBooksPage />, path: "all-books" },

        { path: "*", element: <Page404 /> },
      ],
    },
    { path: "*", element: <Navigate to={Page404} replace /> },
  ]);
}

const Dashboard = Loadable(
  lazy(() => import("../Pages/DashboardPages/Dashboard"))
);

const User = Loadable(lazy(() => import("../Pages/DashboardPages/User")));
const ContactsPage = Loadable(
  lazy(() => import("../Pages/DashboardPages/ContactsPage"))
);
const GalleryPage = Loadable(
  lazy(() => import("../Pages/DashboardPages/GalleryPage"))
);
const Profile = Loadable(lazy(() => import("../Pages/DashboardPages/Profile")));

const RegisterPage = Loadable(
  lazy(() => import("../Pages/AuthenticationPages/RegisterPage"))
);
const LoginPage = Loadable(
  lazy(() => import("../Pages/AuthenticationPages/LoignPage"))
);
const ForgotPasswordPage = Loadable(
  lazy(() => import("../Pages/AuthenticationPages/ForgotPassowrd"))
);
const ResetPasswordPage = Loadable(
  lazy(() => import("../Pages/AuthenticationPages/ResetPassowrd"))
);

const AllBooksCategoryPage = Loadable(
  lazy(() => import("../Pages/DataList/BookCategory"))
);

const AllBooksPage = Loadable(lazy(() => import("../Pages/DataList/AllBooks")));

const Page404 = Loadable(lazy(() => import("../Pages/NotFound")));
