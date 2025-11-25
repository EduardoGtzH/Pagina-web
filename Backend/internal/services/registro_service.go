package services

import (
	"errors"
	"time"

	"gorm.io/gorm"
	"web-backend/internal/models"
	"web-backend/internal/repositories"
)

type RegistroService struct {
	repo        *repositories.RegistroRepository
	habitosRepo *repositories.HabitoRepository
}

func NewRegistroService(
	repo *repositories.RegistroRepository,
	habitosRepo *repositories.HabitoRepository,
) *RegistroService {
	return &RegistroService{
		repo:        repo,
		habitosRepo: habitosRepo,
	}
}

// usuarioID: el usuario que está registrando
// habitoID: hábito a registrar
func (s *RegistroService) CrearRegistro(
	usuarioID, habitoID uint,
	fecha time.Time,
	cumplido bool,
	nota string,
) (*models.Registro, error) {

	if habitoID == 0 {
		return nil, errors.New("habito_id requerido")
	}

	// 1) Verificar que el hábito exista
	habito, err := s.habitosRepo.ObtenerPorID(habitoID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("el hábito no existe")
		}
		return nil, err
	}

	// 2) Verificar que el hábito sea del usuario
	if habito.UsuarioID != usuarioID {
		return nil, errors.New("no puedes registrar un hábito que no te pertenece")
	}

	// 3) Opcional: no permitir registros de hábitos inactivos
	if !habito.Activo {
		return nil, errors.New("el hábito está inactivo")
	}

	if fecha.IsZero() {
		fecha = time.Now().UTC()
	}

	reg := &models.Registro{
		HabitoID: habitoID,
		Fecha:    fecha,
		Cumplido: cumplido,
		Nota:     nota,
	}

	if err := s.repo.Crear(reg); err != nil {
		return nil, err
	}

	return reg, nil
}

func (s *RegistroService) ListarPorHabito(habitoID uint) ([]models.Registro, error) {
	return s.repo.ListarPorHabito(habitoID)
}
