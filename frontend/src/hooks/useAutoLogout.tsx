import { setAlert, setUser, useGlobalState } from "../redux/slices/global";
import { useEffect, useRef } from "react";
import { EMPLOYEE_ADDITIONAL_HOUR, cAxios } from "../lib/constants";
import { useDispatch } from "react-redux";
import { setReport } from "../redux/slices/home";

export function useAutoLogout() {
  const { user } = useGlobalState();
  const userRef = useRef(user);

  const dispatch = useDispatch();

  useEffect(() => {
    const intervalID = setInterval(() => {
      if (!userRef.current?.employee) {
        clearInterval(intervalID);
      } else {
        const now = new Date();
        const et = new Date(userRef.current.employee.endTime);
        const endTime = new Date();
        endTime.setHours(
          et.getHours() + EMPLOYEE_ADDITIONAL_HOUR,
          et.getMinutes()
        );

        if (now.getTime() > endTime.getTime()) {
          cAxios.delete("auth/logout").then((res) => {
            if (res.data.status === 200) {
              dispatch(setUser(null));
              dispatch(setReport(null));
              dispatch(
                setAlert({
                  type: "error",
                  message: "Account logged out",
                  description:
                    "Your account has been logged out, because your working time is over!",
                })
              );
            }
          });
        }
      }
    }, 5000);
    return () => clearInterval(intervalID);
  }, [dispatch]);
}
