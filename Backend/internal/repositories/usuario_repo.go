package repositories

import (
	"web-backend/internal/db"
	"web-backend/internal/models"
)

type UsuarioRepository struct{}

func NewUsuarioRepository() *UsuarioRepository {
	return &UsuarioRepository{}
}

func (r *UsuarioRepository) Crear(usuario *models.Usuario) error {
	return db.DB.Create(usuario).Error
}

func (r *UsuarioRepository) BuscarPorEmail(email string) (*models.Usuario, error) {
	var usuario models.Usuario
	err := db.DB.Where("email = ?", email).First(&usuario).Error
	if err != nil {
		return nil, err
	}
	return &usuario, nil
}
