import { Navigate } from "react-router-dom";
import Greet from "../../components/Greet";
import { useTitle } from "../../hooks/useTitle";
import { useGlobalState } from "../../redux/slices/global";
import { useHomeState } from "../../redux/slices/home";
import EmployeeView from "./views/employee";
import ManagerView from "./views/manager";

export default function Home() {
  useTitle("Home");

  const { user } = useGlobalState();
  const { report } = useHomeState();

  if (user?.employee && !report) {
    return <Navigate to={"/home/report/create"} />;
  }

  return (
    <div className="w-full flex flex-col my-16 lg:w-3/4 mx-auto">
      <Greet />
      {user?.employee ? <EmployeeView /> : <ManagerView />}
    </div>
  );
}
