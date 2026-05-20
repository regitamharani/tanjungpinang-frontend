import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DestinationPage from "./pages/DestinationPage";
import DetailDestinasi from "./pages/DetailDestinasi";
import AuthPage from "./pages/AuthPage";
import AccountPage from "./pages/AccountPage";

const isLoggedIn = () => !!localStorage.getItem("token");

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/destination" element={<DestinationPage />} />
        <Route path="/destination/:slug" element={<DetailDestinasi />} />
        <Route path="/login" element={<AuthPage defaultMode="login" />} />
        <Route path="/register" element={<AuthPage defaultMode="register" />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;