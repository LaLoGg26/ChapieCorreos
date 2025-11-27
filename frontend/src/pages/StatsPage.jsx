import { useEffect, useState } from "react";
import axios from "axios";

export default function StatsPage() {
  const [data, setData] = useState({
    stats: [],
    grossIncome: 0,
    deductions: 0,
    netProfit: 0,
    totalClicks: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/stats")
      .then((res) => setData(res.data));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <h2 className="text-3xl font-bold text-white border-b border-slate-700 pb-4">
        Tablero Financiero
      </h2>

      {/* TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Ingresos */}
        <div className="bg-slate-800 p-6 rounded-xl border border-green-900/50 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">
            💰
          </div>
          <p className="text-green-400 text-sm uppercase font-bold tracking-wider">
            Ingresos Brutos
          </p>
          <p className="text-4xl font-bold text-white mt-2">
            ${data.grossIncome.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400 mt-2">Generado por escuelas</p>
        </div>

        {/* 2. Egresos (El contador) */}
        <div className="bg-slate-800 p-6 rounded-xl border border-red-900/50 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">
            📉
          </div>
          <p className="text-red-400 text-sm uppercase font-bold tracking-wider">
            Costos Operativos
          </p>
          <p className="text-4xl font-bold text-white mt-2">
            -${data.deductions.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {data.totalClicks} incidentes registrados ($20 c/u)
          </p>
        </div>

        {/* 3. Ganancia Neta */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
          <p className="text-blue-100 text-sm uppercase font-bold tracking-wider">
            Ganancia Neta
          </p>
          <p className="text-5xl font-bold mt-2">
            ${data.netProfit.toFixed(2)}
          </p>
          <p className="text-xs text-blue-200 mt-2 opacity-80">
            Ingresos - Costos
          </p>
        </div>
      </div>

      {/* DETALLE POR ESCUELA */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 bg-slate-900/50 border-b border-slate-700">
          <h3 className="font-bold text-slate-300">
            Desglose de Ingresos por Escuela
          </h3>
        </div>
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-xs">
            <tr>
              <th className="p-4">Escuela</th>
              <th className="p-4">Precio Unit.</th>
              <th className="p-4 text-center">Correos</th>
              <th className="p-4 text-right">Generado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {data.stats.map((s, i) => (
              <tr key={i} className="hover:bg-slate-700/50 transition-colors">
                <td className="p-4 font-bold text-white">{s.school_name}</td>
                <td className="p-4 font-mono text-xs">${s.price}</td>
                <td className="p-4 text-center">
                  <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs">
                    {s.total_emails}
                  </span>
                </td>
                <td className="p-4 text-right font-mono text-green-400 font-bold">
                  +${Number(s.total_earnings).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
