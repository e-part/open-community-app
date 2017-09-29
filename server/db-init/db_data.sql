-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: epart_webapp2
-- ------------------------------------------------------
-- Server version	5.7.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `ACL`
--

LOCK TABLES `ACL` WRITE;
/*!40000 ALTER TABLE `ACL` DISABLE KEYS */;
/*!40000 ALTER TABLE `ACL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `AppModel`
--

LOCK TABLES `AppModel` WRITE;
/*!40000 ALTER TABLE `AppModel` DISABLE KEYS */;
/*!40000 ALTER TABLE `AppModel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `AuthProvider`
--

LOCK TABLES `AuthProvider` WRITE;
/*!40000 ALTER TABLE `AuthProvider` DISABLE KEYS */;
INSERT INTO `AuthProvider` VALUES (4,'facebook-login',NULL,'/auth/facebook','facebook','facebook');
/*!40000 ALTER TABLE `AuthProvider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (1,'חינוך','חינוך',NULL,NULL,NULL),(2,'תרבות','תרבות',NULL,NULL,NULL);
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `CategoryPost`
--

LOCK TABLES `CategoryPost` WRITE;
/*!40000 ALTER TABLE `CategoryPost` DISABLE KEYS */;
INSERT INTO `CategoryPost` VALUES (1,1,1),(2,1,2),(3,2,3);
/*!40000 ALTER TABLE `CategoryPost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;




--
-- Dumping data for table `Event`
--

LOCK TABLES `Event` WRITE;
/*!40000 ALTER TABLE `Event` DISABLE KEYS */;
/*!40000 ALTER TABLE `Event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Meta`
--

LOCK TABLES `Meta` WRITE;
/*!40000 ALTER TABLE `Meta` DISABLE KEYS */;
/*!40000 ALTER TABLE `Meta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Page`
--

LOCK TABLES `Page` WRITE;
/*!40000 ALTER TABLE `Page` DISABLE KEYS */;
/*!40000 ALTER TABLE `Page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Post`
--

LOCK TABLES `Post` WRITE;
/*!40000 ALTER TABLE `Post` DISABLE KEYS */;
INSERT INTO `Post` VALUES (1,'כותרת דיון','טקסט מומצא של תת כותרת','תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך ',NULL,NULL,NULL,NULL,NULL,'כותרת-דיון','PUBLISHED',NULL,NULL,NULL),(2,'2כותרת דיון','2טקסט מומצא של תת כותרת','תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך ',NULL,NULL,NULL,NULL,NULL,'כותרת-דיון','PUBLISHED',NULL,NULL,NULL),(3,'3כותרת דיון','3טקסט מומצא של תת כותרת','תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך ',NULL,NULL,NULL,NULL,NULL,'כותרת-דיון','PUBLISHED',NULL,NULL,NULL);
/*!40000 ALTER TABLE `Post` ENABLE KEYS */;
UNLOCK TABLES;



--
-- Dumping data for table `Product`
--

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` VALUES (1,'admin',NULL,NULL,NULL),(2,'user',NULL,NULL,NULL),(3,'mk',NULL,NULL,NULL);
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `PostCommittee`
--

LOCK TABLES `PostCommittee` WRITE;
/*!40000 ALTER TABLE `PostCommittee` DISABLE KEYS */;
INSERT INTO `PostCommittee` VALUES (1, '1', '1'),(1, '2', '2');
/*!40000 ALTER TABLE `PostCommittee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Committeeuser`
--

LOCK TABLES `Committeeuser` WRITE;
/*!40000 ALTER TABLE `Committeeuser` DISABLE KEYS */;
INSERT INTO `Committeeuser` VALUES (1,'1', '3'),(2,'2', '4');
/*!40000 ALTER TABLE `Committeeuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Committee`
--

LOCK TABLES `Committee` WRITE;
/*!40000 ALTER TABLE `Committee` DISABLE KEYS */;
INSERT INTO `Committee` (`id`,`name`, `slug`) VALUES (1,'ועדת החינוך', 'ועדת-החינוך' ),(2,'ועדת התרבות', 'ועדת-התרבות');
/*!40000 ALTER TABLE `Committee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Postuser`
--

LOCK TABLES `Postuser` WRITE;
/*!40000 ALTER TABLE `Postuser` DISABLE KEYS */;
INSERT INTO `Postuser` (`id`,`name`, `slug`) VALUES ('1', '1', '1'),('2', '1', '2');
/*!40000 ALTER TABLE `Postuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `RoleMapping`
--

LOCK TABLES `RoleMapping` WRITE;
/*!40000 ALTER TABLE `RoleMapping` DISABLE KEYS */;
INSERT INTO `RoleMapping` VALUES (1,'USER','1',2),(2,'USER','2',1),(3,'USER','3',3),(4,'USER','4',3);
/*!40000 ALTER TABLE `RoleMapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Setting`
--

LOCK TABLES `Setting` WRITE;
/*!40000 ALTER TABLE `Setting` DISABLE KEYS */;
INSERT INTO `Setting` VALUES (1,'appTheme','skin-blue'),(2,'appName','LoopBack Admin'),(3,'formLabelSize','3'),(4,'appLayout','fixed'),(5,'formLayout','horizontal'),(6,'formInputSize','9'),(7,'com.module.users.enable_registration','true');
/*!40000 ALTER TABLE `Setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `accessToken`
--

LOCK TABLES `accessToken` WRITE;
/*!40000 ALTER TABLE `accessToken` DISABLE KEYS */;
INSERT INTO `accessToken` VALUES ('fTOL0UVdqZYvkUdTRvLoLYsF4tt3j3WKYjoCIdbCLNk2eg5E1qpOe2WNPD137xOh',31556926,'2016-08-10 08:49:27',1);
/*!40000 ALTER TABLE `accessToken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'user','user',NULL,NULL,NULL,0,NULL,'user@user.com','$2a$10$Z5o7r8zQhtQ8dc8pbUjteedcQ3ksCtB1AtcNPqskYCAouSZBIWBam',NULL,'null','user@user.com',1,NULL,'created','2016-06-23 12:43:00',NULL),(2,'admin','admin',NULL,NULL,NULL,0,NULL,'admin@admin.com','$2a$10$y4KjamyJeUmPaLcPGJ5xm.ENyrHs4odfG9fNmQ4Wz9IVdBJGBWLy.',NULL,'null','admin@admin.com',1,NULL,'created','2016-06-23 12:43:00',NULL),(3,'mk1','mk1',NULL,NULL,NULL,0,NULL,'mk1@user.com','$2a$10$Z5o7r8zQhtQ8dc8pbUjteedcQ3ksCtB1AtcNPqskYCAouSZBIWBam',NULL,'null','mk1@user.com',1,NULL,'created','2016-06-23 12:43:00',NULL),(4,'mk2','mk2',NULL,NULL,NULL,0,NULL,'mk2@user.com','$2a$10$Z5o7r8zQhtQ8dc8pbUjteedcQ3ksCtB1AtcNPqskYCAouSZBIWBam',NULL,'null','mk2@user.com',1,NULL,'created','2016-06-23 12:43:00',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `userCategory`
--

LOCK TABLES `userCategory` WRITE;
/*!40000 ALTER TABLE `userCategory` DISABLE KEYS */;
INSERT INTO `userCategory` VALUES (5,1,1),(4,2,2),(6,1,2);
/*!40000 ALTER TABLE `userCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `userCredential`
--

LOCK TABLES `userCredential` WRITE;
/*!40000 ALTER TABLE `userCredential` DISABLE KEYS */;
/*!40000 ALTER TABLE `userCredential` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `userIdentity`
--

LOCK TABLES `userIdentity` WRITE;
/*!40000 ALTER TABLE `userIdentity` DISABLE KEYS */;
/*!40000 ALTER TABLE `userIdentity` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-08-10 12:40:33
