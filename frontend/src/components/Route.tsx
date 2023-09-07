import { Navigate } from "react-router-dom";
import { useGlobalState } from "../redux/slices/global";

type Props = {
  component: any;
};

export const PrivateRoute: React.FC<Props> = (props) => {
  const { user } = useGlobalState();
  if (!user) return <Navigate to="/auth/login" />;
  return props.component;
};

export const PublicRoute: React.FC<Props> = (props) => {
  const { user } = useGlobalState();
  if (user) return <Navigate to="/home" />;
  return props.component;
};
