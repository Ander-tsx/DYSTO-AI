-- =============================================================================
-- DYSTO-AI | DB-04 | Vistas de Base de Datos
-- Archivo: database/04_vistas.sql
-- Descripción: Definición de vistas SQL que reemplazan consultas del backend.
-- Motor: MySQL
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Vista 1: vw_product_public_list
-- Reemplaza la consulta del endpoint ProductPublicListView.
-- Devuelve los productos con stock disponible (stock > 0) junto con
-- el correo del vendedor, ordenados por fecha de creación descendente.
-- ---------------------------------------------------------------------------

DROP VIEW IF EXISTS vw_product_public_list;

CREATE VIEW vw_product_public_list AS
SELECT
    p.id,
    p.title,
    p.price,
    p.stock,
    p.category,
    u.email          AS seller_email,
    p.main_image,
    p.units_sold,
    CASE
        WHEN p.stock > 0 THEN TRUE
        ELSE FALSE
    END               AS is_active,
    p.is_active_admin,
    p.created_at
FROM products_product   AS p
INNER JOIN users_customuser AS u
    ON p.seller_id = u.id
WHERE p.stock > 0
ORDER BY p.created_at DESC;


-- ---------------------------------------------------------------------------
-- Vista 2: vw_order_list
-- Reemplaza la consulta del endpoint OrderListView.
-- Devuelve los pedidos del sistema junto con la información del comprador
-- (email), el total formateado, la cantidad total de artículos por orden,
-- y el estado del pedido.
-- ---------------------------------------------------------------------------

DROP VIEW IF EXISTS vw_order_list;

CREATE VIEW vw_order_list AS
SELECT
    o.id,
    o.order_number,
    o.user_id,
    u.email              AS user_email,
    o.address_snapshot,
    o.total,
    o.status,
    o.created_at,
    COALESCE(items.total_items, 0)   AS total_items,
    COALESCE(items.total_quantity, 0) AS total_quantity
FROM orders_order AS o
INNER JOIN users_customuser AS u
    ON o.user_id = u.id
LEFT JOIN (
    SELECT
        oi.order_id,
        COUNT(oi.id)       AS total_items,
        SUM(oi.quantity)   AS total_quantity
    FROM orders_orderitem AS oi
    GROUP BY oi.order_id
) AS items
    ON o.id = items.order_id
ORDER BY o.created_at DESC;
