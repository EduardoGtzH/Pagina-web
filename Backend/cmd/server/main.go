package main

import (
	"fmt"
	"log"
	"net/http"

	"web-backend/internal/api"
	"web-backend/internal/api/handlers"
	"web-backend/internal/db"
	"web-backend/internal/models"
	"web-backend/internal/repositories"
	"web-backend/internal/services"
)

func main() {
	// Conexión BD
	db.Connect()

	// Migraciones
	db.DB.AutoMigrate(&models.Usuario{}, &models.Habito{}, &models.Registro{})

	// Repos
	uRepo := repositories.NewUsuarioRepository()
	hRepo := repositories.NewHabitoRepository()
	rRepo := repositories.NewRegistroRepository()

	// Services
	uService := services.NewUsuarioService(uRepo)
	hService := services.NewHabitService(hRepo)
	rService := services.NewRegistroService(rRepo, hRepo) // <-- nuevo

	// Handlers
	uHandler := handlers.NewUsuarioHandler(uService)
	hHandler := handlers.NewHabitHandler(hService)
	rHandler := handlers.NewRegistroHandler(rService)

	// Rutas
	api.RegisterRoutes(uHandler, hHandler, rHandler)

	fmt.Println("Servidor corriendo en :8080")
	log.Fatal(http.ListenAndServe(":8080", nil)) // nil = DefaultServeMux
}
