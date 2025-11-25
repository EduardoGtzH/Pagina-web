package api

import (
	"net/http"

	"web-backend/internal/api/handlers"
)

// Middleware CORS sencillo para desarrollo
func withCORS(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Permite cualquier origen en desarrollo
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Responder rápido a preflight OPTIONS
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		h(w, r)
	}
}

func RegisterRoutes(
	usuarioHandler *handlers.UsuarioHandler,
	habitHandler *handlers.HabitHandler,
	registroHandler *handlers.RegistroHandler,
) {
	http.HandleFunc("/usuarios", withCORS(usuarioHandler.CrearUsuario))
	http.HandleFunc("/login", withCORS(usuarioHandler.Login))

	http.HandleFunc("/habitos", withCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			habitHandler.CrearHabito(w, r)
		case http.MethodGet:
			habitHandler.ListarPorUsuario(w, r)
		case http.MethodPut:
			habitHandler.ActualizarHabito(w, r)
		case http.MethodDelete:
			habitHandler.EliminarHabito(w, r)
		default:
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/registros", withCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			registroHandler.CrearRegistro(w, r)
		case http.MethodGet:
			registroHandler.ListarPorHabito(w, r)
		default:
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		}
	}))
}
