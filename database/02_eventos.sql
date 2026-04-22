-- DB-02 | Eventos programados de mantenimiento para DystoAI
-- Requiere que el scheduler de eventos de MySQL/MariaDB esté habilitado.
-- Si tienes permisos de administrador, ejecuta:
-- SET GLOBAL event_scheduler = ON;

USE dysto_ai;

DROP EVENT IF EXISTS ev_clean_empty_abandoned_carts;
DROP EVENT IF EXISTS ev_purge_old_audit_logs;

DELIMITER $$

CREATE EVENT ev_clean_empty_abandoned_carts
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP + INTERVAL 1 DAY
DO
BEGIN
    DELETE FROM carts_cart
    WHERE updated_at < (NOW() - INTERVAL 30 DAY)
      AND NOT EXISTS (
          SELECT 1
          FROM carts_cartitem
          WHERE carts_cartitem.cart_id = carts_cart.id
      );
END$$

CREATE EVENT ev_purge_old_audit_logs
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP + INTERVAL 1 DAY
DO
BEGIN
    DELETE FROM logbook_auditlog
    WHERE timestamp < (NOW() - INTERVAL 180 DAY);
END$$

DELIMITER ;