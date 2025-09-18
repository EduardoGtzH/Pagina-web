import { useEffect, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";

export default function Calendar() {
    const [username, setUsername] = useState<string>("");
    
        useEffect(() => {
        const savedUser = localStorage.getItem("username");
        if (savedUser) {
        setUsername(savedUser);
        }
        }, []);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Ejemplo de datos de progreso por día
  const progressData: Record<string, number> = {
    "2025-09-01": 100,
    "2025-09-02": 50,
    "2025-09-03": 0,
    "2025-09-04": 75,
  };

  // Rango de días del mes actual
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Función para obtener el color del día según el porcentaje
  const getDayColor = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    const progress = progressData[key] ?? null;

    if (progress === null) return "bg-blue-950"; // sin datos
    if (progress === 100) return "bg-green-500 text-white";
    if (progress >= 50) return "bg-yellow-400 text-black";
    if (progress > 0) return "bg-orange-400 text-black";
    return "bg-red-500 text-white";
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

      {/* Contenido principal */}
      <main className="w-3/4 bg-blue-950 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="px-4 py-2 text-blue-500 rounded-md"
          >
            ⬅️ Anterior
          </button>
          <h2 className="text-2xl font-bold">
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="px-4 py-2 text-blue-500 rounded-md"
          >
            Siguiente ➡️
          </button>
        </div>

        {/* Calendario */}
        <div className="grid grid-cols-7 gap-2 ">
          {daysInMonth.map((day) => (
            <div
              key={day.toISOString()}
              className={`h-20 flex items-center justify-center rounded-md font-semibold ${getDayColor(
                day
              )}`}
            >
              {format(day, "d", { locale: es })}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
