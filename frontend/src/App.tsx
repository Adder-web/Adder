import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import CustomCursor from "./components/CustomCursor";
import ScentResultPage from "./pages/ScentResult";

function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/result" element={<ScentResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
