package repositories

import (
	"web-backend/internal/db"
	"web-backend/internal/models"
)

type HabitoRepository struct{}

func NewHabitoRepository() *HabitoRepository {
	return &HabitoRepository{}
}

func (r *HabitoRepository) Crear(h *models.Habito) error {
	return db.DB.Create(h).Error
}

func (r *HabitoRepository) ListarPorUsuario(usuarioID uint) ([]models.Habito, error) {
	var habitos []models.Habito
	err := db.DB.Where("usuario_id = ?", usuarioID).Find(&habitos).Error
	return habitos, err
}

// 🔴 Ahora eliminamos de verdad
func (r *HabitoRepository) Eliminar(id uint) error {
	return db.DB.Delete(&models.Habito{}, id).Error
}

// Buscar un hábito que pertenezca a un usuario
func (r *HabitoRepository) BuscarPorIDyUsuario(id, usuarioID uint) (*models.Habito, error) {
	var h models.Habito
	if err := db.DB.Where("id = ? AND usuario_id = ?", id, usuarioID).First(&h).Error; err != nil {
		return nil, err
	}
	return &h, nil
}

// Actualizar nombre / descripción
func (r *HabitoRepository) Actualizar(h *models.Habito) error {
	return db.DB.Model(&models.Habito{}).
		Where("id = ? AND usuario_id = ?", h.ID, h.UsuarioID).
		Updates(map[string]interface{}{
			"nombre":      h.Nombre,
			"descripcion": h.Descripcion,
		}).Error
}

func (r *HabitoRepository) ObtenerPorID(id uint) (*models.Habito, error) {
	var h models.Habito
	if err := db.DB.First(&h, id).Error; err != nil {
		return nil, err
	}
	return &h, nil
}
