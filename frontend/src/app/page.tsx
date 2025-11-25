"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Usuario = {
  Nombre: string;
  Email: string;
  ID: number;
};

export default function Home() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("usuario");
      if (stored) {
        setUsuario(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error leyendo usuario de localStorage", e);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center text-center px-6 bg-bgDark text-textLight overflow-visible">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-900/30 via-purple-900/10 to-cyan-800/20 animate-pulse"></div>

      {/* HERO */}
      <section className="relative z-20 max-w-4xl mt-32 animate-fade-up overflow-visible">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-linear-to-tr from-blue-600 to-cyan-400 bg-clip-text text-transparent drop-shadow-xl overflow-visible leading-tight">
          Mejora tus Hábitos
        </h1>

        <p className="text-textMuted text-lg mt-4">
          Organiza, registra y transforma tu vida con una herramienta simple y poderosa.
        </p>

        {/* Botones / CTAs */}
        <div className="flex flex-col md:flex-row gap-6 justify-center mt-10">
          {loadingUser ? (
            <span className="text-textMuted">Cargando...</span>
          ) : usuario ? (
            <Link
              href="/habitos"
              className="px-10 py-4 bg-linear-to-tr from-blue-600 to-cyan-500 bg-accent2 text-bgDark rounded-xl font-bold shadow-xl hover:scale-105 transition-all"
            >
              Ir a mis Hábitos
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="px-10 py-4 border border-white/10 rounded-xl font-bold hover:border-accent2 hover:text-accent2 transition-all duration-300 hover:scale-110"
              >
                Crear cuenta
              </Link>

              <Link
                href="/login"
                className="px-10 py-4 border border-white/10 rounded-xl font-bold hover:border-accent2 hover:text-accent2 transition-all duration-300 hover:scale-110"
              >
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-10 mt-20 max-w-6xl">
        {/* Registra tu día */}
        <Link
          href="/registro"
          className="p-6 bg-bgCard rounded-2xl animated-border glow hover:scale-105 transition-all cursor-pointer text-left"
        >
          <h3 className="text-accent2 text-xl font-bold mb-2">
            Registra tu día
          </h3>
          <p className="text-textMuted">
            Marca tus hábitos y crea la racha perfecta paso a paso.
          </p>
        </Link>

        {/* Visualiza tu progreso */}
        <Link
          href="/progreso"
          className="p-6 bg-bgCard rounded-2xl animated-border glow hover:scale-105 transition-all cursor-pointer text-left"
        >
          <h3 className="text-accent2 text-xl font-bold mb-2">
            Visualiza tu progreso
          </h3>
          <p className="text-textMuted">
            Próximamente: gráficas y métricas sobre tu consistencia.
          </p>
        </Link>

        {/* Organiza tu vida */}
        <Link
          href="/habitos"
          className="p-6 bg-bgCard rounded-2xl animated-border glow hover:scale-105 transition-all cursor-pointer text-left"
        >
          <h3 className="text-accent2 text-xl font-bold mb-2">
            Organiza tu vida
          </h3>
          <p className="text-textMuted">
            Diseña rutinas claras y sostenibles sin complicarte.
          </p>
        </Link>
      </section>
    </div>
  );
}
