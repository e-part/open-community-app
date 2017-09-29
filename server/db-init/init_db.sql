CREATE DATABASE  IF NOT EXISTS `epart_webapp` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `epart_webapp`;
-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: epart_webapp
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
-- Table structure for table `ACL`
--

DROP TABLE IF EXISTS `ACL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ACL` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model` varchar(512) DEFAULT NULL,
  `property` varchar(512) DEFAULT NULL,
  `accessType` varchar(512) DEFAULT NULL,
  `permission` varchar(512) DEFAULT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ACL`
--

LOCK TABLES `ACL` WRITE;
/*!40000 ALTER TABLE `ACL` DISABLE KEYS */;
/*!40000 ALTER TABLE `ACL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AppModel`
--

DROP TABLE IF EXISTS `AppModel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AppModel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AppModel`
--

LOCK TABLES `AppModel` WRITE;
/*!40000 ALTER TABLE `AppModel` DISABLE KEYS */;
/*!40000 ALTER TABLE `AppModel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AuthProvider`
--

DROP TABLE IF EXISTS `AuthProvider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AuthProvider` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) DEFAULT NULL,
  `link` varchar(512) DEFAULT NULL,
  `authPath` varchar(512) DEFAULT NULL,
  `provider` varchar(512) DEFAULT NULL,
  `class` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AuthProvider`
--

LOCK TABLES `AuthProvider` WRITE;
/*!40000 ALTER TABLE `AuthProvider` DISABLE KEYS */;
INSERT INTO `AuthProvider` VALUES (4,'facebook-login',NULL,'/auth/facebook','facebook','facebook');
/*!40000 ALTER TABLE `AuthProvider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) DEFAULT NULL,
  `slug` varchar(512) DEFAULT NULL,
  `imageUrl` varchar(512) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (1,'חינוך','חינוך',NULL,NULL,NULL),(2,'תרבות','תרבות',NULL,NULL,NULL);
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CategoryPost`
--

DROP TABLE IF EXISTS `CategoryPost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CategoryPost` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryId` int(11) DEFAULT NULL,
  `postId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CategoryPost`
--

LOCK TABLES `CategoryPost` WRITE;
/*!40000 ALTER TABLE `CategoryPost` DISABLE KEYS */;
INSERT INTO `CategoryPost` VALUES (1,1,1),(2,1,2),(3,2,3);
/*!40000 ALTER TABLE `CategoryPost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8 NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `parentCommentId` int(11) DEFAULT NULL,
  `postId` int(11) DEFAULT NULL,
  `creatorId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Committee`
--

DROP TABLE IF EXISTS `Committee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Committee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `slug` varchar(512) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Committee`
--

LOCK TABLES `Committee` WRITE;
/*!40000 ALTER TABLE `Committee` DISABLE KEYS */;
/*!40000 ALTER TABLE `Committee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Committeeuser`
--

DROP TABLE IF EXISTS `Committeeuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Committeeuser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `committeeId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Committeeuser`
--

LOCK TABLES `Committeeuser` WRITE;
/*!40000 ALTER TABLE `Committeeuser` DISABLE KEYS */;
/*!40000 ALTER TABLE `Committeeuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Event`
--

DROP TABLE IF EXISTS `Event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `location` varchar(512) DEFAULT NULL,
  `url` varchar(512) DEFAULT NULL,
  `image` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Event`
--

LOCK TABLES `Event` WRITE;
/*!40000 ALTER TABLE `Event` DISABLE KEYS */;
/*!40000 ALTER TABLE `Event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Meta`
--

DROP TABLE IF EXISTS `Meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Meta`
--

LOCK TABLES `Meta` WRITE;
/*!40000 ALTER TABLE `Meta` DISABLE KEYS */;
/*!40000 ALTER TABLE `Meta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Page`
--

DROP TABLE IF EXISTS `Page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `slug` varchar(512) DEFAULT NULL,
  `content` varchar(512) DEFAULT NULL,
  `extended` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Page`
--

LOCK TABLES `Page` WRITE;
/*!40000 ALTER TABLE `Page` DISABLE KEYS */;
/*!40000 ALTER TABLE `Page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Post`
--

DROP TABLE IF EXISTS `Post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `subtitle` text,
  `content` text,
  `mainImage` varchar(512) DEFAULT NULL,
  `featuredImage` varchar(512) DEFAULT NULL,
  `fbImage` varchar(512) DEFAULT NULL,
  `meetingDate` datetime DEFAULT NULL,
  `meetingHour` varchar(512) DEFAULT NULL,
  `permaLink` varchar(512) DEFAULT NULL,
  `status` varchar(512) DEFAULT NULL,
  `keywords` text,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Post`
--

LOCK TABLES `Post` WRITE;
/*!40000 ALTER TABLE `Post` DISABLE KEYS */;
INSERT INTO `Post` VALUES (1,'כותרת דיון','טקסט מומצא של תת כותרת','תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך ',NULL,NULL,NULL,NULL,NULL,'כותרת-דיון','PUBLISHED',NULL,NULL,NULL),(2,'2כותרת דיון','2טקסט מומצא של תת כותרת','תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך ',NULL,NULL,NULL,NULL,NULL,'כותרת-דיון','PUBLISHED',NULL,NULL,NULL),(3,'3כותרת דיון','3טקסט מומצא של תת כותרת','תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך תוכן מומצא ארוך ',NULL,NULL,NULL,NULL,NULL,'כותרת-דיון','PUBLISHED',NULL,NULL,NULL);
/*!40000 ALTER TABLE `Post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PostCommittee`
--

DROP TABLE IF EXISTS `PostCommittee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PostCommittee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postId` int(11) DEFAULT NULL,
  `committeeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PostCommittee`
--

LOCK TABLES `PostCommittee` WRITE;
/*!40000 ALTER TABLE `PostCommittee` DISABLE KEYS */;
/*!40000 ALTER TABLE `PostCommittee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Postuser`
--

DROP TABLE IF EXISTS `Postuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Postuser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Postuser`
--

LOCK TABLES `Postuser` WRITE;
/*!40000 ALTER TABLE `Postuser` DISABLE KEYS */;
/*!40000 ALTER TABLE `Postuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `categoryId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product`
--

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` VALUES (1,'admin',NULL,NULL,NULL),(2,'user',NULL,NULL,NULL),(3,'mk',NULL,NULL,NULL);
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RoleMapping`
--

DROP TABLE IF EXISTS `RoleMapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RoleMapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RoleMapping`
--

LOCK TABLES `RoleMapping` WRITE;
/*!40000 ALTER TABLE `RoleMapping` DISABLE KEYS */;
INSERT INTO `RoleMapping` VALUES (1,'USER','1',2),(2,'USER','2',1),(3,'USER','3',3),(4,'USER','4',3);
/*!40000 ALTER TABLE `RoleMapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Setting`
--

DROP TABLE IF EXISTS `Setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(512) NOT NULL,
  `value` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Setting`
--

LOCK TABLES `Setting` WRITE;
/*!40000 ALTER TABLE `Setting` DISABLE KEYS */;
INSERT INTO `Setting` VALUES (1,'appTheme','skin-blue'),(2,'appName','LoopBack Admin'),(3,'formLabelSize','3'),(4,'appLayout','fixed'),(5,'formLayout','horizontal'),(6,'formInputSize','9'),(7,'com.module.users.enable_registration','true');
/*!40000 ALTER TABLE `Setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accessToken`
--

DROP TABLE IF EXISTS `accessToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accessToken` (
  `id` varchar(255) NOT NULL,
  `ttl` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accessToken`
--

LOCK TABLES `accessToken` WRITE;
/*!40000 ALTER TABLE `accessToken` DISABLE KEYS */;
INSERT INTO `accessToken` VALUES ('fTOL0UVdqZYvkUdTRvLoLYsF4tt3j3WKYjoCIdbCLNk2eg5E1qpOe2WNPD137xOh',31556926,'2016-08-10 08:49:27',1);
/*!40000 ALTER TABLE `accessToken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(512) DEFAULT NULL,
  `lastName` varchar(512) DEFAULT NULL,
  `imageUrl` varchar(512) DEFAULT NULL,
  `city` varchar(512) DEFAULT NULL,
  `dateOfBirth` varchar(512) DEFAULT NULL,
  `isPassMigrated` tinyint(1) DEFAULT NULL,
  `realm` varchar(512) DEFAULT NULL,
  `username` varchar(512) DEFAULT NULL,
  `password` varchar(512) NOT NULL,
  `credentials` text,
  `challenges` text,
  `email` varchar(512) NOT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  `status` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `lastUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'user','user',NULL,NULL,NULL,0,NULL,'user@user.com','$2a$10$Z5o7r8zQhtQ8dc8pbUjteedcQ3ksCtB1AtcNPqskYCAouSZBIWBam',NULL,'null','user@user.com',1,NULL,'created','2016-06-23 12:43:00',NULL),(2,'admin','admin',NULL,NULL,NULL,0,NULL,'admin@admin.com','$2a$10$y4KjamyJeUmPaLcPGJ5xm.ENyrHs4odfG9fNmQ4Wz9IVdBJGBWLy.',NULL,'null','admin@admin.com',1,NULL,'created','2016-06-23 12:43:00',NULL),(3,'mk1','mk1',NULL,NULL,NULL,0,NULL,'mk1@user.com','$2a$10$Z5o7r8zQhtQ8dc8pbUjteedcQ3ksCtB1AtcNPqskYCAouSZBIWBam',NULL,'null','mk1@user.com',1,NULL,'created','2016-06-23 12:43:00',NULL),(4,'mk2','mk2',NULL,NULL,NULL,0,NULL,'mk2@user.com','$2a$10$Z5o7r8zQhtQ8dc8pbUjteedcQ3ksCtB1AtcNPqskYCAouSZBIWBam',NULL,'null','mk2@user.com',1,NULL,'created','2016-06-23 12:43:00',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userCategory`
--

DROP TABLE IF EXISTS `userCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userCategory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userCategory`
--

LOCK TABLES `userCategory` WRITE;
/*!40000 ALTER TABLE `userCategory` DISABLE KEYS */;
INSERT INTO `userCategory` VALUES (5,1,1),(4,2,2),(6,1,2);
/*!40000 ALTER TABLE `userCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userCredential`
--

DROP TABLE IF EXISTS `userCredential`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userCredential` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `provider` varchar(512) DEFAULT NULL,
  `authScheme` varchar(512) DEFAULT NULL,
  `externalId` varchar(512) DEFAULT NULL,
  `profile` text,
  `credentials` text,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userCredential`
--

LOCK TABLES `userCredential` WRITE;
/*!40000 ALTER TABLE `userCredential` DISABLE KEYS */;
/*!40000 ALTER TABLE `userCredential` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userIdentity`
--

DROP TABLE IF EXISTS `userIdentity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userIdentity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `provider` varchar(512) DEFAULT NULL,
  `authScheme` varchar(512) DEFAULT NULL,
  `externalId` varchar(512) DEFAULT NULL,
  `profile` text,
  `credentials` text,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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

-- Dump completed on 2016-08-10 11:53:02
