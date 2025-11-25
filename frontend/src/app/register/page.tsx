"use client";

import { useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleRegister = async () => {
    setMensaje("");
    setEsError(false);

    if (!nombre || !email || !password) {
      setMensaje("Completa todos los campos.");
      setEsError(true);
      return;
    }

    setCargando(true);

    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Error backend al registrar:", txt);
        setMensaje("Error al registrar usuario ❌");
        setEsError(true);
        return;
      }

      // Si tu backend devuelve el usuario creado en JSON:
      // const data = await res.json();
      setMensaje("Usuario creado exitosamente 🎉");
      setEsError(false);

      // Si quisieras limpiar el formulario:
      setNombre("");
      setEmail("");
      setPassword("");

      // Si quisieras redirigir automáticamente:
      // window.location.href = "/login";
    } catch (err) {
      console.error("Error de red al registrar:", err);
      setMensaje("No se pudo conectar con el servidor.");
      setEsError(true);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgDark px-4">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-indigo-800/20 animate-pulse"></div>

      {/* Card principal */}
      <div className="relative w-full max-w-md bg-bgCard backdrop-blur-xs shadow-2xl rounded-2xl p-10 border border-white/10 animate-fadein">
        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-textLight mb-6">
          Crear una cuenta
        </h1>

        <p className="text-center text-textMuted mb-8">
          Únete y comienza a mejorar tus hábitos cada día.
        </p>

        {/* Campos */}
        <div className="space-y-6">
          <div>
            <label className="text-sm text-textLight">Nombre</label>
            <input
              className="w-full p-3 mt-1 rounded-lg bg-white/10 border border-white/20 text-textLight placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Tu nombre ej. Alfredo Adame"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-textLight">
              Correo electrónico
            </label>
            <input
              className="w-full p-3 mt-1 rounded-lg bg-white/10 border border-white/20 text-textLight placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="email@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>

          <div>
            <label className="text-sm text-textLight">Contraseña</label>
            <input
              type="password"
              className="w-full p-3 mt-1 rounded-lg bg-white/10 border border-white/20 text-textLight placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Botón principal */}
        <button
          onClick={handleRegister}
          disabled={cargando}
          className="w-full mt-8 bg-accent hover:bg-gray-500 transition-all text-white p-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {cargando ? "Registrando..." : "Registrarse"}
        </button>

        {/* Mensaje */}
        {mensaje && (
          <p
            className={`text-center mt-4 font-medium animate-fadein ${
              esError ? "text-red-400" : "text-green-400"
            }`}
          >
            {mensaje}
          </p>
        )}

        {/* Botón hacia login */}
        <div className="text-center mt-8">
          <p className="text-textMuted">¿Ya tienes una cuenta?</p>
          <Link
            href="/login"
            className="text-accent hover:text-accentDark transition-all font-medium underline underline-offset-4"
          >
            Ir a Login
          </Link>
        </div>
      </div>
    </div>
  );
}
