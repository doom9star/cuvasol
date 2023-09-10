import { Alert, ConfigProvider } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PublicRoute } from "./components/Route";
import Index from "./pages/Index";
import AuthRouter from "./pages/auth";
import Layout from "./pages/layout";
import { useDispatch } from "react-redux";
import { setAlert, useGlobalState } from "./redux/slices/global";

function App() {
  const { alert } = useGlobalState();
  const dispatch = useDispatch();

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route
                path="auth/*"
                element={<PublicRoute component={<AuthRouter />} />}
              />
              <Route path="*" element={<Navigate to={"/"} replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ConfigProvider>
  );
}

export default App;
