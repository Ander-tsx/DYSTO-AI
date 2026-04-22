-- DB-01 | Poblacion de datos inicial para pruebas de desarrollo

USE dysto_ai;

START TRANSACTION;


DELETE FROM orders_orderitem
WHERE order_id IN (
    SELECT id FROM orders_order
    WHERE JSON_UNQUOTE(JSON_EXTRACT(address_snapshot, '$.seed_tag')) = 'DB-01'
);

DELETE FROM orders_order
WHERE JSON_UNQUOTE(JSON_EXTRACT(address_snapshot, '$.seed_tag')) = 'DB-01';

DELETE FROM carts_cartitem
WHERE cart_id IN (
    SELECT id FROM carts_cart
    WHERE user_id IN (
        SELECT id FROM users_customuser
        WHERE email = 'admin@dysto.ai' OR email LIKE 'vendor%@dysto.ai'
    )
);

DELETE FROM carts_cart
WHERE user_id IN (
    SELECT id FROM users_customuser
    WHERE email = 'admin@dysto.ai' OR email LIKE 'vendor%@dysto.ai'
);

DELETE FROM orders_orderitem
WHERE product_id IN (
    SELECT id FROM products_product
    WHERE seller_id IN (
        SELECT id FROM users_customuser
        WHERE email LIKE 'vendor%@dysto.ai'
    )
);

DELETE FROM products_product
WHERE seller_id IN (
    SELECT id FROM users_customuser
    WHERE email LIKE 'vendor%@dysto.ai'
);

DELETE FROM users_address
WHERE user_id IN (
    SELECT id FROM users_customuser
    WHERE email = 'admin@dysto.ai' OR email LIKE 'vendor%@dysto.ai' OR email LIKE 'cliente%@dysto.ai'
);

DELETE FROM logbook_auditlog
WHERE user_id IN (
    SELECT id FROM users_customuser
    WHERE email = 'admin@dysto.ai' OR email LIKE 'vendor%@dysto.ai' OR email LIKE 'cliente%@dysto.ai'
);

DELETE FROM token_blacklist_blacklistedtoken
WHERE token_id IN (
    SELECT id FROM token_blacklist_outstandingtoken
    WHERE user_id IN (
        SELECT id FROM users_customuser
        WHERE email = 'admin@dysto.ai' OR email LIKE 'vendor%@dysto.ai' OR email LIKE 'cliente%@dysto.ai'
    )
);

DELETE FROM token_blacklist_outstandingtoken
WHERE user_id IN (
    SELECT id FROM users_customuser
    WHERE email = 'admin@dysto.ai' OR email LIKE 'vendor%@dysto.ai' OR email LIKE 'cliente%@dysto.ai'
);

DELETE FROM users_customuser
WHERE email = 'admin@dysto.ai' OR email LIKE 'vendor%@dysto.ai' OR email LIKE 'cliente%@dysto.ai';

-- =========================================================
-- 1) USUARIOS 
-- Password para todos: DystoDemo2026!
-- =========================================================

INSERT INTO users_customuser (password,last_login,is_superuser,first_name,last_name,is_staff,is_active,date_joined,email,role,phone,avatar_url,created_at)
VALUES ('pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,1,'Carlos','Hernandez',1,1,DATE_SUB(NOW(), INTERVAL 540 DAY),'admin@dysto.ai','admin','+52 55 1000 0000','https://images.unsplash.com/photo-1560250097-0b93528c311a',DATE_SUB(NOW(), INTERVAL 540 DAY));

INSERT INTO users_customuser (password,last_login,is_superuser,first_name,last_name,is_staff,is_active,date_joined,email,role,phone,avatar_url,created_at)
VALUES ('pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Fernanda','Lopez',0,1,DATE_SUB(NOW(), INTERVAL 430 DAY),'vendor01@dysto.ai','vendor','+52 55 2000 0001','https://images.unsplash.com/photo-1494790108377-be9c29b29330',DATE_SUB(NOW(), INTERVAL 430 DAY));

INSERT INTO users_customuser (password,last_login,is_superuser,first_name,last_name,is_staff,is_active,date_joined,email,role,phone,avatar_url,created_at)
VALUES ('pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Jorge','Martinez',0,1,DATE_SUB(NOW(), INTERVAL 420 DAY),'vendor02@dysto.ai','vendor','+52 33 2000 0002','https://images.unsplash.com/photo-1500648767791-00dcc994a43e',DATE_SUB(NOW(), INTERVAL 420 DAY));

INSERT INTO users_customuser (password,last_login,is_superuser,first_name,last_name,is_staff,is_active,date_joined,email,role,phone,avatar_url,created_at)
VALUES ('pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Ximena','Garcia',0,1,DATE_SUB(NOW(), INTERVAL 410 DAY),'vendor03@dysto.ai','vendor','+52 81 2000 0003','https://images.unsplash.com/photo-1544005313-94ddf0286df2',DATE_SUB(NOW(), INTERVAL 410 DAY));

INSERT INTO users_customuser (password,last_login,is_superuser,first_name,last_name,is_staff,is_active,date_joined,email,role,phone,avatar_url,created_at)
VALUES ('pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Ricardo','Sanchez',0,1,DATE_SUB(NOW(), INTERVAL 400 DAY),'vendor04@dysto.ai','vendor','+52 22 2000 0004','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',DATE_SUB(NOW(), INTERVAL 400 DAY));

INSERT INTO users_customuser (password,last_login,is_superuser,first_name,last_name,is_staff,is_active,date_joined,email,role,phone,avatar_url,created_at)
VALUES ('pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Valeria','Ramirez',0,1,DATE_SUB(NOW(), INTERVAL 390 DAY),'vendor05@dysto.ai','vendor','+52 44 2000 0005','https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',DATE_SUB(NOW(), INTERVAL 390 DAY));

INSERT INTO users_customuser (password,last_login,is_superuser,first_name,last_name,is_staff,is_active,date_joined,email,role,phone,avatar_url,created_at)
VALUES ('pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Alejandro','Torres',0,1,DATE_SUB(NOW(), INTERVAL 380 DAY),'vendor06@dysto.ai','vendor','+52 99 2000 0006','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',DATE_SUB(NOW(), INTERVAL 380 DAY));

INSERT INTO users_customuser (password,last_login,is_superuser,first_name,last_name,is_staff,is_active,date_joined,email,role,phone,avatar_url,created_at)
VALUES ('pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Mariana','Castillo',0,1,DATE_SUB(NOW(), INTERVAL 370 DAY),'vendor07@dysto.ai','vendor','+52 66 2000 0007','https://images.unsplash.com/photo-1524504388940-b1c1722653e1',DATE_SUB(NOW(), INTERVAL 370 DAY));

INSERT INTO users_customuser (password,last_login,is_superuser,first_name,last_name,is_staff,is_active,date_joined,email,role,phone,avatar_url,created_at)
VALUES ('pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Emiliano','Vargas',0,1,DATE_SUB(NOW(), INTERVAL 360 DAY),'vendor08@dysto.ai','vendor','+52 47 2000 0008','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',DATE_SUB(NOW(), INTERVAL 360 DAY));

INSERT INTO users_customuser (password,last_login,is_superuser,first_name,last_name,is_staff,is_active,date_joined,email,role,phone,avatar_url,created_at)
VALUES ('pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Sofia','Navarro',0,1,DATE_SUB(NOW(), INTERVAL 350 DAY),'vendor09@dysto.ai','vendor','+52 72 2000 0009','https://images.unsplash.com/photo-1517841905240-472988babdf9',DATE_SUB(NOW(), INTERVAL 350 DAY));

INSERT INTO users_customuser (password,last_login,is_superuser,first_name,last_name,is_staff,is_active,date_joined,email,role,phone,avatar_url,created_at)
VALUES ('pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Diego','Mendoza',0,1,DATE_SUB(NOW(), INTERVAL 340 DAY),'vendor10@dysto.ai','vendor','+52 99 2000 0010','https://images.unsplash.com/photo-1463453091185-61582044d556',DATE_SUB(NOW(), INTERVAL 340 DAY));

-- =========================================================
-- 2) DIRECCIONES 
-- =========================================================

INSERT INTO users_address (user_id,street,street_number,city,state,postal_code,is_default,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='admin@dysto.ai'),'Avenida Insurgentes Sur','101','Ciudad de Mexico','CDMX','03100',1,DATE_SUB(NOW(), INTERVAL 520 DAY),DATE_SUB(NOW(), INTERVAL 12 DAY));

INSERT INTO users_address (user_id,street,street_number,city,state,postal_code,is_default,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor01@dysto.ai'),'Avenida Reforma','245','Ciudad de Mexico','CDMX','06600',1,DATE_SUB(NOW(), INTERVAL 420 DAY),DATE_SUB(NOW(), INTERVAL 4 DAY));

INSERT INTO users_address (user_id,street,street_number,city,state,postal_code,is_default,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor02@dysto.ai'),'Calle Chapultepec','128','Guadalajara','Jalisco','44100',1,DATE_SUB(NOW(), INTERVAL 410 DAY),DATE_SUB(NOW(), INTERVAL 8 DAY));

INSERT INTO users_address (user_id,street,street_number,city,state,postal_code,is_default,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor03@dysto.ai'),'Avenida Universidad','985','Monterrey','Nuevo Leon','64000',1,DATE_SUB(NOW(), INTERVAL 400 DAY),DATE_SUB(NOW(), INTERVAL 6 DAY));

INSERT INTO users_address (user_id,street,street_number,city,state,postal_code,is_default,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor04@dysto.ai'),'Boulevard 5 de Mayo','321','Puebla','Puebla','72000',1,DATE_SUB(NOW(), INTERVAL 390 DAY),DATE_SUB(NOW(), INTERVAL 3 DAY));

INSERT INTO users_address (user_id,street,street_number,city,state,postal_code,is_default,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor05@dysto.ai'),'Avenida Constituyentes','77','Queretaro','Queretaro','76000',1,DATE_SUB(NOW(), INTERVAL 380 DAY),DATE_SUB(NOW(), INTERVAL 9 DAY));

INSERT INTO users_address (user_id,street,street_number,city,state,postal_code,is_default,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor06@dysto.ai'),'Calle 60','410','Merida','Yucatan','97000',1,DATE_SUB(NOW(), INTERVAL 370 DAY),DATE_SUB(NOW(), INTERVAL 7 DAY));

INSERT INTO users_address (user_id,street,street_number,city,state,postal_code,is_default,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor07@dysto.ai'),'Avenida Revolucion','510','Tijuana','Baja California','22000',1,DATE_SUB(NOW(), INTERVAL 360 DAY),DATE_SUB(NOW(), INTERVAL 5 DAY));

INSERT INTO users_address (user_id,street,street_number,city,state,postal_code,is_default,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor08@dysto.ai'),'Boulevard Lopez Mateos','1203','Leon','Guanajuato','37000',1,DATE_SUB(NOW(), INTERVAL 350 DAY),DATE_SUB(NOW(), INTERVAL 10 DAY));

INSERT INTO users_address (user_id,street,street_number,city,state,postal_code,is_default,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor09@dysto.ai'),'Paseo Tollocan','640','Toluca','Estado de Mexico','50000',1,DATE_SUB(NOW(), INTERVAL 340 DAY),DATE_SUB(NOW(), INTERVAL 2 DAY));

INSERT INTO users_address (user_id,street,street_number,city,state,postal_code,is_default,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor10@dysto.ai'),'Avenida Tulum','901','Cancun','Quintana Roo','77500',1,DATE_SUB(NOW(), INTERVAL 330 DAY),DATE_SUB(NOW(), INTERVAL 1 DAY));

-- =========================================================
-- 3) PRODUCTOS 
-- =========================================================

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor01@dysto.ai'),'Tecnologia','Xbox Series S 512GB','Consola en excelente estado, incluye un control y cable HDMI.',7999.00,6,'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRrO2fyzaL1get1Sg-W1zUZpJ11ckYelErwB21hEMjBki3MdxDCAJm255iH-j6fVGB-28N7IAnOQkvuiMOD6KjUq2TVbsIMJKLsVEbCLiG56QLUjYB20H0HpLI',JSON_ARRAY('https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRYA1N6X0ZjMqa48WA-w3RE9ZA2TlAwmRKpKMPfGwOU0twvC4TdnOMcluQmYIow34MrZFgrZg5twXvTqKlUhaRZUIiitxyAF5X5Bpt8q7u2jYOz1sRhZvo1oQ','https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTDNt_iBpwOWvPFxvAsQmgcZyX7J78JuUmHTsR1bODwbEP0Hew5CaF49EfYRzLC_woiAvFlMAShkr8XzrxKrc6u3GzN7-QkIaK2cFbR5lA1LvBMBk4MbdoFLw'),JSON_OBJECT('brand','Microsoft','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 180 DAY),DATE_SUB(NOW(), INTERVAL 5 DAY),JSON_ARRAY('xbox','consola','gaming'),34);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor01@dysto.ai'),'Tecnologia','Control Inalambrico Xbox Carbon Black','Control original, compatible con Xbox y PC.',1399.00,14,'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSoANTxycBc9-xfGX87U-zm5DC1Ddx663WUrwZitGHJIqYPC0cFtyXITobAOkFoGrDcm9lLUF5VzXEgzZkpgsqXilNAlwux1ZJ5aLkwAFr31eS8iRu99Adk1w2m',JSON_ARRAY('https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQPwVVabP_cK9ROyXkepDQIxbx3oY3FeyinWV0HcERtDaBHSWxY7-1x5yJx09M3l58W77X6QOclDQ5roYZ2wA6vQTEzelxZHWxxhaZ8RMFhhpp-1mebuuvOIjY','https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRMA9Tq-MH4aQq0RxlUHsoIrvIAY8fJpaZZMcp8u6ys41siqN_GmuxNAHZrWElU1i7pV6oS-kbYyZMnM_KvABWsgz7zwUhRuf_QqS9YMePRzOtF8s9Xwzwq3XA'),JSON_OBJECT('brand','Microsoft','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 150 DAY),DATE_SUB(NOW(), INTERVAL 8 DAY),JSON_ARRAY('accesorios','gaming'),49);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor02@dysto.ai'),'Hogar','Mesa de Comedor Madera 4 Puestos','Mesa de comedor para espacios medianos, acabado en roble claro.',6499.00,8,'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSWSnAQNPyhDmQDhy32DoiwmeYdlmd0DT5ujU3RvnwvLi9vI2anytAxP6UtZtZwEmEfyfo0eCB4QMzp9mQBXa-kxnKYF7bX1A4XDooLnq-6BV9mfZiEvLqatQ',JSON_ARRAY('https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT9fsLQT8rpTimF9tbZGpIh3SDGK02EBiLFORhp6tkujkhDUc0E3ILi1e2WsoSNuR8DD4Z8QlFiHP4thBXz5mFuR8MPJTDIsTDCinHxhD-3YYwlwyPk5PM4-7Q','https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ_pjObe42umvhAvBYQJJyrPHpPALoqbg7P3gOSSiMF03QwEfE2LzkaInwsgpNyC9d-UjXjbbhBw5Yo88rDW2oIBt4f_ZVn5C3jTAa5c18t_mWAo3fClQg9uCA'),JSON_OBJECT('material','madera','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 220 DAY),DATE_SUB(NOW(), INTERVAL 15 DAY),JSON_ARRAY('mesa','hogar','comedor'),17);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor02@dysto.ai'),'Hogar','Silla Ergonomica de Oficina','Silla con soporte lumbar y ajuste de altura.',3299.00,9,'https://m.media-amazon.com/images/I/81BLi0KQXeL._AC_SX679_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/719LgQLGDVL._AC_SX679_.jpg','https://m.media-amazon.com/images/I/7128-T4K-rL._AC_SX679_.jpg'),JSON_OBJECT('color','negro','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 140 DAY),DATE_SUB(NOW(), INTERVAL 12 DAY),JSON_ARRAY('oficina','silla'),26);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor03@dysto.ai'),'Tecnologia','Computadora Portatil Lenovo IdeaPad i5','Portatil para estudio y trabajo, 16GB RAM y SSD de 512GB.',15999.00,5,'https://m.media-amazon.com/images/I/710R57COBFL._AC_SX522_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/611FLyvTFBL._AC_SX522_.jpg','https://m.media-amazon.com/images/I/71uS4VFafTL._AC_SX522_.jpg'),JSON_OBJECT('brand','Lenovo','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 110 DAY),DATE_SUB(NOW(), INTERVAL 2 DAY),JSON_ARRAY('computadora','portatil'),22);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor03@dysto.ai'),'Tecnologia','Televisor Samsung 55 Pulgadas 4K','Smart TV 4K UHD con apps preinstaladas y control de voz.',11999.00,7,'https://m.media-amazon.com/images/I/61aBRVxTBQL._AC_SX300_SY300_QL70_ML2_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/61rnDMTsNDL._AC_SX522_.jpg','https://m.media-amazon.com/images/I/71non-NOFRL._AC_SX522_.jpg'),JSON_OBJECT('brand','Samsung','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 190 DAY),DATE_SUB(NOW(), INTERVAL 4 DAY),JSON_ARRAY('televisor','4k','smart-tv'),31);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor04@dysto.ai'),'Hogar','Jabon Liquido para Manos 500ml','Jabon antibacterial de uso diario con aroma neutro.',59.00,70,'https://m.media-amazon.com/images/I/71dV+riwhWL._AC_SY300_SX300_QL70_ML2_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/710ELIzH1wL._AC_SX679_.jpg','https://m.media-amazon.com/images/I/71bfDx8X9CL._AC_SX679_.jpg'),JSON_OBJECT('tipo','limpieza','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 300 DAY),DATE_SUB(NOW(), INTERVAL 20 DAY),JSON_ARRAY('jabon','limpieza','hogar'),112);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor04@dysto.ai'),'Hogar','Detergente Liquido Ropa 2L','Rinde para multiples lavadas, fragancia fresca.',129.00,55,'https://m.media-amazon.com/images/I/61UAQrv5EGL._AC_SY300_SX300_QL70_ML2_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/611DH3KwMJL._AC_SX679_.jpg','https://m.media-amazon.com/images/I/71h2-JG-28L._AC_SX679_.jpg'),JSON_OBJECT('tipo','aseo','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 270 DAY),DATE_SUB(NOW(), INTERVAL 18 DAY),JSON_ARRAY('detergente','aseo'),95);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor05@dysto.ai'),'Tecnologia','Mouse Logitech Inalambrico M170','Mouse compacto para oficina y uso diario.',349.00,32,'https://m.media-amazon.com/images/I/615c1OkxYwL._AC_SY300_SX300_QL70_ML2_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/71Bep7uDA3L._AC_SX522_.jpg','https://m.media-amazon.com/images/I/71jadbj6sML._AC_SX522_.jpg'),JSON_OBJECT('brand','Logitech','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 210 DAY),DATE_SUB(NOW(), INTERVAL 10 DAY),JSON_ARRAY('mouse','oficina'),77);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor05@dysto.ai'),'Tecnologia','Teclado Mecanico Red Switch','Teclado en espanol, retroiluminado, formato completo.',1799.00,16,'https://m.media-amazon.com/images/I/61fOWq4eDmL._AC_SY300_SX300_QL70_ML2_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/71qnlqpAy6L._AC_SX522_.jpg','https://m.media-amazon.com/images/I/71LXMPIlhRL._AC_SX522_.jpg'),JSON_OBJECT('layout','espanol','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 160 DAY),DATE_SUB(NOW(), INTERVAL 6 DAY),JSON_ARRAY('teclado','gaming','oficina'),39);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor06@dysto.ai'),'Hogar','Juego de Ollas Antiadherentes x5','Juego de ollas para cocina diaria, facil limpieza.',2199.00,11,'https://m.media-amazon.com/images/I/81K4RSkRXzL._AC_SY300_SX300_QL70_ML2_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/81Yh6NES0oL._AC_SX679_.jpg','https://m.media-amazon.com/images/I/71Xqa51MbgL._AC_SX679_.jpg'),JSON_OBJECT('material','aluminio','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 205 DAY),DATE_SUB(NOW(), INTERVAL 16 DAY),JSON_ARRAY('cocina','hogar'),28);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor06@dysto.ai'),'Hogar','Licuadora Oster 700W','Licuadora de vaso de vidrio con 3 velocidades.',1399.00,13,'https://m.media-amazon.com/images/I/51yFg5kr1-L._AC_SX679_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/814eVhFzsIL._AC_SX679_.jpg','https://m.media-amazon.com/images/I/81etp3XAIEL._AC_SX679_.jpg'),JSON_OBJECT('brand','Oster','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 145 DAY),DATE_SUB(NOW(), INTERVAL 11 DAY),JSON_ARRAY('electrodomesticos','cocina'),33);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor07@dysto.ai'),'Tecnologia','Audifonos Bluetooth Sony WH-CH520','Bateria de larga duracion y sonido balanceado.',899.00,19,'https://m.media-amazon.com/images/I/41ETuD2aZRL._AC_SX300_SY300_QL70_ML2_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/71AQ4yidjFL._AC_SX522_.jpg','https://m.media-amazon.com/images/I/71AQ4yidjFL._AC_SX522_.jpg','https://m.media-amazon.com/images/I/71F3N9ONS7L._AC_SX522_.jpg'),JSON_OBJECT('brand','Sony','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 170 DAY),DATE_SUB(NOW(), INTERVAL 9 DAY),JSON_ARRAY('audio','bluetooth'),41);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor07@dysto.ai'),'Tecnologia','Parlante JBL Go 3','Parlante portatil resistente al agua.',999.00,18,'https://m.media-amazon.com/images/I/715ZUYP5N5L._AC_SX522_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/918lQmwtCwL._AC_SX522_.jpg','https://m.media-amazon.com/images/I/81S5YOcGjyL._AC_SX522_.jpg'),JSON_OBJECT('brand','JBL','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 130 DAY),DATE_SUB(NOW(), INTERVAL 7 DAY),JSON_ARRAY('audio','portatil'),47);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor08@dysto.ai'),'Hogar','Escritorio Minimalista 120cm','Escritorio de trabajo ideal para home office.',2499.00,7,'https://m.media-amazon.com/images/I/81chqQOXLIL._AC_SX679_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/81kH9WtrVsL._AC_SX679_.jpg','https://m.media-amazon.com/images/I/81eUm8WGVWL._AC_SX679_.jpg'),JSON_OBJECT('material','madera-metal','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 210 DAY),DATE_SUB(NOW(), INTERVAL 14 DAY),JSON_ARRAY('escritorio','home-office'),19);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor08@dysto.ai'),'Tecnologia','Monitor LG 24 Pulgadas IPS','Monitor Full HD para trabajo y entretenimiento.',3999.00,9,'https://m.media-amazon.com/images/I/81rALfMyUWL._AC_SX522_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/71LmWsR+pvL._AC_SX522_.jpg','https://m.media-amazon.com/images/I/61fMc9r5FxL._AC_SX522_.jpg'),JSON_OBJECT('brand','LG','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 175 DAY),DATE_SUB(NOW(), INTERVAL 6 DAY),JSON_ARRAY('monitor','oficina'),27);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor09@dysto.ai'),'Tecnologia','Disco SSD 1TB NVMe','Unidad de estado solido de alto rendimiento.',1499.00,21,'https://m.media-amazon.com/images/I/51YDo05UMyL._AC_SX522_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/51HTMnIhp2L._AC_SX522_.jpg','https://m.media-amazon.com/images/I/612wvIsno1L._AC_SX522_.jpg'),JSON_OBJECT('capacidad','1TB','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 125 DAY),DATE_SUB(NOW(), INTERVAL 5 DAY),JSON_ARRAY('almacenamiento','pc'),36);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor09@dysto.ai'),'Tecnologia','Camara Web Logitech C920','Camara para videollamadas en Full HD.',1299.00,11,'https://m.media-amazon.com/images/I/71eGb1FcyiL._AC_SY300_SX300_QL70_ML2_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/713oLX7nuHL._AC_SX522_.jpg','https://m.media-amazon.com/images/I/61ceNI7PhyL._AC_SX522_.jpg'),JSON_OBJECT('brand','Logitech','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 118 DAY),DATE_SUB(NOW(), INTERVAL 3 DAY),JSON_ARRAY('webcam','streaming'),18);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor10@dysto.ai'),'Hogar','Set de Toallas x6 Algodon','Toallas suaves de secado rapido para uso diario.',499.00,25,'https://m.media-amazon.com/images/I/51imYOqhayL._AC_SX679_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/61Qinr5QV7L._AC_SX679_.jpg','https://m.media-amazon.com/images/I/61S77tw+srL._AC_SX679_.jpg'),JSON_OBJECT('material','algodon','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 260 DAY),DATE_SUB(NOW(), INTERVAL 19 DAY),JSON_ARRAY('bano','hogar'),61);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor10@dysto.ai'),'Hogar','Organizador de Zapatos 3 Niveles','Estructura metalica para organizar calzado en casa.',699.00,17,'https://m.media-amazon.com/images/I/61Znc7JKAXL._AC_SY300_SX300_QL70_ML2_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/71dNwnqtCBL._AC_SX679_.jpg','https://m.media-amazon.com/images/I/71rEBtJbqqL._AC_SX679_.jpg'),JSON_OBJECT('material','metal','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 155 DAY),DATE_SUB(NOW(), INTERVAL 13 DAY),JSON_ARRAY('organizacion','hogar'),23);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor10@dysto.ai'),'Hogar','Jabon en Barra x3','Paquete de jabon en barra para aseo diario.',45.00,80,'https://m.media-amazon.com/images/I/51xVv91HqmL._AC_SX679_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/61XqOTKVv5L._AC_SX679_.jpg','https://m.media-amazon.com/images/I/61Q1i55SDbL._AC_SX679_.jpg'),JSON_OBJECT('tipo','aseo personal','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 245 DAY),DATE_SUB(NOW(), INTERVAL 17 DAY),JSON_ARRAY('jabon','hogar'),102);

INSERT INTO products_product (seller_id,category,title,description,price,stock,main_image,additional_images,metadata,edit_allowed,is_active_admin,created_at,updated_at,tags,units_sold)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor04@dysto.ai'),'Hogar','Escoba de Microfibra con Repuesto','Escoba para piso con cabezal giratorio.',249.00,28,'https://m.media-amazon.com/images/I/81pyye40tnL._AC_SY300_SX300_QL70_ML2_.jpg',JSON_ARRAY('https://m.media-amazon.com/images/I/81tlM4d79oL._AC_SX679_.jpg','https://m.media-amazon.com/images/I/81DzTQ1Kp6L._AC_SX679_.jpg'),JSON_OBJECT('tipo','limpieza','seed_tag','DB-01','currency','MXN'),1,1,DATE_SUB(NOW(), INTERVAL 205 DAY),DATE_SUB(NOW(), INTERVAL 4 DAY),JSON_ARRAY('limpieza','hogar'),44);

-- =========================================================
-- 4) CARRITOS 
-- =========================================================

INSERT INTO carts_cart (user_id,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor01@dysto.ai'),DATE_SUB(NOW(), INTERVAL 60 DAY),DATE_SUB(NOW(), INTERVAL 2 DAY));

INSERT INTO carts_cart (user_id,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor02@dysto.ai'),DATE_SUB(NOW(), INTERVAL 50 DAY),DATE_SUB(NOW(), INTERVAL 4 DAY));

INSERT INTO carts_cart (user_id,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor03@dysto.ai'),DATE_SUB(NOW(), INTERVAL 40 DAY),DATE_SUB(NOW(), INTERVAL 3 DAY));

INSERT INTO carts_cart (user_id,created_at,updated_at)
VALUES ((SELECT id FROM users_customuser WHERE email='vendor04@dysto.ai'),DATE_SUB(NOW(), INTERVAL 35 DAY),DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO carts_cartitem (cart_id,product_id,quantity)
VALUES (
    (SELECT c.id FROM carts_cart c JOIN users_customuser u ON u.id=c.user_id WHERE u.email='vendor01@dysto.ai' LIMIT 1),
    (SELECT p.id FROM products_product p WHERE p.title='Jabon Liquido para Manos 500ml' LIMIT 1),
    3
);

INSERT INTO carts_cartitem (cart_id,product_id,quantity)
VALUES (
    (SELECT c.id FROM carts_cart c JOIN users_customuser u ON u.id=c.user_id WHERE u.email='vendor02@dysto.ai' LIMIT 1),
    (SELECT p.id FROM products_product p WHERE p.title='Televisor Samsung 55 Pulgadas 4K' LIMIT 1),
    1
);

INSERT INTO carts_cartitem (cart_id,product_id,quantity)
VALUES (
    (SELECT c.id FROM carts_cart c JOIN users_customuser u ON u.id=c.user_id WHERE u.email='vendor03@dysto.ai' LIMIT 1),
    (SELECT p.id FROM products_product p WHERE p.title='Mesa de Comedor Madera 4 Puestos' LIMIT 1),
    1
);

INSERT INTO carts_cartitem (cart_id,product_id,quantity)
VALUES (
    (SELECT c.id FROM carts_cart c JOIN users_customuser u ON u.id=c.user_id WHERE u.email='vendor04@dysto.ai' LIMIT 1),
    (SELECT p.id FROM products_product p WHERE p.title='Licuadora Oster 700W' LIMIT 1),
    2
);

-- =========================================================
-- 5) PEDIDOS 
-- =========================================================

INSERT INTO orders_order (user_id,address_snapshot,total,status,order_number,created_at)
VALUES (
    (SELECT id FROM users_customuser WHERE email='vendor01@dysto.ai'),
    JSON_OBJECT('street','Avenida Reforma','street_number','245','city','Ciudad de Mexico','state','CDMX','postal_code','06600','seed_tag','DB-01'),
    0.00,'completed','DB01ORD000000001',DATE_SUB(NOW(), INTERVAL 120 DAY)
);

INSERT INTO orders_order (user_id,address_snapshot,total,status,order_number,created_at)
VALUES (
    (SELECT id FROM users_customuser WHERE email='vendor02@dysto.ai'),
    JSON_OBJECT('street','Calle Chapultepec','street_number','128','city','Guadalajara','state','Jalisco','postal_code','44100','seed_tag','DB-01'),
    0.00,'completed','DB01ORD000000002',DATE_SUB(NOW(), INTERVAL 100 DAY)
);

INSERT INTO orders_order (user_id,address_snapshot,total,status,order_number,created_at)
VALUES (
    (SELECT id FROM users_customuser WHERE email='vendor03@dysto.ai'),
    JSON_OBJECT('street','Avenida Universidad','street_number','985','city','Monterrey','state','Nuevo Leon','postal_code','64000','seed_tag','DB-01'),
    0.00,'completed','DB01ORD000000003',DATE_SUB(NOW(), INTERVAL 80 DAY)
);

INSERT INTO orders_order (user_id,address_snapshot,total,status,order_number,created_at)
VALUES (
    (SELECT id FROM users_customuser WHERE email='vendor04@dysto.ai'),
    JSON_OBJECT('street','Boulevard 5 de Mayo','street_number','321','city','Puebla','state','Puebla','postal_code','72000','seed_tag','DB-01'),
    0.00,'completed','DB01ORD000000004',DATE_SUB(NOW(), INTERVAL 65 DAY)
);

INSERT INTO orders_order (user_id,address_snapshot,total,status,order_number,created_at)
VALUES (
    (SELECT id FROM users_customuser WHERE email='vendor05@dysto.ai'),
    JSON_OBJECT('street','Avenida Constituyentes','street_number','77','city','Queretaro','state','Queretaro','postal_code','76000','seed_tag','DB-01'),
    0.00,'completed','DB01ORD000000005',DATE_SUB(NOW(), INTERVAL 54 DAY)
);

INSERT INTO orders_order (user_id,address_snapshot,total,status,order_number,created_at)
VALUES (
    (SELECT id FROM users_customuser WHERE email='vendor06@dysto.ai'),
    JSON_OBJECT('street','Calle 60','street_number','410','city','Merida','state','Yucatan','postal_code','97000','seed_tag','DB-01'),
    0.00,'completed','DB01ORD000000006',DATE_SUB(NOW(), INTERVAL 42 DAY)
);

INSERT INTO orders_orderitem (order_id,product_id,product_snapshot,quantity,unit_price)
VALUES (
    (SELECT id FROM orders_order WHERE order_number='DB01ORD000000001'),
    (SELECT id FROM products_product WHERE title='Mesa de Comedor Madera 4 Puestos' LIMIT 1),
    JSON_OBJECT('title','Mesa de Comedor Madera 4 Puestos','price',6499.00),
    1,
    6499.00
);

INSERT INTO orders_orderitem (order_id,product_id,product_snapshot,quantity,unit_price)
VALUES (
    (SELECT id FROM orders_order WHERE order_number='DB01ORD000000001'),
    (SELECT id FROM products_product WHERE title='Jabon Liquido para Manos 500ml' LIMIT 1),
    JSON_OBJECT('title','Jabon Liquido para Manos 500ml','price',59.00),
    2,
    59.00
);

INSERT INTO orders_orderitem (order_id,product_id,product_snapshot,quantity,unit_price)
VALUES (
    (SELECT id FROM orders_order WHERE order_number='DB01ORD000000002'),
    (SELECT id FROM products_product WHERE title='Xbox Series S 512GB' LIMIT 1),
    JSON_OBJECT('title','Xbox Series S 512GB','price',7999.00),
    1,
    7999.00
);

INSERT INTO orders_orderitem (order_id,product_id,product_snapshot,quantity,unit_price)
VALUES (
    (SELECT id FROM orders_order WHERE order_number='DB01ORD000000003'),
    (SELECT id FROM products_product WHERE title='Jabon Liquido para Manos 500ml' LIMIT 1),
    JSON_OBJECT('title','Jabon Liquido para Manos 500ml','price',59.00),
    4,
    59.00
);

INSERT INTO orders_orderitem (order_id,product_id,product_snapshot,quantity,unit_price)
VALUES (
    (SELECT id FROM orders_order WHERE order_number='DB01ORD000000003'),
    (SELECT id FROM products_product WHERE title='Licuadora Oster 700W' LIMIT 1),
    JSON_OBJECT('title','Licuadora Oster 700W','price',1399.00),
    1,
    1399.00
);

INSERT INTO orders_orderitem (order_id,product_id,product_snapshot,quantity,unit_price)
VALUES (
    (SELECT id FROM orders_order WHERE order_number='DB01ORD000000004'),
    (SELECT id FROM products_product WHERE title='Televisor Samsung 55 Pulgadas 4K' LIMIT 1),
    JSON_OBJECT('title','Televisor Samsung 55 Pulgadas 4K','price',11999.00),
    1,
    11999.00
);

INSERT INTO orders_orderitem (order_id,product_id,product_snapshot,quantity,unit_price)
VALUES (
    (SELECT id FROM orders_order WHERE order_number='DB01ORD000000005'),
    (SELECT id FROM products_product WHERE title='Computadora Portatil Lenovo IdeaPad i5' LIMIT 1),
    JSON_OBJECT('title','Computadora Portatil Lenovo IdeaPad i5','price',15999.00),
    1,
    15999.00
);

INSERT INTO orders_orderitem (order_id,product_id,product_snapshot,quantity,unit_price)
VALUES (
    (SELECT id FROM orders_order WHERE order_number='DB01ORD000000006'),
    (SELECT id FROM products_product WHERE title='Jabon Liquido para Manos 500ml' LIMIT 1),
    JSON_OBJECT('title','Jabon Liquido para Manos 500ml','price',59.00),
    3,
    59.00
);

UPDATE orders_order
SET total = (
    SELECT IFNULL(SUM(quantity * unit_price), 0)
    FROM orders_orderitem
    WHERE order_id = orders_order.id
)
WHERE order_number='DB01ORD000000001';

UPDATE orders_order
SET total = (
    SELECT IFNULL(SUM(quantity * unit_price), 0)
    FROM orders_orderitem
    WHERE order_id = orders_order.id
)
WHERE order_number='DB01ORD000000002';

UPDATE orders_order
SET total = (
    SELECT IFNULL(SUM(quantity * unit_price), 0)
    FROM orders_orderitem
    WHERE order_id = orders_order.id
)
WHERE order_number='DB01ORD000000003';

UPDATE orders_order
SET total = (
    SELECT IFNULL(SUM(quantity * unit_price), 0)
    FROM orders_orderitem
    WHERE order_id = orders_order.id
)
WHERE order_number='DB01ORD000000004';

UPDATE orders_order
SET total = (
    SELECT IFNULL(SUM(quantity * unit_price), 0)
    FROM orders_orderitem
    WHERE order_id = orders_order.id
)
WHERE order_number='DB01ORD000000005';

UPDATE orders_order
SET total = (
    SELECT IFNULL(SUM(quantity * unit_price), 0)
    FROM orders_orderitem
    WHERE order_id = orders_order.id
)
WHERE order_number='DB01ORD000000006';

COMMIT;
