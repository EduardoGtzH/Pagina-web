package models

import "time"

type Registro struct {
	ID       uint      `gorm:"primaryKey"`
	HabitoID uint      `gorm:"not null"`
	Fecha    time.Time `gorm:"not null"`
	Cumplido bool      `gorm:"default:false"`
	Nota     string
}
