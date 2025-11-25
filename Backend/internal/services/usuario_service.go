package services

import (
	"errors"
	"net/mail"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"web-backend/internal/models"
	"web-backend/internal/repositories"
)

type UsuarioService struct {
	repo *repositories.UsuarioRepository
}

func NewUsuarioService(r *repositories.UsuarioRepository) *UsuarioService {
	return &UsuarioService{repo: r}
}

// CrearUsuario: registra un nuevo usuario con validaciones de seguridad
func (s *UsuarioService) CrearUsuario(nombre, email, password string) (*models.Usuario, error) {
	nombre = strings.TrimSpace(nombre)
	email = strings.TrimSpace(email)
	password = strings.TrimSpace(password)

	if nombre == "" {
		return nil, errors.New("el nombre es obligatorio")
	}

	if email == "" {
		return nil, errors.New("el email es obligatorio")
	}

	// Validación básica de formato de email
	if _, err := mail.ParseAddress(email); err != nil {
		return nil, errors.New("email con formato inválido")
	}

	if len(password) < 6 {
		return nil, errors.New("la contraseña debe tener al menos 6 caracteres")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("no se pudo procesar la contraseña")
	}

	u := &models.Usuario{
		Nombre:       nombre,
		Email:        email,
		PasswordHash: string(hash),
	}

	if err := s.repo.Crear(u); err != nil {
		return nil, err
	}

	return u, nil
}

// Login con validaciones mínimas
func (s *UsuarioService) Login(email, password string) (*models.Usuario, error) {
	email = strings.TrimSpace(email)
	password = strings.TrimSpace(password)

	if email == "" || password == "" {
		return nil, errors.New("email y contraseña son obligatorios")
	}

	u, err := s.repo.BuscarPorEmail(email)
	if err != nil {
		// No revelamos si el email existe o no
		return nil, errors.New("credenciales inválidas")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password)); err != nil {
		return nil, errors.New("credenciales inválidas")
	}

	return u, nil
}
