import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CustomCursor from "./components/CustomCursor";
import { AuthProvider } from "./context/AuthContext";
import ScentResultPage from "./pages/ScentResult";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/result" element={<ScentResultPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
