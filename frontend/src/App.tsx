import { ConfigProvider } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PublicRoute } from "./components/Route";
import Index from "./pages/Index";
import AuthRouter from "./pages/auth";
import Layout from "./pages/layout";

function App() {
  return (
    <ConfigProvider theme={{}}>
      <div style={{ width: "100vw", height: "100vh" }}>
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
