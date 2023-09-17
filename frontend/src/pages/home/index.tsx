import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout";
import Home from "./home";
import ReportRouter from "./report";
import { useAutoLogout } from "../../hooks/useAutoLogout";

export default function HomeRouter() {
  useAutoLogout();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="report/*" element={<ReportRouter />} />
        <Route path="*" element={<Navigate to={"/"} replace />} />
      </Route>
    </Routes>
  );
}
