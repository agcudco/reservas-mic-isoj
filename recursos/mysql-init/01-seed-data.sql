-- ============================================================
-- INICIALIZACIÓN DE DATOS — Sistema de Eventos (MySQL)
-- UUIDs en formato estándar con guiones (36 chars)
-- ============================================================

USE eventos_db;

-- ============================================================
-- 1. ESCENARIOS
-- ============================================================
INSERT INTO escenario (id, nombre, descripcion, ubicacion, capacidad) VALUES
('esc-0001-0000-0000-0000-000000000001', 'Estadio Nacional', 'Estadio principal para conciertos y eventos deportivos', 'Av. Javier Prado 123, Lima', 50000),
('esc-0002-0000-0000-0000-000000000002', 'Teatro Municipal', 'Teatro histórico para obras de teatro y recitales íntimos', 'Jr. de la Unión 456, Lima', 1200),
('esc-0003-0000-0000-0000-000000000003', 'Arena Jockey', 'Recinto cubierto para eventos masivos y espectáculos', 'Av. Javier Prado 4200, Lima', 15000);

-- ============================================================
-- 2. EVENTOS (OneToOne con Escenario)
-- ============================================================
INSERT INTO evento (id, nombre, descripcion, fecha, hora, escenarioId) VALUES
('evt-0001-0000-0000-0000-000000000001', 'Concierto de Rock 2026', 'Gran concierto con las mejores bandas de rock latinoamericano', '2026-08-15', '20:00:00', 'esc-0001-0000-0000-0000-000000000001'),
('evt-0002-0000-0000-0000-000000000002', 'Festival de Jazz', 'Noche de jazz internacional con artistas invitados', '2026-09-20', '19:30:00', 'esc-0002-0000-0000-0000-000000000002'),
('evt-0003-0000-0000-0000-000000000003', 'Concierto Pop Masivo', 'Espectáculo pop con pirotecnia y efectos especiales', '2026-10-05', '21:00:00', 'esc-0003-0000-0000-0000-000000000003');

-- ============================================================
-- 3. SECCIONES (ManyToOne con Escenario)
-- ============================================================
-- Estadio Nacional
INSERT INTO seccion (id, nombre, descripcion, tipoSeccion, capacidad, escenarioId) VALUES
('sec-0001-0000-0000-0000-000000000001', 'Tribuna Norte', 'Sector norte con vista panorámica', 'tribuna', 15000, 'esc-0001-0000-0000-0000-000000000001'),
('sec-0002-0000-0000-0000-000000000002', 'Tribuna Sur', 'Sector sur con acceso directo a salidas', 'tribuna', 15000, 'esc-0001-0000-0000-0000-000000000001'),
('sec-0003-0000-0000-0000-000000000003', 'Palco VIP', 'Zona exclusiva con servicio de catering', 'palco', 500, 'esc-0001-0000-0000-0000-000000000001'),
('sec-0004-0000-0000-0000-000000000004', 'General Este', 'Sector general con precios accesibles', 'general', 9500, 'esc-0001-0000-0000-0000-000000000001'),
('sec-0005-0000-0000-0000-000000000005', 'General Oeste', 'Sector general con precios accesibles', 'general', 10000, 'esc-0001-0000-0000-0000-000000000001');

-- Teatro Municipal
INSERT INTO seccion (id, nombre, descripcion, tipoSeccion, capacidad, escenarioId) VALUES
('sec-0006-0000-0000-0000-000000000006', 'Platea Alta', 'Primera fila con vista directa al escenario', 'VIP', 200, 'esc-0002-0000-0000-0000-000000000002'),
('sec-0007-0000-0000-0000-000000000007', 'Platea Baja', 'Sector central del teatro', 'general', 500, 'esc-0002-0000-0000-0000-000000000002'),
('sec-0008-0000-0000-0000-000000000008', 'Galería', 'Sector superior del teatro', 'general', 500, 'esc-0002-0000-0000-0000-000000000002');

-- Arena Jockey
INSERT INTO seccion (id, nombre, descripcion, tipoSeccion, capacidad, escenarioId) VALUES
('sec-0009-0000-0000-0000-000000000009', 'Pista General', 'Área de pie frente al escenario', 'general', 8000, 'esc-0003-0000-0000-0000-000000000003'),
('sec-0010-0000-0000-0000-000000000010', 'Gradas VIP', 'Gradas elevadas con barra privada', 'VIP', 3000, 'esc-0003-0000-0000-0000-000000000003'),
('sec-0011-0000-0000-0000-000000000011', 'Palco Premium', 'Palcos privados con servicio exclusivo', 'palco', 4000, 'esc-0003-0000-0000-0000-000000000003');

-- ============================================================
-- 4. FILAS (ManyToOne con Seccion)
-- ============================================================
-- Tribuna Norte (Estadio)
INSERT INTO fila (id, nombre, capacidad, seccionId) VALUES
('fil-0001-0000-0000-0000-000000000001', 'Fila A', 50, 'sec-0001-0000-0000-0000-000000000001'),
('fil-0002-0000-0000-0000-000000000002', 'Fila B', 50, 'sec-0001-0000-0000-0000-000000000001'),
('fil-0003-0000-0000-0000-000000000003', 'Fila C', 50, 'sec-0001-0000-0000-0000-000000000001'),
('fil-0004-0000-0000-0000-000000000004', 'Fila D', 50, 'sec-0001-0000-0000-0000-000000000001');

-- Palco VIP (Estadio)
INSERT INTO fila (id, nombre, capacidad, seccionId) VALUES
('fil-0005-0000-0000-0000-000000000005', 'Fila VIP-1', 25, 'sec-0003-0000-0000-0000-000000000003'),
('fil-0006-0000-0000-0000-000000000006', 'Fila VIP-2', 25, 'sec-0003-0000-0000-0000-000000000003');

-- Platea Alta (Teatro)
INSERT INTO fila (id, nombre, capacidad, seccionId) VALUES
('fil-0007-0000-0000-0000-000000000007', 'Fila 1', 20, 'sec-0006-0000-0000-0000-000000000006'),
('fil-0008-0000-0000-0000-000000000008', 'Fila 2', 20, 'sec-0006-0000-0000-0000-000000000006'),
('fil-0009-0000-0000-0000-000000000009', 'Fila 3', 20, 'sec-0006-0000-0000-0000-000000000006');

-- Pista General (Arena)
INSERT INTO fila (id, nombre, capacidad, seccionId) VALUES
('fil-0010-0000-0000-0000-000000000010', 'Zona Frontal', 100, 'sec-0009-0000-0000-0000-000000000009'),
('fil-0011-0000-0000-0000-000000000011', 'Zona Central', 100, 'sec-0009-0000-0000-0000-000000000009');

-- ============================================================
-- 5. ASIENTOS (ManyToOne con Fila)
-- ============================================================
-- Fila A - Tribuna Norte (5 asientos de muestra)
INSERT INTO asiento (id, numero, estado, tipo, filaId) VALUES
('asi-0001-0000-0000-0000-000000000001', 'A-01', 'disponible', 'normal', 'fil-0001-0000-0000-0000-000000000001'),
('asi-0002-0000-0000-0000-000000000002', 'A-02', 'disponible', 'normal', 'fil-0001-0000-0000-0000-000000000001'),
('asi-0003-0000-0000-0000-000000000003', 'A-03', 'ocupado', 'normal', 'fil-0001-0000-0000-0000-000000000001'),
('asi-0004-0000-0000-0000-000000000004', 'A-04', 'disponible', 'preferencial', 'fil-0001-0000-0000-0000-000000000001'),
('asi-0005-0000-0000-0000-000000000005', 'A-05', 'mantenimiento', 'normal', 'fil-0001-0000-0000-0000-000000000001');

-- Fila VIP-1 - Palco VIP (5 asientos)
INSERT INTO asiento (id, numero, estado, tipo, filaId) VALUES
('asi-0006-0000-0000-0000-000000000006', 'VIP-1-01', 'disponible', 'vip', 'fil-0005-0000-0000-0000-000000000005'),
('asi-0007-0000-0000-0000-000000000007', 'VIP-1-02', 'disponible', 'vip', 'fil-0005-0000-0000-0000-000000000005'),
('asi-0008-0000-0000-0000-000000000008', 'VIP-1-03', 'ocupado', 'vip', 'fil-0005-0000-0000-0000-000000000005'),
('asi-0009-0000-0000-0000-000000000009', 'VIP-1-04', 'disponible', 'vip', 'fil-0005-0000-0000-0000-000000000005'),
('asi-0010-0000-0000-0000-000000000010', 'VIP-1-05', 'disponible', 'vip', 'fil-0005-0000-0000-0000-000000000005');

-- Fila 1 - Platea Alta (5 asientos)
INSERT INTO asiento (id, numero, estado, tipo, filaId) VALUES
('asi-0011-0000-0000-0000-000000000011', '1-01', 'disponible', 'preferencial', 'fil-0007-0000-0000-0000-000000000007'),
('asi-0012-0000-0000-0000-000000000012', '1-02', 'disponible', 'preferencial', 'fil-0007-0000-0000-0000-000000000007'),
('asi-0013-0000-0000-0000-000000000013', '1-03', 'ocupado', 'preferencial', 'fil-0007-0000-0000-0000-000000000007'),
('asi-0014-0000-0000-0000-000000000014', '1-04', 'disponible', 'normal', 'fil-0007-0000-0000-0000-000000000007'),
('asi-0015-0000-0000-0000-000000000015', '1-05', 'disponible', 'normal', 'fil-0007-0000-0000-0000-000000000007');

-- Zona Frontal - Pista General (5 asientos)
INSERT INTO asiento (id, numero, estado, tipo, filaId) VALUES
('asi-0016-0000-0000-0000-000000000016', 'F-001', 'disponible', 'normal', 'fil-0010-0000-0000-0000-000000000010'),
('asi-0017-0000-0000-0000-000000000017', 'F-002', 'disponible', 'normal', 'fil-0010-0000-0000-0000-000000000010'),
('asi-0018-0000-0000-0000-000000000018', 'F-003', 'ocupado', 'normal', 'fil-0010-0000-0000-0000-000000000010'),
('asi-0019-0000-0000-0000-000000000019', 'F-004', 'disponible', 'normal', 'fil-0010-0000-0000-0000-000000000010'),
('asi-0020-0000-0000-0000-000000000020', 'F-005', 'mantenimiento', 'normal', 'fil-0010-0000-0000-0000-000000000010');