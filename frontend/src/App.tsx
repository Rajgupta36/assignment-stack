import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/DashBoard";
import ConfigPage from "@/pages/ConfigPage";
import RouteMiddleware from "@/lib/middleware";

export default function App() {
  return (
    <BrowserRouter>
      <RouteMiddleware>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </RouteMiddleware>
    </BrowserRouter>
  );
}
