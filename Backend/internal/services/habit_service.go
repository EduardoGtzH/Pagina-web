package services

import (
	"errors"

	"web-backend/internal/models"
	"web-backend/internal/repositories"
)

type HabitService struct {
	repo *repositories.HabitoRepository
}

func NewHabitService(repo *repositories.HabitoRepository) *HabitService {
	return &HabitService{repo: repo}
}

func (s *HabitService) CrearHabito(usuarioID uint, nombre, descripcion string) (*models.Habito, error) {
	if nombre == "" {
		return nil, errors.New("el nombre del hábito es obligatorio")
	}

	h := &models.Habito{
		UsuarioID:   usuarioID,
		Nombre:      nombre,
		Descripcion: descripcion,
	}

	if err := s.repo.Crear(h); err != nil {
		return nil, err
	}

	return h, nil
}

func (s *HabitService) ListarPorUsuario(usuarioID uint) ([]models.Habito, error) {
	return s.repo.ListarPorUsuario(usuarioID)
}

// 🔴 Ahora eliminamos de verdad
func (s *HabitService) EliminarHabito(id uint) error {
	return s.repo.Eliminar(id)
}

// 🟢 Editar el hábito original
func (s *HabitService) ActualizarHabito(id, usuarioID uint, nombre, descripcion string) (*models.Habito, error) {
	if nombre == "" {
		return nil, errors.New("el nombre del hábito es obligatorio")
	}

	h, err := s.repo.BuscarPorIDyUsuario(id, usuarioID)
	if err != nil {
		return nil, err
	}

	h.Nombre = nombre
	h.Descripcion = descripcion

	if err := s.repo.Actualizar(h); err != nil {
		return nil, err
	}

	return h, nil
}
