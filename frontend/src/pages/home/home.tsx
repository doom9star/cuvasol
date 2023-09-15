import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useTitle } from "../../hooks/useTitle";
import { useGlobalState } from "../../redux/slices/global";
import { useHomeState } from "../../redux/slices/home";
import { UserType } from "../../types/models";

export default function Home() {
  useTitle("Home");

  const { user } = useGlobalState();
  const { report } = useHomeState();

  const isEmployee = useMemo(() => {
    return user?.groups.findIndex((g) => g.name === UserType.EMPLOYEE) !== -1;
  }, [user]);

  if (isEmployee && !report) {
    return <Navigate to={"/home/report/create"} />;
  }

  return <div>Home page</div>;
}
