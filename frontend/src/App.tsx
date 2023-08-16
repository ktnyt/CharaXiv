import { Route, Router, Routes } from "@solidjs/router";
import { Component, lazy } from "solid-js";

const IndexPage = lazy(() => import("./pages/Index"));
const RegisterPage = lazy(() => import("./pages/Register"));
const RegisterSentPage = lazy(() => import("./pages/RegisterSent"));
const ActivatePage = lazy(() => import("./pages/Activate"));
const PasswordResetRequestPage = lazy(
  () => import("./pages/PasswordResetRequest"),
);
const PasswordResetRequestSentPage = lazy(
  () => import("./pages/PasswordResetRequestSent"),
);
const PasswordResetPage = lazy(() => import("./pages/PasswordReset"));
const CharacterPage = lazy(() => import("./pages/Character"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

const App: Component = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register_sent" element={<RegisterSentPage />} />
        <Route path="/activate" element={<ActivatePage />} />
        <Route
          path="/password_reset_request"
          element={<PasswordResetRequestPage />}
        />
        <Route
          path="/password_reset_request_sent"
          element={<PasswordResetRequestSentPage />}
        />
        <Route path="/password_reset" element={<PasswordResetPage />} />
        <Route path="/sheet/:sheet_id" element={<CharacterPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
