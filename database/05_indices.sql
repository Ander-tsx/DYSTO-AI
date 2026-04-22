-- =========================================================
-- DB-05 | Índices para optimización de consultas en DystoAI
-- =========================================================
-- Archivo: database/05_indices.sql
-- Descripción: Creación de índices únicos y sencillos sobre
--              columnas de uso frecuente en consultas críticas.
--
-- NOTA: No se indexan llaves primarias (PK) ni foráneas (FK)
--       porque MySQL/InnoDB ya genera índices automáticamente
--       sobre estas columnas.
-- =========================================================

USE dystoai;

-- ---------------------------------------------------------
-- ÍNDICE 1: email en users_customuser
-- ---------------------------------------------------------
-- Justificación:
--   La columna 'email' es el campo utilizado como
--   USERNAME_FIELD en el modelo CustomUser de Django.
--   Cada vez que un usuario inicia sesión, el sistema
--   ejecuta una consulta WHERE email = '...' para
--   validar sus credenciales. Aunque Django ya define
--   email como UNIQUE (lo cual crea un índice implícito),
--   este CREATE INDEX se incluye como evidencia explícita
--   del criterio de indexación. Si el índice ya existe
--   por la restricción UNIQUE, MySQL lo ignorará.
-- ---------------------------------------------------------

CREATE INDEX idx_users_email
ON users_customuser (email);

-- ---------------------------------------------------------
-- ÍNDICE 2: category en products_product
-- ---------------------------------------------------------
-- Justificación:
--   El catálogo público del marketplace permite filtrar
--   productos por categoría. La vista ProductPublicListView
--   ejecuta consultas con WHERE category = '...' cada vez
--   que un usuario filtra el catálogo. Indexar esta columna
--   acelera significativamente la búsqueda en tablas con
--   alto volumen de productos.
-- ---------------------------------------------------------

CREATE INDEX idx_products_category
ON products_product (category);

-- ---------------------------------------------------------
-- ÍNDICE 3: title en products_product
-- ---------------------------------------------------------
-- Justificación:
--   La barra de búsqueda global del marketplace ejecuta
--   consultas con WHERE title LIKE '%texto%' o mediante
--   Q objects de Django que incluyen el título. Un índice
--   sobre esta columna optimiza las búsquedas textuales
--   parciales cuando el patrón inicia sin comodín y
--   mejora el rendimiento general de los ordenamientos
--   alfabéticos en listados de productos.
-- ---------------------------------------------------------

CREATE INDEX idx_products_title
ON products_product (title);

-- ---------------------------------------------------------
-- ÍNDICE 4: order_number en orders_order
-- ---------------------------------------------------------
-- Justificación:
--   La columna order_number se utiliza como identificador
--   público de los pedidos. El endpoint OrderDetailView
--   realiza consultas WHERE order_number = '...' para
--   mostrar el comprobante de compra. Aunque el modelo
--   define unique=True (lo cual genera un índice), se
--   documenta explícitamente como parte de la estrategia
--   de indexación.
-- ---------------------------------------------------------

CREATE INDEX idx_orders_order_number
ON orders_order (order_number);

-- ---------------------------------------------------------
-- ÍNDICE 5: entity + action en logbook_auditlog
-- ---------------------------------------------------------
-- Justificación:
--   La tabla de auditoría crece constantemente con cada
--   operación CRUD del sistema. Las consultas de revisión
--   filtran frecuentemente por entidad (entity) y tipo de
--   acción (action), por ejemplo: "mostrar todas las
--   eliminaciones de productos". Un índice compuesto sobre
--   ambas columnas optimiza estas consultas de monitoreo
--   y reportes de seguridad.
-- ---------------------------------------------------------

CREATE INDEX idx_auditlog_entity_action
ON logbook_auditlog (entity, action);

-- ---------------------------------------------------------
-- ÍNDICE 6: timestamp en logbook_auditlog
-- ---------------------------------------------------------
-- Justificación:
--   Los registros de auditoría se consultan frecuentemente
--   ordenados por fecha (ORDER BY timestamp DESC) y también
--   se filtran por rangos de tiempo para generar reportes
--   de actividad. El evento ev_purge_old_audit_logs también
--   ejecuta DELETE WHERE timestamp < '...' de forma diaria.
--   Indexar esta columna acelera ambas operaciones.
-- ---------------------------------------------------------

CREATE INDEX idx_auditlog_timestamp
ON logbook_auditlog (timestamp);

-- ---------------------------------------------------------
-- ÍNDICE 7: stock en products_product
-- ---------------------------------------------------------
-- Justificación:
--   El catálogo público solo muestra productos con stock > 0
--   (propiedad is_active se basa en stock). La vista
--   ProductPublicListView filtra constantemente por esta
--   condición. Un índice en stock permite a MySQL descartar
--   rápidamente los productos sin disponibilidad sin
--   realizar un full table scan.
-- ---------------------------------------------------------

CREATE INDEX idx_products_stock
ON products_product (stock);
