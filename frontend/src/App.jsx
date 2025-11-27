import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import ClientsPage from "./pages/ClientsPage";
import SchoolsPage from "./pages/SchoolsPage";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
        <Toaster richColors position="top-right" />
        <Navbar />

        <main className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<ClientsPage />} />
            <Route path="/schools" element={<SchoolsPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
