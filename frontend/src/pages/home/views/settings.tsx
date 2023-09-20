import { Button } from "antd";
import { useCallback, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { cAxios } from "../../../lib/constants";
import { setAlert, setUser } from "../../../redux/slices/global";

export default function SettingsMenu() {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    setLoading(true);
    cAxios
      .delete("auth/logout")
      .then((res) => {
        if (res.data.status === 200) {
          dispatch(setUser(null));
        } else {
          dispatch(
            setAlert({
              type: "error",
              message: "Account logout failed",
              description: res.data.body || res.data.message,
            })
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <div className="mx-10 mt-10 mb-5 flex">
      <Button
        ghost
        type="primary"
        className="mb-2"
        onClick={onLogout}
        icon={<AiOutlineLogout size={12} />}
        loading={loading}
      >
        Logout
      </Button>
    </div>
  );
}
