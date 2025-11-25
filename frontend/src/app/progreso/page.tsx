"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

type Usuario = {
  ID: number;
  Nombre: string;
  Email: string;
};

type Registro = {
  Fecha: string;
  Cumplido: boolean;
};

type HabitoStats = {
  ID: number;
  Nombre: string;
  Descripcion: string;
  totalRegistros: number;
  totalCumplidos: number;
  porcentaje: number;
  streakActual: number;
};

export default function ProgresoPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [habitos, setHabitos] = useState<HabitoStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensajeError, setMensajeError] = useState("");

  const hoy = new Date();
  const fechaBonita = hoy.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const hoyISO = hoy.toISOString().split("T")[0];

  // Leer usuario desde localStorage
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("usuario")
          : null;
      if (!raw) {
        window.location.href = "/login";
        return;
      }
      const parsed = JSON.parse(raw);
      setUsuario({
        ID: parsed.ID,
        Nombre: parsed.Nombre,
        Email: parsed.Email,
      });
    } catch (err) {
      console.error("Error leyendo usuario en progreso:", err);
      if (typeof window !== "undefined") {
        localStorage.removeItem("usuario");
        window.location.href = "/login";
      }
    }
  }, []);

  // Calcular streak actual a partir de registros
  const calcularStreak = (registros: Registro[]): number => {
    if (registros.length === 0) return 0;

    const fechasCumplidas = new Set(
      registros
        .filter((r) => r.Cumplido)
        .map((r) => {
          const d = new Date(r.Fecha);
          return d.toISOString().split("T")[0];
        })
    );

    let streak = 0;
    const cursor = new Date(); // hoy

    while (true) {
      const iso = cursor.toISOString().split("T")[0];
      if (fechasCumplidas.has(iso)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  // Cargar progreso (hábitos + registros)
  const cargarProgreso = async (userId: number) => {
    setLoading(true);
    setMensajeError("");

    try {
      // 1) Traer hábitos
      const resHabitos = await fetch(
        `${API_URL}/habitos?usuario_id=${userId}`
      );
      if (!resHabitos.ok) {
        const txt = await resHabitos.text();
        console.error("Error backend al obtener hábitos:", txt);
        setMensajeError("No se pudieron cargar tus hábitos.");
        setLoading(false);
        return;
      }

      const rawHabitos = await resHabitos.json();

      const baseHabitos: { ID: number; Nombre: string; Descripcion: string }[] =
        (rawHabitos as any[]).map((h: any) => ({
          ID: Number(h.ID ?? h.id ?? 0),
          Nombre: h.Nombre ?? h.nombre ?? "",
          Descripcion: h.Descripcion ?? h.descripcion ?? "",
        }));

      const stats: HabitoStats[] = [];

      // 2) Para cada hábito, traer registros
      for (const h of baseHabitos) {
        if (!h.ID || h.ID <= 0) continue;

        try {
          const resRegs = await fetch(
            `${API_URL}/registros?habito_id=${h.ID}`
          );
          if (!resRegs.ok) {
            const txt = await resRegs.text();
            console.error(
              `Error backend al obtener registros de hábito ${h.ID}:`,
              txt
            );
            continue;
          }

          const rawRegs = await resRegs.json();

          const registros: Registro[] = (rawRegs as any[]).map((r: any) => ({
            Fecha: r.Fecha ?? r.fecha,
            Cumplido: r.Cumplido ?? r.cumplido ?? false,
          }));

          const totalRegistros = registros.length;
          const totalCumplidos = registros.filter((r) => r.Cumplido).length;
          const porcentaje =
            totalRegistros > 0
              ? Math.round((totalCumplidos * 100) / totalRegistros)
              : 0;

          const streakActual = calcularStreak(registros);

          stats.push({
            ID: h.ID,
            Nombre: h.Nombre,
            Descripcion: h.Descripcion,
            totalRegistros,
            totalCumplidos,
            porcentaje,
            streakActual,
          });
        } catch (err) {
          console.error("Error de red al obtener registros:", err);
        }
      }

      setHabitos(stats);
    } catch (err) {
      console.error("Error de red al cargar progreso:", err);
      setMensajeError("Error de conexión al cargar tu progreso.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      cargarProgreso(usuario.ID);
    }
  }, [usuario]);

  if (!usuario) return null;

  // Agregados globales
  const totalHabitos = habitos.length;
  const totalRegistrosGlobal = habitos.reduce(
    (acc, h) => acc + h.totalRegistros,
    0
  );
  const totalCumplidosGlobal = habitos.reduce(
    (acc, h) => acc + h.totalCumplidos,
    0
  );
  const mejorRacha =
    habitos.length > 0
      ? habitos.reduce((max, h) => Math.max(max, h.streakActual), 0)
      : 0;

  const porcentajeGlobal =
    totalRegistrosGlobal > 0
      ? Math.round((totalCumplidosGlobal * 100) / totalRegistrosGlobal)
      : 0;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 px-4 pb-16">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-gray-900 to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto pt-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Tu progreso
            </h1>
            <p className="text-gray-400 mt-1">
              {fechaBonita} —{" "}
              <span className="text-indigo-300 font-semibold">
                {usuario.Nombre}
              </span>
            </p>
          </div>
          <p className="text-sm text-gray-400">
            Hoy es:{" "}
            <span className="text-indigo-300 font-mono">{hoyISO}</span>
          </p>
        </div>

        {mensajeError && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {mensajeError}
          </div>
        )}

        {/* Estadísticas globales */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-4 shadow shadow-black/50">
            <h2 className="text-sm text-gray-400">Hábitos activos</h2>
            <p className="mt-2 text-3xl font-bold text-indigo-300">
              {totalHabitos}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-4 shadow shadow-black/50">
            <h2 className="text-sm text-gray-400">
              Registros completados
            </h2>
            <p className="mt-1 text-xl font-semibold text-emerald-300">
              {totalCumplidosGlobal}{" "}
              <span className="text-sm text-gray-400">
                / {totalRegistrosGlobal || 0}
              </span>
            </p>
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${porcentajeGlobal}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {porcentajeGlobal}% de cumplimiento global
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-4 shadow shadow-black/50">
            <h2 className="text-sm text-gray-400">Mejor racha</h2>
            <p className="mt-2 text-3xl font-bold text-cyan-300">
              {mejorRacha}
              <span className="text-base text-gray-400 ml-1">
                días
              </span>
            </p>
          </div>
        </section>

        {loading ? (
          <p className="text-gray-400">Cargando tu progreso...</p>
        ) : habitos.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-gray-900/80 p-6 text-gray-200">
            <p>No tienes hábitos con registros todavía.</p>
            <p className="mt-2 text-gray-400">
              Crea hábitos en{" "}
              <Link
                href="/habitos"
                className="text-indigo-300 underline underline-offset-4"
              >
                la sección de Hábitos
              </Link>{" "}
              y luego registra tu día para ver estadísticas aquí.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            {habitos.map((h) => (
              <div
                key={h.ID}
                className="rounded-2xl border border-white/10 bg-gray-900/80 p-5 shadow shadow-black/50 hover:border-indigo-500/60 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-indigo-100">
                      {h.Nombre}
                    </h2>
                    {h.Descripcion && (
                      <p className="text-sm text-gray-400">
                        {h.Descripcion}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide">
                        Cumplimiento
                      </p>
                      <p className="font-semibold text-emerald-300">
                        {h.totalCumplidos} / {h.totalRegistros || 0}{" "}
                        <span className="text-xs text-gray-400">
                          ({h.porcentaje}%)
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide">
                        Racha actual
                      </p>
                      <p className="font-semibold text-cyan-300">
                        {h.streakActual}{" "}
                        <span className="text-xs text-gray-400">
                          días
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Barra de progreso por hábito */}
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-400 transition-all"
                      style={{ width: `${h.porcentaje}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
