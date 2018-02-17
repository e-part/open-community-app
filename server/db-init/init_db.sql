CREATE DATABASE  IF NOT EXISTS `civic_app` /*!40100 DEFAULT CHARACTER SET utf8 */; USE `civic_app`; -- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64) -- -- Host: 127.0.0.1    Database: epart_webapp -- ------------------------------------------------------ -- Server version	5.7.9 /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */; /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */; /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */; /*!40101 SET NAMES utf8 */; /*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */; /*!40103 SET TIME_ZONE='+00:00' */; /*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */; /*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */; /*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */; /*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */; -- -- Table structure for table `ACL` -- DROP TABLE IF EXISTS `ACL`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `ACL` ( `id` int(11) NOT NULL AUTO_INCREMENT, `model` varchar(512) DEFAULT NULL, `property` varchar(512) DEFAULT NULL, `accessType` varchar(512) DEFAULT NULL, `permission` varchar(512) DEFAULT NULL, `principalType` varchar(512) DEFAULT NULL, `principalId` varchar(512) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `AppModel` -- DROP TABLE IF EXISTS `AppModel`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `AppModel` ( `id` int(11) NOT NULL AUTO_INCREMENT, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `AuthProvider` -- DROP TABLE IF EXISTS `AuthProvider`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `AuthProvider` ( `id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(512) DEFAULT NULL, `link` varchar(512) DEFAULT NULL, `authPath` varchar(512) DEFAULT NULL, `provider` varchar(512) DEFAULT NULL, `class` varchar(512) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=7919 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Category` -- DROP TABLE IF EXISTS `Category`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Category` ( `id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(512) DEFAULT NULL, `slug` varchar(512) DEFAULT NULL, `imageUrl` varchar(512) DEFAULT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `CategoryPost` -- DROP TABLE IF EXISTS `CategoryPost`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `CategoryPost` ( `id` int(11) NOT NULL AUTO_INCREMENT, `categoryId` int(11) DEFAULT NULL, `postId` int(11) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=1954 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Comment` -- DROP TABLE IF EXISTS `Comment`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Comment` ( `id` int(11) NOT NULL AUTO_INCREMENT, `customerId` int(11) DEFAULT NULL, `content` text CHARACTER SET utf8 NOT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, `parentCommentId` int(11) DEFAULT NULL, `postId` int(11) DEFAULT NULL, `creatorId` int(11) DEFAULT NULL, `files` text COLLATE utf8_bin, `deleted` tinyint(4) NOT NULL DEFAULT '0', `repliedToCommentId` int(11) DEFAULT NULL, `sentimentScore` decimal(7,7) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=371 DEFAULT CHARSET=utf8 COLLATE=utf8_bin; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Committee` -- DROP TABLE IF EXISTS `Committee`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Committee` ( `id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(512) NOT NULL, `slug` varchar(512) DEFAULT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Committeeuser` -- DROP TABLE IF EXISTS `Committeeuser`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Committeeuser` ( `id` int(11) NOT NULL AUTO_INCREMENT, `committeeId` int(11) DEFAULT NULL, `userId` int(11) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=54 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Conclusion` -- DROP TABLE IF EXISTS `Conclusion`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Conclusion` ( `id` int(11) NOT NULL AUTO_INCREMENT, `postId` int(11) NOT NULL, `text` varchar(512) DEFAULT NULL, `iconUrl` varchar(255) DEFAULT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=48 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Customer` -- DROP TABLE IF EXISTS `Customer`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Customer` ( `id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(128) DEFAULT NULL, `domain` varchar(512) DEFAULT NULL, `className` varchar(45) DEFAULT NULL, `attributes` text, `clientID` varchar(512) DEFAULT NULL, `clientSecret` varchar(512) DEFAULT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Decision` -- DROP TABLE IF EXISTS `Decision`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Decision` ( `id` int(11) NOT NULL AUTO_INCREMENT, `conclusionId` int(11) NOT NULL, `text` varchar(512) DEFAULT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Device` -- DROP TABLE IF EXISTS `Device`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Device` ( `id` int(11) NOT NULL AUTO_INCREMENT, `registrationId` varchar(255) DEFAULT NULL, `type` varchar(45) DEFAULT NULL, `userId` int(11) DEFAULT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`), UNIQUE KEY `registrationId_UNIQUE` (`registrationId`) ) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Faq` -- DROP TABLE IF EXISTS `Faq`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Faq` ( `id` int(11) NOT NULL AUTO_INCREMENT, `question` text NOT NULL, `answer` text NOT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Follow` -- DROP TABLE IF EXISTS `Follow`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Follow` ( `id` int(11) NOT NULL AUTO_INCREMENT, `followerId` int(11) DEFAULT NULL, `followeeId` int(11) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=85 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `ItemPledge` -- DROP TABLE IF EXISTS `ItemPledge`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `ItemPledge` ( `id` int(11) NOT NULL AUTO_INCREMENT, `customerId` int(11) DEFAULT NULL, `userId` int(11) DEFAULT NULL, `itemRequestId` int(11) DEFAULT NULL, `quantity` int(11) DEFAULT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`), UNIQUE KEY `unique_userId_itemRequestId` (`userId`,`itemRequestId`) ) ENGINE=MyISAM AUTO_INCREMENT=364 DEFAULT CHARSET=utf8 COLLATE=utf8_bin; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `ItemRequest` -- DROP TABLE IF EXISTS `ItemRequest`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `ItemRequest` ( `id` int(11) NOT NULL AUTO_INCREMENT, `customerId` int(11) DEFAULT NULL, `postId` int(11) DEFAULT NULL, `quantity` int(11) DEFAULT NULL, `description` varchar(255) COLLATE utf8_bin DEFAULT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=391 DEFAULT CHARSET=utf8 COLLATE=utf8_bin; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Meeting` -- DROP TABLE IF EXISTS `Meeting`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Meeting` ( `id` int(11) NOT NULL AUTO_INCREMENT, `customerId` int(11) DEFAULT NULL, `postId` int(11) DEFAULT NULL, `location` varchar(255) COLLATE utf8_bin DEFAULT NULL, `date` datetime DEFAULT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=393 DEFAULT CHARSET=utf8 COLLATE=utf8_bin; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Message` -- DROP TABLE IF EXISTS `Message`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Message` ( `id` int(11) NOT NULL AUTO_INCREMENT, `content` text CHARACTER SET utf8 NOT NULL, `postId` int(11) DEFAULT NULL, `creatorId` int(11) DEFAULT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=201 DEFAULT CHARSET=utf8 COLLATE=utf8_bin; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Meta` -- DROP TABLE IF EXISTS `Meta`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Meta` ( `id` int(11) NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Notification` -- DROP TABLE IF EXISTS `Notification`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Notification` ( `id` int(11) NOT NULL AUTO_INCREMENT, `customerId` int(11) DEFAULT NULL, `name` varchar(255) NOT NULL, `method` varchar(255) NOT NULL, `meta` text, `receiverId` int(11) NOT NULL, `status` varchar(255) NOT NULL DEFAULT 'UNREAD', `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=243 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Poll` -- DROP TABLE IF EXISTS `Poll`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Poll` ( `id` int(11) NOT NULL AUTO_INCREMENT, `customerId` int(11) DEFAULT NULL, `postId` int(11) NOT NULL, `question` varchar(512) DEFAULT NULL, `archived` tinyint(4) DEFAULT '0', `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=92 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `PollAnswer` -- DROP TABLE IF EXISTS `PollAnswer`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `PollAnswer` ( `id` int(11) NOT NULL AUTO_INCREMENT, `customerId` int(11) DEFAULT NULL, `pollId` int(11) DEFAULT NULL, `answer` varchar(512) DEFAULT NULL, `answerType` varchar(100) DEFAULT NULL, `color` varchar(45) DEFAULT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, `votes` int(11) NOT NULL DEFAULT '0', PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=223 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `PollVote` -- DROP TABLE IF EXISTS `PollVote`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `PollVote` ( `id` int(11) NOT NULL AUTO_INCREMENT, `customerId` int(11) DEFAULT NULL, `pollId` int(11) NOT NULL, `userId` int(11) NOT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Post` -- DROP TABLE IF EXISTS `Post`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Post` ( `id` int(11) NOT NULL AUTO_INCREMENT, `customerId` int(11) DEFAULT NULL, `ownerId` int(11) DEFAULT NULL, `type` varchar(45) DEFAULT 'DISCUSSION', `isParent` tinyint(4) NOT NULL DEFAULT '0', `parentPostId` int(11) DEFAULT NULL, `conclusions` text, `title` text NOT NULL, `subtitle` text, `content` text, `mainImage` varchar(512) DEFAULT NULL, `featuredImage` varchar(512) DEFAULT NULL, `fbImage` varchar(512) DEFAULT NULL, `meetingDate` datetime DEFAULT NULL, `meetingHour` varchar(512) DEFAULT NULL, `permaLink` varchar(255) DEFAULT NULL, `status` varchar(512) DEFAULT NULL, `keywords` text, `notificationsSent` tinyint(4) DEFAULT '0', `imageCaption` varchar(512) DEFAULT NULL, `officialTitle` varchar(512) DEFAULT NULL, `officialMeetingId` int(11) DEFAULT NULL, `officialCommitteeId` int(11) DEFAULT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, `migrationStatus` varchar(255) NOT NULL DEFAULT 'NORMAL', `isCancelled` tinyint(4) DEFAULT '0', `consequences` text, `summaryPoints` text, `youtubeVideoId` varchar(255) DEFAULT NULL, `public` tinyint(4) DEFAULT '1', `ownerSummary` text, `endDate` datetime DEFAULT NULL, `meetingLocation` varchar(512) DEFAULT NULL, `minimumRequiredHours` int(11) DEFAULT NULL, `reviewStatus` varchar(45) DEFAULT 'APPROVED', PRIMARY KEY (`id`), UNIQUE KEY `permaLink_UNIQUE` (`permaLink`), UNIQUE KEY `officialMeetingId_UNIQUE` (`officialMeetingId`) ) ENGINE=MyISAM AUTO_INCREMENT=6047 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `PostCommittee` -- DROP TABLE IF EXISTS `PostCommittee`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `PostCommittee` ( `id` int(11) NOT NULL AUTO_INCREMENT, `postId` int(11) DEFAULT NULL, `committeeId` int(11) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `PostTag` -- DROP TABLE IF EXISTS `PostTag`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `PostTag` ( `id` int(11) NOT NULL AUTO_INCREMENT, `postId` int(11) DEFAULT NULL, `tagId` int(11) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=5550 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Postuser` -- DROP TABLE IF EXISTS `Postuser`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Postuser` ( `id` int(11) NOT NULL AUTO_INCREMENT, `postId` int(11) DEFAULT NULL, `userId` int(11) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Role` -- DROP TABLE IF EXISTS `Role`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Role` ( `id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(512) NOT NULL, `description` varchar(512) DEFAULT NULL, `created` datetime DEFAULT NULL, `modified` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `RoleMapping` -- DROP TABLE IF EXISTS `RoleMapping`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `RoleMapping` ( `id` int(11) NOT NULL AUTO_INCREMENT, `principalType` varchar(512) DEFAULT NULL, `principalId` varchar(512) DEFAULT NULL, `roleId` int(11) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=11069 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Setting` -- DROP TABLE IF EXISTS `Setting`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Setting` ( `id` int(11) NOT NULL AUTO_INCREMENT, `key` varchar(512) NOT NULL, `value` varchar(512) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Subscription` -- DROP TABLE IF EXISTS `Subscription`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Subscription` ( `id` int(11) NOT NULL AUTO_INCREMENT, `eventType` varchar(128) NOT NULL, `method` varchar(128) NOT NULL, `userId` int(11) NOT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`), UNIQUE KEY `uniqueMethodEventUserId` (`method`,`userId`,`eventType`) ) ENGINE=MyISAM AUTO_INCREMENT=13663 DEFAULT CHARSET=utf8; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `Tag` -- DROP TABLE IF EXISTS `Tag`; /*!40101 SET @saved_cs_client     = @@character_set_client */; /*!40101 SET character_set_client = utf8 */; CREATE TABLE `Tag` ( `id` int(11) NOT NULL AUTO_INCREMENT, `customerId` int(11) DEFAULT NULL, `content` varchar(255) CHARACTER SET utf8 NOT NULL, `type` varchar(255) COLLATE utf8_bin DEFAULT NULL, `creatorId` int(11) DEFAULT NULL, `parentTagId` int(11) DEFAULT NULL, `createdAt` datetime DEFAULT NULL, `updatedAt` datetime DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=MyISAM AUTO_INCREMENT=347 DEFAULT CHARSET=utf8 COLLATE=utf8_bin; /*!40101 SET character_set_client = @saved_cs_client */; -- -- Table structure for table `TagComment`
--

DROP TABLE IF EXISTS `TagComment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TagComment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commentId` int(11) DEFAULT NULL,
  `tagId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=95 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TimePledge`
--

DROP TABLE IF EXISTS `TimePledge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TimePledge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customerId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `postId` int(11) DEFAULT NULL,
  `hours` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniqueUserIdPostId` (`userId`,`postId`)
) ENGINE=MyISAM AUTO_INCREMENT=358 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Upvote`
--

DROP TABLE IF EXISTS `Upvote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Upvote` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customerId` int(11) DEFAULT NULL,
  `commentId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE_COMMENT_USER` (`commentId`,`userId`)
) ENGINE=MyISAM AUTO_INCREMENT=58 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
-- Table structure for table `dashboardsetting`
--

DROP TABLE IF EXISTS `dashboardsetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dashboardsetting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `settings` text,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ownerId_UNIQUE` (`ownerId`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tenantId` int(11) DEFAULT NULL,
  `firstName` varchar(512) DEFAULT NULL,
  `lastName` varchar(512) DEFAULT NULL,
  `imageUrl` varchar(512),
  `city` varchar(512) DEFAULT NULL,
  `dateOfBirth` varchar(512) DEFAULT NULL,
  `isPassMigrated` tinyint(1) DEFAULT NULL,
  `realm` varchar(512) DEFAULT NULL,
  `username` varchar(512) DEFAULT NULL,
  `password` varchar(512) NOT NULL,
  `credentials` text,
  `challenges` text,
  `email` varchar(254) NOT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  `status` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `lastUpdated` datetime DEFAULT NULL,
  `selectedCategories` tinyint(1) DEFAULT '0',
  `occupation` varchar(100) DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `EMAIL_UNIQUE` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=22239 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE_USER_CATEGORY` (`userId`,`categoryId`)
) ENGINE=MyISAM AUTO_INCREMENT=132928 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-09-29 23:52:19
