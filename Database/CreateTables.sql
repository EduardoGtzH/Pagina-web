CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE habitos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    ADD CONSTRAINT unique_habito_usuario UNIQUE (usuario_id, nombre);

);

CREATE TABLE registros (
    id SERIAL PRIMARY KEY,
    habito_id INT NOT NULL REFERENCES habitos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    cumplido BOOLEAN DEFAULT FALSE,
    nota TEXT
    ADD CONSTRAINT unique_registro_fecha UNIQUE (habito_id, fecha);
);

