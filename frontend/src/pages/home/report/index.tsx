import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout";
import CreateReport from "./create";
import TaskRouter from "./tasks";
import SubmitReport from "./submit";

export default function ReportRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="create" element={<CreateReport />} />
        <Route path="submit" element={<SubmitReport />} />
        <Route path="task/*" element={<TaskRouter />} />
        <Route path="*" element={<Navigate to={"/home"} replace />} />
      </Route>
    </Routes>
  );
}
