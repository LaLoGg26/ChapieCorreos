import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg transition-colors ${
      location.pathname === path
        ? "bg-blue-600 text-white font-bold"
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    }`;

  return (
    <nav className="bg-slate-800 border-b border-slate-700 p-4 mb-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-500">Chapie Correos 📨</h1>
        <div className="flex gap-2">
          <Link to="/" className={linkClass("/")}>
            Clientes
          </Link>
          <Link to="/schools" className={linkClass("/schools")}>
            Escuelas (Catálogo)
          </Link>
          <Link to="/stats" className={linkClass("/stats")}>
            Estadísticas 💰
          </Link>
        </div>
      </div>
    </nav>
  );
}
