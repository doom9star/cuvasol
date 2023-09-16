import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout";
import CreateTask from "./create";
import EditTask from "./edit";

export default function TaskRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="create" element={<CreateTask />} />
        <Route path=":tid/edit" element={<EditTask />} />
        <Route path="*" element={<Navigate to={"/home"} replace />} />
      </Route>
    </Routes>
  );
}
