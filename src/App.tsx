import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import CssLabPage from "./pages/CssLabPage";
import DomainsPage from "./pages/DomainsPage";
import "./App.css";

function App() {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="site-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/css-lab" element={<CssLabPage />} />
          <Route path="/projects" element={<DomainsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
