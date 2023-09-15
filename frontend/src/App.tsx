import { Alert, ConfigProvider, Spin } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./components/Route";
import Index from "./pages/Index";
import AuthRouter from "./pages/auth";
import Layout from "./pages/layout";
import { useDispatch } from "react-redux";
import {
  setAlert,
  setGlobalLoading,
  setUser,
  useGlobalState,
} from "./redux/slices/global";
import HomeRouter from "./pages/home";
import { useEffect } from "react";
import { cAxios } from "./lib/constants";

function App() {
  const { alert, loading } = useGlobalState();
  const dispatch = useDispatch();

  useEffect(() => {
    cAxios
      .get("auth/")
      .then((res) => {
        if (res.data.status === 200) {
          dispatch(setUser(res.data.body));
        }
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  }, [dispatch]);

  return (
    <ConfigProvider theme={{}}>
      <div style={{ width: "100vw", height: "100vh" }}>
        {alert.message && (
          <Alert
            type={alert.type}
            message={alert.message}
            description={alert.description}
            showIcon
            closable
            onClose={() => dispatch(setAlert({}))}
          />
        )}
        {loading ? (
          <Spin size="large" className="absolute top-1/2 left-1/2" />
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route
                  path="auth/*"
                  element={<PublicRoute component={<AuthRouter />} />}
                />
                <Route
                  path="home/*"
                  element={<PrivateRoute component={<HomeRouter />} />}
                />
                <Route path="*" element={<Navigate to={"/"} replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        )}
      </div>
    </ConfigProvider>
  );
}

export default App;
