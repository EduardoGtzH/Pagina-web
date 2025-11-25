package services

import (
	"time"
)

func ParseFecha(fecha string) time.Time {
	layout := "2006-01-02" // formato YYYY-MM-DD
	t, _ := time.Parse(layout, fecha)
	return t
}
