USE `valops_treinamentos`;



--
-- Table structure for table `training_ratings`
--

DROP TABLE IF EXISTS `training_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `material_id` int NOT NULL,
  `user_id` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_material_rating` (`user_id`,`material_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `training_ratings_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `training_materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_ratings`
--

LOCK TABLES `training_ratings` WRITE;
/*!40000 ALTER TABLE `training_ratings` DISABLE KEYS */;
INSERT INTO `training_ratings` VALUES (1,1,'F3876812',5,'muito bom','2025-04-15 02:31:55','2025-04-15 03:08:50'),(2,1,'F3190245',5,'','2025-04-15 03:03:41','2025-04-15 03:03:41');
/*!40000 ALTER TABLE `training_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `training_statistics`
--

DROP TABLE IF EXISTS `training_statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_statistics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `total_materials` int DEFAULT '0',
  `video_content_hours` int DEFAULT '0',
  `total_courses` int DEFAULT '0',
  `average_rating` float DEFAULT '0',
  `total_downloads` int DEFAULT '0',
  `total_views` int DEFAULT '0',
  `last_calculated` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_statistics`
--

LOCK TABLES `training_statistics` WRITE;
/*!40000 ALTER TABLE `training_statistics` DISABLE KEYS */;
INSERT INTO `training_statistics` VALUES (1,5,1,1,4.7,85,400,'2025-04-15 01:26:27','2025-04-15 01:26:27');
/*!40000 ALTER TABLE `training_statistics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `training_tags`
--

DROP TABLE IF EXISTS `training_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_tags`
--

LOCK TABLES `training_tags` WRITE;
/*!40000 ALTER TABLE `training_tags` DISABLE KEYS */;
INSERT INTO `training_tags` VALUES (1,'Validação','Validação de modelos de machine learning','2025-04-15 01:26:27'),(2,'Robustez','Testes de robustez em modelos preditivos','2025-04-15 01:26:27'),(3,'Produção','Implantação de modelos em produção','2025-04-15 01:26:27'),(4,'Testes','Procedimentos de teste para modelos','2025-04-15 01:26:27'),(5,'Python','Programação Python para machine learning','2025-04-15 01:26:27'),(6,'Machine Learning','Aprendizado de máquina','2025-04-15 01:26:27'),(7,'Classificação','Modelos de classificação','2025-04-15 01:26:27'),(8,'Regressão','Modelos de regressão','2025-04-15 01:26:27'),(9,'Deep Learning','Redes neurais e aprendizado profundo','2025-04-15 01:26:27'),(10,'Clusterização','Modelos de agrupamento não supervisionados','2025-04-15 01:26:27');
/*!40000 ALTER TABLE `training_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `training_user_history`
--

DROP TABLE IF EXISTS `training_user_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_user_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `material_id` int NOT NULL,
  `progress_percentage` int DEFAULT '0',
  `last_position` int DEFAULT '0',
  `is_completed` tinyint(1) DEFAULT '0',
  `first_accessed` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_accessed` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_material_history` (`user_id`,`material_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `training_user_history_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `training_materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_user_history`
--

LOCK TABLES `training_user_history` WRITE;
/*!40000 ALTER TABLE `training_user_history` DISABLE KEYS */;
INSERT INTO `training_user_history` VALUES (1,'F3876812',1,0,NULL,0,'2025-04-15 01:50:25','2025-04-15 03:39:18'),(2,'F3190245',1,0,NULL,0,'2025-04-15 02:58:01','2025-04-15 03:23:18'),(3,'F3190245',2,0,NULL,0,'2025-04-15 02:59:29','2025-04-15 02:59:29'),(4,'F3190245',4,0,NULL,0,'2025-04-15 02:59:52','2025-04-15 02:59:52'),(5,'F3190245',5,0,NULL,0,'2025-04-15 02:59:59','2025-04-15 02:59:59'),(6,'F3190245',3,0,NULL,0,'2025-04-15 03:00:14','2025-04-15 03:00:14'),(7,'F3876812',4,0,NULL,0,'2025-04-15 03:11:41','2025-04-15 03:11:41');
/*!40000 ALTER TABLE `training_user_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `training_view_logs`
--

DROP TABLE IF EXISTS `training_view_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_view_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `material_id` int NOT NULL,
  `user_id` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `view_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uix_material_user_view` (`material_id`,`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_view_logs`
--

LOCK TABLES `training_view_logs` WRITE;
/*!40000 ALTER TABLE `training_view_logs` DISABLE KEYS */;
INSERT INTO `training_view_logs` VALUES (1,1,'F3876812','2025-04-15 02:56:47'),(2,1,'F3190245','2025-04-15 02:58:01'),(3,2,'F3190245','2025-04-15 02:59:29'),(4,4,'F3190245','2025-04-15 02:59:52'),(5,5,'F3190245','2025-04-15 02:59:59'),(6,3,'F3190245','2025-04-15 03:00:14'),(7,4,'F3876812','2025-04-15 03:11:41');
/*!40000 ALTER TABLE `training_view_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `view_training_materials`
--

DROP TABLE IF EXISTS `view_training_materials`;
/*!50001 DROP VIEW IF EXISTS `view_training_materials`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_training_materials` AS SELECT 
 1 AS `id`,
 1 AS `title`,
 1 AS `type`,
 1 AS `category_name`,
 1 AS `description`,
 1 AS `level`,
 1 AS `rating`,
 1 AS `rating_count`,
 1 AS `author`,
 1 AS `duration`,
 1 AS `pages`,
 1 AS `publish_date`,
 1 AS `is_featured`,
 1 AS `is_active`,
 1 AS `view_count`,
 1 AS `download_count`,
 1 AS `created_at`,
 1 AS `updated_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'valops_treinamentos'
--

--
-- Dumping routines for database 'valops_treinamentos'
--

--
-- Current Database: `mysql`
--

USE `mysql`;

--
-- Current Database: `valops_exemplos`
--

USE `valops_exemplos`;

--
-- Current Database: `valops_gevao`
--

USE `valops_gevao`;

--
-- Current Database: `valops_main`
--

USE `valops_main`;

--
-- Current Database: `valops_treinamentos`
--

USE `valops_treinamentos`;

--
-- Final view structure for view `view_training_materials`
--

/*!50001 DROP VIEW IF EXISTS `view_training_materials`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_training_materials` AS select `m`.`id` AS `id`,`m`.`title` AS `title`,`m`.`type` AS `type`,`c`.`name` AS `category_name`,`m`.`description` AS `description`,`m`.`level` AS `level`,`m`.`rating` AS `rating`,`m`.`rating_count` AS `rating_count`,`m`.`author` AS `author`,`m`.`duration` AS `duration`,`m`.`pages` AS `pages`,`m`.`publish_date` AS `publish_date`,`m`.`is_featured` AS `is_featured`,`m`.`is_active` AS `is_active`,`m`.`view_count` AS `view_count`,`m`.`download_count` AS `download_count`,`m`.`created_at` AS `created_at`,`m`.`updated_at` AS `updated_at` from (`training_materials` `m` left join `training_categories` `c` on((`m`.`category_id` = `c`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!50606 SET GLOBAL INNODB_STATS_AUTO_RECALC=@OLD_INNODB_STATS_AUTO_RECALC */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-15  3:40:12
