import { Navigate, Route, Routes } from "react-router-dom";
import { useAutoLogout } from "../../hooks/useAutoLogout";
import EmployeeRouter from "./employee";
import Home from "./home";
import Layout from "./layout";
import ReportRouter from "./report";

export default function HomeRouter() {
  useAutoLogout();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="report/*" element={<ReportRouter />} />
        <Route path="employee/*" element={<EmployeeRouter />} />
        <Route path="*" element={<Navigate to={"/"} replace />} />
      </Route>
    </Routes>
  );
}
