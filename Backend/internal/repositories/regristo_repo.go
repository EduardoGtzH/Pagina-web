package repositories

import (
	"web-backend/internal/db"
	"web-backend/internal/models"
)

type RegistroRepository struct{}

func NewRegistroRepository() *RegistroRepository {
	return &RegistroRepository{}
}

func (r *RegistroRepository) Crear(reg *models.Registro) error {
	return db.DB.Create(reg).Error
}

func (r *RegistroRepository) ListarPorHabito(habitoID uint) ([]models.Registro, error) {
	var regs []models.Registro
	err := db.DB.Where("habito_id = ?", habitoID).Order("fecha DESC").Find(&regs).Error
	return regs, err
}
