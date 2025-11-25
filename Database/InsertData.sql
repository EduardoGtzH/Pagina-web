INSERT INTO usuarios (nombre, email, contrasena)
VALUES ('Eduardo', 'edu@example.com', 'hashedpass');

INSERT INTO habitos (usuario_id, nombre, descripcion)
VALUES (1, 'Leer 30 minutos', 'Lectura diaria para mejorar hábitos');

INSERT INTO registros (habito_id, fecha, cumplido, nota)
VALUES (1, CURRENT_DATE, TRUE, 'Lo completé por la mañana');
