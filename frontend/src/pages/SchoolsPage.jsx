import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function SchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [form, setForm] = useState({ name: "", price: "" });

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = () =>
    axios
      .get("http://localhost:4000/api/schools")
      .then((res) => setSchools(res.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/schools", form);
      toast.success("Escuela agregada");
      setForm({ name: "", price: "" });
      loadSchools();
    } catch (error) {
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Borrar escuela?")) return;
    await axios.delete(`http://localhost:4000/api/schools/${id}`);
    loadSchools();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Formulario */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit">
        <h3 className="text-xl font-bold text-white mb-4">🏫 Nueva Escuela</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
            placeholder="Nombre (ej. ESCOM)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
            placeholder="Precio (ej. 50)"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 rounded">
            Guardar
          </button>
        </form>
      </div>

      {/* Lista */}
      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {schools.map((school) => (
          <div
            key={school.id}
            className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-white text-lg">{school.name}</p>
              <p className="text-green-400 font-mono">${school.price}</p>
            </div>
            <button
              onClick={() => handleDelete(school.id)}
              className="text-red-400 hover:text-red-300"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
