import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import waterImg from "../assets/agua.png";
import exerciseImg from "../assets/ejercicio.png";
import sleepImg from "../assets/dormir.png";
import foodImg from "../assets/comida.png";


export default function Home() {
    const [username, setUsername] = useState<string>("");

    const today = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    useEffect(() => {
        const savedUser = localStorage.getItem("username");
        if (savedUser) {
        setUsername(savedUser);
        }
    }, []);

    const [habits, setHabits] = useState([
        { id: 1, name: "Beber agua", done: false, image: waterImg },
        { id: 2, name: "Hacer ejercicio", done: false, image: exerciseImg },
        { id: 3, name: "Dormir bien", done: false, image: sleepImg },
        { id: 4, name: "Comer saludable", done: false, image: foodImg },
        ]);

    const toggleHabit = (id: number) => {
        setHabits(
        habits.map((habit) =>
            habit.id === id ? { ...habit, done: !habit.done } : habit
        )
        );
    };

  return (
    <div className="flex h-screen w-screen">
      {/* Menú lateral */}
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
        <h2 className="text-5xl font-bold mb-6 text-blue-200">
          Tus hábitos hoy: <span className="capitalize">{today}</span>
        </h2>

        <div className="grid grid-cols-2 gap-6">
            {habits.map((habit) => (
                <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`p-6 rounded-lg shadow-md text-xl font-semibold flex flex-col items-center justify-center cursor-pointer transition
                    border-4
                    ${habit.done ? "bg-gray-600 border-gray-200" : "bg-blue-900 border-gray-600 hover:border-blue-950"}`}
                >
                <img
                    src={habit.image}
                    alt={habit.name}
                    className="w-16 h-16 mb-4"
                />
                <span>{habit.done ? `✅ ${habit.name}` : habit.name}</span>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}
