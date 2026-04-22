drop trigger if exists trg_product_insert;
drop trigger if exists trg_product_update;
drop trigger if exists trg_product_delete;
drop trigger if exists trg_order_insert;
drop trigger if exists trg_order_update;
drop trigger if exists trg_order_delete;
drop trigger if exists trg_orderitem_insert;
drop trigger if exists trg_orderitem_update;
drop trigger if exists trg_orderitem_delete;
drop trigger if exists trg_customuser_insert;
drop trigger if exists trg_address_insert;
drop trigger if exists trg_address_update;
drop trigger if exists trg_address_delete;
drop trigger if exists trg_cart_insert;
drop trigger if exists trg_cart_update;
drop trigger if exists trg_cart_delete;
drop trigger if exists trg_cartitem_insert;
drop trigger if exists trg_cartitem_update;
drop trigger if exists trg_cartitem_delete;

-- Triggers para Product

DELIMITER $$

CREATE TRIGGER trg_product_insert
AFTER INSERT ON products_product
FOR EACH ROW
BEGIN
    INSERT INTO logbook_auditlog (
        entity,
        entity_id,
        action,
        changes,
        timestamp,
        source_ip,
        user_id
    )
    VALUES (
        'Product',
        NEW.id,
        'CREATE',
        JSON_OBJECT(
            'after', JSON_OBJECT(
                'id', NEW.id,
                'seller_id', NEW.seller_id,
                'category', NEW.category,
                'title', NEW.title,
                'description', NEW.description,
                'price', NEW.price,
                'stock', NEW.stock,
                'main_image', NEW.main_image,
                'additional_images', NEW.additional_images,
                'metadata', NEW.metadata,
                'edit_allowed', NEW.edit_allowed,
                'tags', NEW.tags,
                'units_sold', NEW.units_sold
            )
        ),
        NOW(),
        NULL,
        NULL
    );
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER trg_product_update
AFTER UPDATE ON products_product
FOR EACH ROW
BEGIN
    DECLARE changes JSON DEFAULT JSON_OBJECT();

    IF OLD.title <> NEW.title THEN
        SET changes = JSON_SET(changes, '$.title', JSON_OBJECT('before', OLD.title, 'after', NEW.title));
    END IF;

    IF OLD.price <> NEW.price THEN
        SET changes = JSON_SET(changes, '$.price', JSON_OBJECT('before', OLD.price, 'after', NEW.price));
    END IF;

    IF OLD.stock <> NEW.stock THEN
        SET changes = JSON_SET(changes, '$.stock', JSON_OBJECT('before', OLD.stock, 'after', NEW.stock));
    END IF;

    IF OLD.category <> NEW.category THEN
        SET changes = JSON_SET(changes, '$.category', JSON_OBJECT('before', OLD.category, 'after', NEW.category));
    END IF;

    IF OLD.description <> NEW.description THEN
        SET changes = JSON_SET(changes, '$.description', JSON_OBJECT('before', OLD.description, 'after', NEW.description));
    END IF;

    IF OLD.units_sold <> NEW.units_sold THEN
        SET changes = JSON_SET(changes, '$.units_sold', JSON_OBJECT('before', OLD.units_sold, 'after', NEW.units_sold));
    END IF;

    IF OLD.edit_allowed <> NEW.edit_allowed THEN
        SET changes = JSON_SET(changes, '$.edit_allowed', JSON_OBJECT('before', OLD.edit_allowed, 'after', NEW.edit_allowed));
    END IF;

    IF JSON_LENGTH(changes) > 0 THEN
        INSERT INTO logbook_auditlog (
            entity,
            entity_id,
            action,
            changes,
            timestamp,
            source_ip,
            user_id
        )
        VALUES (
            'Product',
            NEW.id,
            'UPDATE',
            changes,
            NOW(),
            NULL,
            NULL
        );
    END IF;

END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_product_delete
AFTER DELETE ON products_product
FOR EACH ROW
BEGIN
    INSERT INTO logbook_auditlog (
        entity,
        entity_id,
        action,
        changes,
        timestamp,
        source_ip,
        user_id
    )
    VALUES (
        'Product',
        OLD.id,
        'DELETE',
        JSON_OBJECT(
            'before', JSON_OBJECT(
                'id', OLD.id,
                'seller_id', OLD.seller_id,
                'category', OLD.category,
                'title', OLD.title,
                'description', OLD.description,
                'price', OLD.price,
                'stock', OLD.stock,
                'main_image', OLD.main_image,
                'additional_images', OLD.additional_images,
                'metadata', OLD.metadata,
                'edit_allowed', OLD.edit_allowed,
                'tags', OLD.tags,
                'units_sold', OLD.units_sold
            )
        ),
        NOW(),
        NULL,
        NULL
    );
END$$

DELIMITER ;

-- Triggers para Cart

DELIMITER $$

CREATE TRIGGER trg_cart_insert
AFTER INSERT ON carts_cart
FOR EACH ROW
BEGIN
    INSERT INTO logbook_auditlog (
        entity,
        entity_id,
        action,
        changes,
        timestamp,
        source_ip,
        user_id
    )
    VALUES (
        'Cart',
        NEW.id,
        'CREATE',
        JSON_OBJECT(
            'after', JSON_OBJECT(
                'id', NEW.id,
                'user_id', NEW.user_id
            )
        ),
        NOW(),
        NULL,
        NULL
    );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_cart_update
AFTER UPDATE ON carts_cart
FOR EACH ROW
BEGIN
    DECLARE changes JSON DEFAULT JSON_OBJECT();

    IF OLD.user_id <=> NEW.user_id THEN
        SET changes = JSON_SET(changes, '$.user_id', JSON_OBJECT('before', OLD.user_id, 'after', NEW.user_id));
    END IF;

    IF JSON_LENGTH(changes) > 0 THEN
        INSERT INTO logbook_auditlog (
            entity,
            entity_id,
            action,
            changes,
            timestamp,
            source_ip,
            user_id
        )
        VALUES (
            'Cart',
            NEW.id,
            'UPDATE',
            changes,
            NOW(),
            NULL,
            NULL
        );
    END IF;

END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_cart_delete
AFTER DELETE ON carts_cart
FOR EACH ROW
BEGIN
    INSERT INTO logbook_auditlog (
        entity,
        entity_id,
        action,
        changes,
        timestamp,
        source_ip,
        user_id
    )
    VALUES (
        'Cart',
        OLD.id,
        'DELETE',
        JSON_OBJECT(
            'before', JSON_OBJECT(
                'id', OLD.id,
                'user_id', OLD.user_id
            )
        ),
        NOW(),
        NULL,
        NULL
    );
END$$

DELIMITER ;

-- Triggers para CartItem

DELIMITER $$

CREATE TRIGGER trg_cartitem_insert
AFTER INSERT ON carts_cartitem
FOR EACH ROW
BEGIN
    INSERT INTO logbook_auditlog (
        entity,
        entity_id,
        action,
        changes,
        timestamp,
        source_ip,
        user_id
    )
    VALUES (
        'CartItem',
        NEW.id,
        'CREATE',
        JSON_OBJECT(
            'after', JSON_OBJECT(
                'id', NEW.id,
                'cart_id', NEW.cart_id,
                'product_id', NEW.product_id,
                'quantity', NEW.quantity
            )
        ),
        NOW(),
        NULL,
        NULL
    );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_cartitem_update
AFTER UPDATE ON carts_cartitem
FOR EACH ROW
BEGIN
    DECLARE changes JSON DEFAULT JSON_OBJECT();

    IF OLD.quantity <> NEW.quantity THEN
        SET changes = JSON_SET(changes, '$.quantity', JSON_OBJECT('before', OLD.quantity, 'after', NEW.quantity));
    END IF;

    IF JSON_LENGTH(changes) > 0 THEN
        INSERT INTO logbook_auditlog (
            entity,
            entity_id,
            action,
            changes,
            timestamp,
            source_ip,
            user_id
        )
        VALUES (
            'CartItem',
            NEW.id,
            'UPDATE',
            changes,
            NOW(),
            NULL,
            NULL
        );
    END IF;

END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_cartitem_delete
AFTER DELETE ON carts_cartitem
FOR EACH ROW
BEGIN
    INSERT INTO logbook_auditlog (
        entity,
        entity_id,
        action,
        changes,
        timestamp,
        source_ip,
        user_id
    )
    VALUES (
        'CartItem',
        OLD.id,
        'DELETE',
        JSON_OBJECT(
            'before', JSON_OBJECT(
                'id', OLD.id,
                'cart_id', OLD.cart_id,
                'product_id', OLD.product_id,
                'quantity', OLD.quantity
            )
        ),
        NOW(),
        NULL,
        NULL
    );
END$$

DELIMITER ;

-- Triggers para Order

DELIMITER $$

CREATE TRIGGER trg_order_insert
AFTER INSERT ON orders_order
FOR EACH ROW
BEGIN
    INSERT INTO logbook_auditlog (
        entity,
        entity_id,
        action,
        changes,
        timestamp,
        source_ip,
        user_id
    )
    VALUES (
        'Order',
        NEW.id,
        'CREATE',
        JSON_OBJECT(
            'after', JSON_OBJECT(
                'id', NEW.id,
                'total', NEW.total,
                'status', NEW.status,
                'order_number', NEW.order_number,
                'address_snapshot', NEW.address_snapshot,
                'user_id', NEW.user_id
            )
        ),
        NOW(),
        NULL,
        NULL
    );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_order_update
AFTER UPDATE ON orders_order
FOR EACH ROW
BEGIN
    DECLARE changes JSON DEFAULT JSON_OBJECT();

    -- Cambios en el usuario
    IF OLD.user_id <> NEW.user_id THEN
        SET changes = JSON_SET(changes, '$.user_id', JSON_OBJECT('before', OLD.user_id, 'after', NEW.user_id));
    END IF;

    -- Cambios en el total
    IF OLD.total <> NEW.total THEN
        SET changes = JSON_SET(changes, '$.total', JSON_OBJECT('before', OLD.total, 'after', NEW.total));
    END IF;

    -- Cambios en el estado
    IF OLD.status <> NEW.status THEN
        SET changes = JSON_SET(changes, '$.status', JSON_OBJECT('before', OLD.status, 'after', NEW.status));
    END IF;

    -- Cambios en el número de orden
    IF OLD.order_number <> NEW.order_number THEN
        SET changes = JSON_SET(changes, '$.order_number', JSON_OBJECT('before', OLD.order_number, 'after', NEW.order_number));
    END IF;

    -- Cambios en la dirección (comparar como strings JSON)
    IF JSON_EXTRACT(OLD.address_snapshot, '$') <> JSON_EXTRACT(NEW.address_snapshot, '$') THEN
        SET changes = JSON_SET(changes, '$.address_snapshot', JSON_OBJECT('before', OLD.address_snapshot, 'after', NEW.address_snapshot));
    END IF;

    -- Solo insertar si hubo cambios
    IF JSON_LENGTH(changes) > 0 THEN
        INSERT INTO logbook_auditlog (
            entity,
            entity_id,
            action,
            changes,
            timestamp,
            source_ip,
            user_id
        )
        VALUES (
            'Order',
            NEW.id,
            'UPDATE',
            changes,
            NOW(),
            NULL,
            NULL
        );
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_order_delete
AFTER DELETE ON orders_order
FOR EACH ROW
BEGIN
    INSERT INTO logbook_auditlog (
        entity,
        entity_id,
        action,
        changes,
        timestamp,
        source_ip,
        user_id
    )
    VALUES (
        'Order',
        OLD.id,
        'DELETE',
        JSON_OBJECT(
            'before', JSON_OBJECT(
                'id', OLD.id,
                'user_id', OLD.user_id,
                'total', OLD.total,
                'status', OLD.status,
                'order_number', OLD.order_number,
                'address_snapshot', OLD.address_snapshot
            )
        ),
        NOW(),
        NULL,
        NULL
    );
END$$

DELIMITER ;

-- Triggers para OrderItem

DELIMITER $$

CREATE TRIGGER trg_orderitem_insert
AFTER INSERT ON orders_orderitem
FOR EACH ROW
BEGIN
    INSERT INTO logbook_auditlog (
        entity,
        entity_id,
        action,
        changes,
        timestamp,
        source_ip,
        user_id
    )
    VALUES (
        'OrderItem',
        NEW.id,
        'CREATE',
        JSON_OBJECT(
            'after', JSON_OBJECT(
                'id', NEW.id,
                'order_id', NEW.order_id,
                'product_id', NEW.product_id,
                'quantity', NEW.quantity,
                'unit_price', NEW.unit_price
            )
        ),
        NOW(),
        NULL,
        NULL
    );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_orderitem_update
AFTER UPDATE ON orders_orderitem
FOR EACH ROW
BEGIN
    DECLARE changes JSON DEFAULT JSON_OBJECT();

    IF OLD.quantity <> NEW.quantity THEN
        SET changes = JSON_SET(changes, '$.quantity', JSON_OBJECT('before', OLD.quantity, 'after', NEW.quantity));
    END IF;

    IF OLD.unit_price <> NEW.unit_price THEN
        SET changes = JSON_SET(changes, '$.unit_price', JSON_OBJECT('before', OLD.unit_price, 'after', NEW.unit_price));
    END IF;

    IF JSON_LENGTH(changes) > 0 THEN
        INSERT INTO logbook_auditlog (
            entity,
            entity_id,
            action,
            changes,
            timestamp,
            source_ip,
            user_id
        )
        VALUES (
            'OrderItem',
            NEW.id,
            'UPDATE',
            changes,
            NOW(),
            NULL,
            NULL
        );
    END IF;

END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_orderitem_delete
AFTER DELETE ON orders_orderitem
FOR EACH ROW
BEGIN
    INSERT INTO logbook_auditlog (
        entity,
        entity_id,
        action,
        changes,
        timestamp,
        source_ip,
        user_id
    )
    VALUES (
        'OrderItem',
        OLD.id,
        'DELETE',
        JSON_OBJECT(
            'before', JSON_OBJECT(
                'id', OLD.id,
                'order_id', OLD.order_id,
                'product_id', OLD.product_id,
                'quantity', OLD.quantity,
                'unit_price', OLD.unit_price
            )
        ),
        NOW(),
        NULL,
        NULL
    );
END$$

DELIMITER ;

-- Triggers para CustomUser

DELIMITER $$

CREATE TRIGGER trg_customuser_insert
AFTER INSERT ON users_customuser
FOR EACH ROW
BEGIN
    INSERT INTO logbook_auditlog (
        entity,
        entity_id,
        action,
        changes,
        timestamp,
        source_ip,
        user_id
    )
    VALUES (
        'CustomUser',
        NEW.id,
        'CREATE',
        JSON_OBJECT(
            'after', JSON_OBJECT(
                'id', NEW.id,
                'email', NEW.email,
                'first_name', NEW.first_name,
                'last_name', NEW.last_name,
                'is_active', NEW.is_active,
                'is_staff', NEW.is_staff,
                'is_superuser', NEW.is_superuser,
                'role', NEW.role,
                'phone', NEW.phone
            )
        ),
        NOW(),
        NULL,
        NULL
    );
END$$

DELIMITER ;

-- Triggers para Address

DELIMITER $$

CREATE TRIGGER trg_address_insert
AFTER INSERT ON users_address
FOR EACH ROW
BEGIN
    INSERT INTO logbook_auditlog (
        entity,
        entity_id,
        action,
        changes,
        timestamp,
        source_ip,
        user_id
    )
    VALUES (
        'Address',
        NEW.id,
        'CREATE',
        JSON_OBJECT(
            'after', JSON_OBJECT(
                'id', NEW.id,
                'user_id', NEW.user_id,
                'street', NEW.street,
                'street_number', NEW.street_number,
                'city', NEW.city,
                'state', NEW.state,
                'postal_code', NEW.postal_code,
                'is_default', NEW.is_default
            )
        ),
        NOW(),
        NULL,
        NULL
    );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_address_update
AFTER UPDATE ON users_address
FOR EACH ROW
BEGIN
    DECLARE changes JSON DEFAULT JSON_OBJECT();

    IF OLD.user_id <> NEW.user_id THEN
        SET changes = JSON_SET(changes, '$.user_id', JSON_OBJECT('before', OLD.user_id, 'after', NEW.user_id));
    END IF;

    IF OLD.street <> NEW.street THEN
        SET changes = JSON_SET(changes, '$.street', JSON_OBJECT('before', OLD.street, 'after', NEW.street));
    END IF;

    IF OLD.street_number <> NEW.street_number THEN
        SET changes = JSON_SET(changes, '$.street_number', JSON_OBJECT('before', OLD.street_number, 'after', NEW.street_number));
    END IF;

    IF OLD.city <> NEW.city THEN
        SET changes = JSON_SET(changes, '$.city', JSON_OBJECT('before', OLD.city, 'after', NEW.city));
    END IF;

    IF OLD.state <> NEW.state THEN
        SET changes = JSON_SET(changes, '$.state', JSON_OBJECT('before', OLD.state, 'after', NEW.state));
    END IF;

    IF OLD.postal_code <> NEW.postal_code THEN
        SET changes = JSON_SET(changes, '$.postal_code', JSON_OBJECT('before', OLD.postal_code, 'after', NEW.postal_code));
    END IF;

    IF OLD.is_default <> NEW.is_default THEN
        SET changes = JSON_SET(changes, '$.is_default', JSON_OBJECT('before', OLD.is_default, 'after', NEW.is_default));
    END IF;

    IF JSON_LENGTH(changes) > 0 THEN
        INSERT INTO logbook_auditlog (
            entity,
            entity_id,
            action,
            changes,
            timestamp,
            source_ip,
            user_id
        )
        VALUES (
            'Address',
            NEW.id,
            'UPDATE',
            changes,
            NOW(),
            NULL,
            NULL
        );
    END IF;

END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_address_delete
AFTER DELETE ON users_address
FOR EACH ROW
BEGIN
    INSERT INTO logbook_auditlog (
        entity,
        entity_id,
        action,
        changes,
        timestamp,
        source_ip,
        user_id
    )
    VALUES (
        'Address',
        OLD.id,
        'DELETE',
        JSON_OBJECT(
            'before', JSON_OBJECT(
                'id', OLD.id,
                'user_id', OLD.user_id,
                'street', OLD.street,
                'street_number', OLD.street_number,
                'city', OLD.city,
                'state', OLD.state,
                'postal_code', OLD.postal_code,
                'is_default', OLD.is_default
            )
        ),
        NOW(),
        NULL,
        NULL
    );
END$$

DELIMITER ;