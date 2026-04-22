-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dysto_ai
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',3,'add_permission'),(6,'Can change permission',3,'change_permission'),(7,'Can delete permission',3,'delete_permission'),(8,'Can view permission',3,'view_permission'),(9,'Can add group',2,'add_group'),(10,'Can change group',2,'change_group'),(11,'Can delete group',2,'delete_group'),(12,'Can view group',2,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add Blacklisted Token',6,'add_blacklistedtoken'),(22,'Can change Blacklisted Token',6,'change_blacklistedtoken'),(23,'Can delete Blacklisted Token',6,'delete_blacklistedtoken'),(24,'Can view Blacklisted Token',6,'view_blacklistedtoken'),(25,'Can add Outstanding Token',7,'add_outstandingtoken'),(26,'Can change Outstanding Token',7,'change_outstandingtoken'),(27,'Can delete Outstanding Token',7,'delete_outstandingtoken'),(28,'Can view Outstanding Token',7,'view_outstandingtoken'),(29,'Can add Usuario',9,'add_customuser'),(30,'Can change Usuario',9,'change_customuser'),(31,'Can delete Usuario',9,'delete_customuser'),(32,'Can view Usuario',9,'view_customuser'),(33,'Can add Dirección',8,'add_address'),(34,'Can change Dirección',8,'change_address'),(35,'Can delete Dirección',8,'delete_address'),(36,'Can view Dirección',8,'view_address'),(37,'Can add Producto',10,'add_product'),(38,'Can change Producto',10,'change_product'),(39,'Can delete Producto',10,'delete_product'),(40,'Can view Producto',10,'view_product'),(41,'Can add Carrito',11,'add_cart'),(42,'Can change Carrito',11,'change_cart'),(43,'Can delete Carrito',11,'delete_cart'),(44,'Can view Carrito',11,'view_cart'),(45,'Can add Elemento del carrito',12,'add_cartitem'),(46,'Can change Elemento del carrito',12,'change_cartitem'),(47,'Can delete Elemento del carrito',12,'delete_cartitem'),(48,'Can view Elemento del carrito',12,'view_cartitem'),(49,'Can add Pedido',13,'add_order'),(50,'Can change Pedido',13,'change_order'),(51,'Can delete Pedido',13,'delete_order'),(52,'Can view Pedido',13,'view_order'),(53,'Can add Item del Pedido',14,'add_orderitem'),(54,'Can change Item del Pedido',14,'change_orderitem'),(55,'Can delete Item del Pedido',14,'delete_orderitem'),(56,'Can view Item del Pedido',14,'view_orderitem'),(57,'Can add Registro de Auditoría',15,'add_auditlog'),(58,'Can change Registro de Auditoría',15,'change_auditlog'),(59,'Can delete Registro de Auditoría',15,'delete_auditlog'),(60,'Can view Registro de Auditoría',15,'view_auditlog');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts_cart`
--

DROP TABLE IF EXISTS `carts_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts_cart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `carts_cart_user_id_bd0756c7_fk_users_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `users_customuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts_cart`
--

LOCK TABLES `carts_cart` WRITE;
/*!40000 ALTER TABLE `carts_cart` DISABLE KEYS */;
INSERT INTO `carts_cart` VALUES (1,'2026-04-14 18:19:59.185205','2026-04-14 18:19:59.185223',1),(2,'2026-04-16 19:34:12.933593','2026-04-16 19:34:12.933658',2),(3,'2026-04-16 23:53:37.964717','2026-04-16 23:53:37.964730',3),(4,'2026-04-18 02:02:46.072560','2026-04-18 02:02:46.072592',4),(5,'2026-02-21 12:53:03.000000','2026-04-20 12:53:03.000000',6),(6,'2026-03-03 12:53:03.000000','2026-04-18 12:53:03.000000',7),(7,'2026-03-13 12:53:03.000000','2026-04-19 12:53:03.000000',8),(8,'2026-03-18 12:53:03.000000','2026-04-21 12:53:03.000000',9);
/*!40000 ALTER TABLE `carts_cart` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_cart_insert` AFTER INSERT ON `carts_cart` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_cart_update` AFTER UPDATE ON `carts_cart` FOR EACH ROW BEGIN
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

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_cart_delete` AFTER DELETE ON `carts_cart` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `carts_cartitem`
--

DROP TABLE IF EXISTS `carts_cartitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts_cartitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `cart_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cart_product` (`cart_id`,`product_id`),
  KEY `carts_cartitem_product_id_acd010e4_fk_products_product_id` (`product_id`),
  CONSTRAINT `carts_cartitem_cart_id_9cb0a756_fk_carts_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `carts_cart` (`id`),
  CONSTRAINT `carts_cartitem_product_id_acd010e4_fk_products_product_id` FOREIGN KEY (`product_id`) REFERENCES `products_product` (`id`),
  CONSTRAINT `carts_cartitem_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts_cartitem`
--

LOCK TABLES `carts_cartitem` WRITE;
/*!40000 ALTER TABLE `carts_cartitem` DISABLE KEYS */;
INSERT INTO `carts_cartitem` VALUES (10,1,1,11),(11,3,5,20),(12,1,6,19),(13,1,7,16),(14,2,8,25);
/*!40000 ALTER TABLE `carts_cartitem` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_cartitem_insert` AFTER INSERT ON `carts_cartitem` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_cartitem_update` AFTER UPDATE ON `carts_cartitem` FOR EACH ROW BEGIN
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

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_cartitem_delete` AFTER DELETE ON `carts_cartitem` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_users_customuser_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_users_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `users_customuser` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(2,'auth','group'),(3,'auth','permission'),(11,'carts','cart'),(12,'carts','cartitem'),(4,'contenttypes','contenttype'),(15,'logbook','auditlog'),(13,'orders','order'),(14,'orders','orderitem'),(10,'products','product'),(5,'sessions','session'),(6,'token_blacklist','blacklistedtoken'),(7,'token_blacklist','outstandingtoken'),(8,'users','address'),(9,'users','customuser');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-04-14 18:15:15.702336'),(2,'contenttypes','0002_remove_content_type_name','2026-04-14 18:15:15.783764'),(3,'auth','0001_initial','2026-04-14 18:15:16.045925'),(4,'auth','0002_alter_permission_name_max_length','2026-04-14 18:15:16.113529'),(5,'auth','0003_alter_user_email_max_length','2026-04-14 18:15:16.121150'),(6,'auth','0004_alter_user_username_opts','2026-04-14 18:15:16.129489'),(7,'auth','0005_alter_user_last_login_null','2026-04-14 18:15:16.135007'),(8,'auth','0006_require_contenttypes_0002','2026-04-14 18:15:16.138213'),(9,'auth','0007_alter_validators_add_error_messages','2026-04-14 18:15:16.143848'),(10,'auth','0008_alter_user_username_max_length','2026-04-14 18:15:16.149329'),(11,'auth','0009_alter_user_last_name_max_length','2026-04-14 18:15:16.155245'),(12,'auth','0010_alter_group_name_max_length','2026-04-14 18:15:16.170742'),(13,'auth','0011_update_proxy_permissions','2026-04-14 18:15:16.177624'),(14,'auth','0012_alter_user_first_name_max_length','2026-04-14 18:15:16.183908'),(15,'users','0001_initial','2026-04-14 18:15:16.492529'),(16,'admin','0001_initial','2026-04-14 18:15:16.591551'),(17,'admin','0002_logentry_remove_auto_add','2026-04-14 18:15:16.597629'),(18,'admin','0003_logentry_add_action_flag_choices','2026-04-14 18:15:16.603124'),(19,'products','0001_initial','2026-04-14 18:15:16.620237'),(20,'carts','0001_initial','2026-04-14 18:15:16.659357'),(21,'carts','0002_initial','2026-04-14 18:15:16.821860'),(22,'logbook','0001_initial','2026-04-14 18:15:16.838224'),(23,'logbook','0002_initial','2026-04-14 18:15:16.892367'),(24,'orders','0001_initial','2026-04-14 18:15:16.933560'),(25,'orders','0002_initial','2026-04-14 18:15:17.090161'),(26,'products','0002_initial','2026-04-14 18:15:17.145087'),(27,'sessions','0001_initial','2026-04-14 18:15:17.171804'),(28,'token_blacklist','0001_initial','2026-04-14 18:15:17.304139'),(29,'token_blacklist','0002_outstandingtoken_jti_hex','2026-04-14 18:15:17.344040'),(30,'token_blacklist','0003_auto_20171017_2007','2026-04-14 18:15:17.356213'),(31,'token_blacklist','0004_auto_20171017_2013','2026-04-14 18:15:17.414396'),(32,'token_blacklist','0005_remove_outstandingtoken_jti','2026-04-14 18:15:17.461510'),(33,'token_blacklist','0006_auto_20171017_2113','2026-04-14 18:15:17.484466'),(34,'token_blacklist','0007_auto_20171017_2214','2026-04-14 18:15:17.640107'),(35,'token_blacklist','0008_migrate_to_bigautofield','2026-04-14 18:15:17.850895'),(36,'token_blacklist','0010_fix_migrate_to_bigautofield','2026-04-14 18:15:17.869686'),(37,'token_blacklist','0011_linearizes_history','2026-04-14 18:15:17.872048'),(38,'token_blacklist','0012_alter_outstandingtoken_user','2026-04-14 18:15:17.883515'),(39,'token_blacklist','0013_alter_blacklistedtoken_options_and_more','2026-04-14 18:15:17.899706');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logbook_auditlog`
--

DROP TABLE IF EXISTS `logbook_auditlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logbook_auditlog` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `entity` varchar(100) NOT NULL,
  `entity_id` int NOT NULL,
  `action` varchar(10) NOT NULL,
  `changes` json NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `source_ip` char(39) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `logbook_auditlog_user_id_d94da1fe_fk_users_customuser_id` (`user_id`),
  CONSTRAINT `logbook_auditlog_user_id_d94da1fe_fk_users_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `users_customuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logbook_auditlog`
--

LOCK TABLES `logbook_auditlog` WRITE;
/*!40000 ALTER TABLE `logbook_auditlog` DISABLE KEYS */;
INSERT INTO `logbook_auditlog` VALUES (1,'Cart',1,'CREATE','{\"after\": {\"id\": \"1\", \"user\": \"admin@gmail.com (Vendedor)\", \"created_at\": \"2026-04-14 18:19:59.185205+00:00\", \"updated_at\": \"2026-04-14 18:19:59.185223+00:00\"}}','2026-04-14 18:19:59.186103','127.0.0.1',NULL),(2,'CustomUser',1,'CREATE','{\"after\": {\"id\": \"1\", \"role\": \"vendor\", \"email\": \"admin@gmail.com\", \"phone\": null, \"is_staff\": \"False\", \"is_active\": \"True\", \"last_name\": \"Teja Carvajal\", \"avatar_url\": null, \"created_at\": \"2026-04-14 18:19:59.179921+00:00\", \"first_name\": \"Erick\", \"last_login\": null, \"date_joined\": \"2026-04-14 18:19:59.179595+00:00\", \"is_superuser\": \"False\"}}','2026-04-14 18:19:59.189123','127.0.0.1',NULL),(3,'Product',1,'CREATE','{\"after\": {\"id\": \"1\", \"tags\": \"[\'taza\', \'ceramica\', \'meme\', \'man face\', \'roblox face\', \'cafe\', \'te\', \'bebida\', \'humor\', \'regalo\', \'novedad\']\", \"price\": \"15.99\", \"stock\": \"4\", \"title\": \"Taza de cerámica \'Man Face\' con diseño de meme\", \"seller\": \"admin@gmail.com (Vendedor)\", \"category\": \"Modelos de IA\", \"metadata\": \"{}\", \"created_at\": \"2026-04-14 18:21:31.604483+00:00\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776190860/products/r4mf1vyq3itobojnzbzt.jpg\", \"units_sold\": \"0\", \"updated_at\": \"2026-04-14 18:21:31.604509+00:00\", \"description\": \"Disfruta de tus bebidas favoritas con esta divertida taza de cerámica blanca, decorada con el icónico \'Man Face\' del mundo de los memes. Ideal para café, té o cualquier otra bebida caliente, esta taza añade un toque de humor a tu rutina diaria. Perfecta para coleccionistas de memes o como regalo original.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-14 18:21:31.608689','127.0.0.1',NULL),(4,'Product',1,'UPDATE','{\"price\": {\"after\": \"16.09\", \"before\": \"15.99\"}, \"updated_at\": {\"after\": \"2026-04-14 18:23:08.410339+00:00\", \"before\": \"2026-04-14 18:21:31.604509+00:00\"}}','2026-04-14 18:23:08.418232','127.0.0.1',NULL),(5,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-14 18:23:59.634008+00:00\", \"before\": null}}','2026-04-14 18:23:59.640020','127.0.0.1',NULL),(6,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-14 18:29:08.378986+00:00\", \"before\": \"2026-04-14 18:23:59.634008+00:00\"}}','2026-04-14 18:29:08.402627','127.0.0.1',NULL),(7,'Product',1,'UPDATE','{\"stock\": {\"after\": \"9\", \"before\": \"4\"}, \"updated_at\": {\"after\": \"2026-04-14 18:29:22.681473+00:00\", \"before\": \"2026-04-14 18:23:08.410339+00:00\"}}','2026-04-14 18:29:22.696241','127.0.0.1',1),(8,'Product',2,'CREATE','{\"after\": {\"id\": \"2\", \"tags\": \"[\'cuchara\', \'utensilio\', \'cocina\', \'mesa\', \'acero inoxidable\', \'menaje\', \'cubierto\']\", \"price\": \"2.50\", \"stock\": \"6\", \"title\": \"Cuchara de Acero Inoxidable Brillante\", \"seller\": \"admin@gmail.com (Vendedor)\", \"category\": \"Herramientas\", \"metadata\": \"{}\", \"created_at\": \"2026-04-14 18:31:10.881273+00:00\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776191460/products/bzlymn7w2xvmy4j5xovw.jpg\", \"units_sold\": \"0\", \"updated_at\": \"2026-04-14 18:31:10.881300+00:00\", \"description\": \"Cuchara de mesa o sopa de acero inoxidable con acabado brillante. Ideal para el uso diario en el hogar o restaurantes, resistente y fácil de limpiar. Su diseño clásico se adapta a cualquier vajilla.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-14 18:31:10.884951','127.0.0.1',1),(9,'Product',1,'DELETE','{\"before\": {\"id\": \"1\", \"tags\": \"[\'taza\', \'ceramica\', \'meme\', \'man face\', \'roblox face\', \'cafe\', \'te\', \'bebida\', \'humor\', \'regalo\', \'novedad\']\", \"price\": \"16.09\", \"stock\": \"9\", \"title\": \"Taza de cerámica \'Man Face\' con diseño de meme\", \"seller\": \"admin@gmail.com (Vendedor)\", \"category\": \"Modelos de IA\", \"metadata\": \"{}\", \"created_at\": \"2026-04-14 18:21:31.604483+00:00\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776190860/products/r4mf1vyq3itobojnzbzt.jpg\", \"units_sold\": \"0\", \"updated_at\": \"2026-04-14 18:29:22.681473+00:00\", \"description\": \"Disfruta de tus bebidas favoritas con esta divertida taza de cerámica blanca, decorada con el icónico \'Man Face\' del mundo de los memes. Ideal para café, té o cualquier otra bebida caliente, esta taza añade un toque de humor a tu rutina diaria. Perfecta para coleccionistas de memes o como regalo original.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-14 18:31:20.910693','127.0.0.1',1),(10,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-14 18:57:21.942318+00:00\", \"before\": \"2026-04-14 18:29:08.378986+00:00\"}}','2026-04-14 18:57:21.947164','127.0.0.1',NULL),(11,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-14 18:57:36.002460+00:00\", \"before\": \"2026-04-14 18:57:21.942318+00:00\"}}','2026-04-14 18:57:36.005702','127.0.0.1',NULL),(12,'Product',2,'UPDATE','{\"stock\": {\"after\": \"9\", \"before\": \"6\"}}','2026-04-14 18:57:40.106784','127.0.0.1',1),(13,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 07:21:46.166679+00:00\", \"before\": \"2026-04-14 18:57:36.002460+00:00\"}}','2026-04-16 07:21:46.170806','127.0.0.1',NULL),(14,'Product',2,'UPDATE','{\"stock\": {\"after\": \"11\", \"before\": \"9\"}}','2026-04-16 07:21:52.981117','127.0.0.1',1),(15,'Address',1,'CREATE','{\"after\": {\"id\": \"1\", \"city\": \"test\", \"user\": \"admin@gmail.com (Vendedor)\", \"state\": \"test\", \"street\": \"test\", \"is_default\": \"True\", \"postal_code\": \"62220\", \"street_number\": \"124\"}}','2026-04-16 07:22:33.989124','127.0.0.1',1),(16,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 08:44:47.771419+00:00\", \"before\": \"2026-04-16 07:21:46.166679+00:00\"}}','2026-04-16 08:44:47.783688','127.0.0.1',NULL),(17,'Product',3,'CREATE','{\"after\": {\"id\": \"3\", \"tags\": \"[\'taza\', \'mug\', \'cerámica\', \'man face\', \'roblox\', \'meme\', \'café\', \'té\', \'bebida\', \'regalo\', \'novedad\', \'humor\', \'blanco y negro\']\", \"price\": \"15.99\", \"stock\": \"5\", \"title\": \"Taza de Cerámica con Diseño \'Man Face\' de Meme\", \"seller\": \"admin@gmail.com (Vendedor)\", \"category\": \"Modelos de IA\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776329161/products/gbj5r5uyq3ts5ln93t1v.jpg\", \"units_sold\": \"0\", \"description\": \"Taza de cerámica blanca con un diseño gráfico minimalista de una cara sonriente y confiada, popularmente conocida como \'Man Face\' o \'Roblox Face\' en la cultura de internet. Ideal para disfrutar de café, té o cualquier bebida caliente, añadiendo un toque de humor y originalidad a tu colección de tazas o como un regalo divertido para entusiastas de memes y videojuegos.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-16 08:46:14.223899','127.0.0.1',1),(18,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 17:06:33.469335+00:00\", \"before\": \"2026-04-16 08:44:47.771419+00:00\"}}','2026-04-16 17:06:33.473133','127.0.0.1',NULL),(19,'Address',2,'CREATE','{\"after\": {\"id\": \"2\", \"city\": \"CUERNAVACA\", \"user\": \"admin@gmail.com (Vendedor)\", \"state\": \"morelos\", \"street\": \"test\", \"is_default\": \"False\", \"postal_code\": \"62220\", \"street_number\": \"321\"}}','2026-04-16 17:07:07.028247','127.0.0.1',1),(20,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 17:27:10.869442+00:00\", \"before\": \"2026-04-16 17:06:33.469335+00:00\"}}','2026-04-16 17:27:10.876034','127.0.0.1',NULL),(21,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 17:32:27.128747+00:00\", \"before\": \"2026-04-16 17:27:10.869442+00:00\"}}','2026-04-16 17:32:27.134320','127.0.0.1',NULL),(22,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 17:34:55.958352+00:00\", \"before\": \"2026-04-16 17:32:27.128747+00:00\"}}','2026-04-16 17:34:55.964517','127.0.0.1',NULL),(23,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 17:37:36.206518+00:00\", \"before\": \"2026-04-16 17:34:55.958352+00:00\"}}','2026-04-16 17:37:36.211160','127.0.0.1',NULL),(24,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 17:38:43.740947+00:00\", \"before\": \"2026-04-16 17:37:36.206518+00:00\"}}','2026-04-16 17:38:43.745464','127.0.0.1',NULL),(25,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 17:50:11.080780+00:00\", \"before\": \"2026-04-16 17:38:43.740947+00:00\"}}','2026-04-16 17:50:11.084347','127.0.0.1',NULL),(26,'Address',3,'CREATE','{\"after\": {\"id\": \"3\", \"city\": \"CUERNAVACA\", \"user\": \"admin@gmail.com (Vendedor)\", \"state\": \"morelos\", \"street\": \"test\", \"is_default\": \"False\", \"postal_code\": \"62220\", \"street_number\": \"123123\"}}','2026-04-16 17:50:20.222925','127.0.0.1',1),(27,'Product',3,'UPDATE','{\"stock\": {\"after\": \"8\", \"before\": \"5\"}}','2026-04-16 17:52:05.996720','127.0.0.1',1),(28,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 18:17:45.021625+00:00\", \"before\": \"2026-04-16 17:50:11.080780+00:00\"}}','2026-04-16 18:17:45.030335','127.0.0.1',NULL),(29,'Cart',2,'CREATE','{\"after\": {\"id\": \"2\", \"user\": \"20233tn060@utez.edu.mx (Vendedor)\"}}','2026-04-16 19:34:12.934493','127.0.0.1',NULL),(30,'CustomUser',2,'CREATE','{\"after\": {\"id\": \"2\", \"role\": \"vendor\", \"email\": \"20233tn060@utez.edu.mx\", \"phone\": null, \"is_staff\": \"False\", \"is_active\": \"True\", \"last_name\": \"Teja Carvajal\", \"avatar_url\": null, \"first_name\": \"Erick\", \"last_login\": null, \"date_joined\": \"2026-04-16 19:34:12.927024+00:00\", \"is_superuser\": \"False\"}}','2026-04-16 19:34:12.936649','127.0.0.1',NULL),(31,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 19:45:29.957286+00:00\", \"before\": \"2026-04-16 18:17:45.021625+00:00\"}}','2026-04-16 19:45:29.961680','127.0.0.1',NULL),(32,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 19:46:29.894792+00:00\", \"before\": \"2026-04-16 19:45:29.957286+00:00\"}}','2026-04-16 19:46:29.898082','127.0.0.1',NULL),(33,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 19:48:24.210281+00:00\", \"before\": \"2026-04-16 19:46:29.894792+00:00\"}}','2026-04-16 19:48:24.215645','127.0.0.1',NULL),(34,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 19:48:49.882882+00:00\", \"before\": \"2026-04-16 19:48:24.210281+00:00\"}}','2026-04-16 19:48:49.886000','127.0.0.1',NULL),(35,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 19:50:36.527741+00:00\", \"before\": \"2026-04-16 19:48:49.882882+00:00\"}}','2026-04-16 19:50:36.530633','127.0.0.1',NULL),(36,'Product',4,'CREATE','{\"after\": {\"id\": \"4\", \"tags\": \"[\'Nintendo Switch\', \'OLED\', \'Consola\', \'Videojuegos\', \'Gaming\', \'Splatoon 3\', \'Edición Especial\', \'Joy-Con\', \'Electrónica\', \'Entretenimiento\']\", \"price\": \"379.99\", \"stock\": \"4\", \"title\": \"Consola Nintendo Switch OLED Edición Splatoon 3\", \"seller\": \"admin@gmail.com (Admin)\", \"category\": \"Modelos de IA\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776383411/products/xqz56mh5q7ho6zfqbbts.jpg\", \"units_sold\": \"0\", \"description\": \"Consola Nintendo Switch modelo OLED con un diseño exclusivo inspirado en Splatoon 3. Incluye controles Joy-Con de color neón púrpura y neón verde con gráficos y detalles temáticos de Splatoon 3. Disfruta de una pantalla OLED vibrante de 7 pulgadas, base con puerto LAN, 64 GB de almacenamiento interno y audio mejorado para una experiencia de juego inmersiva en casa o mientras viajas.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-16 23:50:22.681138','127.0.0.1',1),(37,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 23:51:46.163079+00:00\", \"before\": \"2026-04-16 19:50:36.527741+00:00\"}}','2026-04-16 23:51:46.167468','127.0.0.1',NULL),(38,'Product',4,'DELETE','{\"before\": {\"id\": \"4\", \"tags\": \"[\'Nintendo Switch\', \'OLED\', \'Consola\', \'Videojuegos\', \'Gaming\', \'Splatoon 3\', \'Edición Especial\', \'Joy-Con\', \'Electrónica\', \'Entretenimiento\']\", \"price\": \"379.99\", \"stock\": \"4\", \"title\": \"Consola Nintendo Switch OLED Edición Splatoon 3\", \"seller\": \"admin@gmail.com (Admin)\", \"category\": \"Modelos de IA\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776383411/products/xqz56mh5q7ho6zfqbbts.jpg\", \"units_sold\": \"0\", \"description\": \"Consola Nintendo Switch modelo OLED con un diseño exclusivo inspirado en Splatoon 3. Incluye controles Joy-Con de color neón púrpura y neón verde con gráficos y detalles temáticos de Splatoon 3. Disfruta de una pantalla OLED vibrante de 7 pulgadas, base con puerto LAN, 64 GB de almacenamiento interno y audio mejorado para una experiencia de juego inmersiva en casa o mientras viajas.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-16 23:51:53.062584','127.0.0.1',1),(39,'Product',5,'CREATE','{\"after\": {\"id\": \"5\", \"tags\": \"[\'Nintendo Switch\', \'OLED\', \'Splatoon 3\', \'Consola de videojuegos\', \'Edición Especial\', \'Gaming\', \'Electrónica\', \'Entretenimiento\', \'Joy-Con\']\", \"price\": \"8499.00\", \"stock\": \"3\", \"title\": \"Consola Nintendo Switch OLED Modelo Splatoon 3 Edición Especial\", \"seller\": \"admin@gmail.com (Admin)\", \"category\": \"Electrónica\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776383532/products/rkjojj9uo2vk4sifdpr4.jpg\", \"units_sold\": \"0\", \"description\": \"Una edición especial de la consola Nintendo Switch OLED, con un diseño inspirado en Splatoon 3. Incluye Joy-Cons temáticos en colores neón morado y verde con gráficos únicos, una base blanca con detalles de grafiti y la consola con la parte posterior decorada. Cuenta con una vibrante pantalla OLED de 7 pulgadas, un soporte ajustable amplio, base con puerto LAN por cable, 64 GB de almacenamiento interno y audio mejorado, ideal para disfrutar de tus juegos favoritos en casa o en movimiento.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-16 23:52:21.693746','127.0.0.1',1),(40,'Cart',3,'CREATE','{\"after\": {\"id\": \"3\", \"user\": \"erickhumbertotc@gmail.com (Vendedor)\"}}','2026-04-16 23:53:37.965763','127.0.0.1',1),(41,'CustomUser',3,'CREATE','{\"after\": {\"id\": \"3\", \"role\": \"vendor\", \"email\": \"erickhumbertotc@gmail.com\", \"phone\": null, \"is_staff\": \"False\", \"is_active\": \"True\", \"last_name\": \"Teja Carvajal\", \"avatar_url\": null, \"first_name\": \"Erick\", \"last_login\": null, \"date_joined\": \"2026-04-16 23:53:37.959970+00:00\", \"is_superuser\": \"False\"}}','2026-04-16 23:53:37.968600','127.0.0.1',1),(42,'CustomUser',3,'UPDATE','{\"last_login\": {\"after\": \"2026-04-16 23:54:47.457796+00:00\", \"before\": null}}','2026-04-16 23:54:47.460758','127.0.0.1',NULL),(43,'CartItem',1,'CREATE','{\"after\": {\"id\": \"1\", \"cart\": \"Carrito de erickhumbertotc@gmail.com\", \"product\": \"Consola Nintendo Switch OLED Modelo Splatoon 3 Edición Especial - Stock: 3\", \"quantity\": \"3\"}}','2026-04-16 23:54:53.566360','127.0.0.1',3),(44,'Address',4,'CREATE','{\"after\": {\"id\": \"4\", \"city\": \"CUERNAVACA\", \"user\": \"erickhumbertotc@gmail.com (Vendedor)\", \"state\": \"morelos\", \"street\": \"test\", \"is_default\": \"True\", \"postal_code\": \"62220\", \"street_number\": \"123123\"}}','2026-04-16 23:55:11.967608','127.0.0.1',3),(45,'Order',1,'CREATE','{\"after\": {\"id\": \"1\", \"user\": \"erickhumbertotc@gmail.com (Vendedor)\", \"total\": \"25497.00\", \"status\": \"completed\", \"order_number\": \"9B7EB7AB7E794EE2\", \"address_snapshot\": \"{\'street\': \'test\', \'street_number\': \'123123\', \'city\': \'CUERNAVACA\', \'state\': \'morelos\', \'postal_code\': \'62220\'}\"}}','2026-04-16 23:55:18.262210','127.0.0.1',3),(46,'OrderItem',1,'CREATE','{\"after\": {\"id\": \"1\", \"order\": \"Pedido 9B7EB7AB7E794EE2 - erickhumbertotc@gmail.com\", \"product\": \"Consola Nintendo Switch OLED Modelo Splatoon 3 Edición Especial - Stock: 3\", \"quantity\": \"3\", \"unit_price\": \"8499.00\", \"product_snapshot\": \"{\'title\': \'Consola Nintendo Switch OLED Modelo Splatoon 3 Edición Especial\', \'price\': \'8499.00\'}\"}}','2026-04-16 23:55:18.320648','127.0.0.1',3),(47,'Product',5,'UPDATE','{\"stock\": {\"after\": \"0\", \"before\": \"3\"}, \"units_sold\": {\"after\": \"3\", \"before\": \"0\"}}','2026-04-16 23:55:18.326612','127.0.0.1',3),(48,'CartItem',1,'DELETE','{\"before\": {\"id\": \"1\", \"cart\": \"Carrito de erickhumbertotc@gmail.com\", \"product\": \"Consola Nintendo Switch OLED Modelo Splatoon 3 Edición Especial - Stock: 0\", \"quantity\": \"3\"}}','2026-04-16 23:55:18.330027','127.0.0.1',3),(49,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-17 00:29:11.560160+00:00\", \"before\": \"2026-04-16 23:51:46.163079+00:00\"}}','2026-04-17 00:29:11.563107','127.0.0.1',NULL),(50,'Product',5,'DELETE','{\"before\": {\"id\": \"5\", \"tags\": \"[\'Nintendo Switch\', \'OLED\', \'Splatoon 3\', \'Consola de videojuegos\', \'Edición Especial\', \'Gaming\', \'Electrónica\', \'Entretenimiento\', \'Joy-Con\']\", \"price\": \"8499.00\", \"stock\": \"0\", \"title\": \"Consola Nintendo Switch OLED Modelo Splatoon 3 Edición Especial\", \"seller\": \"admin@gmail.com (Admin)\", \"category\": \"Electrónica\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776383532/products/rkjojj9uo2vk4sifdpr4.jpg\", \"units_sold\": \"3\", \"description\": \"Una edición especial de la consola Nintendo Switch OLED, con un diseño inspirado en Splatoon 3. Incluye Joy-Cons temáticos en colores neón morado y verde con gráficos únicos, una base blanca con detalles de grafiti y la consola con la parte posterior decorada. Cuenta con una vibrante pantalla OLED de 7 pulgadas, un soporte ajustable amplio, base con puerto LAN por cable, 64 GB de almacenamiento interno y audio mejorado, ideal para disfrutar de tus juegos favoritos en casa o en movimiento.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-17 00:29:45.651604','127.0.0.1',1),(51,'Product',6,'CREATE','{\"after\": {\"id\": \"6\", \"tags\": \"[\'Nintendo Switch\', \'OLED\', \'Consola de videojuegos\', \'Splatoon 3\', \'Edición especial\', \'Joy-Con\', \'Gaming\', \'Videojuegos\', \'Entretenimiento\', \'Consola\']\", \"price\": \"0.02\", \"stock\": \"3\", \"title\": \"Consola Nintendo Switch Modelo OLED Edición Especial Splatoon 3\", \"seller\": \"admin@gmail.com (Admin)\", \"category\": \"Electrónica\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776385837/products/zgujlbigtmpea3buse2u.jpg\", \"units_sold\": \"0\", \"description\": \"Consola Nintendo Switch Modelo OLED edición especial de Splatoon 3, con un vibrante diseño inspirado en el juego. Incluye Joy-Cons temáticos en tonos morado degradado y verde neón con patrones de Splatoon, una estación de acoplamiento blanca con grafitis de Splatoon y la pantalla OLED de 7 pulgadas que ofrece colores intensos y contrastes nítidos. Ideal para jugar en casa o en movimiento.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-17 00:32:24.875710','127.0.0.1',1),(52,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-17 00:43:11.288358+00:00\", \"before\": \"2026-04-17 00:29:11.560160+00:00\"}}','2026-04-17 00:43:11.292157','127.0.0.1',NULL),(53,'Address',5,'CREATE','{\"after\": {\"id\": \"5\", \"city\": \"CUERNAVACA\", \"user\": \"admin@gmail.com (Admin)\", \"state\": \"morelos\", \"street\": \"test\", \"is_default\": \"False\", \"postal_code\": \"62220\", \"street_number\": \"123123\"}}','2026-04-17 00:43:31.829497','127.0.0.1',1),(54,'Cart',4,'CREATE','{\"after\": {\"id\": \"4\", \"user\": \"admin1@gmail.com (Vendedor)\"}}','2026-04-18 02:02:46.073557','127.0.0.1',NULL),(55,'CustomUser',4,'CREATE','{\"after\": {\"id\": \"4\", \"role\": \"vendor\", \"email\": \"admin1@gmail.com\", \"phone\": null, \"is_staff\": \"False\", \"is_active\": \"True\", \"last_name\": \"Teja Carvajal\", \"avatar_url\": null, \"first_name\": \"Erick\", \"last_login\": null, \"date_joined\": \"2026-04-18 02:02:46.064080+00:00\", \"is_superuser\": \"False\"}}','2026-04-18 02:02:46.076931','127.0.0.1',NULL),(56,'Product',7,'CREATE','{\"after\": {\"id\": \"7\", \"tags\": \"[\'sombrero\', \'paja\', \'canotier\', \'rojo\', \'verano\', \'playa\', \'moda\', \'accesorio\', \'sol\', \'clásico\']\", \"price\": \"280.00\", \"stock\": \"4\", \"title\": \"Sombrero Canotier de Paja Clásico con Cinta Roja\", \"seller\": \"admin1@gmail.com (Vendedor)\", \"category\": \"Ropa y Moda\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776477895/products/sotlmgeawxovv2wyhubm.jpg\", \"units_sold\": \"0\", \"description\": \"Sombrero tipo canotier fabricado en paja natural, ideal para protegerte del sol con estilo. Cuenta con una banda decorativa de color rojo que le añade un toque clásico y vibrante. Perfecto para eventos al aire libre, paseos de verano, playa o como accesorio de moda.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-18 02:05:00.245332','127.0.0.1',4),(57,'Product',8,'CREATE','{\"after\": {\"id\": \"8\", \"tags\": \"[\'pastel\', \'tarta\', \'cumpleaños\', \'celebración\', \'fiesta\', \'velas\', \'postre\', \'dulce\', \'repostería\', \'blanco\', \'decoración\']\", \"price\": \"550.00\", \"stock\": \"3\", \"title\": \"Pastel de Cumpleaños Blanco con Velas \'Happy Birthday\'\", \"seller\": \"admin1@gmail.com (Vendedor)\", \"category\": \"Alimentos y Bebidas\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776477913/products/f5xw2nwbn9ppjvkwjmkp.jpg\", \"units_sold\": \"0\", \"description\": \"Elegante pastel de cumpleaños con cubierta de glaseado blanco, decorado con velas coloridas que forman la frase \'HAPPY BIRTHDAY\' encendidas. Ideal para celebrar ocasiones especiales, este pastel es un delicioso centro de mesa para cualquier fiesta de cumpleaños. Presentado sobre un soporte de vidrio con chispas de colores esparcidas alrededor.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-18 02:05:16.599062','127.0.0.1',4),(58,'Product',9,'CREATE','{\"after\": {\"id\": \"9\", \"tags\": \"[\'Nikon\', \'D3400\', \'DSLR\', \'cámara digital\', \'fotografía\', \'lente 18-55mm\', \'Nikkor\', \'Electrónica\', \'Reflex\', \'SnapBridge\', \'Full HD\', \'kit de cámara\']\", \"price\": \"8500.00\", \"stock\": \"8\", \"title\": \"Cámara Réflex Digital Nikon D3400 con Lente AF-P DX NIKKOR 18-55mm f/3.5-5.6G VR\", \"seller\": \"admin1@gmail.com (Vendedor)\", \"category\": \"Electrónica\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776477934/products/be5hod5gdh3c4nqkogzz.png\", \"units_sold\": \"0\", \"description\": \"Cámara réflex digital (DSLR) Nikon D3400, ideal para principiantes y entusiastas de la fotografía. Cuenta con un sensor CMOS de formato DX de 24.2 megapíxeles, capacidad de grabación de video Full HD 1080p y conectividad Bluetooth SnapBridge para compartir imágenes fácilmente. Incluye el versátil lente kit AF-P DX NIKKOR 18-55mm f/3.5-5.6G VR con estabilización de imagen, perfecto para una amplia gama de situaciones fotográficas.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-18 02:05:39.503269','127.0.0.1',4),(59,'Product',8,'UPDATE','{\"stock\": {\"after\": \"5\", \"before\": \"3\"}}','2026-04-18 02:05:46.652928','127.0.0.1',4),(60,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-18 02:05:51.811798+00:00\", \"before\": \"2026-04-17 00:43:11.288358+00:00\"}}','2026-04-18 02:05:51.815297','127.0.0.1',NULL),(61,'CartItem',2,'CREATE','{\"after\": {\"id\": \"2\", \"cart\": \"Carrito de admin@gmail.com\", \"product\": \"Sombrero Canotier de Paja Clásico con Cinta Roja - Stock: 4\", \"quantity\": \"1\"}}','2026-04-18 02:05:56.063167','127.0.0.1',1),(62,'CartItem',2,'UPDATE','{\"quantity\": {\"after\": \"3\", \"before\": \"1\"}}','2026-04-18 02:05:59.671795','127.0.0.1',1),(63,'Order',2,'CREATE','{\"after\": {\"id\": \"2\", \"user\": \"admin@gmail.com (Admin)\", \"total\": \"840.00\", \"status\": \"completed\", \"order_number\": \"40369ED1F48E4C9B\", \"address_snapshot\": \"{\'street\': \'test\', \'street_number\': \'124\', \'city\': \'test\', \'state\': \'test\', \'postal_code\': \'62220\'}\"}}','2026-04-18 02:06:06.753107','127.0.0.1',1),(64,'OrderItem',2,'CREATE','{\"after\": {\"id\": \"2\", \"order\": \"Pedido 40369ED1F48E4C9B - admin@gmail.com\", \"product\": \"Sombrero Canotier de Paja Clásico con Cinta Roja - Stock: 4\", \"quantity\": \"3\", \"unit_price\": \"280.00\", \"product_snapshot\": \"{\'title\': \'Sombrero Canotier de Paja Clásico con Cinta Roja\', \'price\': \'280.00\'}\"}}','2026-04-18 02:06:06.755019','127.0.0.1',1),(65,'Product',7,'UPDATE','{\"stock\": {\"after\": \"1\", \"before\": \"4\"}, \"units_sold\": {\"after\": \"3\", \"before\": \"0\"}}','2026-04-18 02:06:06.760189','127.0.0.1',1),(66,'CartItem',2,'DELETE','{\"before\": {\"id\": \"2\", \"cart\": \"Carrito de admin@gmail.com\", \"product\": \"Sombrero Canotier de Paja Clásico con Cinta Roja - Stock: 1\", \"quantity\": \"3\"}}','2026-04-18 02:06:06.763057','127.0.0.1',1),(67,'CartItem',3,'CREATE','{\"after\": {\"id\": \"3\", \"cart\": \"Carrito de admin1@gmail.com\", \"product\": \"Taza de Cerámica con Diseño \'Man Face\' de Meme - Stock: 8\", \"quantity\": \"3\"}}','2026-04-18 02:06:33.575796','127.0.0.1',4),(68,'Product',10,'CREATE','{\"after\": {\"id\": \"10\", \"tags\": \"[\'florero\', \'madera\', \'artesanal\', \'decoración\', \'hogar\', \'jarrón\', \'rústico\', \'natural\', \'accesorio\', \'diseño\']\", \"price\": \"380.00\", \"stock\": \"4\", \"title\": \"Florero de Madera Artesanal / Jarrón Decorativo Rústico\", \"seller\": \"admin@gmail.com (Admin)\", \"category\": \"Hogar y Jardín\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776477991/products/ic0oozoqgndownirhuij.jpg\", \"units_sold\": \"0\", \"description\": \"Este elegante florero de madera, con un diseño clásico y curvilíneo, es ideal para realzar la decoración de cualquier espacio. Fabricado artesanalmente, exhibe un veteado natural y un acabado pulido que resalta la belleza de la madera. Perfecto para flores secas, arreglos artificiales o como pieza decorativa central por sí misma, aportando un toque rústico y sofisticado a tu hogar u oficina.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-18 02:06:38.165918','127.0.0.1',1),(69,'Address',6,'CREATE','{\"after\": {\"id\": \"6\", \"city\": \"CUERNAVACA\", \"user\": \"admin1@gmail.com (Vendedor)\", \"state\": \"morelos\", \"street\": \"test\", \"is_default\": \"True\", \"postal_code\": \"62220\", \"street_number\": \"123123\"}}','2026-04-18 02:06:50.612732','127.0.0.1',4),(70,'Order',3,'CREATE','{\"after\": {\"id\": \"3\", \"user\": \"admin1@gmail.com (Vendedor)\", \"total\": \"47.97\", \"status\": \"completed\", \"order_number\": \"FCA3010702174D95\", \"address_snapshot\": \"{\'street\': \'test\', \'street_number\': \'123123\', \'city\': \'CUERNAVACA\', \'state\': \'morelos\', \'postal_code\': \'62220\'}\"}}','2026-04-18 02:06:54.539469','127.0.0.1',4),(71,'OrderItem',3,'CREATE','{\"after\": {\"id\": \"3\", \"order\": \"Pedido FCA3010702174D95 - admin1@gmail.com\", \"product\": \"Taza de Cerámica con Diseño \'Man Face\' de Meme - Stock: 8\", \"quantity\": \"3\", \"unit_price\": \"15.99\", \"product_snapshot\": \"{\'title\': \\\"Taza de Cerámica con Diseño \'Man Face\' de Meme\\\", \'price\': \'15.99\'}\"}}','2026-04-18 02:06:54.541685','127.0.0.1',4),(72,'Product',3,'UPDATE','{\"stock\": {\"after\": \"5\", \"before\": \"8\"}, \"units_sold\": {\"after\": \"3\", \"before\": \"0\"}}','2026-04-18 02:06:54.546261','127.0.0.1',4),(73,'CartItem',3,'DELETE','{\"before\": {\"id\": \"3\", \"cart\": \"Carrito de admin1@gmail.com\", \"product\": \"Taza de Cerámica con Diseño \'Man Face\' de Meme - Stock: 5\", \"quantity\": \"3\"}}','2026-04-18 02:06:54.549874','127.0.0.1',4),(74,'CartItem',4,'CREATE','{\"after\": {\"id\": \"4\", \"cart\": \"Carrito de admin1@gmail.com\", \"product\": \"Cuchara de Acero Inoxidable Brillante - Stock: 11\", \"quantity\": \"2\"}}','2026-04-18 02:07:09.463641','127.0.0.1',4),(75,'CartItem',5,'CREATE','{\"after\": {\"id\": \"5\", \"cart\": \"Carrito de admin@gmail.com\", \"product\": \"Cámara Réflex Digital Nikon D3400 con Lente AF-P DX NIKKOR 18-55mm f/3.5-5.6G VR - Stock: 8\", \"quantity\": \"1\"}}','2026-04-18 02:07:16.778066','127.0.0.1',1),(76,'Order',4,'CREATE','{\"after\": {\"id\": \"4\", \"user\": \"admin1@gmail.com (Vendedor)\", \"total\": \"5.00\", \"status\": \"completed\", \"order_number\": \"564C6619DF1041F9\", \"address_snapshot\": \"{\'street\': \'test\', \'street_number\': \'123123\', \'city\': \'CUERNAVACA\', \'state\': \'morelos\', \'postal_code\': \'62220\'}\"}}','2026-04-18 02:07:19.996299','127.0.0.1',4),(77,'OrderItem',4,'CREATE','{\"after\": {\"id\": \"4\", \"order\": \"Pedido 564C6619DF1041F9 - admin1@gmail.com\", \"product\": \"Cuchara de Acero Inoxidable Brillante - Stock: 11\", \"quantity\": \"2\", \"unit_price\": \"2.50\", \"product_snapshot\": \"{\'title\': \'Cuchara de Acero Inoxidable Brillante\', \'price\': \'2.50\'}\"}}','2026-04-18 02:07:19.998322','127.0.0.1',4),(78,'Product',2,'UPDATE','{\"stock\": {\"after\": \"9\", \"before\": \"11\"}, \"units_sold\": {\"after\": \"2\", \"before\": \"0\"}}','2026-04-18 02:07:20.005000','127.0.0.1',4),(79,'CartItem',4,'DELETE','{\"before\": {\"id\": \"4\", \"cart\": \"Carrito de admin1@gmail.com\", \"product\": \"Cuchara de Acero Inoxidable Brillante - Stock: 9\", \"quantity\": \"2\"}}','2026-04-18 02:07:20.009782','127.0.0.1',4),(80,'Order',5,'CREATE','{\"after\": {\"id\": \"5\", \"user\": \"admin@gmail.com (Admin)\", \"total\": \"8500.00\", \"status\": \"completed\", \"order_number\": \"CBE6908D7C724A10\", \"address_snapshot\": \"{\'street\': \'test\', \'street_number\': \'124\', \'city\': \'test\', \'state\': \'test\', \'postal_code\': \'62220\'}\"}}','2026-04-18 02:07:20.667343','127.0.0.1',1),(81,'OrderItem',5,'CREATE','{\"after\": {\"id\": \"5\", \"order\": \"Pedido CBE6908D7C724A10 - admin@gmail.com\", \"product\": \"Cámara Réflex Digital Nikon D3400 con Lente AF-P DX NIKKOR 18-55mm f/3.5-5.6G VR - Stock: 8\", \"quantity\": \"1\", \"unit_price\": \"8500.00\", \"product_snapshot\": \"{\'title\': \'Cámara Réflex Digital Nikon D3400 con Lente AF-P DX NIKKOR 18-55mm f/3.5-5.6G VR\', \'price\': \'8500.00\'}\"}}','2026-04-18 02:07:20.669600','127.0.0.1',1),(82,'Product',9,'UPDATE','{\"stock\": {\"after\": \"7\", \"before\": \"8\"}, \"units_sold\": {\"after\": \"1\", \"before\": \"0\"}}','2026-04-18 02:07:20.675261','127.0.0.1',1),(83,'CartItem',5,'DELETE','{\"before\": {\"id\": \"5\", \"cart\": \"Carrito de admin@gmail.com\", \"product\": \"Cámara Réflex Digital Nikon D3400 con Lente AF-P DX NIKKOR 18-55mm f/3.5-5.6G VR - Stock: 7\", \"quantity\": \"1\"}}','2026-04-18 02:07:20.680276','127.0.0.1',1),(84,'CustomUser',4,'UPDATE','{\"last_login\": {\"after\": \"2026-04-18 02:07:49.003125+00:00\", \"before\": null}}','2026-04-18 02:07:49.007579','127.0.0.1',NULL),(85,'Product',10,'UPDATE','{\"stock\": {\"after\": \"7\", \"before\": \"4\"}}','2026-04-18 02:08:00.683106','127.0.0.1',1),(86,'Product',11,'CREATE','{\"after\": {\"id\": \"11\", \"tags\": \"[\'smartphone\', \'celular\', \'móvil\', \'OnePlus\', \'Nord\', \'Android\', \'electrónica\', \'teléfono\', \'cámara\', \'pantalla\', \'gadgets\']\", \"price\": \"3999.00\", \"stock\": \"6\", \"title\": \"Smartphone OnePlus Nord\", \"seller\": \"admin1@gmail.com (Vendedor)\", \"category\": \"Electrónica\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776478078/products/utyezvwbv0rwhc7bs89b.jpg\", \"units_sold\": \"0\", \"description\": \"Un smartphone moderno de la marca OnePlus con un diseño elegante en color oscuro, pantalla amplia con el lema distintivo \'Never Settle\', y un sistema de doble cámara trasera. Ideal para comunicación, entretenimiento, navegación y fotografía diaria, ofreciendo una experiencia de usuario fluida y confiable.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-18 02:08:07.101574','127.0.0.1',4),(87,'CartItem',6,'CREATE','{\"after\": {\"id\": \"6\", \"cart\": \"Carrito de admin1@gmail.com\", \"product\": \"Consola Nintendo Switch Modelo OLED Edición Especial Splatoon 3 - Stock: 3\", \"quantity\": \"3\"}}','2026-04-18 02:08:12.678982','127.0.0.1',4),(88,'Order',6,'CREATE','{\"after\": {\"id\": \"6\", \"user\": \"admin1@gmail.com (Vendedor)\", \"total\": \"0.06\", \"status\": \"completed\", \"order_number\": \"CBD6E20C3D7E4047\", \"address_snapshot\": \"{\'street\': \'test\', \'street_number\': \'123123\', \'city\': \'CUERNAVACA\', \'state\': \'morelos\', \'postal_code\': \'62220\'}\"}}','2026-04-18 02:08:14.627663','127.0.0.1',4),(89,'OrderItem',6,'CREATE','{\"after\": {\"id\": \"6\", \"order\": \"Pedido CBD6E20C3D7E4047 - admin1@gmail.com\", \"product\": \"Consola Nintendo Switch Modelo OLED Edición Especial Splatoon 3 - Stock: 3\", \"quantity\": \"3\", \"unit_price\": \"0.02\", \"product_snapshot\": \"{\'title\': \'Consola Nintendo Switch Modelo OLED Edición Especial Splatoon 3\', \'price\': \'0.02\'}\"}}','2026-04-18 02:08:14.629254','127.0.0.1',4),(90,'Product',6,'UPDATE','{\"stock\": {\"after\": \"0\", \"before\": \"3\"}, \"units_sold\": {\"after\": \"3\", \"before\": \"0\"}}','2026-04-18 02:08:14.634202','127.0.0.1',4),(91,'CartItem',6,'DELETE','{\"before\": {\"id\": \"6\", \"cart\": \"Carrito de admin1@gmail.com\", \"product\": \"Consola Nintendo Switch Modelo OLED Edición Especial Splatoon 3 - Stock: 0\", \"quantity\": \"3\"}}','2026-04-18 02:08:14.638588','127.0.0.1',4),(92,'Product',6,'DELETE','{\"before\": {\"id\": \"6\", \"tags\": \"[\'Nintendo Switch\', \'OLED\', \'Consola de videojuegos\', \'Splatoon 3\', \'Edición especial\', \'Joy-Con\', \'Gaming\', \'Videojuegos\', \'Entretenimiento\', \'Consola\']\", \"price\": \"0.02\", \"stock\": \"0\", \"title\": \"Consola Nintendo Switch Modelo OLED Edición Especial Splatoon 3\", \"seller\": \"admin@gmail.com (Admin)\", \"category\": \"Electrónica\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776385837/products/zgujlbigtmpea3buse2u.jpg\", \"units_sold\": \"3\", \"description\": \"Consola Nintendo Switch Modelo OLED edición especial de Splatoon 3, con un vibrante diseño inspirado en el juego. Incluye Joy-Cons temáticos en tonos morado degradado y verde neón con patrones de Splatoon, una estación de acoplamiento blanca con grafitis de Splatoon y la pantalla OLED de 7 pulgadas que ofrece colores intensos y contrastes nítidos. Ideal para jugar en casa o en movimiento.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-18 02:08:21.867670','127.0.0.1',1),(93,'CartItem',7,'CREATE','{\"after\": {\"id\": \"7\", \"cart\": \"Carrito de admin@gmail.com\", \"product\": \"Smartphone OnePlus Nord - Stock: 6\", \"quantity\": \"1\"}}','2026-04-18 02:08:28.712606','127.0.0.1',1),(94,'CartItem',7,'UPDATE','{\"quantity\": {\"after\": \"2\", \"before\": \"1\"}}','2026-04-18 02:08:30.442233','127.0.0.1',1),(95,'Order',7,'CREATE','{\"after\": {\"id\": \"7\", \"user\": \"admin@gmail.com (Admin)\", \"total\": \"7998.00\", \"status\": \"completed\", \"order_number\": \"E04586E3E5B240DC\", \"address_snapshot\": \"{\'street\': \'test\', \'street_number\': \'124\', \'city\': \'test\', \'state\': \'test\', \'postal_code\': \'62220\'}\"}}','2026-04-18 02:08:32.479584','127.0.0.1',1),(96,'OrderItem',7,'CREATE','{\"after\": {\"id\": \"7\", \"order\": \"Pedido E04586E3E5B240DC - admin@gmail.com\", \"product\": \"Smartphone OnePlus Nord - Stock: 6\", \"quantity\": \"2\", \"unit_price\": \"3999.00\", \"product_snapshot\": \"{\'title\': \'Smartphone OnePlus Nord\', \'price\': \'3999.00\'}\"}}','2026-04-18 02:08:32.481968','127.0.0.1',1),(97,'Product',11,'UPDATE','{\"stock\": {\"after\": \"4\", \"before\": \"6\"}, \"units_sold\": {\"after\": \"2\", \"before\": \"0\"}}','2026-04-18 02:08:32.487990','127.0.0.1',1),(98,'CartItem',7,'DELETE','{\"before\": {\"id\": \"7\", \"cart\": \"Carrito de admin@gmail.com\", \"product\": \"Smartphone OnePlus Nord - Stock: 4\", \"quantity\": \"2\"}}','2026-04-18 02:08:32.491675','127.0.0.1',1),(99,'CartItem',8,'CREATE','{\"after\": {\"id\": \"8\", \"cart\": \"Carrito de admin1@gmail.com\", \"product\": \"Taza de Cerámica con Diseño \'Man Face\' de Meme - Stock: 5\", \"quantity\": \"1\"}}','2026-04-18 02:08:41.627795','127.0.0.1',4),(100,'CartItem',8,'UPDATE','{\"quantity\": {\"after\": \"2\", \"before\": \"1\"}}','2026-04-18 02:08:43.466690','127.0.0.1',4),(101,'CartItem',9,'CREATE','{\"after\": {\"id\": \"9\", \"cart\": \"Carrito de admin1@gmail.com\", \"product\": \"Cuchara de Acero Inoxidable Brillante - Stock: 9\", \"quantity\": \"4\"}}','2026-04-18 02:08:51.585126','127.0.0.1',4),(102,'Order',8,'CREATE','{\"after\": {\"id\": \"8\", \"user\": \"admin1@gmail.com (Vendedor)\", \"total\": \"41.98\", \"status\": \"completed\", \"order_number\": \"ABB70C48A1684C55\", \"address_snapshot\": \"{\'street\': \'test\', \'street_number\': \'123123\', \'city\': \'CUERNAVACA\', \'state\': \'morelos\', \'postal_code\': \'62220\'}\"}}','2026-04-18 02:08:57.141338','127.0.0.1',4),(103,'OrderItem',8,'CREATE','{\"after\": {\"id\": \"8\", \"order\": \"Pedido ABB70C48A1684C55 - admin1@gmail.com\", \"product\": \"Cuchara de Acero Inoxidable Brillante - Stock: 9\", \"quantity\": \"4\", \"unit_price\": \"2.50\", \"product_snapshot\": \"{\'title\': \'Cuchara de Acero Inoxidable Brillante\', \'price\': \'2.50\'}\"}}','2026-04-18 02:08:57.143041','127.0.0.1',4),(104,'Product',2,'UPDATE','{\"stock\": {\"after\": \"5\", \"before\": \"9\"}, \"units_sold\": {\"after\": \"6\", \"before\": \"2\"}}','2026-04-18 02:08:57.148404','127.0.0.1',4),(105,'OrderItem',9,'CREATE','{\"after\": {\"id\": \"9\", \"order\": \"Pedido ABB70C48A1684C55 - admin1@gmail.com\", \"product\": \"Taza de Cerámica con Diseño \'Man Face\' de Meme - Stock: 5\", \"quantity\": \"2\", \"unit_price\": \"15.99\", \"product_snapshot\": \"{\'title\': \\\"Taza de Cerámica con Diseño \'Man Face\' de Meme\\\", \'price\': \'15.99\'}\"}}','2026-04-18 02:08:57.150181','127.0.0.1',4),(106,'Product',3,'UPDATE','{\"stock\": {\"after\": \"3\", \"before\": \"5\"}, \"units_sold\": {\"after\": \"5\", \"before\": \"3\"}}','2026-04-18 02:08:57.155419','127.0.0.1',4),(107,'CartItem',9,'DELETE','{\"before\": {\"id\": \"9\", \"cart\": \"Carrito de admin1@gmail.com\", \"product\": \"Cuchara de Acero Inoxidable Brillante - Stock: 5\", \"quantity\": \"4\"}}','2026-04-18 02:08:57.158990','127.0.0.1',4),(108,'CartItem',8,'DELETE','{\"before\": {\"id\": \"8\", \"cart\": \"Carrito de admin1@gmail.com\", \"product\": \"Taza de Cerámica con Diseño \'Man Face\' de Meme - Stock: 3\", \"quantity\": \"2\"}}','2026-04-18 02:08:57.160776','127.0.0.1',4),(109,'Address',5,'DELETE','{\"before\": {\"id\": \"5\", \"city\": \"CUERNAVACA\", \"user\": \"admin@gmail.com (Admin)\", \"state\": \"morelos\", \"street\": \"test\", \"is_default\": \"False\", \"postal_code\": \"62220\", \"street_number\": \"123123\"}}','2026-04-18 02:09:11.949350','127.0.0.1',1),(110,'Address',3,'DELETE','{\"before\": {\"id\": \"3\", \"city\": \"CUERNAVACA\", \"user\": \"admin@gmail.com (Admin)\", \"state\": \"morelos\", \"street\": \"test\", \"is_default\": \"False\", \"postal_code\": \"62220\", \"street_number\": \"123123\"}}','2026-04-18 02:09:16.337064','127.0.0.1',1),(111,'Product',12,'CREATE','{\"after\": {\"id\": \"12\", \"tags\": \"[\'caligrafía china\', \'pinceles caligrafía\', \'arte asiático\', \'sumi-e\', \'material de arte\', \'escritura\', \'cultura oriental\', \'decoración de escritorio\', \'manualidades\', \'soporte de pinceles\']\", \"price\": \"750.00\", \"stock\": \"3\", \"title\": \"Juego de Caligrafía China Tradicional con Soporte y Pinceles\", \"seller\": \"admin1@gmail.com (Vendedor)\", \"category\": \"Arte y Manualidades\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776707494/products/fiktodhjnfe98wgchyer.jpg\", \"units_sold\": \"0\", \"description\": \"Elegante juego de caligrafía china compuesto por un soporte de madera oscura o lacada con detalles ornamentales y una selección de varios pinceles (o \'mofudos\') de diferentes tamaños y tipos de cerdas. Este conjunto es ideal para estudiantes y entusiastas de la caligrafía, la pintura Sumi-e o el arte tradicional asiático. El soporte permite organizar y secar los pinceles de manera adecuada, prolongando su vida útil. Los pinceles presentan mangos de bambú o madera, algunos con inscripciones. Es una pieza funcional y decorativa para cualquier escritorio o estudio.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-20 17:51:52.297767','127.0.0.1',4),(112,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-20 17:59:42.835531+00:00\", \"before\": \"2026-04-18 02:05:51.811798+00:00\"}}','2026-04-20 17:59:42.840002','127.0.0.1',NULL),(113,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-20 18:06:46.222365+00:00\", \"before\": \"2026-04-20 17:59:42.835531+00:00\"}}','2026-04-20 18:06:46.226969','127.0.0.1',NULL),(114,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-20 18:10:26.345694+00:00\", \"before\": \"2026-04-20 18:06:46.222365+00:00\"}}','2026-04-20 18:10:26.348704','127.0.0.1',NULL),(115,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-20 18:12:22.768085+00:00\", \"before\": \"2026-04-20 18:10:26.345694+00:00\"}}','2026-04-20 18:12:22.772324','127.0.0.1',NULL),(116,'Address',7,'CREATE','{\"after\": {\"id\": \"7\", \"city\": \"CUERNAVACA\", \"user\": \"admin@gmail.com (Admin)\", \"state\": \"morelos\", \"street\": \"test\", \"is_default\": \"False\", \"postal_code\": \"62220\", \"street_number\": \"123123\"}}','2026-04-20 18:14:51.668999','127.0.0.1',1),(117,'CartItem',10,'CREATE','{\"after\": {\"id\": \"10\", \"cart\": \"Carrito de admin@gmail.com\", \"product\": \"Smartphone OnePlus Nord - Stock: 4\", \"quantity\": \"1\"}}','2026-04-20 18:15:27.821827','127.0.0.1',1),(118,'Product',10,'UPDATE','{\"stock\": {\"after\": \"9\", \"before\": \"7\"}}','2026-04-20 18:17:02.588243','127.0.0.1',1),(119,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-20 18:19:28.240089+00:00\", \"before\": \"2026-04-20 18:12:22.768085+00:00\"}}','2026-04-20 18:19:28.244399','127.0.0.1',NULL),(120,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-20 18:37:40.825178+00:00\", \"before\": \"2026-04-20 18:19:28.240089+00:00\"}}','2026-04-20 18:37:40.829122','127.0.0.1',NULL),(121,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-20 18:37:51.731567+00:00\", \"before\": \"2026-04-20 18:37:40.825178+00:00\"}}','2026-04-20 18:37:51.736369','127.0.0.1',NULL),(122,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-20 18:51:30.096843+00:00\", \"before\": \"2026-04-20 18:37:51.731567+00:00\"}}','2026-04-20 18:51:30.100791','127.0.0.1',NULL),(123,'Product',12,'DELETE','{\"before\": {\"id\": 12, \"tags\": [\"caligrafía china\", \"pinceles caligrafía\", \"arte asiático\", \"sumi-e\", \"material de arte\", \"escritura\", \"cultura oriental\", \"decoración de escritorio\", \"manualidades\", \"soporte de pinceles\"], \"price\": 750.00, \"stock\": 3, \"title\": \"Juego de Caligrafía China Tradicional con Soporte y Pinceles\", \"category\": \"Arte y Manualidades\", \"metadata\": {}, \"seller_id\": 4, \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776707494/products/fiktodhjnfe98wgchyer.jpg\", \"units_sold\": 0, \"description\": \"Elegante juego de caligrafía china compuesto por un soporte de madera oscura o lacada con detalles ornamentales y una selección de varios pinceles (o \'mofudos\') de diferentes tamaños y tipos de cerdas. Este conjunto es ideal para estudiantes y entusiastas de la caligrafía, la pintura Sumi-e o el arte tradicional asiático. El soporte permite organizar y secar los pinceles de manera adecuada, prolongando su vida útil. Los pinceles presentan mangos de bambú o madera, algunos con inscripciones. Es una pieza funcional y decorativa para cualquier escritorio o estudio.\", \"edit_allowed\": 0, \"additional_images\": []}}','2026-04-21 20:25:06.000000',NULL,NULL),(124,'CustomUser',1,'UPDATE','{\"last_login\": {\"after\": \"2026-04-22 17:46:51.082640+00:00\", \"before\": \"2026-04-20 18:51:30.096843+00:00\"}}','2026-04-22 17:46:51.087284','127.0.0.1',NULL),(125,'CustomUser',2,'UPDATE','{\"last_login\": {\"after\": \"2026-04-22 17:47:20.113582+00:00\", \"before\": null}}','2026-04-22 17:47:20.118250','127.0.0.1',NULL),(126,'CustomUser',3,'UPDATE','{\"last_login\": {\"after\": \"2026-04-22 18:03:13.896445+00:00\", \"before\": \"2026-04-16 23:54:47.457796+00:00\"}}','2026-04-22 18:03:13.901084','127.0.0.1',NULL),(127,'CustomUser',4,'UPDATE','{\"last_login\": {\"after\": \"2026-04-22 18:03:37.478056+00:00\", \"before\": \"2026-04-18 02:07:49.003125+00:00\"}}','2026-04-22 18:03:37.481237','127.0.0.1',NULL),(128,'Product',13,'CREATE','{\"after\": {\"id\": 13, \"tags\": [\"florero\", \"jarrón\", \"madera\", \"artesanal\", \"decoración\", \"hogar\", \"ornamento\", \"rústico\", \"elegante\"], \"price\": 450.00, \"stock\": 8, \"title\": \"Florero Decorativo de Madera Artesanal\", \"category\": \"Hogar y Jardín\", \"metadata\": {}, \"seller_id\": 3, \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776881073/products/n7u4iikvrnxqv4via3o9.jpg\", \"units_sold\": 0, \"description\": \"Elegante florero decorativo fabricado artesanalmente en madera. Presenta un acabado pulido que resalta la veta natural de la madera, aportando un toque cálido y sofisticado a cualquier espacio. Su diseño clásico y curvado es ideal para colocar flores frescas o secas, o simplemente como pieza decorativa. Perfecto para salas, comedores u oficinas.\", \"edit_allowed\": 0, \"additional_images\": []}}','2026-04-22 12:04:45.000000',NULL,NULL),(129,'Product',13,'CREATE','{\"after\": {\"id\": \"13\", \"tags\": \"[\'florero\', \'jarrón\', \'madera\', \'artesanal\', \'decoración\', \'hogar\', \'ornamento\', \'rústico\', \'elegante\']\", \"price\": \"450.00\", \"stock\": \"8\", \"title\": \"Florero Decorativo de Madera Artesanal\", \"seller\": \"erickhumbertotc@gmail.com (Vendedor)\", \"category\": \"Hogar y Jardín\", \"metadata\": \"{}\", \"main_image\": \"https://res.cloudinary.com/dy1o55fwf/image/upload/v1776881073/products/n7u4iikvrnxqv4via3o9.jpg\", \"units_sold\": \"0\", \"description\": \"Elegante florero decorativo fabricado artesanalmente en madera. Presenta un acabado pulido que resalta la veta natural de la madera, aportando un toque cálido y sofisticado a cualquier espacio. Su diseño clásico y curvado es ideal para colocar flores frescas o secas, o simplemente como pieza decorativa. Perfecto para salas, comedores u oficinas.\", \"edit_allowed\": \"False\", \"additional_images\": \"[]\"}}','2026-04-22 18:04:45.179281','127.0.0.1',3),(130,'CustomUser',4,'UPDATE','{\"last_login\": {\"after\": \"2026-04-22 18:05:41.943974+00:00\", \"before\": \"2026-04-22 18:03:37.478056+00:00\"}}','2026-04-22 18:05:41.948494','127.0.0.1',NULL),(131,'CustomUser',5,'CREATE','{\"after\": {\"id\": 5, \"role\": \"admin\", \"email\": \"admin@dysto.ai\", \"phone\": \"+52 55 1000 0000\", \"is_staff\": 1, \"is_active\": 1, \"last_name\": \"Hernandez\", \"first_name\": \"Carlos\", \"is_superuser\": 1}}','2026-04-22 12:53:03.000000',NULL,NULL),(132,'CustomUser',6,'CREATE','{\"after\": {\"id\": 6, \"role\": \"vendor\", \"email\": \"vendor01@dysto.ai\", \"phone\": \"+52 55 2000 0001\", \"is_staff\": 0, \"is_active\": 1, \"last_name\": \"Lopez\", \"first_name\": \"Fernanda\", \"is_superuser\": 0}}','2026-04-22 12:53:03.000000',NULL,NULL),(133,'CustomUser',7,'CREATE','{\"after\": {\"id\": 7, \"role\": \"vendor\", \"email\": \"vendor02@dysto.ai\", \"phone\": \"+52 33 2000 0002\", \"is_staff\": 0, \"is_active\": 1, \"last_name\": \"Martinez\", \"first_name\": \"Jorge\", \"is_superuser\": 0}}','2026-04-22 12:53:03.000000',NULL,NULL),(134,'CustomUser',8,'CREATE','{\"after\": {\"id\": 8, \"role\": \"vendor\", \"email\": \"vendor03@dysto.ai\", \"phone\": \"+52 81 2000 0003\", \"is_staff\": 0, \"is_active\": 1, \"last_name\": \"Garcia\", \"first_name\": \"Ximena\", \"is_superuser\": 0}}','2026-04-22 12:53:03.000000',NULL,NULL),(135,'CustomUser',9,'CREATE','{\"after\": {\"id\": 9, \"role\": \"vendor\", \"email\": \"vendor04@dysto.ai\", \"phone\": \"+52 22 2000 0004\", \"is_staff\": 0, \"is_active\": 1, \"last_name\": \"Sanchez\", \"first_name\": \"Ricardo\", \"is_superuser\": 0}}','2026-04-22 12:53:03.000000',NULL,NULL),(136,'CustomUser',10,'CREATE','{\"after\": {\"id\": 10, \"role\": \"vendor\", \"email\": \"vendor05@dysto.ai\", \"phone\": \"+52 44 2000 0005\", \"is_staff\": 0, \"is_active\": 1, \"last_name\": \"Ramirez\", \"first_name\": \"Valeria\", \"is_superuser\": 0}}','2026-04-22 12:53:03.000000',NULL,NULL),(137,'CustomUser',11,'CREATE','{\"after\": {\"id\": 11, \"role\": \"vendor\", \"email\": \"vendor06@dysto.ai\", \"phone\": \"+52 99 2000 0006\", \"is_staff\": 0, \"is_active\": 1, \"last_name\": \"Torres\", \"first_name\": \"Alejandro\", \"is_superuser\": 0}}','2026-04-22 12:53:03.000000',NULL,NULL),(138,'CustomUser',12,'CREATE','{\"after\": {\"id\": 12, \"role\": \"vendor\", \"email\": \"vendor07@dysto.ai\", \"phone\": \"+52 66 2000 0007\", \"is_staff\": 0, \"is_active\": 1, \"last_name\": \"Castillo\", \"first_name\": \"Mariana\", \"is_superuser\": 0}}','2026-04-22 12:53:03.000000',NULL,NULL),(139,'CustomUser',13,'CREATE','{\"after\": {\"id\": 13, \"role\": \"vendor\", \"email\": \"vendor08@dysto.ai\", \"phone\": \"+52 47 2000 0008\", \"is_staff\": 0, \"is_active\": 1, \"last_name\": \"Vargas\", \"first_name\": \"Emiliano\", \"is_superuser\": 0}}','2026-04-22 12:53:03.000000',NULL,NULL),(140,'CustomUser',14,'CREATE','{\"after\": {\"id\": 14, \"role\": \"vendor\", \"email\": \"vendor09@dysto.ai\", \"phone\": \"+52 72 2000 0009\", \"is_staff\": 0, \"is_active\": 1, \"last_name\": \"Navarro\", \"first_name\": \"Sofia\", \"is_superuser\": 0}}','2026-04-22 12:53:03.000000',NULL,NULL),(141,'CustomUser',15,'CREATE','{\"after\": {\"id\": 15, \"role\": \"vendor\", \"email\": \"vendor10@dysto.ai\", \"phone\": \"+52 99 2000 0010\", \"is_staff\": 0, \"is_active\": 1, \"last_name\": \"Mendoza\", \"first_name\": \"Diego\", \"is_superuser\": 0}}','2026-04-22 12:53:03.000000',NULL,NULL),(142,'Address',8,'CREATE','{\"after\": {\"id\": 8, \"city\": \"Ciudad de Mexico\", \"state\": \"CDMX\", \"street\": \"Avenida Insurgentes Sur\", \"user_id\": 5, \"is_default\": 1, \"postal_code\": \"03100\", \"street_number\": \"101\"}}','2026-04-22 12:53:03.000000',NULL,NULL),(143,'Address',9,'CREATE','{\"after\": {\"id\": 9, \"city\": \"Ciudad de Mexico\", \"state\": \"CDMX\", \"street\": \"Avenida Reforma\", \"user_id\": 6, \"is_default\": 1, \"postal_code\": \"06600\", \"street_number\": \"245\"}}','2026-04-22 12:53:03.000000',NULL,NULL),(144,'Address',10,'CREATE','{\"after\": {\"id\": 10, \"city\": \"Guadalajara\", \"state\": \"Jalisco\", \"street\": \"Calle Chapultepec\", \"user_id\": 7, \"is_default\": 1, \"postal_code\": \"44100\", \"street_number\": \"128\"}}','2026-04-22 12:53:03.000000',NULL,NULL),(145,'Address',11,'CREATE','{\"after\": {\"id\": 11, \"city\": \"Monterrey\", \"state\": \"Nuevo Leon\", \"street\": \"Avenida Universidad\", \"user_id\": 8, \"is_default\": 1, \"postal_code\": \"64000\", \"street_number\": \"985\"}}','2026-04-22 12:53:03.000000',NULL,NULL),(146,'Address',12,'CREATE','{\"after\": {\"id\": 12, \"city\": \"Puebla\", \"state\": \"Puebla\", \"street\": \"Boulevard 5 de Mayo\", \"user_id\": 9, \"is_default\": 1, \"postal_code\": \"72000\", \"street_number\": \"321\"}}','2026-04-22 12:53:03.000000',NULL,NULL),(147,'Address',13,'CREATE','{\"after\": {\"id\": 13, \"city\": \"Queretaro\", \"state\": \"Queretaro\", \"street\": \"Avenida Constituyentes\", \"user_id\": 10, \"is_default\": 1, \"postal_code\": \"76000\", \"street_number\": \"77\"}}','2026-04-22 12:53:03.000000',NULL,NULL),(148,'Address',14,'CREATE','{\"after\": {\"id\": 14, \"city\": \"Merida\", \"state\": \"Yucatan\", \"street\": \"Calle 60\", \"user_id\": 11, \"is_default\": 1, \"postal_code\": \"97000\", \"street_number\": \"410\"}}','2026-04-22 12:53:03.000000',NULL,NULL),(149,'Address',15,'CREATE','{\"after\": {\"id\": 15, \"city\": \"Tijuana\", \"state\": \"Baja California\", \"street\": \"Avenida Revolucion\", \"user_id\": 12, \"is_default\": 1, \"postal_code\": \"22000\", \"street_number\": \"510\"}}','2026-04-22 12:53:03.000000',NULL,NULL),(150,'Address',16,'CREATE','{\"after\": {\"id\": 16, \"city\": \"Leon\", \"state\": \"Guanajuato\", \"street\": \"Boulevard Lopez Mateos\", \"user_id\": 13, \"is_default\": 1, \"postal_code\": \"37000\", \"street_number\": \"1203\"}}','2026-04-22 12:53:03.000000',NULL,NULL),(151,'Address',17,'CREATE','{\"after\": {\"id\": 17, \"city\": \"Toluca\", \"state\": \"Estado de Mexico\", \"street\": \"Paseo Tollocan\", \"user_id\": 14, \"is_default\": 1, \"postal_code\": \"50000\", \"street_number\": \"640\"}}','2026-04-22 12:53:03.000000',NULL,NULL),(152,'Address',18,'CREATE','{\"after\": {\"id\": 18, \"city\": \"Cancun\", \"state\": \"Quintana Roo\", \"street\": \"Avenida Tulum\", \"user_id\": 15, \"is_default\": 1, \"postal_code\": \"77500\", \"street_number\": \"901\"}}','2026-04-22 12:53:03.000000',NULL,NULL),(153,'Product',14,'CREATE','{\"after\": {\"id\": 14, \"tags\": [\"xbox\", \"consola\", \"gaming\"], \"price\": 7999.00, \"stock\": 6, \"title\": \"Xbox Series S 512GB\", \"category\": \"Tecnologia\", \"metadata\": {\"brand\": \"Microsoft\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 6, \"main_image\": \"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRrO2fyzaL1get1Sg-W1zUZpJ11ckYelErwB21hEMjBki3MdxDCAJm255iH-j6fVGB-28N7IAnOQkvuiMOD6KjUq2TVbsIMJKLsVEbCLiG56QLUjYB20H0HpLI\", \"units_sold\": 34, \"description\": \"Consola en excelente estado, incluye un control y cable HDMI.\", \"edit_allowed\": 1, \"additional_images\": [\"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRYA1N6X0ZjMqa48WA-w3RE9ZA2TlAwmRKpKMPfGwOU0twvC4TdnOMcluQmYIow34MrZFgrZg5twXvTqKlUhaRZUIiitxyAF5X5Bpt8q7u2jYOz1sRhZvo1oQ\", \"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTDNt_iBpwOWvPFxvAsQmgcZyX7J78JuUmHTsR1bODwbEP0Hew5CaF49EfYRzLC_woiAvFlMAShkr8XzrxKrc6u3GzN7-QkIaK2cFbR5lA1LvBMBk4MbdoFLw\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(154,'Product',15,'CREATE','{\"after\": {\"id\": 15, \"tags\": [\"accesorios\", \"gaming\"], \"price\": 1399.00, \"stock\": 14, \"title\": \"Control Inalambrico Xbox Carbon Black\", \"category\": \"Tecnologia\", \"metadata\": {\"brand\": \"Microsoft\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 6, \"main_image\": \"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSoANTxycBc9-xfGX87U-zm5DC1Ddx663WUrwZitGHJIqYPC0cFtyXITobAOkFoGrDcm9lLUF5VzXEgzZkpgsqXilNAlwux1ZJ5aLkwAFr31eS8iRu99Adk1w2m\", \"units_sold\": 49, \"description\": \"Control original, compatible con Xbox y PC.\", \"edit_allowed\": 1, \"additional_images\": [\"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQPwVVabP_cK9ROyXkepDQIxbx3oY3FeyinWV0HcERtDaBHSWxY7-1x5yJx09M3l58W77X6QOclDQ5roYZ2wA6vQTEzelxZHWxxhaZ8RMFhhpp-1mebuuvOIjY\", \"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRMA9Tq-MH4aQq0RxlUHsoIrvIAY8fJpaZZMcp8u6ys41siqN_GmuxNAHZrWElU1i7pV6oS-kbYyZMnM_KvABWsgz7zwUhRuf_QqS9YMePRzOtF8s9Xwzwq3XA\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(155,'Product',16,'CREATE','{\"after\": {\"id\": 16, \"tags\": [\"mesa\", \"hogar\", \"comedor\"], \"price\": 6499.00, \"stock\": 8, \"title\": \"Mesa de Comedor Madera 4 Puestos\", \"category\": \"Hogar\", \"metadata\": {\"currency\": \"MXN\", \"material\": \"madera\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 7, \"main_image\": \"https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSWSnAQNPyhDmQDhy32DoiwmeYdlmd0DT5ujU3RvnwvLi9vI2anytAxP6UtZtZwEmEfyfo0eCB4QMzp9mQBXa-kxnKYF7bX1A4XDooLnq-6BV9mfZiEvLqatQ\", \"units_sold\": 17, \"description\": \"Mesa de comedor para espacios medianos, acabado en roble claro.\", \"edit_allowed\": 1, \"additional_images\": [\"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT9fsLQT8rpTimF9tbZGpIh3SDGK02EBiLFORhp6tkujkhDUc0E3ILi1e2WsoSNuR8DD4Z8QlFiHP4thBXz5mFuR8MPJTDIsTDCinHxhD-3YYwlwyPk5PM4-7Q\", \"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ_pjObe42umvhAvBYQJJyrPHpPALoqbg7P3gOSSiMF03QwEfE2LzkaInwsgpNyC9d-UjXjbbhBw5Yo88rDW2oIBt4f_ZVn5C3jTAa5c18t_mWAo3fClQg9uCA\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(156,'Product',17,'CREATE','{\"after\": {\"id\": 17, \"tags\": [\"oficina\", \"silla\"], \"price\": 3299.00, \"stock\": 9, \"title\": \"Silla Ergonomica de Oficina\", \"category\": \"Hogar\", \"metadata\": {\"color\": \"negro\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 7, \"main_image\": \"https://m.media-amazon.com/images/I/81BLi0KQXeL._AC_SX679_.jpg\", \"units_sold\": 26, \"description\": \"Silla con soporte lumbar y ajuste de altura.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/719LgQLGDVL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/7128-T4K-rL._AC_SX679_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(157,'Product',18,'CREATE','{\"after\": {\"id\": 18, \"tags\": [\"computadora\", \"portatil\"], \"price\": 15999.00, \"stock\": 5, \"title\": \"Computadora Portatil Lenovo IdeaPad i5\", \"category\": \"Tecnologia\", \"metadata\": {\"brand\": \"Lenovo\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 8, \"main_image\": \"https://m.media-amazon.com/images/I/710R57COBFL._AC_SX522_.jpg\", \"units_sold\": 22, \"description\": \"Portatil para estudio y trabajo, 16GB RAM y SSD de 512GB.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/611FLyvTFBL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/71uS4VFafTL._AC_SX522_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(158,'Product',19,'CREATE','{\"after\": {\"id\": 19, \"tags\": [\"televisor\", \"4k\", \"smart-tv\"], \"price\": 11999.00, \"stock\": 7, \"title\": \"Televisor Samsung 55 Pulgadas 4K\", \"category\": \"Tecnologia\", \"metadata\": {\"brand\": \"Samsung\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 8, \"main_image\": \"https://m.media-amazon.com/images/I/61aBRVxTBQL._AC_SX300_SY300_QL70_ML2_.jpg\", \"units_sold\": 31, \"description\": \"Smart TV 4K UHD con apps preinstaladas y control de voz.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/61rnDMTsNDL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/71non-NOFRL._AC_SX522_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(159,'Product',20,'CREATE','{\"after\": {\"id\": 20, \"tags\": [\"jabon\", \"limpieza\", \"hogar\"], \"price\": 59.00, \"stock\": 70, \"title\": \"Jabon Liquido para Manos 500ml\", \"category\": \"Hogar\", \"metadata\": {\"tipo\": \"limpieza\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 9, \"main_image\": \"https://m.media-amazon.com/images/I/71dV+riwhWL._AC_SY300_SX300_QL70_ML2_.jpg\", \"units_sold\": 112, \"description\": \"Jabon antibacterial de uso diario con aroma neutro.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/710ELIzH1wL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/71bfDx8X9CL._AC_SX679_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(160,'Product',21,'CREATE','{\"after\": {\"id\": 21, \"tags\": [\"detergente\", \"aseo\"], \"price\": 129.00, \"stock\": 55, \"title\": \"Detergente Liquido Ropa 2L\", \"category\": \"Hogar\", \"metadata\": {\"tipo\": \"aseo\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 9, \"main_image\": \"https://m.media-amazon.com/images/I/61UAQrv5EGL._AC_SY300_SX300_QL70_ML2_.jpg\", \"units_sold\": 95, \"description\": \"Rinde para multiples lavadas, fragancia fresca.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/611DH3KwMJL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/71h2-JG-28L._AC_SX679_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(161,'Product',22,'CREATE','{\"after\": {\"id\": 22, \"tags\": [\"mouse\", \"oficina\"], \"price\": 349.00, \"stock\": 32, \"title\": \"Mouse Logitech Inalambrico M170\", \"category\": \"Tecnologia\", \"metadata\": {\"brand\": \"Logitech\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 10, \"main_image\": \"https://m.media-amazon.com/images/I/615c1OkxYwL._AC_SY300_SX300_QL70_ML2_.jpg\", \"units_sold\": 77, \"description\": \"Mouse compacto para oficina y uso diario.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/71Bep7uDA3L._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/71jadbj6sML._AC_SX522_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(162,'Product',23,'CREATE','{\"after\": {\"id\": 23, \"tags\": [\"teclado\", \"gaming\", \"oficina\"], \"price\": 1799.00, \"stock\": 16, \"title\": \"Teclado Mecanico Red Switch\", \"category\": \"Tecnologia\", \"metadata\": {\"layout\": \"espanol\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 10, \"main_image\": \"https://m.media-amazon.com/images/I/61fOWq4eDmL._AC_SY300_SX300_QL70_ML2_.jpg\", \"units_sold\": 39, \"description\": \"Teclado en espanol, retroiluminado, formato completo.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/71qnlqpAy6L._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/71LXMPIlhRL._AC_SX522_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(163,'Product',24,'CREATE','{\"after\": {\"id\": 24, \"tags\": [\"cocina\", \"hogar\"], \"price\": 2199.00, \"stock\": 11, \"title\": \"Juego de Ollas Antiadherentes x5\", \"category\": \"Hogar\", \"metadata\": {\"currency\": \"MXN\", \"material\": \"aluminio\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 11, \"main_image\": \"https://m.media-amazon.com/images/I/81K4RSkRXzL._AC_SY300_SX300_QL70_ML2_.jpg\", \"units_sold\": 28, \"description\": \"Juego de ollas para cocina diaria, facil limpieza.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/81Yh6NES0oL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/71Xqa51MbgL._AC_SX679_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(164,'Product',25,'CREATE','{\"after\": {\"id\": 25, \"tags\": [\"electrodomesticos\", \"cocina\"], \"price\": 1399.00, \"stock\": 13, \"title\": \"Licuadora Oster 700W\", \"category\": \"Hogar\", \"metadata\": {\"brand\": \"Oster\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 11, \"main_image\": \"https://m.media-amazon.com/images/I/51yFg5kr1-L._AC_SX679_.jpg\", \"units_sold\": 33, \"description\": \"Licuadora de vaso de vidrio con 3 velocidades.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/814eVhFzsIL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/81etp3XAIEL._AC_SX679_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(165,'Product',26,'CREATE','{\"after\": {\"id\": 26, \"tags\": [\"audio\", \"bluetooth\"], \"price\": 899.00, \"stock\": 19, \"title\": \"Audifonos Bluetooth Sony WH-CH520\", \"category\": \"Tecnologia\", \"metadata\": {\"brand\": \"Sony\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 12, \"main_image\": \"https://m.media-amazon.com/images/I/41ETuD2aZRL._AC_SX300_SY300_QL70_ML2_.jpg\", \"units_sold\": 41, \"description\": \"Bateria de larga duracion y sonido balanceado.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/71AQ4yidjFL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/71AQ4yidjFL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/71F3N9ONS7L._AC_SX522_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(166,'Product',27,'CREATE','{\"after\": {\"id\": 27, \"tags\": [\"audio\", \"portatil\"], \"price\": 999.00, \"stock\": 18, \"title\": \"Parlante JBL Go 3\", \"category\": \"Tecnologia\", \"metadata\": {\"brand\": \"JBL\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 12, \"main_image\": \"https://m.media-amazon.com/images/I/715ZUYP5N5L._AC_SX522_.jpg\", \"units_sold\": 47, \"description\": \"Parlante portatil resistente al agua.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/918lQmwtCwL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/81S5YOcGjyL._AC_SX522_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(167,'Product',28,'CREATE','{\"after\": {\"id\": 28, \"tags\": [\"escritorio\", \"home-office\"], \"price\": 2499.00, \"stock\": 7, \"title\": \"Escritorio Minimalista 120cm\", \"category\": \"Hogar\", \"metadata\": {\"currency\": \"MXN\", \"material\": \"madera-metal\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 13, \"main_image\": \"https://m.media-amazon.com/images/I/81chqQOXLIL._AC_SX679_.jpg\", \"units_sold\": 19, \"description\": \"Escritorio de trabajo ideal para home office.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/81kH9WtrVsL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/81eUm8WGVWL._AC_SX679_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(168,'Product',29,'CREATE','{\"after\": {\"id\": 29, \"tags\": [\"monitor\", \"oficina\"], \"price\": 3999.00, \"stock\": 9, \"title\": \"Monitor LG 24 Pulgadas IPS\", \"category\": \"Tecnologia\", \"metadata\": {\"brand\": \"LG\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 13, \"main_image\": \"https://m.media-amazon.com/images/I/81rALfMyUWL._AC_SX522_.jpg\", \"units_sold\": 27, \"description\": \"Monitor Full HD para trabajo y entretenimiento.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/71LmWsR+pvL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/61fMc9r5FxL._AC_SX522_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(169,'Product',30,'CREATE','{\"after\": {\"id\": 30, \"tags\": [\"almacenamiento\", \"pc\"], \"price\": 1499.00, \"stock\": 21, \"title\": \"Disco SSD 1TB NVMe\", \"category\": \"Tecnologia\", \"metadata\": {\"currency\": \"MXN\", \"seed_tag\": \"DB-01\", \"capacidad\": \"1TB\"}, \"seller_id\": 14, \"main_image\": \"https://m.media-amazon.com/images/I/51YDo05UMyL._AC_SX522_.jpg\", \"units_sold\": 36, \"description\": \"Unidad de estado solido de alto rendimiento.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/51HTMnIhp2L._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/612wvIsno1L._AC_SX522_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(170,'Product',31,'CREATE','{\"after\": {\"id\": 31, \"tags\": [\"webcam\", \"streaming\"], \"price\": 1299.00, \"stock\": 11, \"title\": \"Camara Web Logitech C920\", \"category\": \"Tecnologia\", \"metadata\": {\"brand\": \"Logitech\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 14, \"main_image\": \"https://m.media-amazon.com/images/I/71eGb1FcyiL._AC_SY300_SX300_QL70_ML2_.jpg\", \"units_sold\": 18, \"description\": \"Camara para videollamadas en Full HD.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/713oLX7nuHL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/61ceNI7PhyL._AC_SX522_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(171,'Product',32,'CREATE','{\"after\": {\"id\": 32, \"tags\": [\"bano\", \"hogar\"], \"price\": 499.00, \"stock\": 25, \"title\": \"Set de Toallas x6 Algodon\", \"category\": \"Hogar\", \"metadata\": {\"currency\": \"MXN\", \"material\": \"algodon\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 15, \"main_image\": \"https://m.media-amazon.com/images/I/51imYOqhayL._AC_SX679_.jpg\", \"units_sold\": 61, \"description\": \"Toallas suaves de secado rapido para uso diario.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/61Qinr5QV7L._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/61S77tw+srL._AC_SX679_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(172,'Product',33,'CREATE','{\"after\": {\"id\": 33, \"tags\": [\"organizacion\", \"hogar\"], \"price\": 699.00, \"stock\": 17, \"title\": \"Organizador de Zapatos 3 Niveles\", \"category\": \"Hogar\", \"metadata\": {\"currency\": \"MXN\", \"material\": \"metal\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 15, \"main_image\": \"https://m.media-amazon.com/images/I/61Znc7JKAXL._AC_SY300_SX300_QL70_ML2_.jpg\", \"units_sold\": 23, \"description\": \"Estructura metalica para organizar calzado en casa.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/71dNwnqtCBL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/71rEBtJbqqL._AC_SX679_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(173,'Product',34,'CREATE','{\"after\": {\"id\": 34, \"tags\": [\"jabon\", \"hogar\"], \"price\": 45.00, \"stock\": 80, \"title\": \"Jabon en Barra x3\", \"category\": \"Hogar\", \"metadata\": {\"tipo\": \"aseo personal\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 15, \"main_image\": \"https://m.media-amazon.com/images/I/51xVv91HqmL._AC_SX679_.jpg\", \"units_sold\": 102, \"description\": \"Paquete de jabon en barra para aseo diario.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/61XqOTKVv5L._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/61Q1i55SDbL._AC_SX679_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(174,'Product',35,'CREATE','{\"after\": {\"id\": 35, \"tags\": [\"limpieza\", \"hogar\"], \"price\": 249.00, \"stock\": 28, \"title\": \"Escoba de Microfibra con Repuesto\", \"category\": \"Hogar\", \"metadata\": {\"tipo\": \"limpieza\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}, \"seller_id\": 9, \"main_image\": \"https://m.media-amazon.com/images/I/81pyye40tnL._AC_SY300_SX300_QL70_ML2_.jpg\", \"units_sold\": 44, \"description\": \"Escoba para piso con cabezal giratorio.\", \"edit_allowed\": 1, \"additional_images\": [\"https://m.media-amazon.com/images/I/81tlM4d79oL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/81DzTQ1Kp6L._AC_SX679_.jpg\"]}}','2026-04-22 12:53:03.000000',NULL,NULL),(175,'Cart',5,'CREATE','{\"after\": {\"id\": 5, \"user_id\": 6}}','2026-04-22 12:53:03.000000',NULL,NULL),(176,'Cart',6,'CREATE','{\"after\": {\"id\": 6, \"user_id\": 7}}','2026-04-22 12:53:03.000000',NULL,NULL),(177,'Cart',7,'CREATE','{\"after\": {\"id\": 7, \"user_id\": 8}}','2026-04-22 12:53:03.000000',NULL,NULL),(178,'Cart',8,'CREATE','{\"after\": {\"id\": 8, \"user_id\": 9}}','2026-04-22 12:53:03.000000',NULL,NULL),(179,'CartItem',11,'CREATE','{\"after\": {\"id\": 11, \"cart_id\": 5, \"quantity\": 3, \"product_id\": 20}}','2026-04-22 12:53:03.000000',NULL,NULL),(180,'CartItem',12,'CREATE','{\"after\": {\"id\": 12, \"cart_id\": 6, \"quantity\": 1, \"product_id\": 19}}','2026-04-22 12:53:03.000000',NULL,NULL),(181,'CartItem',13,'CREATE','{\"after\": {\"id\": 13, \"cart_id\": 7, \"quantity\": 1, \"product_id\": 16}}','2026-04-22 12:53:03.000000',NULL,NULL),(182,'CartItem',14,'CREATE','{\"after\": {\"id\": 14, \"cart_id\": 8, \"quantity\": 2, \"product_id\": 25}}','2026-04-22 12:53:03.000000',NULL,NULL),(183,'Order',9,'CREATE','{\"after\": {\"id\": 9, \"total\": 0.00, \"status\": \"completed\", \"user_id\": 6, \"order_number\": \"DB01ORD000000001\", \"address_snapshot\": {\"city\": \"Ciudad de Mexico\", \"state\": \"CDMX\", \"street\": \"Avenida Reforma\", \"seed_tag\": \"DB-01\", \"postal_code\": \"06600\", \"street_number\": \"245\"}}}','2026-04-22 12:53:03.000000',NULL,NULL),(184,'Order',10,'CREATE','{\"after\": {\"id\": 10, \"total\": 0.00, \"status\": \"completed\", \"user_id\": 7, \"order_number\": \"DB01ORD000000002\", \"address_snapshot\": {\"city\": \"Guadalajara\", \"state\": \"Jalisco\", \"street\": \"Calle Chapultepec\", \"seed_tag\": \"DB-01\", \"postal_code\": \"44100\", \"street_number\": \"128\"}}}','2026-04-22 12:53:03.000000',NULL,NULL),(185,'Order',11,'CREATE','{\"after\": {\"id\": 11, \"total\": 0.00, \"status\": \"completed\", \"user_id\": 8, \"order_number\": \"DB01ORD000000003\", \"address_snapshot\": {\"city\": \"Monterrey\", \"state\": \"Nuevo Leon\", \"street\": \"Avenida Universidad\", \"seed_tag\": \"DB-01\", \"postal_code\": \"64000\", \"street_number\": \"985\"}}}','2026-04-22 12:53:03.000000',NULL,NULL),(186,'Order',12,'CREATE','{\"after\": {\"id\": 12, \"total\": 0.00, \"status\": \"completed\", \"user_id\": 9, \"order_number\": \"DB01ORD000000004\", \"address_snapshot\": {\"city\": \"Puebla\", \"state\": \"Puebla\", \"street\": \"Boulevard 5 de Mayo\", \"seed_tag\": \"DB-01\", \"postal_code\": \"72000\", \"street_number\": \"321\"}}}','2026-04-22 12:53:03.000000',NULL,NULL),(187,'Order',13,'CREATE','{\"after\": {\"id\": 13, \"total\": 0.00, \"status\": \"completed\", \"user_id\": 10, \"order_number\": \"DB01ORD000000005\", \"address_snapshot\": {\"city\": \"Queretaro\", \"state\": \"Queretaro\", \"street\": \"Avenida Constituyentes\", \"seed_tag\": \"DB-01\", \"postal_code\": \"76000\", \"street_number\": \"77\"}}}','2026-04-22 12:53:03.000000',NULL,NULL),(188,'Order',14,'CREATE','{\"after\": {\"id\": 14, \"total\": 0.00, \"status\": \"completed\", \"user_id\": 11, \"order_number\": \"DB01ORD000000006\", \"address_snapshot\": {\"city\": \"Merida\", \"state\": \"Yucatan\", \"street\": \"Calle 60\", \"seed_tag\": \"DB-01\", \"postal_code\": \"97000\", \"street_number\": \"410\"}}}','2026-04-22 12:53:03.000000',NULL,NULL),(189,'OrderItem',10,'CREATE','{\"after\": {\"id\": 10, \"order_id\": 9, \"quantity\": 1, \"product_id\": 16, \"unit_price\": 6499.00}}','2026-04-22 12:53:03.000000',NULL,NULL),(190,'OrderItem',11,'CREATE','{\"after\": {\"id\": 11, \"order_id\": 9, \"quantity\": 2, \"product_id\": 20, \"unit_price\": 59.00}}','2026-04-22 12:53:03.000000',NULL,NULL),(191,'OrderItem',12,'CREATE','{\"after\": {\"id\": 12, \"order_id\": 10, \"quantity\": 1, \"product_id\": 14, \"unit_price\": 7999.00}}','2026-04-22 12:53:03.000000',NULL,NULL),(192,'OrderItem',13,'CREATE','{\"after\": {\"id\": 13, \"order_id\": 11, \"quantity\": 4, \"product_id\": 20, \"unit_price\": 59.00}}','2026-04-22 12:53:03.000000',NULL,NULL),(193,'OrderItem',14,'CREATE','{\"after\": {\"id\": 14, \"order_id\": 11, \"quantity\": 1, \"product_id\": 25, \"unit_price\": 1399.00}}','2026-04-22 12:53:03.000000',NULL,NULL),(194,'OrderItem',15,'CREATE','{\"after\": {\"id\": 15, \"order_id\": 12, \"quantity\": 1, \"product_id\": 19, \"unit_price\": 11999.00}}','2026-04-22 12:53:03.000000',NULL,NULL),(195,'OrderItem',16,'CREATE','{\"after\": {\"id\": 16, \"order_id\": 13, \"quantity\": 1, \"product_id\": 18, \"unit_price\": 15999.00}}','2026-04-22 12:53:03.000000',NULL,NULL),(196,'OrderItem',17,'CREATE','{\"after\": {\"id\": 17, \"order_id\": 14, \"quantity\": 3, \"product_id\": 20, \"unit_price\": 59.00}}','2026-04-22 12:53:03.000000',NULL,NULL),(197,'Order',9,'UPDATE','{\"total\": {\"after\": 6617.00, \"before\": 0.00}}','2026-04-22 12:53:03.000000',NULL,NULL),(198,'Order',10,'UPDATE','{\"total\": {\"after\": 7999.00, \"before\": 0.00}}','2026-04-22 12:53:03.000000',NULL,NULL),(199,'Order',11,'UPDATE','{\"total\": {\"after\": 1635.00, \"before\": 0.00}}','2026-04-22 12:53:03.000000',NULL,NULL),(200,'Order',12,'UPDATE','{\"total\": {\"after\": 11999.00, \"before\": 0.00}}','2026-04-22 12:53:03.000000',NULL,NULL),(201,'Order',13,'UPDATE','{\"total\": {\"after\": 15999.00, \"before\": 0.00}}','2026-04-22 12:53:03.000000',NULL,NULL),(202,'Order',14,'UPDATE','{\"total\": {\"after\": 177.00, \"before\": 0.00}}','2026-04-22 12:53:03.000000',NULL,NULL);
/*!40000 ALTER TABLE `logbook_auditlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_order`
--

DROP TABLE IF EXISTS `orders_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address_snapshot` json NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `order_number` varchar(16) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `orders_order_user_id_e9b59eb1_fk_users_customuser_id` (`user_id`),
  CONSTRAINT `orders_order_user_id_e9b59eb1_fk_users_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `users_customuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_order`
--

LOCK TABLES `orders_order` WRITE;
/*!40000 ALTER TABLE `orders_order` DISABLE KEYS */;
INSERT INTO `orders_order` VALUES (1,'{\"city\": \"CUERNAVACA\", \"state\": \"morelos\", \"street\": \"test\", \"postal_code\": \"62220\", \"street_number\": \"123123\"}',25497.00,'completed','9B7EB7AB7E794EE2','2026-04-16 23:55:18.151198',3),(2,'{\"city\": \"test\", \"state\": \"test\", \"street\": \"test\", \"postal_code\": \"62220\", \"street_number\": \"124\"}',840.00,'completed','40369ED1F48E4C9B','2026-04-18 02:06:06.751826',1),(3,'{\"city\": \"CUERNAVACA\", \"state\": \"morelos\", \"street\": \"test\", \"postal_code\": \"62220\", \"street_number\": \"123123\"}',47.97,'completed','FCA3010702174D95','2026-04-18 02:06:54.538337',4),(4,'{\"city\": \"CUERNAVACA\", \"state\": \"morelos\", \"street\": \"test\", \"postal_code\": \"62220\", \"street_number\": \"123123\"}',5.00,'completed','564C6619DF1041F9','2026-04-18 02:07:19.995118',4),(5,'{\"city\": \"test\", \"state\": \"test\", \"street\": \"test\", \"postal_code\": \"62220\", \"street_number\": \"124\"}',8500.00,'completed','CBE6908D7C724A10','2026-04-18 02:07:20.666204',1),(6,'{\"city\": \"CUERNAVACA\", \"state\": \"morelos\", \"street\": \"test\", \"postal_code\": \"62220\", \"street_number\": \"123123\"}',0.06,'completed','CBD6E20C3D7E4047','2026-04-18 02:08:14.626427',4),(7,'{\"city\": \"test\", \"state\": \"test\", \"street\": \"test\", \"postal_code\": \"62220\", \"street_number\": \"124\"}',7998.00,'completed','E04586E3E5B240DC','2026-04-18 02:08:32.477512',1),(8,'{\"city\": \"CUERNAVACA\", \"state\": \"morelos\", \"street\": \"test\", \"postal_code\": \"62220\", \"street_number\": \"123123\"}',41.98,'completed','ABB70C48A1684C55','2026-04-18 02:08:57.140292',4),(9,'{\"city\": \"Ciudad de Mexico\", \"state\": \"CDMX\", \"street\": \"Avenida Reforma\", \"seed_tag\": \"DB-01\", \"postal_code\": \"06600\", \"street_number\": \"245\"}',6617.00,'completed','DB01ORD000000001','2025-12-23 12:53:03.000000',6),(10,'{\"city\": \"Guadalajara\", \"state\": \"Jalisco\", \"street\": \"Calle Chapultepec\", \"seed_tag\": \"DB-01\", \"postal_code\": \"44100\", \"street_number\": \"128\"}',7999.00,'completed','DB01ORD000000002','2026-01-12 12:53:03.000000',7),(11,'{\"city\": \"Monterrey\", \"state\": \"Nuevo Leon\", \"street\": \"Avenida Universidad\", \"seed_tag\": \"DB-01\", \"postal_code\": \"64000\", \"street_number\": \"985\"}',1635.00,'completed','DB01ORD000000003','2026-02-01 12:53:03.000000',8),(12,'{\"city\": \"Puebla\", \"state\": \"Puebla\", \"street\": \"Boulevard 5 de Mayo\", \"seed_tag\": \"DB-01\", \"postal_code\": \"72000\", \"street_number\": \"321\"}',11999.00,'completed','DB01ORD000000004','2026-02-16 12:53:03.000000',9),(13,'{\"city\": \"Queretaro\", \"state\": \"Queretaro\", \"street\": \"Avenida Constituyentes\", \"seed_tag\": \"DB-01\", \"postal_code\": \"76000\", \"street_number\": \"77\"}',15999.00,'completed','DB01ORD000000005','2026-02-27 12:53:03.000000',10),(14,'{\"city\": \"Merida\", \"state\": \"Yucatan\", \"street\": \"Calle 60\", \"seed_tag\": \"DB-01\", \"postal_code\": \"97000\", \"street_number\": \"410\"}',177.00,'completed','DB01ORD000000006','2026-03-11 12:53:03.000000',11);
/*!40000 ALTER TABLE `orders_order` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_order_insert` AFTER INSERT ON `orders_order` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_order_update` AFTER UPDATE ON `orders_order` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_order_delete` AFTER DELETE ON `orders_order` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `orders_orderitem`
--

DROP TABLE IF EXISTS `orders_orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_orderitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_snapshot` json NOT NULL,
  `quantity` int unsigned NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_orderitem_order_id_fe61a34d_fk_orders_order_id` (`order_id`),
  KEY `orders_orderitem_product_id_afe4254a_fk_products_product_id` (`product_id`),
  CONSTRAINT `orders_orderitem_order_id_fe61a34d_fk_orders_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders_order` (`id`),
  CONSTRAINT `orders_orderitem_product_id_afe4254a_fk_products_product_id` FOREIGN KEY (`product_id`) REFERENCES `products_product` (`id`),
  CONSTRAINT `orders_orderitem_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_orderitem`
--

LOCK TABLES `orders_orderitem` WRITE;
/*!40000 ALTER TABLE `orders_orderitem` DISABLE KEYS */;
INSERT INTO `orders_orderitem` VALUES (1,'{\"price\": \"8499.00\", \"title\": \"Consola Nintendo Switch OLED Modelo Splatoon 3 Edición Especial\"}',3,8499.00,1,NULL),(2,'{\"price\": \"280.00\", \"title\": \"Sombrero Canotier de Paja Clásico con Cinta Roja\"}',3,280.00,2,7),(3,'{\"price\": \"15.99\", \"title\": \"Taza de Cerámica con Diseño \'Man Face\' de Meme\"}',3,15.99,3,3),(4,'{\"price\": \"2.50\", \"title\": \"Cuchara de Acero Inoxidable Brillante\"}',2,2.50,4,2),(5,'{\"price\": \"8500.00\", \"title\": \"Cámara Réflex Digital Nikon D3400 con Lente AF-P DX NIKKOR 18-55mm f/3.5-5.6G VR\"}',1,8500.00,5,9),(6,'{\"price\": \"0.02\", \"title\": \"Consola Nintendo Switch Modelo OLED Edición Especial Splatoon 3\"}',3,0.02,6,NULL),(7,'{\"price\": \"3999.00\", \"title\": \"Smartphone OnePlus Nord\"}',2,3999.00,7,11),(8,'{\"price\": \"2.50\", \"title\": \"Cuchara de Acero Inoxidable Brillante\"}',4,2.50,8,2),(9,'{\"price\": \"15.99\", \"title\": \"Taza de Cerámica con Diseño \'Man Face\' de Meme\"}',2,15.99,8,3),(10,'{\"price\": 6499.00, \"title\": \"Mesa de Comedor Madera 4 Puestos\"}',1,6499.00,9,16),(11,'{\"price\": 59.00, \"title\": \"Jabon Liquido para Manos 500ml\"}',2,59.00,9,20),(12,'{\"price\": 7999.00, \"title\": \"Xbox Series S 512GB\"}',1,7999.00,10,14),(13,'{\"price\": 59.00, \"title\": \"Jabon Liquido para Manos 500ml\"}',4,59.00,11,20),(14,'{\"price\": 1399.00, \"title\": \"Licuadora Oster 700W\"}',1,1399.00,11,25),(15,'{\"price\": 11999.00, \"title\": \"Televisor Samsung 55 Pulgadas 4K\"}',1,11999.00,12,19),(16,'{\"price\": 15999.00, \"title\": \"Computadora Portatil Lenovo IdeaPad i5\"}',1,15999.00,13,18),(17,'{\"price\": 59.00, \"title\": \"Jabon Liquido para Manos 500ml\"}',3,59.00,14,20);
/*!40000 ALTER TABLE `orders_orderitem` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_orderitem_insert` AFTER INSERT ON `orders_orderitem` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_orderitem_update` AFTER UPDATE ON `orders_orderitem` FOR EACH ROW BEGIN
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

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_orderitem_delete` AFTER DELETE ON `orders_orderitem` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `products_product`
--

DROP TABLE IF EXISTS `products_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products_product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext,
  `price` decimal(10,2) NOT NULL,
  `stock` int unsigned NOT NULL,
  `main_image` varchar(500) NOT NULL,
  `additional_images` json NOT NULL,
  `metadata` json NOT NULL,
  `edit_allowed` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `tags` json NOT NULL,
  `units_sold` int unsigned NOT NULL,
  `seller_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_product_seller_id_07afb1e3_fk_users_customuser_id` (`seller_id`),
  CONSTRAINT `products_product_seller_id_07afb1e3_fk_users_customuser_id` FOREIGN KEY (`seller_id`) REFERENCES `users_customuser` (`id`),
  CONSTRAINT `products_product_chk_1` CHECK ((`stock` >= 0)),
  CONSTRAINT `products_product_chk_2` CHECK ((`units_sold` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products_product`
--

LOCK TABLES `products_product` WRITE;
/*!40000 ALTER TABLE `products_product` DISABLE KEYS */;
INSERT INTO `products_product` VALUES (2,'Herramientas','Cuchara de Acero Inoxidable Brillante','Cuchara de mesa o sopa de acero inoxidable con acabado brillante. Ideal para el uso diario en el hogar o restaurantes, resistente y fácil de limpiar. Su diseño clásico se adapta a cualquier vajilla.',2.50,5,'https://res.cloudinary.com/dy1o55fwf/image/upload/v1776191460/products/bzlymn7w2xvmy4j5xovw.jpg','[]','{}',0,'2026-04-14 18:31:10.881273','2026-04-16 07:21:52.975530','[\"cuchara\", \"utensilio\", \"cocina\", \"mesa\", \"acero inoxidable\", \"menaje\", \"cubierto\"]',6,1),(3,'Modelos de IA','Taza de Cerámica con Diseño \'Man Face\' de Meme','Taza de cerámica blanca con un diseño gráfico minimalista de una cara sonriente y confiada, popularmente conocida como \'Man Face\' o \'Roblox Face\' en la cultura de internet. Ideal para disfrutar de café, té o cualquier bebida caliente, añadiendo un toque de humor y originalidad a tu colección de tazas o como un regalo divertido para entusiastas de memes y videojuegos.',15.99,3,'https://res.cloudinary.com/dy1o55fwf/image/upload/v1776329161/products/gbj5r5uyq3ts5ln93t1v.jpg','[]','{}',0,'2026-04-16 08:46:14.217951','2026-04-20 18:38:59.971025','[\"taza\", \"mug\", \"cerámica\", \"man face\", \"roblox\", \"meme\", \"café\", \"té\", \"bebida\", \"regalo\", \"novedad\", \"humor\", \"blanco y negro\"]',5,1),(7,'Ropa y Moda','Sombrero Canotier de Paja Clásico con Cinta Roja','Sombrero tipo canotier fabricado en paja natural, ideal para protegerte del sol con estilo. Cuenta con una banda decorativa de color rojo que le añade un toque clásico y vibrante. Perfecto para eventos al aire libre, paseos de verano, playa o como accesorio de moda.',280.00,1,'https://res.cloudinary.com/dy1o55fwf/image/upload/v1776477895/products/sotlmgeawxovv2wyhubm.jpg','[]','{}',0,'2026-04-18 02:05:00.239423','2026-04-18 02:05:00.239458','[\"sombrero\", \"paja\", \"canotier\", \"rojo\", \"verano\", \"playa\", \"moda\", \"accesorio\", \"sol\", \"clásico\"]',3,4),(8,'Alimentos y Bebidas','Pastel de Cumpleaños Blanco con Velas \'Happy Birthday\'','Elegante pastel de cumpleaños con cubierta de glaseado blanco, decorado con velas coloridas que forman la frase \'HAPPY BIRTHDAY\' encendidas. Ideal para celebrar ocasiones especiales, este pastel es un delicioso centro de mesa para cualquier fiesta de cumpleaños. Presentado sobre un soporte de vidrio con chispas de colores esparcidas alrededor.',550.00,5,'https://res.cloudinary.com/dy1o55fwf/image/upload/v1776477913/products/f5xw2nwbn9ppjvkwjmkp.jpg','[]','{}',0,'2026-04-18 02:05:16.592495','2026-04-18 02:05:46.644906','[\"pastel\", \"tarta\", \"cumpleaños\", \"celebración\", \"fiesta\", \"velas\", \"postre\", \"dulce\", \"repostería\", \"blanco\", \"decoración\"]',0,4),(9,'Electrónica','Cámara Réflex Digital Nikon D3400 con Lente AF-P DX NIKKOR 18-55mm f/3.5-5.6G VR','Cámara réflex digital (DSLR) Nikon D3400, ideal para principiantes y entusiastas de la fotografía. Cuenta con un sensor CMOS de formato DX de 24.2 megapíxeles, capacidad de grabación de video Full HD 1080p y conectividad Bluetooth SnapBridge para compartir imágenes fácilmente. Incluye el versátil lente kit AF-P DX NIKKOR 18-55mm f/3.5-5.6G VR con estabilización de imagen, perfecto para una amplia gama de situaciones fotográficas.',8500.00,7,'https://res.cloudinary.com/dy1o55fwf/image/upload/v1776477934/products/be5hod5gdh3c4nqkogzz.png','[]','{}',0,'2026-04-18 02:05:39.496410','2026-04-18 02:05:39.496437','[\"Nikon\", \"D3400\", \"DSLR\", \"cámara digital\", \"fotografía\", \"lente 18-55mm\", \"Nikkor\", \"Electrónica\", \"Reflex\", \"SnapBridge\", \"Full HD\", \"kit de cámara\"]',1,4),(10,'Hogar y Jardín','Florero de Madera Artesanal / Jarrón Decorativo Rústico','Este elegante florero de madera, con un diseño clásico y curvilíneo, es ideal para realzar la decoración de cualquier espacio. Fabricado artesanalmente, exhibe un veteado natural y un acabado pulido que resalta la belleza de la madera. Perfecto para flores secas, arreglos artificiales o como pieza decorativa central por sí misma, aportando un toque rústico y sofisticado a tu hogar u oficina.',380.00,9,'https://res.cloudinary.com/dy1o55fwf/image/upload/v1776477991/products/ic0oozoqgndownirhuij.jpg','[]','{}',0,'2026-04-18 02:06:38.159512','2026-04-20 18:17:02.580137','[\"florero\", \"madera\", \"artesanal\", \"decoración\", \"hogar\", \"jarrón\", \"rústico\", \"natural\", \"accesorio\", \"diseño\"]',0,1),(11,'Electrónica','Smartphone OnePlus Nord','Un smartphone moderno de la marca OnePlus con un diseño elegante en color oscuro, pantalla amplia con el lema distintivo \'Never Settle\', y un sistema de doble cámara trasera. Ideal para comunicación, entretenimiento, navegación y fotografía diaria, ofreciendo una experiencia de usuario fluida y confiable.',3999.00,4,'https://res.cloudinary.com/dy1o55fwf/image/upload/v1776478078/products/utyezvwbv0rwhc7bs89b.jpg','[]','{}',0,'2026-04-18 02:08:07.095028','2026-04-18 02:08:07.095065','[\"smartphone\", \"celular\", \"móvil\", \"OnePlus\", \"Nord\", \"Android\", \"electrónica\", \"teléfono\", \"cámara\", \"pantalla\", \"gadgets\"]',2,4),(13,'Hogar y Jardín','Florero Decorativo de Madera Artesanal','Elegante florero decorativo fabricado artesanalmente en madera. Presenta un acabado pulido que resalta la veta natural de la madera, aportando un toque cálido y sofisticado a cualquier espacio. Su diseño clásico y curvado es ideal para colocar flores frescas o secas, o simplemente como pieza decorativa. Perfecto para salas, comedores u oficinas.',450.00,8,'https://res.cloudinary.com/dy1o55fwf/image/upload/v1776881073/products/n7u4iikvrnxqv4via3o9.jpg','[]','{}',0,'2026-04-22 18:04:45.172755','2026-04-22 18:04:45.172782','[\"florero\", \"jarrón\", \"madera\", \"artesanal\", \"decoración\", \"hogar\", \"ornamento\", \"rústico\", \"elegante\"]',0,3),(14,'Tecnologia','Xbox Series S 512GB','Consola en excelente estado, incluye un control y cable HDMI.',7999.00,6,'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRrO2fyzaL1get1Sg-W1zUZpJ11ckYelErwB21hEMjBki3MdxDCAJm255iH-j6fVGB-28N7IAnOQkvuiMOD6KjUq2TVbsIMJKLsVEbCLiG56QLUjYB20H0HpLI','[\"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRYA1N6X0ZjMqa48WA-w3RE9ZA2TlAwmRKpKMPfGwOU0twvC4TdnOMcluQmYIow34MrZFgrZg5twXvTqKlUhaRZUIiitxyAF5X5Bpt8q7u2jYOz1sRhZvo1oQ\", \"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTDNt_iBpwOWvPFxvAsQmgcZyX7J78JuUmHTsR1bODwbEP0Hew5CaF49EfYRzLC_woiAvFlMAShkr8XzrxKrc6u3GzN7-QkIaK2cFbR5lA1LvBMBk4MbdoFLw\"]','{\"brand\": \"Microsoft\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-10-24 12:53:03.000000','2026-04-17 12:53:03.000000','[\"xbox\", \"consola\", \"gaming\"]',34,6),(15,'Tecnologia','Control Inalambrico Xbox Carbon Black','Control original, compatible con Xbox y PC.',1399.00,14,'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSoANTxycBc9-xfGX87U-zm5DC1Ddx663WUrwZitGHJIqYPC0cFtyXITobAOkFoGrDcm9lLUF5VzXEgzZkpgsqXilNAlwux1ZJ5aLkwAFr31eS8iRu99Adk1w2m','[\"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQPwVVabP_cK9ROyXkepDQIxbx3oY3FeyinWV0HcERtDaBHSWxY7-1x5yJx09M3l58W77X6QOclDQ5roYZ2wA6vQTEzelxZHWxxhaZ8RMFhhpp-1mebuuvOIjY\", \"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRMA9Tq-MH4aQq0RxlUHsoIrvIAY8fJpaZZMcp8u6ys41siqN_GmuxNAHZrWElU1i7pV6oS-kbYyZMnM_KvABWsgz7zwUhRuf_QqS9YMePRzOtF8s9Xwzwq3XA\"]','{\"brand\": \"Microsoft\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-11-23 12:53:03.000000','2026-04-14 12:53:03.000000','[\"accesorios\", \"gaming\"]',49,6),(16,'Hogar','Mesa de Comedor Madera 4 Puestos','Mesa de comedor para espacios medianos, acabado en roble claro.',6499.00,8,'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSWSnAQNPyhDmQDhy32DoiwmeYdlmd0DT5ujU3RvnwvLi9vI2anytAxP6UtZtZwEmEfyfo0eCB4QMzp9mQBXa-kxnKYF7bX1A4XDooLnq-6BV9mfZiEvLqatQ','[\"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT9fsLQT8rpTimF9tbZGpIh3SDGK02EBiLFORhp6tkujkhDUc0E3ILi1e2WsoSNuR8DD4Z8QlFiHP4thBXz5mFuR8MPJTDIsTDCinHxhD-3YYwlwyPk5PM4-7Q\", \"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ_pjObe42umvhAvBYQJJyrPHpPALoqbg7P3gOSSiMF03QwEfE2LzkaInwsgpNyC9d-UjXjbbhBw5Yo88rDW2oIBt4f_ZVn5C3jTAa5c18t_mWAo3fClQg9uCA\"]','{\"currency\": \"MXN\", \"material\": \"madera\", \"seed_tag\": \"DB-01\"}',1,'2025-09-14 12:53:03.000000','2026-04-07 12:53:03.000000','[\"mesa\", \"hogar\", \"comedor\"]',17,7),(17,'Hogar','Silla Ergonomica de Oficina','Silla con soporte lumbar y ajuste de altura.',3299.00,9,'https://m.media-amazon.com/images/I/81BLi0KQXeL._AC_SX679_.jpg','[\"https://m.media-amazon.com/images/I/719LgQLGDVL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/7128-T4K-rL._AC_SX679_.jpg\"]','{\"color\": \"negro\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-12-03 12:53:03.000000','2026-04-10 12:53:03.000000','[\"oficina\", \"silla\"]',26,7),(18,'Tecnologia','Computadora Portatil Lenovo IdeaPad i5','Portatil para estudio y trabajo, 16GB RAM y SSD de 512GB.',15999.00,5,'https://m.media-amazon.com/images/I/710R57COBFL._AC_SX522_.jpg','[\"https://m.media-amazon.com/images/I/611FLyvTFBL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/71uS4VFafTL._AC_SX522_.jpg\"]','{\"brand\": \"Lenovo\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2026-01-02 12:53:03.000000','2026-04-20 12:53:03.000000','[\"computadora\", \"portatil\"]',22,8),(19,'Tecnologia','Televisor Samsung 55 Pulgadas 4K','Smart TV 4K UHD con apps preinstaladas y control de voz.',11999.00,7,'https://m.media-amazon.com/images/I/61aBRVxTBQL._AC_SX300_SY300_QL70_ML2_.jpg','[\"https://m.media-amazon.com/images/I/61rnDMTsNDL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/71non-NOFRL._AC_SX522_.jpg\"]','{\"brand\": \"Samsung\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-10-14 12:53:03.000000','2026-04-18 12:53:03.000000','[\"televisor\", \"4k\", \"smart-tv\"]',31,8),(20,'Hogar','Jabon Liquido para Manos 500ml','Jabon antibacterial de uso diario con aroma neutro.',59.00,70,'https://m.media-amazon.com/images/I/71dV+riwhWL._AC_SY300_SX300_QL70_ML2_.jpg','[\"https://m.media-amazon.com/images/I/710ELIzH1wL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/71bfDx8X9CL._AC_SX679_.jpg\"]','{\"tipo\": \"limpieza\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-06-26 12:53:03.000000','2026-04-02 12:53:03.000000','[\"jabon\", \"limpieza\", \"hogar\"]',112,9),(21,'Hogar','Detergente Liquido Ropa 2L','Rinde para multiples lavadas, fragancia fresca.',129.00,55,'https://m.media-amazon.com/images/I/61UAQrv5EGL._AC_SY300_SX300_QL70_ML2_.jpg','[\"https://m.media-amazon.com/images/I/611DH3KwMJL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/71h2-JG-28L._AC_SX679_.jpg\"]','{\"tipo\": \"aseo\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-07-26 12:53:03.000000','2026-04-04 12:53:03.000000','[\"detergente\", \"aseo\"]',95,9),(22,'Tecnologia','Mouse Logitech Inalambrico M170','Mouse compacto para oficina y uso diario.',349.00,32,'https://m.media-amazon.com/images/I/615c1OkxYwL._AC_SY300_SX300_QL70_ML2_.jpg','[\"https://m.media-amazon.com/images/I/71Bep7uDA3L._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/71jadbj6sML._AC_SX522_.jpg\"]','{\"brand\": \"Logitech\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-09-24 12:53:03.000000','2026-04-12 12:53:03.000000','[\"mouse\", \"oficina\"]',77,10),(23,'Tecnologia','Teclado Mecanico Red Switch','Teclado en espanol, retroiluminado, formato completo.',1799.00,16,'https://m.media-amazon.com/images/I/61fOWq4eDmL._AC_SY300_SX300_QL70_ML2_.jpg','[\"https://m.media-amazon.com/images/I/71qnlqpAy6L._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/71LXMPIlhRL._AC_SX522_.jpg\"]','{\"layout\": \"espanol\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-11-13 12:53:03.000000','2026-04-16 12:53:03.000000','[\"teclado\", \"gaming\", \"oficina\"]',39,10),(24,'Hogar','Juego de Ollas Antiadherentes x5','Juego de ollas para cocina diaria, facil limpieza.',2199.00,11,'https://m.media-amazon.com/images/I/81K4RSkRXzL._AC_SY300_SX300_QL70_ML2_.jpg','[\"https://m.media-amazon.com/images/I/81Yh6NES0oL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/71Xqa51MbgL._AC_SX679_.jpg\"]','{\"currency\": \"MXN\", \"material\": \"aluminio\", \"seed_tag\": \"DB-01\"}',1,'2025-09-29 12:53:03.000000','2026-04-06 12:53:03.000000','[\"cocina\", \"hogar\"]',28,11),(25,'Hogar','Licuadora Oster 700W','Licuadora de vaso de vidrio con 3 velocidades.',1399.00,13,'https://m.media-amazon.com/images/I/51yFg5kr1-L._AC_SX679_.jpg','[\"https://m.media-amazon.com/images/I/814eVhFzsIL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/81etp3XAIEL._AC_SX679_.jpg\"]','{\"brand\": \"Oster\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-11-28 12:53:03.000000','2026-04-11 12:53:03.000000','[\"electrodomesticos\", \"cocina\"]',33,11),(26,'Tecnologia','Audifonos Bluetooth Sony WH-CH520','Bateria de larga duracion y sonido balanceado.',899.00,19,'https://m.media-amazon.com/images/I/41ETuD2aZRL._AC_SX300_SY300_QL70_ML2_.jpg','[\"https://m.media-amazon.com/images/I/71AQ4yidjFL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/71AQ4yidjFL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/71F3N9ONS7L._AC_SX522_.jpg\"]','{\"brand\": \"Sony\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-11-03 12:53:03.000000','2026-04-13 12:53:03.000000','[\"audio\", \"bluetooth\"]',41,12),(27,'Tecnologia','Parlante JBL Go 3','Parlante portatil resistente al agua.',999.00,18,'https://m.media-amazon.com/images/I/715ZUYP5N5L._AC_SX522_.jpg','[\"https://m.media-amazon.com/images/I/918lQmwtCwL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/81S5YOcGjyL._AC_SX522_.jpg\"]','{\"brand\": \"JBL\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-12-13 12:53:03.000000','2026-04-15 12:53:03.000000','[\"audio\", \"portatil\"]',47,12),(28,'Hogar','Escritorio Minimalista 120cm','Escritorio de trabajo ideal para home office.',2499.00,7,'https://m.media-amazon.com/images/I/81chqQOXLIL._AC_SX679_.jpg','[\"https://m.media-amazon.com/images/I/81kH9WtrVsL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/81eUm8WGVWL._AC_SX679_.jpg\"]','{\"currency\": \"MXN\", \"material\": \"madera-metal\", \"seed_tag\": \"DB-01\"}',1,'2025-09-24 12:53:03.000000','2026-04-08 12:53:03.000000','[\"escritorio\", \"home-office\"]',19,13),(29,'Tecnologia','Monitor LG 24 Pulgadas IPS','Monitor Full HD para trabajo y entretenimiento.',3999.00,9,'https://m.media-amazon.com/images/I/81rALfMyUWL._AC_SX522_.jpg','[\"https://m.media-amazon.com/images/I/71LmWsR+pvL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/61fMc9r5FxL._AC_SX522_.jpg\"]','{\"brand\": \"LG\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-10-29 12:53:03.000000','2026-04-16 12:53:03.000000','[\"monitor\", \"oficina\"]',27,13),(30,'Tecnologia','Disco SSD 1TB NVMe','Unidad de estado solido de alto rendimiento.',1499.00,21,'https://m.media-amazon.com/images/I/51YDo05UMyL._AC_SX522_.jpg','[\"https://m.media-amazon.com/images/I/51HTMnIhp2L._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/612wvIsno1L._AC_SX522_.jpg\"]','{\"currency\": \"MXN\", \"seed_tag\": \"DB-01\", \"capacidad\": \"1TB\"}',1,'2025-12-18 12:53:03.000000','2026-04-17 12:53:03.000000','[\"almacenamiento\", \"pc\"]',36,14),(31,'Tecnologia','Camara Web Logitech C920','Camara para videollamadas en Full HD.',1299.00,11,'https://m.media-amazon.com/images/I/71eGb1FcyiL._AC_SY300_SX300_QL70_ML2_.jpg','[\"https://m.media-amazon.com/images/I/713oLX7nuHL._AC_SX522_.jpg\", \"https://m.media-amazon.com/images/I/61ceNI7PhyL._AC_SX522_.jpg\"]','{\"brand\": \"Logitech\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-12-25 12:53:03.000000','2026-04-19 12:53:03.000000','[\"webcam\", \"streaming\"]',18,14),(32,'Hogar','Set de Toallas x6 Algodon','Toallas suaves de secado rapido para uso diario.',499.00,25,'https://m.media-amazon.com/images/I/51imYOqhayL._AC_SX679_.jpg','[\"https://m.media-amazon.com/images/I/61Qinr5QV7L._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/61S77tw+srL._AC_SX679_.jpg\"]','{\"currency\": \"MXN\", \"material\": \"algodon\", \"seed_tag\": \"DB-01\"}',1,'2025-08-05 12:53:03.000000','2026-04-03 12:53:03.000000','[\"bano\", \"hogar\"]',61,15),(33,'Hogar','Organizador de Zapatos 3 Niveles','Estructura metalica para organizar calzado en casa.',699.00,17,'https://m.media-amazon.com/images/I/61Znc7JKAXL._AC_SY300_SX300_QL70_ML2_.jpg','[\"https://m.media-amazon.com/images/I/71dNwnqtCBL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/71rEBtJbqqL._AC_SX679_.jpg\"]','{\"currency\": \"MXN\", \"material\": \"metal\", \"seed_tag\": \"DB-01\"}',1,'2025-11-18 12:53:03.000000','2026-04-09 12:53:03.000000','[\"organizacion\", \"hogar\"]',23,15),(34,'Hogar','Jabon en Barra x3','Paquete de jabon en barra para aseo diario.',45.00,80,'https://m.media-amazon.com/images/I/51xVv91HqmL._AC_SX679_.jpg','[\"https://m.media-amazon.com/images/I/61XqOTKVv5L._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/61Q1i55SDbL._AC_SX679_.jpg\"]','{\"tipo\": \"aseo personal\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-08-20 12:53:03.000000','2026-04-05 12:53:03.000000','[\"jabon\", \"hogar\"]',102,15),(35,'Hogar','Escoba de Microfibra con Repuesto','Escoba para piso con cabezal giratorio.',249.00,28,'https://m.media-amazon.com/images/I/81pyye40tnL._AC_SY300_SX300_QL70_ML2_.jpg','[\"https://m.media-amazon.com/images/I/81tlM4d79oL._AC_SX679_.jpg\", \"https://m.media-amazon.com/images/I/81DzTQ1Kp6L._AC_SX679_.jpg\"]','{\"tipo\": \"limpieza\", \"currency\": \"MXN\", \"seed_tag\": \"DB-01\"}',1,'2025-09-29 12:53:03.000000','2026-04-18 12:53:03.000000','[\"limpieza\", \"hogar\"]',44,9);
/*!40000 ALTER TABLE `products_product` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_product_insert` AFTER INSERT ON `products_product` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_product_update` AFTER UPDATE ON `products_product` FOR EACH ROW BEGIN
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

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_product_delete` AFTER DELETE ON `products_product` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `token_blacklist_blacklistedtoken`
--

DROP TABLE IF EXISTS `token_blacklist_blacklistedtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_blacklistedtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `blacklisted_at` datetime(6) NOT NULL,
  `token_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_id` (`token_id`),
  CONSTRAINT `token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk` FOREIGN KEY (`token_id`) REFERENCES `token_blacklist_outstandingtoken` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_blacklistedtoken`
--

LOCK TABLES `token_blacklist_blacklistedtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` DISABLE KEYS */;
INSERT INTO `token_blacklist_blacklistedtoken` VALUES (1,'2026-04-14 18:19:59.242797',1),(2,'2026-04-14 18:57:14.632458',4),(3,'2026-04-14 18:57:22.000702',6),(4,'2026-04-16 07:21:18.533762',8),(5,'2026-04-16 07:31:00.824919',10),(6,'2026-04-16 08:45:39.335232',12),(7,'2026-04-16 17:12:09.266811',14),(8,'2026-04-16 17:32:21.048693',16),(9,'2026-04-16 17:34:27.228180',18),(10,'2026-04-16 17:37:30.394717',20),(11,'2026-04-16 17:38:38.794331',22),(12,'2026-04-16 17:47:00.001932',24),(13,'2026-04-16 18:12:33.602888',26),(14,'2026-04-16 19:18:59.196652',28),(15,'2026-04-16 19:34:13.023176',30),(16,'2026-04-16 19:45:30.476004',32),(17,'2026-04-16 19:46:30.417046',34),(18,'2026-04-16 19:48:24.843256',36),(19,'2026-04-16 19:48:50.312322',38),(20,'2026-04-16 23:48:12.515033',40),(21,'2026-04-16 23:54:27.384482',43),(22,'2026-04-17 00:10:42.227312',45),(23,'2026-04-17 00:30:24.646066',47),(24,'2026-04-18 02:02:46.165769',50),(25,'2026-04-18 02:07:39.357579',52),(26,'2026-04-20 17:45:42.209537',54),(27,'2026-04-20 18:13:13.665703',59),(28,'2026-04-20 18:20:12.207447',61),(29,'2026-04-20 18:37:42.409480',63),(30,'2026-04-20 18:38:28.071239',65),(31,'2026-04-20 18:51:31.970290',67),(32,'2026-04-22 17:50:26.898838',70);
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_outstandingtoken`
--

DROP TABLE IF EXISTS `token_blacklist_outstandingtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_outstandingtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` longtext NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `jti` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq` (`jti`),
  KEY `token_blacklist_outs_user_id_83bc629a_fk_users_cus` (`user_id`),
  CONSTRAINT `token_blacklist_outs_user_id_83bc629a_fk_users_cus` FOREIGN KEY (`user_id`) REFERENCES `users_customuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_outstandingtoken`
--

LOCK TABLES `token_blacklist_outstandingtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` DISABLE KEYS */;
INSERT INTO `token_blacklist_outstandingtoken` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njc5NTU5OSwiaWF0IjoxNzc2MTkwNzk5LCJqdGkiOiI2OGM0NGRiYTBjYWE0YjE1YjYyMDg2Yzg5MzQwNmIyZSIsInVzZXJfaWQiOiIxIn0.gAeEwTTwXM4LXBjYqko06e92A5_Sg1bU-J-2OdUTvhA','2026-04-14 18:19:59.190425','2026-04-21 18:19:59.000000',1,'68c44dba0caa4b15b62086c893406b2e'),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njc5NTU5OSwiaWF0IjoxNzc2MTkwNzk5LCJqdGkiOiJiNzMxMWMwMjM4NjY0M2Y0YWJmNDZkODJlODk1NGNkNiIsInVzZXJfaWQiOiIxIn0.hGzY_mAF13YUii1LLihz5dKRBWGJ0A8OvauT0EtIqPE','2026-04-14 18:19:59.233538','2026-04-21 18:19:59.000000',1,'b7311c02386643f4abf46d82e8954cd6'),(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njc5NTgzOSwiaWF0IjoxNzc2MTkxMDM5LCJqdGkiOiIzZWM5YzhlN2VmYmI0Yjk5OGUwYzZjMWU3ZWVmOGM0NCIsInVzZXJfaWQiOiIxIn0.5ZhJ5XmP5d_BUCd454KA7iPEjjjURw75vdVVOvDG-PY','2026-04-14 18:23:59.628100','2026-04-21 18:23:59.000000',1,'3ec9c8e7efbb4b998e0c6c1e7eef8c44'),(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njc5NjE0OCwiaWF0IjoxNzc2MTkxMzQ4LCJqdGkiOiJlNTcyNDFmN2YwMmU0MDNhODAyZDU5NDM5MTA4Y2E2NCIsInVzZXJfaWQiOiIxIn0.-e0FDb4SM2Cg16WrL5e1LfmbleH4a7ugirg_d7qxOB0','2026-04-14 18:29:08.349953','2026-04-21 18:29:08.000000',1,'e57241f7f02e403a802d59439108ca64'),(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njc5NzgzNCwiaWF0IjoxNzc2MTkzMDM0LCJqdGkiOiIxNjk5N2RkMTYzODg0NjQ1YjY1M2JkNWFjZWEwODNhYiIsInVzZXJfaWQiOiIxIn0.aKP20sGjCaiqHj0ccyCqeOknuQanOJ06VBmfy7ef72U','2026-04-14 18:57:14.614633','2026-04-21 18:57:14.000000',1,'16997dd163884645b653bd5acea083ab'),(6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njc5Nzg0MSwiaWF0IjoxNzc2MTkzMDQxLCJqdGkiOiI2OGE3MjFmMzc0OTY0ZTFmODRhMzc3NzRjZjc5NjE5YyIsInVzZXJfaWQiOiIxIn0.pvCjVwCsNfG1gLvsGveCYnanYiDJ1Q5muByNJbizFdY','2026-04-14 18:57:21.935925','2026-04-21 18:57:21.000000',1,'68a721f374964e1f84a37774cf79619c'),(7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njc5Nzg0MSwiaWF0IjoxNzc2MTkzMDQxLCJqdGkiOiIyYTIwOWQ3NzBhZTg0Mjg1YjEzMjhlMGFkYmJiZTc3NyIsInVzZXJfaWQiOiIxIn0.d5923p5v7Hdb7ImvvJbU8wiGTfVkIsZBx2y4PMe_6KU','2026-04-14 18:57:21.984815','2026-04-21 18:57:21.000000',1,'2a209d770ae84285b1328e0adbbbe777'),(8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njc5Nzg1NSwiaWF0IjoxNzc2MTkzMDU1LCJqdGkiOiI4YTNkZDhmMjAwYzg0YmRiOGUxZTZmNjk4NDAxMGJjMSIsInVzZXJfaWQiOiIxIn0.nICXLcyWDtAkbGqZgjv053pcNLkFnXGI_xyDG1_PhTM','2026-04-14 18:57:35.996416','2026-04-21 18:57:35.000000',1,'8a3dd8f200c84bdb8e1e6f6984010bc1'),(9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NjkyODg3OCwiaWF0IjoxNzc2MzI0MDc4LCJqdGkiOiJiOTg0NjRlMmExNTA0MDI4OWFmYzYzMWU3ZjQ4MTc3MSIsInVzZXJfaWQiOiIxIn0.mW6jJ_BCA6DTupKBHAVD7CSzoj7lNZk-CHwRG25XnEY','2026-04-16 07:21:18.431246','2026-04-23 07:21:18.000000',1,'b98464e2a15040289afc631e7f481771'),(10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NjkyODkwNiwiaWF0IjoxNzc2MzI0MTA2LCJqdGkiOiJkNWE1NWVjNjhhYzQ0ZGE3OGI2N2M4YjM5ODg4OWIwZSIsInVzZXJfaWQiOiIxIn0.IoIwovsMyyX_lHM4DYclpmY70J7CRP5XVQUcv8GBdzU','2026-04-16 07:21:46.163159','2026-04-23 07:21:46.000000',1,'d5a55ec68ac44da78b67c8b398889b0e'),(11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NjkyOTQ2MCwiaWF0IjoxNzc2MzI0NjYwLCJqdGkiOiI1MmE5ZjNjZTNjYjQ0MWYwYWMwNjJjNjEyMjc2ZjY0YyIsInVzZXJfaWQiOiIxIn0.f4E8HqvkY3iVwbh0nXsQtCtAmrA7C4D0CnxA1lYz70A','2026-04-16 07:31:00.816431','2026-04-23 07:31:00.000000',1,'52a9f3ce3cb441f0ac062c612276f64c'),(12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NjkzMzg4NywiaWF0IjoxNzc2MzI5MDg3LCJqdGkiOiI4YjdlMDYxM2JiMTM0NjU2ODllNTM4NTUwZTU3YjkzYyIsInVzZXJfaWQiOiIxIn0.G7P44ohNt6pbfqASnnP-40KrYz4ob8pYHilXGdGTQi0','2026-04-16 08:44:47.760132','2026-04-23 08:44:47.000000',1,'8b7e0613bb13465689e538550e57b93c'),(13,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NjkzMzkzOSwiaWF0IjoxNzc2MzI5MTM5LCJqdGkiOiI3ODVkNThlZjJjODE0YWJlODcxNjMyNmNhZDRiYmY0MiIsInVzZXJfaWQiOiIxIn0.ZAFWmYMWfnZXa_kfdBgmIHWcYV_nN1VVbMjHlzGNAd4','2026-04-16 08:45:39.323062','2026-04-23 08:45:39.000000',1,'785d58ef2c814abe8716326cad4bbf42'),(14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2Mzk5MywiaWF0IjoxNzc2MzU5MTkzLCJqdGkiOiIxY2FmMDBiYjQ5NjQ0ZjA2OWVlNzJhNDU4NDMzMTM5MiIsInVzZXJfaWQiOiIxIn0.ESv4r7B7QBo15sgc7uUqK5wrUShTlYiUSPPfy_RsuEI','2026-04-16 17:06:33.464124','2026-04-23 17:06:33.000000',1,'1caf00bb49644f069ee72a4584331392'),(15,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2NDMyOSwiaWF0IjoxNzc2MzU5NTI5LCJqdGkiOiIxMDk3NDVkZGI4YTg0MjU0OTBhNmU2ZWM4OTkzY2NmZCIsInVzZXJfaWQiOiIxIn0.H9RbBw_ab6W7XbiHS1icfmtrKxzaybVLC5j7G3jaVik','2026-04-16 17:12:09.248915','2026-04-23 17:12:09.000000',1,'109745ddb8a8425490a6e6ec8993ccfd'),(16,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2NTIzMCwiaWF0IjoxNzc2MzYwNDMwLCJqdGkiOiI2NDkxOTI2OWM5NGE0MmZiOGM2NTQxNDU4MTI4YjRkYiIsInVzZXJfaWQiOiIxIn0.IbrrxdiGNRRjpNtgeRKWwOGU6-3m3gHngY2p2vFV_rA','2026-04-16 17:27:10.850123','2026-04-23 17:27:10.000000',1,'64919269c94a42fb8c6541458128b4db'),(17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2NTU0MSwiaWF0IjoxNzc2MzYwNzQxLCJqdGkiOiIyNWQxMTEzOWM5YWU0NWE2YjQ5ZTIwNThhMmU4YzUyZSIsInVzZXJfaWQiOiIxIn0.0S0LvapI7aC-MmkIXx5LzcZUcE8HUhkm0bzB6Kza9v8','2026-04-16 17:32:21.031204','2026-04-23 17:32:21.000000',1,'25d11139c9ae45a6b49e2058a2e8c52e'),(18,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2NTU0NywiaWF0IjoxNzc2MzYwNzQ3LCJqdGkiOiI3MzZjMjg4MmVjZjc0NDJhYWY1ZGVlN2UzOWQwMjk2NCIsInVzZXJfaWQiOiIxIn0.iR2at4B_ZEftMFCdgcjlnf7V1pHfvMyAtDbIadUV6DI','2026-04-16 17:32:27.122865','2026-04-23 17:32:27.000000',1,'736c2882ecf7442aaf5dee7e39d02964'),(19,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2NTY2NywiaWF0IjoxNzc2MzYwODY3LCJqdGkiOiIwNDVkYTRjMjkzNGQ0MDUyODBlZmViZmM5OTRlNjg4MiIsInVzZXJfaWQiOiIxIn0.fC9Ol4CEiRrEDlbbn-KrwWAAc-_C_f7Uj-_sStcfPkw','2026-04-16 17:34:27.203029','2026-04-23 17:34:27.000000',1,'045da4c2934d405280efebfc994e6882'),(20,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2NTY5NSwiaWF0IjoxNzc2MzYwODk1LCJqdGkiOiIyMzYyYjZmMGU4ZjE0MDIwYTJkZWFlZTgzNjc0YWIwYSIsInVzZXJfaWQiOiIxIn0.POSO7aLHCcLJVIN9sT0GN5lJk7rKF8OtrH9_250NFs0','2026-04-16 17:34:55.952185','2026-04-23 17:34:55.000000',1,'2362b6f0e8f14020a2deaee83674ab0a'),(21,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2NTg1MCwiaWF0IjoxNzc2MzYxMDUwLCJqdGkiOiI1M2U5Y2JjMGE3ZGM0NDhlOTQzNGZjNGQ1YzY3ZmZjNSIsInVzZXJfaWQiOiIxIn0.BlSyy2UoXCwNheuX9wnMZ23jgBAhAIFKELUDo9QNETo','2026-04-16 17:37:30.354931','2026-04-23 17:37:30.000000',1,'53e9cbc0a7dc448e9434fc4d5c67ffc5'),(22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2NTg1NiwiaWF0IjoxNzc2MzYxMDU2LCJqdGkiOiJlYTQ0NDZiMzkwYmY0YmRjYjJhM2EyMTI0MWI5MWE0MCIsInVzZXJfaWQiOiIxIn0.XhJCMmGc5v2ZeFOIUcp_ra5mypv61AggJhn3sBGVXn4','2026-04-16 17:37:36.201687','2026-04-23 17:37:36.000000',1,'ea4446b390bf4bdcb2a3a21241b91a40'),(23,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2NTkxOCwiaWF0IjoxNzc2MzYxMTE4LCJqdGkiOiI0YTU3YTM4YTE4OTA0ZGIyYjMxMWQxZDY1NzEwNjdmNiIsInVzZXJfaWQiOiIxIn0.UDt7fm26bFT7B2YHU20T_Z_HBi5N49nSE2CxW-E7vD8','2026-04-16 17:38:38.779132','2026-04-23 17:38:38.000000',1,'4a57a38a18904db2b311d1d6571067f6'),(24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2NTkyMywiaWF0IjoxNzc2MzYxMTIzLCJqdGkiOiJmMTIyYjc2YzQyMTI0YTcxOTNjMzViYTJhYTAwNTVkZSIsInVzZXJfaWQiOiIxIn0.FkrKu7uQI5St63tZhHN1ixEYO78lNURN1ePho8pxp3E','2026-04-16 17:38:43.734840','2026-04-23 17:38:43.000000',1,'f122b76c42124a7193c35ba2aa0055de'),(25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2NjQxOSwiaWF0IjoxNzc2MzYxNjE5LCJqdGkiOiJjNjE2YjhlOGM4NDE0ZmJiODIzNjk5ZDFlNWFkNTNlNSIsInVzZXJfaWQiOiIxIn0.Qihu4qfdraRuzvcrNgt_npfD1jOloVT7LmQF7BxMHYs','2026-04-16 17:46:59.994285','2026-04-23 17:46:59.000000',1,'c616b8e8c8414fbb823699d1e5ad53e5'),(26,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2NjYxMSwiaWF0IjoxNzc2MzYxODExLCJqdGkiOiI0YzgxM2FlOWYxNGM0NWRjYjRlNThkOTNmMzYwYWFmNCIsInVzZXJfaWQiOiIxIn0.DbCJLqmJuOIKgDfa4dXmxTntGZ-_C3L3WVkp-Y_TZV4','2026-04-16 17:50:11.074974','2026-04-23 17:50:11.000000',1,'4c813ae9f14c45dcb4e58d93f360aaf4'),(27,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2Nzk1MywiaWF0IjoxNzc2MzYzMTUzLCJqdGkiOiJiNDExMDIwYmQzMDI0MzFlYjA5Y2M1MWVmN2M0MmUwOCIsInVzZXJfaWQiOiIxIn0.Am-ehqx7jpK-Cx7TIGVmvmKHu0QIAviObpDtcdrjBZc','2026-04-16 18:12:33.576303','2026-04-23 18:12:33.000000',1,'b411020bd302431eb09cc51ef7c42e08'),(28,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk2ODI2NSwiaWF0IjoxNzc2MzYzNDY1LCJqdGkiOiJkZjY1MjhkMTBmYTI0OWYwYTc4Mjg2YWJhZjM4MTYwNSIsInVzZXJfaWQiOiIxIn0.i-4UUKSdk_HkPowu83IbLP5wGF44gJAVui-IMM-fXRE','2026-04-16 18:17:45.014043','2026-04-23 18:17:45.000000',1,'df6528d10fa249f0a78286abaf381605'),(29,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk3MTkzOSwiaWF0IjoxNzc2MzY3MTM5LCJqdGkiOiJiYjUzYzI0ODYxMmI0NDliYWEzMGIyODYxNWY2NTViYSIsInVzZXJfaWQiOiIxIn0.0CsGFGll-X20prXTEtY5GMUH7kPYhnIVP79CQWRGyyQ','2026-04-16 19:18:59.159116','2026-04-23 19:18:59.000000',1,'bb53c248612b449baa30b28615f655ba'),(30,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk3Mjg1MiwiaWF0IjoxNzc2MzY4MDUyLCJqdGkiOiIzMDc3ZjIwYTFlMGU0OWYyYWI4ZDBhMGY2ZTRlMzhhZiIsInVzZXJfaWQiOiIyIn0.KFfjuJtEeN5ERcCKPZrPdGP_IefKsVmoy_ixikr1-CM','2026-04-16 19:34:12.939126','2026-04-23 19:34:12.000000',2,'3077f20a1e0e49f2ab8d0a0f6e4e38af'),(31,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk3Mjg1MywiaWF0IjoxNzc2MzY4MDUzLCJqdGkiOiIwYWE1NmQ4YjhkZWI0MjVhOGE3NWIxMjMxMmY4YzlkZiIsInVzZXJfaWQiOiIyIn0.QqMYwr74V6EaAs-6Dwh2OmeUAfX52zt2rRE6E6r6wWU','2026-04-16 19:34:13.010474','2026-04-23 19:34:13.000000',2,'0aa56d8b8deb425a8a75b12312f8c9df'),(32,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk3MzUyOSwiaWF0IjoxNzc2MzY4NzI5LCJqdGkiOiI5MjUwN2UwNDgxNTA0NzRlODMwZDg5ZTc3OTAwOGMzZiIsInVzZXJfaWQiOiIxIn0.ct0Gt91uoxAE0R5McRL74JcwK9a_8uwDUcENBK7E99I','2026-04-16 19:45:29.951213','2026-04-23 19:45:29.000000',1,'92507e048150474e830d89e779008c3f'),(33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk3MzUzMCwiaWF0IjoxNzc2MzY4NzMwLCJqdGkiOiJlYzFjYTNhMjgxOTA0OTc1OTcxYzdmMmUyMWZlNjA1NyIsInVzZXJfaWQiOiIxIn0.WoyzykA_RX1hPjTwWXRcP3R5vMQbtqt8zTcjh_zsjmw','2026-04-16 19:45:30.463632','2026-04-23 19:45:30.000000',1,'ec1ca3a281904975971c7f2e21fe6057'),(34,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk3MzU4OSwiaWF0IjoxNzc2MzY4Nzg5LCJqdGkiOiJmOTliOWM5OWU3OGM0NWI2OGYxMmU1NzBkMmQyNzc4YSIsInVzZXJfaWQiOiIxIn0.wmRhp0XPy-YsWv0LYFAeS_5h6nmviEOG4lT5-KjLDiE','2026-04-16 19:46:29.889164','2026-04-23 19:46:29.000000',1,'f99b9c99e78c45b68f12e570d2d2778a'),(35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk3MzU5MCwiaWF0IjoxNzc2MzY4NzkwLCJqdGkiOiJhYjMwYjlmYjg1ODQ0Y2E2ODAzZGMwZTQxZmVkNjFkYyIsInVzZXJfaWQiOiIxIn0.g9pb40Ev939u-CpjinAftIM49UQXkT2ZKZZatZhcNMM','2026-04-16 19:46:30.404468','2026-04-23 19:46:30.000000',1,'ab30b9fb85844ca6803dc0e41fed61dc'),(36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk3MzcwNCwiaWF0IjoxNzc2MzY4OTA0LCJqdGkiOiJmMzIyMDBjMTViZWU0YTNhOWYzNTZiOTk3MjIyMWMyOCIsInVzZXJfaWQiOiIxIn0.soDJbqLnmDpHL-jREiB_KaZgOgK-0dpJKZWzf5hWQ8I','2026-04-16 19:48:24.202973','2026-04-23 19:48:24.000000',1,'f32200c15bee4a3a9f356b9972221c28'),(37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk3MzcwNCwiaWF0IjoxNzc2MzY4OTA0LCJqdGkiOiI5NzI4YTdkOTAyZmI0OTdmOWU3NGJkNGZlMTY2N2NlOSIsInVzZXJfaWQiOiIxIn0.eEnnswpjoUi2CP45yTp9pONoCL2KoYa9shLqO3yKqb8','2026-04-16 19:48:24.825016','2026-04-23 19:48:24.000000',1,'9728a7d902fb497f9e74bd4fe1667ce9'),(38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk3MzcyOSwiaWF0IjoxNzc2MzY4OTI5LCJqdGkiOiIzYjZkNWJhZmM0ZTc0YjMyOTVkMTUyNTc1ZDg5OGQ1NyIsInVzZXJfaWQiOiIxIn0.FqE7zPN44H9vQhQe0uuZ_xpvGcXY7JWn8Wp3bksfZRc','2026-04-16 19:48:49.876699','2026-04-23 19:48:49.000000',1,'3b6d5bafc4e74b3295d152575d898d57'),(39,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk3MzczMCwiaWF0IjoxNzc2MzY4OTMwLCJqdGkiOiI1N2I2YTY0NjI5Y2U0ZTU5YjYyYmM2YTJkMzZhZTFiZSIsInVzZXJfaWQiOiIxIn0.CdKFiqQuOuezgV2dCTpWnYTNA51mgKt0HJ17eMhSe3k','2026-04-16 19:48:50.299465','2026-04-23 19:48:50.000000',1,'57b6a64629ce4e59b62bc6a2d36ae1be'),(40,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk3MzgzNiwiaWF0IjoxNzc2MzY5MDM2LCJqdGkiOiJiMmE4NjliZjVhODM0Y2JjOGEzMjg4M2E5Y2E5ZGQ1OCIsInVzZXJfaWQiOiIxIn0._rLvpF6MSUrreJm1AlDJMfF3pCsKGj8f6XSUvQ219_A','2026-04-16 19:50:36.522690','2026-04-23 19:50:36.000000',1,'b2a869bf5a834cbc8a32883a9ca9dd58'),(41,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk4ODA5MiwiaWF0IjoxNzc2MzgzMjkyLCJqdGkiOiI5YjJlMWUxZjBjMGE0MzU4OWZmNGQ2NGFmYjQyY2U4ZSIsInVzZXJfaWQiOiIxIn0.xTsejoWB5dzLXwfLbRa2KwxoD9lkfWBwWWvQ7q3kJzA','2026-04-16 23:48:12.478385','2026-04-23 23:48:12.000000',1,'9b2e1e1f0c0a43589ff4d64afb42ce8e'),(42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk4ODMwNiwiaWF0IjoxNzc2MzgzNTA2LCJqdGkiOiJhYmQ0MzhkZmIwMGY0OWJlYjllMWU1MzA5MDM1MzNhYSIsInVzZXJfaWQiOiIxIn0.pVohS85Hb412UOVGf7FmSjbuROOCeNKiwrtbOgVOtaY','2026-04-16 23:51:46.157589','2026-04-23 23:51:46.000000',1,'abd438dfb00f49beb9e1e530903533aa'),(43,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk4ODQxNywiaWF0IjoxNzc2MzgzNjE3LCJqdGkiOiI1M2E2M2Y4ZjRlMjg0YzU4YTJmYTkxODA5ZTUxZDU1MyIsInVzZXJfaWQiOiIzIn0.b1dyEvrkFJNnlTxBI_XZHAdUnL2pSkIzip27c-Ituck','2026-04-16 23:53:37.972196','2026-04-23 23:53:37.000000',3,'53a63f8f4e284c58a2fa91809e51d553'),(44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk4ODQ2NywiaWF0IjoxNzc2MzgzNjY3LCJqdGkiOiJlZmNkZDMyM2UzOGM0ODhjYWZmZGE4NWFjMGJhNTAwNSIsInVzZXJfaWQiOiIzIn0.y6sXf69T1wArtOfQIZ5gtM03jy_HNMPpyRkHBmujZmQ','2026-04-16 23:54:27.374852','2026-04-23 23:54:27.000000',3,'efcdd323e38c488caffda85ac0ba5005'),(45,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk4ODQ4NywiaWF0IjoxNzc2MzgzNjg3LCJqdGkiOiI5MjI3Y2QzYzc2ODU0NmFhYmM0OTJjZjZlNmM0ODRiOCIsInVzZXJfaWQiOiIzIn0.PUTZsSvmuDZ3fk24ERB1V7Her8RYqLDhfsxXDr_RSt0','2026-04-16 23:54:47.452122','2026-04-23 23:54:47.000000',3,'9227cd3c768546aabc492cf6e6c484b8'),(46,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk4OTQ0MiwiaWF0IjoxNzc2Mzg0NjQyLCJqdGkiOiJkZTQ2ZGJjYWJkYjk0NDllOWFkYWFjNGIxNjQ5ZjVmYiIsInVzZXJfaWQiOiIzIn0.Caeqx8zX8TEDSldlv_a0kfJfyOYjHgq9QcS3kWVzHNQ','2026-04-17 00:10:42.202126','2026-04-24 00:10:42.000000',3,'de46dbcabdb9449e9adaac4b1649f5fb'),(47,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk5MDU1MSwiaWF0IjoxNzc2Mzg1NzUxLCJqdGkiOiJkMGRjZWJkMjE0ZTI0MDljOWNiYmMzOGIyYmYwZTM1MiIsInVzZXJfaWQiOiIxIn0.IDL4i2NEM224AR84iN8mdILJelJ_yqLV3P1xdN9F5S8','2026-04-17 00:29:11.542329','2026-04-24 00:29:11.000000',1,'d0dcebd214e2409c9cbbc38b2bf0e352'),(48,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk5MDYyNCwiaWF0IjoxNzc2Mzg1ODI0LCJqdGkiOiJkYWM3NjZkZjE1ZDA0YjA4OTlmNjk1ZTRiOWFmNzI2MCIsInVzZXJfaWQiOiIxIn0.eXx-b-IDKtmqTI18gUpCMuVdOG3lFzJp4Y15Tysdoe4','2026-04-17 00:30:24.638395','2026-04-24 00:30:24.000000',1,'dac766df15d04b0899f695e4b9af7260'),(49,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3Njk5MTM5MSwiaWF0IjoxNzc2Mzg2NTkxLCJqdGkiOiI1MTBmYjc2NzZiYmI0ODljYTAyZTkyOTRlMDhjYTFiNSIsInVzZXJfaWQiOiIxIn0.at3RtB1qrdJgwKeU7WKL_AiIzh7w6MXTTWcv_g2DPjM','2026-04-17 00:43:11.281894','2026-04-24 00:43:11.000000',1,'510fb7676bbb489ca02e9294e08ca1b5'),(50,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzA4MjU2NiwiaWF0IjoxNzc2NDc3NzY2LCJqdGkiOiJkOTY1MjZlYzczNmM0ZDVmYWY1YjM1MmZjMDczYWM0ZiIsInVzZXJfaWQiOiI0In0.YfkCZjil7xTw7xg-P9vQqJvmkmVWN_dzUGDuxJTLsG4','2026-04-18 02:02:46.078781','2026-04-25 02:02:46.000000',4,'d96526ec736c4d5faf5b352fc073ac4f'),(51,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzA4MjU2NiwiaWF0IjoxNzc2NDc3NzY2LCJqdGkiOiI4MzAzZGExMzkzMzc0YzdiYjJkMjE4OTlkZmU2ZmIxYiIsInVzZXJfaWQiOiI0In0.NvSlBxeWjiFgiY9W4J42xa9cHEjbo_SAcXu08sjFzV8','2026-04-18 02:02:46.155630','2026-04-25 02:02:46.000000',4,'8303da1393374c7bb2d21899dfe6fb1b'),(52,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzA4Mjc1MSwiaWF0IjoxNzc2NDc3OTUxLCJqdGkiOiI0NmNlOGE5Njk0NDM0MTZmOGMyZDBjNmUzMjhiNWJjYSIsInVzZXJfaWQiOiIxIn0.0j9aggpOibfy_A8V-DqVSGLDRQk7RfI80J80Zby0840','2026-04-18 02:05:51.805445','2026-04-25 02:05:51.000000',1,'46ce8a969443416f8c2d0c6e328b5bca'),(53,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzA4Mjg1OSwiaWF0IjoxNzc2NDc4MDU5LCJqdGkiOiI1M2U1ZDQzM2Y0ZDQ0YjkxODk3YzBkOWM2MTg5MjZlNiIsInVzZXJfaWQiOiIxIn0.63ubqn04oO0PxI5AwJHb1iettOFNWkFhHamr70CErPA','2026-04-18 02:07:39.345317','2026-04-25 02:07:39.000000',1,'53e5d433f4d44b91897c0d9c618926e6'),(54,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzA4Mjg2OCwiaWF0IjoxNzc2NDc4MDY4LCJqdGkiOiJiNmY4YTA1OWIyMWE0Yjk5OWRlODNmN2MwNzcyODU5NyIsInVzZXJfaWQiOiI0In0.d7hErjdZpukz793jtPABBv-vYad0dKHlDlfbmPXF-Tg','2026-04-18 02:07:48.997435','2026-04-25 02:07:48.000000',4,'b6f8a059b21a4b999de83f7c07728597'),(55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxMTk0MiwiaWF0IjoxNzc2NzA3MTQyLCJqdGkiOiJjNjFhNWY0NDFiODc0ODMwOTA2MWE2NjVhYjY1YjQzYyIsInVzZXJfaWQiOiI0In0.RQ-Wr5aCRUzrZDgiU28ba3lNhnQR8OiWGhlXmgSRyqQ','2026-04-20 17:45:42.172312','2026-04-27 17:45:42.000000',4,'c61a5f441b8748309061a665ab65b43c'),(56,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxMjc4MiwiaWF0IjoxNzc2NzA3OTgyLCJqdGkiOiI4YWVjZWYwNjdjZWE0NDA4OGZhZGJlNDQ2MmZmNmQ5OCIsInVzZXJfaWQiOiIxIn0.bSxAAeI-BlnDBoi-AqAhK_qr5hRF-T3J9e0D-Ys2GcY','2026-04-20 17:59:42.829342','2026-04-27 17:59:42.000000',1,'8aecef067cea44088fadbe4462ff6d98'),(57,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxMzIwNiwiaWF0IjoxNzc2NzA4NDA2LCJqdGkiOiJjYjkxMWZhOTFiYzg0MGI4YmE0YTBkMmI2MWE2NWEyMyIsInVzZXJfaWQiOiIxIn0.nx3d9DU-KKcCcc-zsVo8apWr-DpzSmidxfhgQfPdQFs','2026-04-20 18:06:46.207014','2026-04-27 18:06:46.000000',1,'cb911fa91bc840b8ba4a0d2b61a65a23'),(58,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxMzQyNiwiaWF0IjoxNzc2NzA4NjI2LCJqdGkiOiIzZjcyZmYzNDgzZmQ0OWFlYjcxYjQwOGFjOTI2ZmM4MCIsInVzZXJfaWQiOiIxIn0.2kbVbhhU9VnQaBMcWsbYB1t_fvhiX4ErVGCYD43lrwA','2026-04-20 18:10:26.340747','2026-04-27 18:10:26.000000',1,'3f72ff3483fd49aeb71b408ac926fc80'),(59,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxMzU0MiwiaWF0IjoxNzc2NzA4NzQyLCJqdGkiOiJiOWVkOGVmNmQ0ZDk0Y2M2OTBhNjE1ZDViMWFlNGIxNCIsInVzZXJfaWQiOiIxIn0._1CMRdRjP2Xox9PlauRZhUorcavapnbkkHjJ0L6wVuI','2026-04-20 18:12:22.762577','2026-04-27 18:12:22.000000',1,'b9ed8ef6d4d94cc690a615d5b1ae4b14'),(60,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxMzU5MywiaWF0IjoxNzc2NzA4NzkzLCJqdGkiOiIyYjNkMzhjNjVhZTA0ZDNiYTFjNjFlZDZhNmUyOWFmZiIsInVzZXJfaWQiOiIxIn0.TgulLYYqlj2_LKRBMkh9xFOif6T3ly-T1cooXkr7ktU','2026-04-20 18:13:13.650645','2026-04-27 18:13:13.000000',1,'2b3d38c65ae04d3ba1c61ed6a6e29aff'),(61,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxMzk2OCwiaWF0IjoxNzc2NzA5MTY4LCJqdGkiOiIzZDE2NjM1NDhiYjU0ZmQwYjVlNjYyZDgzOTQwM2FmNSIsInVzZXJfaWQiOiIxIn0.DeJrbTm2ge3dqCTvTf1Q0zcyzDm7tNGsc4a-5lSshgs','2026-04-20 18:19:28.233266','2026-04-27 18:19:28.000000',1,'3d1663548bb54fd0b5e662d839403af5'),(62,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxNDAxMiwiaWF0IjoxNzc2NzA5MjEyLCJqdGkiOiI4ODJmOTQ2YmY4MmY0MzI2YjQzY2FlZTU4YzE1NDIyMiIsInVzZXJfaWQiOiIxIn0.oGptxVEoqCg7OqgOESHTE70AWqhRQWtBf4QEybP6zfw','2026-04-20 18:20:12.195122','2026-04-27 18:20:12.000000',1,'882f946bf82f4326b43caee58c154222'),(63,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxNTA2MCwiaWF0IjoxNzc2NzEwMjYwLCJqdGkiOiJhOGUyODIzYmYxYWU0MjJmODhhNWZiOTkyMTFlYTkwZSIsInVzZXJfaWQiOiIxIn0.g-s46ZfNDBmwnq1ACfBHIkTM5Zme3q8naf84cgsvNlo','2026-04-20 18:37:40.818560','2026-04-27 18:37:40.000000',1,'a8e2823bf1ae422f88a5fb99211ea90e'),(64,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxNTA2MiwiaWF0IjoxNzc2NzEwMjYyLCJqdGkiOiI4NWJiMTJmYTE0Yzc0YjBkYjM3ZWM5MjRkMWE5MjMxYyIsInVzZXJfaWQiOiIxIn0.EBNhOD_Rzu6iQO-AWWPXihbQOyftViIcHkQ-3gsj588','2026-04-20 18:37:42.397541','2026-04-27 18:37:42.000000',1,'85bb12fa14c74b0db37ec924d1a9231c'),(65,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxNTA3MSwiaWF0IjoxNzc2NzEwMjcxLCJqdGkiOiI1N2I3YWM4YzhhMDM0NDBmODAyODBiMDEyMjMzYzM2OCIsInVzZXJfaWQiOiIxIn0.1-k0AdMkbHVZwTfEItyawOum1FDO5368KWzDigOx5TE','2026-04-20 18:37:51.725646','2026-04-27 18:37:51.000000',1,'57b7ac8c8a03440f80280b012233c368'),(66,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxNTEwOCwiaWF0IjoxNzc2NzEwMzA4LCJqdGkiOiJmMWIzNDVmYTlkMzI0NzM4OTJiNDliMzcyMWM5YTQzYSIsInVzZXJfaWQiOiIxIn0.ot7xoAj4Fw7f8R1E6noFUFLElnSETzk4gSiozd1FC6w','2026-04-20 18:38:28.060248','2026-04-27 18:38:28.000000',1,'f1b345fa9d32473892b49b3721c9a43a'),(67,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxNTg5MCwiaWF0IjoxNzc2NzExMDkwLCJqdGkiOiIxOTdkZjM1ZmM5MDU0MTFhODM0ZjQ4NTA4MTU5ZDRmYyIsInVzZXJfaWQiOiIxIn0.eqqOkCJlGEjU_8eJRXellEx08WMhU2_CKVEZi0AQIvw','2026-04-20 18:51:30.093149','2026-04-27 18:51:30.000000',1,'197df35fc905411a834f48508159d4fc'),(68,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzMxNTg5MSwiaWF0IjoxNzc2NzExMDkxLCJqdGkiOiI4OWFiOTZmZjAxMmE0MTcxYTZkYjZlYzIwZjFiZmM2ZCIsInVzZXJfaWQiOiIxIn0.hO559YhtgyTXEkn2JnMIESSCr2tz6QJmiUs4XqSUB1g','2026-04-20 18:51:31.960136','2026-04-27 18:51:31.000000',1,'89ab96ff012a4171a6db6ec20f1bfc6d'),(69,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzQ4NDgxMSwiaWF0IjoxNzc2ODgwMDExLCJqdGkiOiJmODYwYjkxZGJjYzk0MDRhYmQwOTI0YWRlMDQ4N2QxYSIsInVzZXJfaWQiOiIxIn0.xwFYvdayvAhIT32I2M1VHqPDjpLMBPJef9_AoG5ar2o','2026-04-22 17:46:51.044713','2026-04-29 17:46:51.000000',1,'f860b91dbcc9404abd0924ade0487d1a'),(70,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzQ4NDg0MCwiaWF0IjoxNzc2ODgwMDQwLCJqdGkiOiI1MDBlOWNlMjkxYzE0NWJiOTRiNzQwOWRiZjQyNjM2ZCIsInVzZXJfaWQiOiIyIn0.I_uQrneVKtiRCH9l7Z_ASkYgjX9DkaSo55nS9L94_po','2026-04-22 17:47:20.106800','2026-04-29 17:47:20.000000',2,'500e9ce291c145bb94b7409dbf42636d'),(71,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzQ4NTAyNiwiaWF0IjoxNzc2ODgwMjI2LCJqdGkiOiJmNjcwOGNhMjY2ODY0ODFlOTgyYjE2MzRlZTUyZmQ5MSIsInVzZXJfaWQiOiIyIn0.Z2bWYZXK2U0cVniI2K5AHfn7y5aYOUg1W4bUTPIUKLg','2026-04-22 17:50:26.883943','2026-04-29 17:50:26.000000',2,'f6708ca26686481e982b1634ee52fd91'),(72,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzQ4NTc5MywiaWF0IjoxNzc2ODgwOTkzLCJqdGkiOiIyYTYwYTY4MmEzNDE0OTdlOTcwMDkxYzhhZjQ0ZjNjYyIsInVzZXJfaWQiOiIzIn0.PGoVc4cYXssHFERrjtP8oaDOq0WIMkrpcRGoATTimJk','2026-04-22 18:03:13.890006','2026-04-29 18:03:13.000000',3,'2a60a682a341497e970091c8af44f3cc'),(73,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzQ4NTgxNywiaWF0IjoxNzc2ODgxMDE3LCJqdGkiOiIwYjNjNWRlMzk2M2U0NjFiODI0NmU5YzhhN2UzYzUyOCIsInVzZXJfaWQiOiI0In0.x_qF_kVfGmi4h1O861vLdl7_9Kk7FTOy4bToyr8FpXY','2026-04-22 18:03:37.472980','2026-04-29 18:03:37.000000',4,'0b3c5de3963e461b8246e9c8a7e3c528'),(74,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzQ4NTk0MSwiaWF0IjoxNzc2ODgxMTQxLCJqdGkiOiIyMTJiNzc4M2RhY2U0MTdlODliNjdhMjE4YzU4MjUxZSIsInVzZXJfaWQiOiI0In0.zFow-s9T-UBFaYDrjkUnhhB1yXBhHz880j2BNvz2l5o','2026-04-22 18:05:41.937597','2026-04-29 18:05:41.000000',4,'212b7783dace417e89b67a218c58251e');
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_address`
--

DROP TABLE IF EXISTS `users_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_address` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `street` varchar(255) NOT NULL,
  `street_number` varchar(20) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `is_default` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_address_user_id_4c106ba4_fk_users_customuser_id` (`user_id`),
  CONSTRAINT `users_address_user_id_4c106ba4_fk_users_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `users_customuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_address`
--

LOCK TABLES `users_address` WRITE;
/*!40000 ALTER TABLE `users_address` DISABLE KEYS */;
INSERT INTO `users_address` VALUES (1,'test','124','test','test','62220',1,'2026-04-16 07:22:33.987874','2026-04-16 07:22:33.987898',1),(2,'test','321','CUERNAVACA','morelos','62220',0,'2026-04-16 17:07:07.022777','2026-04-16 17:07:07.022814',1),(4,'test','123123','CUERNAVACA','morelos','62220',1,'2026-04-16 23:55:11.966761','2026-04-16 23:55:11.966780',3),(6,'test','123123','CUERNAVACA','morelos','62220',1,'2026-04-18 02:06:50.611206','2026-04-18 02:06:50.611250',4),(7,'test','123123','CUERNAVACA','morelos','62220',0,'2026-04-20 18:14:51.665313','2026-04-20 18:14:51.665339',1),(8,'Avenida Insurgentes Sur','101','Ciudad de Mexico','CDMX','03100',1,'2024-11-18 12:53:03.000000','2026-04-10 12:53:03.000000',5),(9,'Avenida Reforma','245','Ciudad de Mexico','CDMX','06600',1,'2025-02-26 12:53:03.000000','2026-04-18 12:53:03.000000',6),(10,'Calle Chapultepec','128','Guadalajara','Jalisco','44100',1,'2025-03-08 12:53:03.000000','2026-04-14 12:53:03.000000',7),(11,'Avenida Universidad','985','Monterrey','Nuevo Leon','64000',1,'2025-03-18 12:53:03.000000','2026-04-16 12:53:03.000000',8),(12,'Boulevard 5 de Mayo','321','Puebla','Puebla','72000',1,'2025-03-28 12:53:03.000000','2026-04-19 12:53:03.000000',9),(13,'Avenida Constituyentes','77','Queretaro','Queretaro','76000',1,'2025-04-07 12:53:03.000000','2026-04-13 12:53:03.000000',10),(14,'Calle 60','410','Merida','Yucatan','97000',1,'2025-04-17 12:53:03.000000','2026-04-15 12:53:03.000000',11),(15,'Avenida Revolucion','510','Tijuana','Baja California','22000',1,'2025-04-27 12:53:03.000000','2026-04-17 12:53:03.000000',12),(16,'Boulevard Lopez Mateos','1203','Leon','Guanajuato','37000',1,'2025-05-07 12:53:03.000000','2026-04-12 12:53:03.000000',13),(17,'Paseo Tollocan','640','Toluca','Estado de Mexico','50000',1,'2025-05-17 12:53:03.000000','2026-04-20 12:53:03.000000',14),(18,'Avenida Tulum','901','Cancun','Quintana Roo','77500',1,'2025-05-27 12:53:03.000000','2026-04-21 12:53:03.000000',15);
/*!40000 ALTER TABLE `users_address` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_address_insert` AFTER INSERT ON `users_address` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_address_update` AFTER UPDATE ON `users_address` FOR EACH ROW BEGIN
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

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_address_delete` AFTER DELETE ON `users_address` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users_customuser`
--

DROP TABLE IF EXISTS `users_customuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_customuser` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `email` varchar(254) NOT NULL,
  `role` varchar(10) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar_url` varchar(200) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_customuser`
--

LOCK TABLES `users_customuser` WRITE;
/*!40000 ALTER TABLE `users_customuser` DISABLE KEYS */;
INSERT INTO `users_customuser` VALUES (1,'pbkdf2_sha256$1200000$4kUysLh5KfOhWPUAvUekal$bojkL6J49sU24J9cHA1XVB5msALhHm4pMUYW7K/f7HU=','2026-04-22 17:46:51.082640',0,'Erick','Teja Carvajal',0,1,'2026-04-14 18:19:59.179595','admin@gmail.com','admin',NULL,NULL,'2026-04-14 18:19:59.179921'),(2,'pbkdf2_sha256$1200000$Wgq2C3AFX17PRtwHba2k4T$olEz9gie+L054AmA3/FZ+OGWLjG6F64B9fudvYISr1g=','2026-04-22 17:47:20.113582',0,'Erick','Teja Carvajal',0,1,'2026-04-16 19:34:12.927024','20233tn060@utez.edu.mx','vendor',NULL,NULL,'2026-04-16 19:34:12.927349'),(3,'pbkdf2_sha256$1200000$7bH3YfYfI4a6ubNdUgXcT4$CiKCbBQYD1dm4nMc0AwuuQWpPS2Y7HwdstviAv7J7VE=','2026-04-22 18:03:13.896445',0,'Erick','Teja Carvajal',0,1,'2026-04-16 23:53:37.959970','erickhumbertotc@gmail.com','vendor',NULL,NULL,'2026-04-16 23:53:37.960209'),(4,'pbkdf2_sha256$1200000$nu4vmYi8JtPxG5qDfMN6fi$4+r/1vsqSYOEF9bs7Z7rtigqrtgOMym2qqOyGq7ARpA=','2026-04-22 18:05:41.943974',0,'Erick','Teja Carvajal',0,1,'2026-04-18 02:02:46.064080','admin1@gmail.com','vendor',NULL,NULL,'2026-04-18 02:02:46.064682'),(5,'pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,1,'Carlos','Hernandez',1,1,'2024-10-29 12:53:03.000000','admin@dysto.ai','admin','+52 55 1000 0000','https://images.unsplash.com/photo-1560250097-0b93528c311a','2024-10-29 12:53:03.000000'),(6,'pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Fernanda','Lopez',0,1,'2025-02-16 12:53:03.000000','vendor01@dysto.ai','vendor','+52 55 2000 0001','https://images.unsplash.com/photo-1494790108377-be9c29b29330','2025-02-16 12:53:03.000000'),(7,'pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Jorge','Martinez',0,1,'2025-02-26 12:53:03.000000','vendor02@dysto.ai','vendor','+52 33 2000 0002','https://images.unsplash.com/photo-1500648767791-00dcc994a43e','2025-02-26 12:53:03.000000'),(8,'pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Ximena','Garcia',0,1,'2025-03-08 12:53:03.000000','vendor03@dysto.ai','vendor','+52 81 2000 0003','https://images.unsplash.com/photo-1544005313-94ddf0286df2','2025-03-08 12:53:03.000000'),(9,'pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Ricardo','Sanchez',0,1,'2025-03-18 12:53:03.000000','vendor04@dysto.ai','vendor','+52 22 2000 0004','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d','2025-03-18 12:53:03.000000'),(10,'pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Valeria','Ramirez',0,1,'2025-03-28 12:53:03.000000','vendor05@dysto.ai','vendor','+52 44 2000 0005','https://images.unsplash.com/photo-1487412720507-e7ab37603c6f','2025-03-28 12:53:03.000000'),(11,'pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Alejandro','Torres',0,1,'2025-04-07 12:53:03.000000','vendor06@dysto.ai','vendor','+52 99 2000 0006','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e','2025-04-07 12:53:03.000000'),(12,'pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Mariana','Castillo',0,1,'2025-04-17 12:53:03.000000','vendor07@dysto.ai','vendor','+52 66 2000 0007','https://images.unsplash.com/photo-1524504388940-b1c1722653e1','2025-04-17 12:53:03.000000'),(13,'pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Emiliano','Vargas',0,1,'2025-04-27 12:53:03.000000','vendor08@dysto.ai','vendor','+52 47 2000 0008','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d','2025-04-27 12:53:03.000000'),(14,'pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Sofia','Navarro',0,1,'2025-05-07 12:53:03.000000','vendor09@dysto.ai','vendor','+52 72 2000 0009','https://images.unsplash.com/photo-1517841905240-472988babdf9','2025-05-07 12:53:03.000000'),(15,'pbkdf2_sha256$600000$idyUfcFKPpz30wGdbVXhlO$Dasxsyp8AMAdrlk3/ADWGtTK1eZyHduF1JPWfi8eSdQ=',NULL,0,'Diego','Mendoza',0,1,'2025-05-17 12:53:03.000000','vendor10@dysto.ai','vendor','+52 99 2000 0010','https://images.unsplash.com/photo-1463453091185-61582044d556','2025-05-17 12:53:03.000000');
/*!40000 ALTER TABLE `users_customuser` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_customuser_insert` AFTER INSERT ON `users_customuser` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users_customuser_groups`
--

DROP TABLE IF EXISTS `users_customuser_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_customuser_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customuser_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_customuser_groups_customuser_id_group_id_76b619e3_uniq` (`customuser_id`,`group_id`),
  KEY `users_customuser_groups_group_id_01390b14_fk_auth_group_id` (`group_id`),
  CONSTRAINT `users_customuser_gro_customuser_id_958147bf_fk_users_cus` FOREIGN KEY (`customuser_id`) REFERENCES `users_customuser` (`id`),
  CONSTRAINT `users_customuser_groups_group_id_01390b14_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_customuser_groups`
--

LOCK TABLES `users_customuser_groups` WRITE;
/*!40000 ALTER TABLE `users_customuser_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_customuser_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_customuser_user_permissions`
--

DROP TABLE IF EXISTS `users_customuser_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_customuser_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customuser_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_customuser_user_pe_customuser_id_permission_7a7debf6_uniq` (`customuser_id`,`permission_id`),
  KEY `users_customuser_use_permission_id_baaa2f74_fk_auth_perm` (`permission_id`),
  CONSTRAINT `users_customuser_use_customuser_id_5771478b_fk_users_cus` FOREIGN KEY (`customuser_id`) REFERENCES `users_customuser` (`id`),
  CONSTRAINT `users_customuser_use_permission_id_baaa2f74_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_customuser_user_permissions`
--

LOCK TABLES `users_customuser_user_permissions` WRITE;
/*!40000 ALTER TABLE `users_customuser_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_customuser_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_order_list`
--

DROP TABLE IF EXISTS `vw_order_list`;
/*!50001 DROP VIEW IF EXISTS `vw_order_list`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_order_list` AS SELECT 
 1 AS `id`,
 1 AS `order_number`,
 1 AS `user_id`,
 1 AS `user_email`,
 1 AS `address_snapshot`,
 1 AS `total`,
 1 AS `status`,
 1 AS `created_at`,
 1 AS `total_items`,
 1 AS `total_quantity`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_product_public_list`
--

DROP TABLE IF EXISTS `vw_product_public_list`;
/*!50001 DROP VIEW IF EXISTS `vw_product_public_list`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_product_public_list` AS SELECT 
 1 AS `id`,
 1 AS `title`,
 1 AS `price`,
 1 AS `stock`,
 1 AS `category`,
 1 AS `seller_email`,
 1 AS `main_image`,
 1 AS `units_sold`,
 1 AS `is_active`,
 1 AS `created_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'dysto_ai'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `ev_clean_empty_abandoned_carts` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `ev_clean_empty_abandoned_carts` ON SCHEDULE EVERY 1 DAY STARTS '2026-04-23 12:53:14' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    DELETE FROM carts_cart
    WHERE updated_at < (NOW() - INTERVAL 30 DAY)
      AND NOT EXISTS (
          SELECT 1
          FROM carts_cartitem
          WHERE carts_cartitem.cart_id = carts_cart.id
      );
END */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
/*!50106 DROP EVENT IF EXISTS `ev_purge_old_audit_logs` */;;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `ev_purge_old_audit_logs` ON SCHEDULE EVERY 1 DAY STARTS '2026-04-23 12:53:14' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    DELETE FROM logbook_auditlog
    WHERE timestamp < (NOW() - INTERVAL 180 DAY);
END */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'dysto_ai'
--

--
-- Final view structure for view `vw_order_list`
--

/*!50001 DROP VIEW IF EXISTS `vw_order_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_order_list` AS select `o`.`id` AS `id`,`o`.`order_number` AS `order_number`,`o`.`user_id` AS `user_id`,`u`.`email` AS `user_email`,`o`.`address_snapshot` AS `address_snapshot`,`o`.`total` AS `total`,`o`.`status` AS `status`,`o`.`created_at` AS `created_at`,coalesce(`items`.`total_items`,0) AS `total_items`,coalesce(`items`.`total_quantity`,0) AS `total_quantity` from ((`orders_order` `o` join `users_customuser` `u` on((`o`.`user_id` = `u`.`id`))) left join (select `oi`.`order_id` AS `order_id`,count(`oi`.`id`) AS `total_items`,sum(`oi`.`quantity`) AS `total_quantity` from `orders_orderitem` `oi` group by `oi`.`order_id`) `items` on((`o`.`id` = `items`.`order_id`))) order by `o`.`created_at` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_product_public_list`
--

/*!50001 DROP VIEW IF EXISTS `vw_product_public_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_product_public_list` AS select `p`.`id` AS `id`,`p`.`title` AS `title`,`p`.`price` AS `price`,`p`.`stock` AS `stock`,`p`.`category` AS `category`,`u`.`email` AS `seller_email`,`p`.`main_image` AS `main_image`,`p`.`units_sold` AS `units_sold`,(case when (`p`.`stock` > 0) then true else false end) AS `is_active`,`p`.`created_at` AS `created_at` from (`products_product` `p` join `users_customuser` `u` on((`p`.`seller_id` = `u`.`id`))) where (`p`.`stock` > 0) order by `p`.`created_at` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-22 13:04:09
