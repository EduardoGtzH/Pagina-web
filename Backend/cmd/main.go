package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"backend/internal/api"
	"backend/internal/api/handlers"
	"backend/internal/db"
	"backend/internal/models"
	"backend/internal/repositories"
	"backend/internal/services"
)

func main() {
	// Conectar a PostgreSQL (ya no retorna error)
	db.Connect()
	fmt.Println("Conectado a PostgreSQL con GORM")

	// Migraciones automáticas
	db.DB.AutoMigrate(
		&models.Usuario{},
		&models.Habito{},
		&models.Registro{},
	)

	// Repos
	usuarioRepo := repositories.NewUsuarioRepository()
	habitoRepo := repositories.NewHabitoRepository()
	registroRepo := repositories.NewRegistroRepository()

	// Services
	usuarioService := services.NewUsuarioService(usuarioRepo)
	habitoService := services.NewHabitService(habitoRepo)
	registroService := services.NewRegistroService(registroRepo)

	// Handlers
	usuarioHandler := handlers.NewUsuarioHandler(usuarioService)
	habitoHandler := handlers.NewHabitHandler(habitoService)
	registroHandler := handlers.NewRegistroHandler(registroService)

	// Registrar rutas
	api.RegisterRoutes(usuarioHandler, habitoHandler, registroHandler)

	// Puerto
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("Servidor escuchando en puerto:", port)
	log.Fatal(http.ListenAndServe(":8080", nil))

}
