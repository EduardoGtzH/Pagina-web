"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Usuario = {
  Nombre: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Cargar usuario desde localStorage
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("usuario")
          : null;
      if (!raw) {
        setUsuario(null);
        return;
      }
      const parsed = JSON.parse(raw);
      setUsuario({ Nombre: parsed.Nombre });
    } catch (err) {
      console.error("Error leyendo usuario en Navbar", err);
      setUsuario(null);
    }
  }, []);

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("usuario");
    }
    setUsuario(null);
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-bgCard/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Izquierda: título + botón Home */}
        <div className="flex items-center gap-4">
          {/* Botón Home */}
      

          {/* Marca / nombre de la app */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow shadow-cyan-500/40" />
            <span className="font-semibold text-gray-100 tracking-tight">
              Healty Habits
            </span>
          </Link>
        </div>

        {/* Derecha: navegación según si hay sesión o no */}
        <div className="flex items-center gap-2">
          {usuario ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-300 mr-2">
                Hola, <span className="font-semibold">{usuario.Nombre}</span>
              </span>

              <Link
                href="/habitos"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive("/habitos")
                    ? "bg-indigo-600 text-white shadow shadow-indigo-500/40"
                    : "text-gray-200 hover:bg-white/10"
                }`}
              >
                Hábitos
              </Link>

              <Link
                href="/registro"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive("/registro-dia")
                    ? "bg-indigo-600 text-white shadow shadow-indigo-500/40"
                    : "text-gray-200 hover:bg-white/10"
                }`}
              >
                Registra tu día
              </Link>

              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1.5 rounded-lg text-sm font-medium text-red-300 border border-red-500/50 hover:bg-red-500/20 transition-all"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive("/login")
                    ? "bg-indigo-600 text-white shadow shadow-indigo-500/40"
                    : "text-gray-200 hover:bg-white/10"
                }`}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive("/register")
                    ? "bg-cyan-500 text-gray-900 shadow shadow-cyan-400/50"
                    : "text-gray-900 bg-gray-100 hover:bg-white"
                }`}
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
