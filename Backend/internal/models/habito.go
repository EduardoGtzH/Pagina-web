package models

import "time"

type Habito struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	UsuarioID     uint      `gorm:"not null"  json:"usuario_id"`
	Nombre        string    `gorm:"size:100;not null" json:"nombre"`
	Descripcion   string    `json:"descripcion"`
	Activo        bool      `gorm:"default:true" json:"activo"`
	FechaCreacion time.Time `gorm:"autoCreateTime" json:"fecha_creacion"`
}
