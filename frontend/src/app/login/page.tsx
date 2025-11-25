"use client";

import { useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    setMensaje("");
    setEsError(false);

    if (!email || !password) {
      setMensaje("Completa correo y contraseña.");
      setEsError(true);
      return;
    }

    setCargando(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // El backend normalmente responde texto en errores (http.Error)
        const txt = await res.text();
        console.error("Error login backend:", txt);
        setMensaje("Credenciales incorrectas ❌");
        setEsError(true);
        return;
      }

      // Éxito → aquí sí esperamos JSON
      const data = await res.json();

      // Nos quedamos solo con lo que necesitamos
      const usuarioLimpio = {
        ID: data.ID ?? data.id,
        Nombre: data.Nombre ?? data.nombre,
        Email: data.Email ?? data.email,
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioLimpio));
      setMensaje(`Bienvenido ${usuarioLimpio.Nombre} 🎉`);
      setEsError(false);

      // Redirigir al home
      window.location.href = "/";
    } catch (err) {
      console.error("Error de red en login:", err);
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
          Healty Habits
        </h1>

        <p className="text-center text-textMuted mb-8">Bienvenido</p>

        {/* Campos */}
        <div className="space-y-6">
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
          onClick={handleLogin}
          disabled={cargando}
          className="w-full mt-8 bg-accent hover:bg-gray-500 transition-all text-white p-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {cargando ? "Entrando..." : "Entrar"}
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

        {/* Botón hacia registro */}
        <div className="text-center mt-8">
          <p className="text-textMuted">¿No tienes una cuenta?</p>
          <Link
            href="/register"
            className="text-accent hover:text-accentDark transition-all font-medium underline underline-offset-4"
          >
            Crear una
          </Link>
        </div>
      </div>
    </div>
  );
}
