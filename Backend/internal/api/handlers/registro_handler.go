package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"web-backend/internal/services"
)

type RegistroHandler struct {
	Service *services.RegistroService
}

func NewRegistroHandler(s *services.RegistroService) *RegistroHandler {
	return &RegistroHandler{Service: s}
}

// POST /registros
func (h *RegistroHandler) CrearRegistro(w http.ResponseWriter, r *http.Request) {
	var input struct {
		UsuarioID uint   `json:"usuario_id"`
		HabitoID  uint   `json:"habito_id"`
		Fecha     string `json:"fecha"` // "YYYY-MM-DD"
		Cumplido  bool   `json:"cumplido"`
		Nota      string `json:"nota"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	if input.UsuarioID == 0 {
		http.Error(w, "usuario_id requerido", http.StatusBadRequest)
		return
	}

	if input.HabitoID == 0 {
		http.Error(w, "habito_id requerido", http.StatusBadRequest)
		return
	}

	var fecha time.Time
	if input.Fecha == "" {
		fecha = time.Now().UTC()
	} else {
		var err error
		fecha, err = time.Parse("2006-01-02", input.Fecha)
		if err != nil {
			http.Error(w, "fecha inválida, usa formato YYYY-MM-DD", http.StatusBadRequest)
			return
		}
	}

	reg, err := h.Service.CrearRegistro(
		input.UsuarioID,
		input.HabitoID,
		fecha,
		input.Cumplido,
		input.Nota,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reg)
}

// GET /registros?habito_id=...
func (h *RegistroHandler) ListarPorHabito(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("habito_id")
	if idStr == "" {
		http.Error(w, "habito_id requerido", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "habito_id inválido", http.StatusBadRequest)
		return
	}

	registros, err := h.Service.ListarPorHabito(uint(id))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(registros)
}
