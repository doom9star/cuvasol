import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./ForgotPassword";
import ActivateAccount from "./ActivateAccount";

export default function AuthRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="activate-account/:tid" element={<ActivateAccount />} />
        <Route path="*" element={<Navigate to={"login"} replace />} />
      </Route>
    </Routes>
  );
}
