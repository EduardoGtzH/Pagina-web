"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useRef, useState, FormEvent } from "react";

type Usuario = {
  ID: number;
  Nombre: string;
  Email: string;
};

type Habito = {
  ID: number;
  Nombre: string;
  Descripcion: string;
  Activo: boolean;
};

export default function HabitosPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Leer usuario de localStorage de forma segura
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
      console.error("Error leyendo usuario de localStorage", err);
      if (typeof window !== "undefined") {
        localStorage.removeItem("usuario");
        window.location.href = "/login";
      }
    }
  }, []);

  // Cargar hábitos del backend
  const cargarHabitos = async (userId: number) => {
    try {
      const res = await fetch(`${API_URL}/habitos?usuario_id=${userId}`);
      if (!res.ok) {
        const txt = await res.text();
        console.error("Error backend al listar hábitos:", txt);
        return;
      }

      const raw = await res.json();

      const normalizados: Habito[] = (raw as any[]).map((h: any) => ({
        ID: Number(h.ID ?? h.id ?? 0),
        Nombre: h.Nombre ?? h.nombre ?? "",
        Descripcion: h.Descripcion ?? h.descripcion ?? "",
        Activo: h.Activo ?? h.activo ?? true,
      }));

      setHabitos(normalizados);
    } catch (err) {
      console.error("Error de red al cargar hábitos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      setLoading(true);
      cargarHabitos(usuario.ID);
    }
  }, [usuario]);

  // Enfocar input al abrir modal
  useEffect(() => {
    if (showModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal]);

  const abrirNuevo = () => {
    setEditingId(null);
    setNombre("");
    setDescripcion("");
    setMensaje(null);
    setShowModal(true);
  };

  const abrirEditar = (h: Habito) => {
    setEditingId(h.ID);
    setNombre(h.Nombre);
    setDescripcion(h.Descripcion || "");
    setMensaje(null);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingId(null);
    setNombre("");
    setDescripcion("");
  };

  const manejarEliminar = async (id: number) => {
    if (!usuario) return;

    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      console.error("ID inválido en frontend al eliminar:", id);
      setMensaje("ID inválido, recarga la página e inténtalo de nuevo.");
      return;
    }

    const ok = window.confirm(
      "¿Seguro que quieres eliminar este hábito para siempre?"
    );
    if (!ok) return;

    try {
      const res = await fetch(`${API_URL}/habitos?id=${idNum}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("Error al eliminar hábito:", txt);
        setMensaje("No se pudo eliminar el hábito.");
        return;
      }
      await cargarHabitos(usuario.ID);
      setMensaje("Hábito eliminado.");
    } catch (err) {
      console.error("Error de red al eliminar hábito:", err);
      setMensaje("Error de conexión al eliminar hábito.");
    }
  };

  const manejarSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    setMensaje(null);

    try {
      if (editingId == null) {
        // Crear
        const res = await fetch(`${API_URL}/habitos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario_id: usuario.ID,
            nombre,
            descripcion,
          }),
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error("Error al crear hábito:", txt);
          setMensaje("Error al crear el hábito.");
          return;
        }

        setMensaje("Hábito creado.");
      } else {
        // Editar (PUT /habitos)
        const res = await fetch(`${API_URL}/habitos`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            usuario_id: usuario.ID,
            nombre,
            descripcion,
          }),
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error("Error al actualizar hábito:", txt);
          setMensaje("Error al actualizar el hábito.");
          return;
        }

        setMensaje("Hábito actualizado.");
      }

      await cargarHabitos(usuario.ID);
      cerrarModal();
    } catch (err) {
      console.error("Error de red al guardar hábito:", err);
      setMensaje("Error de conexión al guardar hábito.");
    }
  };

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 pb-16">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-gray-900 to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto pt-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Tus hábitos
            </h1>
            <p className="text-gray-400 mt-1">
              Administra las rutinas de{" "}
              <span className="font-semibold text-indigo-300">
                {usuario.Nombre}
              </span>
            </p>
          </div>
          <button
            onClick={abrirNuevo}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/30 font-semibold"
          >
            + Nuevo hábito
          </button>
        </div>

        {mensaje && (
          <div className="mb-4 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200">
            {mensaje}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400">Cargando hábitos...</p>
        ) : habitos.length === 0 ? (
          <p className="text-gray-400">
            Aún no has creado ningún hábito. Empieza con el botón{" "}
            <span className="text-indigo-300 font-semibold">
              “Nuevo hábito”
            </span>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {habitos.map((h) => (
              <div
                key={h.ID}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gray-900/80 p-5 shadow-lg shadow-black/50 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/60 hover:shadow-indigo-900/60"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-bold text-indigo-100">
                      {h.Nombre}
                    </h2>
                  </div>
                  {h.Descripcion && (
                    <p className="mt-2 text-sm text-gray-300">
                      {h.Descripcion}
                    </p>
                  )}

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => abrirEditar(h)}
                      className="px-3 py-1.5 text-sm rounded-lg border border-indigo-400/60 text-indigo-200 hover:bg-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => manejarEliminar(h.ID)}
                      className="px-3 py-1.5 text-sm rounded-lg border border-red-400/60 text-red-200 hover:bg-red-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Fondo del modal */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-100 transition-opacity"
            onClick={cerrarModal}
          />
          {/* Caja */}
          <div className="relative z-10 w-full max-w-md px-4">
            <div className="rounded-2xl bg-gray-900/95 border border-white/10 shadow-2xl shadow-black/70 p-6 transform transition-all duration-300 ease-out scale-100 opacity-100">
              <h2 className="text-2xl font-bold mb-4 text-indigo-100">
                {editingId ? "Editar hábito" : "Nuevo hábito"}
              </h2>

              <form onSubmit={manejarSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-200 mb-1"
                  >
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    ref={inputRef}
                    className="w-full rounded-xl border border-white/10 bg-gray-800/80 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="descripcion"
                    className="block text-sm font-medium text-gray-200 mb-1"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-gray-800/80 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-gray-700/80 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/40"
                  >
                    {editingId ? "Guardar cambios" : "Crear hábito"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
