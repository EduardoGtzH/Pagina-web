import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

type Recommendation = {
  id: number;
  title: string;
  description: string;
  applied: boolean;
};

export default function Recommendations() {

    const [username, setUsername] = useState<string>("");

    useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) {
    setUsername(savedUser);
    }
    }, []);
    
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: 1,
      title: "💧 Hidrátate mejor",
      description: "Intenta beber al menos 8 vasos de agua al día.",
      applied: false,
    },
    {
      id: 2,
      title: "🏋️ Ejercicio ligero",
      description: "Haz una caminata de 15 minutos después de comer.",
      applied: false,
    },
    {
      id: 3,
      title: "😴 Descanso",
      description: "Duerme entre 7 y 8 horas para mejorar tu salud.",
      applied: false,
    },
    {
      id: 4,
      title: "🍎 Alimentación",
      description: "Agrega una fruta a tu desayuno cada mañana.",
      applied: false,
    },
  ]);

  const toggleApplied = (id: number) => {
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, applied: !rec.applied } : rec
      )
    );
  };

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

      {/* Main content */}
      <main className="w-3/4 bg-blue-950 p-8 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-500">Recomendaciones para ti 💡</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-6 rounded-lg shadow-md border transition ${
                rec.applied ? "bg-green-100 border-green-400" : "bg-blue-950"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-800">{rec.title}</h3>
              <p className="text-blue-500 mb-4">{rec.description}</p>
              <button
                onClick={() => toggleApplied(rec.id)}
                className={`px-4 py-2 rounded-md font-medium ${
                  rec.applied
                    ? "bg-green-500 text-blue-500"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {rec.applied ? "Aplicado ✅" : "Marcar como aplicado"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
