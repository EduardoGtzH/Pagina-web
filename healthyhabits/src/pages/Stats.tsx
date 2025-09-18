import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Stats() {

    const [username, setUsername] = useState<string>("");

    useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) {
    setUsername(savedUser);
    }
    }, []);

  // 🔹 Datos de ejemplo (luego puedes conectar esto con tu estado real/localStorage)
  const data = [
    { day: "Lun", progress: 80 },
    { day: "Mar", progress: 100 },
    { day: "Mié", progress: 60 },
    { day: "Jue", progress: 40 },
    { day: "Vie", progress: 90 },
    { day: "Sáb", progress: 70 },
    { day: "Dom", progress: 50 },
  ];

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-slate-900 shadow-md p-6 flex flex-col">
        <img src={logo} alt="HealthyHabits Logo" className="logo-bottom" />
        <h1 className="text-4xl font-normal mb-6 text-blue-200">Hola, {username}</h1>

        <NavLink
          to="/home"
          id="menu-option"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/stats"
          id="menu-option"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Estadísticas
        </NavLink>

        <NavLink
          to="/calendar"
          id="menu-option"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Calendario
        </NavLink>

        <NavLink
          to="/recommendations"
          id="menu-option"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Recomendaciones
        </NavLink>
      </aside>

      {/* Contenido */}
      <main className="w-3/4 bg-blue-950 p-8 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6">📊 Tus estadísticas semanales</h2>

        {/* Gráfico de barras */}
        <div className="w-full h-80 bg-blue-950 p-4 shadow-md rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="progress" fill="#2563eb" /> {/* azul tailwind */}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* También podrías mostrar un gráfico de línea */}
        <div className="w-full h-80 mt-8 bg-blue-950 p-4 shadow-md rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="progress" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
