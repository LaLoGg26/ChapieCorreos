import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const API_URL = "http://localhost:4000/api";

export default function ClientsPage() {
  // --- ESTADOS ---
  const [parents, setParents] = useState([]);
  const [children, setChildren] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);

  // Estados para formularios
  const [parentForm, setParentForm] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [childForm, setChildForm] = useState({
    email: "",
    phone_number: "",
    school_id: "",
  });

  // Estados para MODO EDICIÓN
  const [editingParentId, setEditingParentId] = useState(null); // ID del padre que se edita
  const [editingChildId, setEditingChildId] = useState(null); // ID del hijo que se edita

  // --- INICIO ---
  useEffect(() => {
    fetchParents();
    fetchSchools();
  }, []);

  // --- CARGA DE DATOS ---
  const fetchParents = async () => {
    try {
      const res = await axios.get(`${API_URL}/parents`);
      setParents(res.data);
    } catch (error) {
      toast.error("Error conectando al servidor");
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await axios.get(`${API_URL}/schools`);
      setSchools(res.data);
    } catch (error) {
      console.error("Error escuelas", error);
    }
  };

  // ==========================================
  // LÓGICA PADRES (CLIENTES)
  // ==========================================

  // 1. Guardar (Crear o Editar)
  const handleParentSubmit = async (e) => {
    e.preventDefault();
    if (!parentForm.email) return toast.warning("Email obligatorio");

    try {
      if (editingParentId) {
        // MODO EDICIÓN (PUT)
        await axios.put(`${API_URL}/parents/${editingParentId}`, parentForm);
        toast.success("✅ Cliente actualizado");
        setEditingParentId(null); // Salir de edición
      } else {
        // MODO CREACIÓN (POST)
        await axios.post(`${API_URL}/parents`, parentForm);
        toast.success("✅ Cliente creado");
      }

      setParentForm({ email: "", name: "", password: "" }); // Limpiar
      fetchParents(); // Recargar lista
    } catch (error) {
      toast.error("Error al guardar cliente");
    }
  };

  // 2. Iniciar Edición (Cargar datos en el form)
  const startEditingParent = (e, parent) => {
    e.stopPropagation(); // No seleccionar el cliente, solo editar
    setEditingParentId(parent.id);
    setParentForm({
      email: parent.email,
      name: parent.name || "",
      password: parent.password || "",
    });
    // Scroll suave hacia arriba para ver el formulario
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. Cancelar Edición
  const cancelParentEdit = () => {
    setEditingParentId(null);
    setParentForm({ email: "", name: "", password: "" });
  };

  // 4. Eliminar
  const handleParentDelete = async (id) => {
    if (!confirm("¿Borrar cliente y todos sus correos?")) return;
    try {
      await axios.delete(`${API_URL}/parents/${id}`);
      toast.success("🗑️ Cliente eliminado");
      if (selectedParent?.id === id) setSelectedParent(null);
      fetchParents();
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  // 5. Incrementar Contador (CON CONFIRMACIÓN)
  const handleIncrement = async (id, e) => {
    e.stopPropagation();
    // Confirmación nativa
    if (!confirm("¿Confirmar incidencia? Se sumarán $20 a los costos.")) return;

    try {
      await axios.put(`${API_URL}/parents/${id}/increment`);
      toast.warning("Costos operativos +$20");
      fetchParents();
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  // ==========================================
  // LÓGICA HIJOS (CORREOS)
  // ==========================================

  const selectParent = async (parent) => {
    // Si estamos editando un hijo, cancelar al cambiar de padre
    setEditingChildId(null);
    setChildForm({ email: "", phone_number: "", school_id: "" });

    setSelectedParent(parent);
    setChildren([]);
    try {
      const res = await axios.get(`${API_URL}/children/parent/${parent.id}`);
      setChildren(res.data);
    } catch (error) {
      toast.error("Error cargando hijos");
    }
  };

  // 1. Guardar Hijo (Crear o Editar)
  const handleChildSubmit = async (e) => {
    e.preventDefault();
    if (!childForm.email || !childForm.school_id)
      return toast.warning("Faltan datos");

    try {
      if (editingChildId) {
        // EDITAR (PUT)
        await axios.put(`${API_URL}/children/${editingChildId}`, {
          ...childForm,
          school_id: childForm.school_id,
        });
        toast.success("✅ Correo actualizado");
        setEditingChildId(null);
      } else {
        // CREAR (POST)
        await axios.post(`${API_URL}/children`, {
          parent_id: selectedParent.id,
          ...childForm,
        });
        toast.success("✅ Correo agregado");
      }

      setChildForm({ email: "", phone_number: "", school_id: "" });
      // Recargar lista
      const res = await axios.get(
        `${API_URL}/children/parent/${selectedParent.id}`
      );
      setChildren(res.data);
    } catch (error) {
      toast.error("Error al guardar hijo");
    }
  };

  // 2. Iniciar Edición Hijo
  const startEditingChild = (child) => {
    setEditingChildId(child.id);
    setChildForm({
      email: child.email,
      phone_number: child.phone_number || "",
      school_id: child.school_id || "",
    });
  };

  // 3. Cancelar Edición Hijo
  const cancelChildEdit = () => {
    setEditingChildId(null);
    setChildForm({ email: "", phone_number: "", school_id: "" });
  };

  // 4. Eliminar Hijo
  const handleChildDelete = async (id) => {
    if (!confirm("¿Borrar este correo hijo?")) return;
    try {
      await axios.delete(`${API_URL}/children/${id}`);
      toast.success("🗑️ Eliminado");
      setChildren(children.filter((c) => c.id !== id));
      if (editingChildId === id) cancelChildEdit(); // Si borramos el que editamos
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const getSchoolName = (id) => {
    const school = schools.find((s) => s.id === id);
    return school ? school.name : "...";
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in pb-10">
      {/* --- COLUMNA IZQUIERDA (CLIENTES) --- */}
      <div className="md:col-span-4 space-y-6">
        {/* FORMULARIO PADRE (Dinámico: Crear/Editar) */}
        <div
          className={`p-5 rounded-xl border shadow-lg transition-colors ${
            editingParentId
              ? "bg-blue-900/20 border-blue-500"
              : "bg-slate-800 border-slate-700"
          }`}
        >
          <h2 className="font-bold mb-3 text-white flex items-center gap-2 justify-between">
            {editingParentId ? "✏️ Editando Cliente" : "👤 Nuevo Cliente"}
            {editingParentId && (
              <button
                onClick={cancelParentEdit}
                className="text-xs text-red-400 hover:underline"
              >
                Cancelar
              </button>
            )}
          </h2>
          <form onSubmit={handleParentSubmit} className="space-y-3">
            <input
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
              placeholder="Nombre"
              value={parentForm.name}
              onChange={(e) =>
                setParentForm({ ...parentForm, name: e.target.value })
              }
            />
            <input
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
              placeholder="Email Principal *"
              value={parentForm.email}
              onChange={(e) =>
                setParentForm({ ...parentForm, email: e.target.value })
              }
            />
            <input
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
              type="text"
              placeholder="Contraseña"
              value={parentForm.password}
              onChange={(e) =>
                setParentForm({ ...parentForm, password: e.target.value })
              }
            />
            <button
              className={`w-full font-bold py-2 rounded transition shadow-lg ${
                editingParentId
                  ? "bg-amber-600 hover:bg-amber-500"
                  : "bg-blue-600 hover:bg-blue-500"
              } text-white`}
            >
              {editingParentId ? "Actualizar Cliente" : "Guardar Cliente"}
            </button>
          </form>
        </div>

        {/* LISTA DE CLIENTES */}
        <div className="space-y-2">
          <h3 className="text-slate-400 text-sm uppercase tracking-wider font-semibold">
            Clientes
          </h3>
          {parents.map((p) => (
            <div
              key={p.id}
              onClick={() => selectParent(p)}
              className={`p-3 rounded-lg cursor-pointer border transition-all flex justify-between items-center group
                ${
                  selectedParent?.id === p.id
                    ? "bg-blue-900/30 border-blue-500"
                    : "bg-slate-800 border-slate-700 hover:border-slate-500"
                }`}
            >
              <div className="overflow-hidden flex-1">
                <p className="font-medium truncate text-white">{p.email}</p>
                <div className="flex gap-2 text-xs text-slate-400 items-center">
                  <span>{p.name || "-"}</span>
                  {p.counter > 0 && (
                    <span className="text-red-400 bg-red-900/20 px-1 rounded font-bold">
                      -${p.counter * 20}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 pl-2">
                {/* Botón Incidencia (+1) */}
                <button
                  onClick={(e) => handleIncrement(p.id, e)}
                  className="text-yellow-500 hover:bg-yellow-500/20 p-1.5 rounded border border-yellow-500/30 text-xs font-bold"
                  title="+1 Incidencia"
                >
                  ⚠️
                </button>

                {/* Botón Editar (Lápiz) */}
                <button
                  onClick={(e) => startEditingParent(e, p)}
                  className="text-blue-400 hover:bg-blue-900/30 p-1.5 rounded transition-colors"
                  title="Editar"
                >
                  ✏️
                </button>

                {/* Botón Eliminar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleParentDelete(p.id);
                  }}
                  className="text-slate-500 hover:text-red-400 p-1.5 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- COLUMNA DERECHA (HIJOS) --- */}
      <div className="md:col-span-8">
        {!selectedParent ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-700 min-h-[400px]">
            <p>Selecciona un cliente</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cabecera */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center shadow-md">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedParent.email}
                </h2>
                <p className="text-slate-400">{selectedParent.name}</p>
              </div>
              <div className="text-right space-y-1">
                {selectedParent.password && (
                  <p className="text-xs text-blue-300 font-mono bg-slate-900 px-2 py-1 rounded">
                    Pass: {selectedParent.password}
                  </p>
                )}
                {selectedParent.counter > 0 && (
                  <p className="text-xs text-red-400">
                    {selectedParent.counter} incidencias
                  </p>
                )}
              </div>
            </div>

            {/* FORMULARIO HIJO (Dinámico) */}
            <div
              className={`p-4 rounded-lg border shadow-md transition-colors ${
                editingChildId
                  ? "bg-green-900/20 border-green-500"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-400">
                  {editingChildId ? "✏️ Editando Correo" : "➕ Nuevo Correo"}
                </span>
                {editingChildId && (
                  <button
                    onClick={cancelChildEdit}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Cancelar edición
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-1">
                  <input
                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white focus:border-green-500 outline-none"
                    placeholder="Teléfono"
                    value={childForm.phone_number}
                    onChange={(e) =>
                      setChildForm({
                        ...childForm,
                        phone_number: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-1">
                  <select
                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white focus:border-green-500 outline-none"
                    value={childForm.school_id}
                    onChange={(e) =>
                      setChildForm({ ...childForm, school_id: e.target.value })
                    }
                  >
                    <option value="">Escuela...</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-1">
                  <input
                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white focus:border-green-500 outline-none"
                    placeholder="Email"
                    value={childForm.email}
                    onChange={(e) =>
                      setChildForm({ ...childForm, email: e.target.value })
                    }
                  />
                </div>
                <button
                  onClick={handleChildSubmit}
                  className={`font-bold py-2 rounded transition shadow-lg text-white ${
                    editingChildId
                      ? "bg-amber-600 hover:bg-amber-500"
                      : "bg-green-600 hover:bg-green-500"
                  }`}
                >
                  {editingChildId ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </div>

            {/* TABLA DE HIJOS */}
            <div className="bg-slate-800 rounded-xl shadow overflow-hidden border border-slate-700">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-slate-400 uppercase font-medium text-xs">
                  <tr>
                    <th className="px-4 py-3">Info</th>
                    <th className="px-4 py-3">Escuela</th>
                    <th className="px-4 py-3">Correo</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {children.map((child) => (
                    <tr
                      key={child.id}
                      className={`transition-colors ${
                        editingChildId === child.id
                          ? "bg-blue-900/20"
                          : "hover:bg-slate-700/50"
                      }`}
                    >
                      <td className="px-4 py-3 text-slate-300 font-mono text-xs">
                        {child.phone_number || "-"}
                      </td>
                      <td className="px-4 py-3 text-blue-300 font-medium">
                        {getSchoolName(child.school_id)}
                      </td>
                      <td className="px-4 py-3 font-medium text-white">
                        {child.email}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => startEditingChild(child)}
                          className="text-blue-400 hover:text-white"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleChildDelete(child.id)}
                          className="text-red-400 hover:text-white"
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                  {children.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-8 text-center text-slate-500"
                      >
                        Sin correos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
