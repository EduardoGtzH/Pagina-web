package models

import "time"

type Usuario struct {
	ID            uint      `gorm:"primaryKey"`
	Nombre        string    `gorm:"size:100;not null"`
	Email         string    `gorm:"size:255;uniqueIndex;not null"`
	PasswordHash  string    `gorm:"not null"`
	FechaCreacion time.Time `gorm:"autoCreateTime"`
}
