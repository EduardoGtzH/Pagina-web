package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"web-backend/internal/services"
)

type HabitHandler struct {
	Service *services.HabitService
}

func NewHabitHandler(s *services.HabitService) *HabitHandler {
	return &HabitHandler{Service: s}
}

// POST /habitos
func (h *HabitHandler) CrearHabito(w http.ResponseWriter, r *http.Request) {
	var input struct {
		UsuarioID   uint   `json:"usuario_id"`
		Nombre      string `json:"nombre"`
		Descripcion string `json:"descripcion"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	habito, err := h.Service.CrearHabito(input.UsuarioID, input.Nombre, input.Descripcion)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(habito)
}

// GET /habitos?usuario_id=7
func (h *HabitHandler) ListarPorUsuario(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("usuario_id")
	if idStr == "" {
		http.Error(w, "usuario_id requerido", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "usuario_id inválido", http.StatusBadRequest)
		return
	}

	habitos, err := h.Service.ListarPorUsuario(uint(id))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(habitos)
}

// PUT /habitos
func (h *HabitHandler) ActualizarHabito(w http.ResponseWriter, r *http.Request) {
	var input struct {
		ID          uint   `json:"id"`
		UsuarioID   uint   `json:"usuario_id"`
		Nombre      string `json:"nombre"`
		Descripcion string `json:"descripcion"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	habito, err := h.Service.ActualizarHabito(input.ID, input.UsuarioID, input.Nombre, input.Descripcion)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(habito)
}

// DELETE /habitos?id=4
func (h *HabitHandler) EliminarHabito(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "id requerido", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "id inválido", http.StatusBadRequest)
		return
	}

	if err := h.Service.EliminarHabito(uint(id)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
