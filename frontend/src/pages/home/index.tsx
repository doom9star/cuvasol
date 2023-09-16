import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout";
import Home from "./home";
import ReportRouter from "./report";

export default function HomeRouter() {
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
