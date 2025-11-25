"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";
import { API_URL } from "@/lib/api";

type Usuario = {
  ID: number;
  Nombre: string;
  Email: string;
};

type HabitoBase = {
  ID: number;
  Nombre: string;
  Descripcion: string;
  Activo: boolean;
};

type HabitoDia = HabitoBase & {
  cumplido: boolean;
  nota: string;
  yaRegistradoHoy: boolean;
};

export default function RegistroDiaPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [habitos, setHabitos] = useState<HabitoDia[]>([]);
  const [cargandoHabitos, setCargandoHabitos] = useState(true);

  const [enviando, setEnviando] = useState(false);
  const [mensajeOk, setMensajeOk] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  // Fecha de hoy en distintos formatos
  const hoy = new Date();
  const fechaISO = hoy.toISOString().split("T")[0]; // YYYY-MM-DD para comparar y mandar al backend
  const fechaBonita = hoy.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // 1) Leer usuario de localStorage
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("usuario")
          : null;
      if (!raw) {
        router.push("/login");
        return;
      }
      const parsed = JSON.parse(raw);
      setUsuario({
        ID: parsed.ID,
        Nombre: parsed.Nombre,
        Email: parsed.Email,
      });
    } catch (err) {
      console.error("Error leyendo usuario en registro-dia:", err);
      if (typeof window !== "undefined") {
        localStorage.removeItem("usuario");
        router.push("/login");
      }
    }
  }, [router]);

  // Función auxiliar: para un conjunto de hábitos, marcar cuáles ya tienen registro hoy
  const marcarRegistradosDeHoy = async (
    habs: HabitoDia[]
  ): Promise<HabitoDia[]> => {
    const resultado: HabitoDia[] = [];

    for (const h of habs) {
      try {
        const res = await fetch(
          `${API_URL}/registros?habito_id=${h.ID}`
        );
        if (!res.ok) {
          resultado.push(h);
          continue;
        }

        const raw = await res.json();
        const registros = (raw as any[]).map((r: any) => ({
          Fecha: r.Fecha ?? r.fecha,
          Cumplido: r.Cumplido ?? r.cumplido ?? false,
          Nota: r.Nota ?? r.nota ?? "",
        }));

        const registroHoy = registros.find((reg) => {
          if (!reg.Fecha) return false;
          const f = new Date(reg.Fecha).toISOString().split("T")[0];
          return f === fechaISO;
        });

        if (registroHoy) {
          resultado.push({
            ...h,
            yaRegistradoHoy: true,
            cumplido: registroHoy.Cumplido,
            nota: registroHoy.Nota,
          });
        } else {
          resultado.push(h);
        }
      } catch (err) {
        console.error("Error consultando registros de hábito", h.ID, err);
        resultado.push(h);
      }
    }

    return resultado;
  };

  // 2) Cargar hábitos del usuario + marcar los que ya están registrados hoy
  const cargarHabitos = async (userId: number) => {
    setCargandoHabitos(true);
    try {
      const res = await fetch(
        `${API_URL}/habitos?usuario_id=${userId}`
      );
      if (!res.ok) {
        const txt = await res.text();
        console.error("Error backend al obtener hábitos:", txt);
        setMensajeError("No se pudieron cargar tus hábitos.");
        return;
      }

      const raw = await res.json();

      const base: HabitoDia[] = (raw as any[]).map((h: any) => ({
        ID: Number(h.ID ?? h.id ?? 0),
        Nombre: h.Nombre ?? h.nombre ?? "",
        Descripcion: h.Descripcion ?? h.descripcion ?? "",
        Activo: h.Activo ?? h.activo ?? true,
        cumplido: false,
        nota: "",
        yaRegistradoHoy: false,
      }));

      const conEstado = await marcarRegistradosDeHoy(base);
      setHabitos(conEstado);
    } catch (err) {
      console.error("Error de red al cargar hábitos:", err);
      setMensajeError("Error de conexión al cargar hábitos.");
    } finally {
      setCargandoHabitos(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      cargarHabitos(usuario.ID);
    }
  }, [usuario]);

  // 3) Toggle de cumplido (solo si NO está ya registrado hoy)
  const toggleCumplido = (id: number) => {
    setHabitos((prev) =>
      prev.map((h) =>
        h.ID === id
          ? h.yaRegistradoHoy
            ? h
            : { ...h, cumplido: !h.cumplido }
          : h
      )
    );
  };

  // 4) Cambio de nota (solo si NO está ya registrado hoy)
  const cambiarNota = (id: number, nota: string) => {
    setHabitos((prev) =>
      prev.map((h) =>
        h.ID === id
          ? h.yaRegistradoHoy
            ? h
            : { ...h, nota }
          : h
      )
    );
  };

  // 5) Enviar registro del día
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    setEnviando(true);
    setMensajeOk("");
    setMensajeError("");

    try {
      let todoBien = true;

      for (const hab of habitos) {
        if (!hab.ID || hab.ID <= 0 || hab.yaRegistradoHoy) {
          continue;
        }

        const res = await fetch(`${API_URL}/registros`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario_id: usuario.ID,
            habito_id: hab.ID,
            fecha: fechaISO,
            cumplido: hab.cumplido,
            nota: hab.nota,
          }),


        });

        if (!res.ok) {
          todoBien = false;
          const txt = await res.text();
          console.error(`Error al registrar hábito ${hab.ID}:`, txt);
        }
      }

      if (todoBien) {
        setMensajeOk("¡Registro de hoy guardado correctamente! ✅");
        await cargarHabitos(usuario.ID);
      } else {
        setMensajeError(
          "Algunos hábitos no se pudieron registrar. Revisa la consola."
        );
      }
    } catch (err) {
      console.error("Error de red al guardar registros:", err);
      setMensajeError("Error de conexión al guardar tus registros.");
    } finally {
      setEnviando(false);
    }
  };

  if (!usuario) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 px-4 pb-16">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-gray-900 to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto pt-24">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Registra tu día
          </h1>
          <p className="text-gray-400 mt-1">
            {fechaBonita} —{" "}
            <span className="text-indigo-300 font-semibold">
              {usuario.Nombre}
            </span>
          </p>
        </div>

        {/* Mensajes */}
        {mensajeOk && (
          <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
            {mensajeOk}
          </div>
        )}
        {mensajeError && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {mensajeError}
          </div>
        )}

        {cargandoHabitos ? (
          <p className="text-gray-400">Cargando tus hábitos...</p>
        ) : habitos.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-gray-900/80 p-6 text-gray-200">
            <p>No tienes hábitos configurados todavía.</p>
            <p className="mt-2 text-gray-400">
              Ve a la sección de{" "}
              <Link
                href="/habitos"
                className="text-indigo-300 underline underline-offset-4"
              >
                Hábitos
              </Link>{" "}
              para crear algunos antes de registrar tu día.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            {habitos.map((hab) => (
              <div
                key={hab.ID}
                className="group relative rounded-2xl border border-white/10 bg-gray-900/80 p-4 shadow shadow-black/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/60"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-indigo-500/10 via-transparent to-cyan-500/10" />

                <div className="relative flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-indigo-100">
                        {hab.Nombre}
                      </h2>
                      {hab.Descripcion && (
                        <p className="text-sm text-gray-400">
                          {hab.Descripcion}
                        </p>
                      )}
                      {hab.yaRegistradoHoy && (
                        <span className="mt-1 inline-flex items-center rounded-full bg-emerald-500/15 border border-emerald-400/50 px-2.5 py-0.5 text-xs font-medium text-emerald-200">
                          Ya registrado hoy
                        </span>
                      )}
                    </div>

                    {/* Toggle cumplido */}
                    <label
                      className={`relative inline-flex items-center ${
                        hab.yaRegistradoHoy
                          ? "opacity-60 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={hab.cumplido}
                        onChange={() => toggleCumplido(hab.ID)}
                        disabled={hab.yaRegistradoHoy}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:bg-indigo-600 transition-colors">
                        <div
                          className={`h-5 w-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ml-0.5 ${
                            hab.cumplido ? "translate-x-5" : ""
                          }`}
                        />
                      </div>
                    </label>
                  </div>

                  {/* Nota */}
                  <input
                    type="text"
                    placeholder={
                      hab.yaRegistradoHoy
                        ? "Ya registraste este hábito hoy"
                        : "Nota del día (opcional)"
                    }
                    className={`mt-1 w-full rounded-xl border border-white/10 bg-gray-800/80 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      hab.yaRegistradoHoy
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }`}
                    value={hab.nota}
                    onChange={(e) =>
                      cambiarNota(hab.ID, e.target.value)
                    }
                    disabled={hab.yaRegistradoHoy}
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={enviando}
              className="w-full mt-4 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {enviando ? "Guardando..." : "Guardar registro de hoy"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
