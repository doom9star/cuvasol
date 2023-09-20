import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout";
import CreateEmployee from "./create";

export default function EmployeeRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="create" element={<CreateEmployee />} />
        <Route path="*" element={<Navigate to={"/home"} replace />} />
      </Route>
    </Routes>
  );
}
