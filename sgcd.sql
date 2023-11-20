-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: tt2.mysql.database.azure.com    Database: sgcd
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cancelacioncita`
--

DROP TABLE IF EXISTS `cancelacioncita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancelacioncita` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idCita` int NOT NULL,
  `Motivo` varchar(255) NOT NULL,
  `Pendiente` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idCita` (`idCita`),
  CONSTRAINT `cancelacioncita_ibfk_1` FOREIGN KEY (`idCita`) REFERENCES `cita` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cancelacioncita_ibfk_2` FOREIGN KEY (`idCita`) REFERENCES `cita` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cancelacioncita`
--

LOCK TABLES `cancelacioncita` WRITE;
/*!40000 ALTER TABLE `cancelacioncita` DISABLE KEYS */;
INSERT INTO `cancelacioncita` VALUES (1,9,'Liberar horario',0,'2023-11-11 10:15:13','2023-11-11 10:15:13'),(2,5,'liberar',0,'2023-11-11 11:04:57','2023-11-11 11:04:57'),(3,12,'Tengo un compromiso ',0,'2023-11-12 01:23:56','2023-11-16 21:12:01'),(4,13,'Siu',0,'2023-11-19 11:47:53','2023-11-19 11:47:53'),(5,23,'pq so',0,'2023-11-19 22:26:57','2023-11-19 22:26:57');
/*!40000 ALTER TABLE `cancelacioncita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cita`
--

DROP TABLE IF EXISTS `cita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cita` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idDocPac` int NOT NULL,
  `Fecha` datetime NOT NULL,
  `Diagnostico` varchar(255) NOT NULL,
  `Estado` tinyint(1) NOT NULL DEFAULT '1',
  `idHistorialClinico` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idDocPac` (`idDocPac`),
  KEY `idHistorialClinico` (`idHistorialClinico`),
  CONSTRAINT `cita_ibfk_1` FOREIGN KEY (`idDocPac`) REFERENCES `docpac` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cita_ibfk_3` FOREIGN KEY (`idDocPac`) REFERENCES `docpac` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cita_ibfk_4` FOREIGN KEY (`idHistorialClinico`) REFERENCES `historial_clinico` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cita`
--

LOCK TABLES `cita` WRITE;
/*!40000 ALTER TABLE `cita` DISABLE KEYS */;
INSERT INTO `cita` VALUES (1,1,'2023-11-13 13:00:00','Testing',1,1,'2023-11-10 18:02:41','2023-11-10 18:02:41'),(2,1,'2023-11-17 17:00:00','Otra cita',1,1,'2023-11-10 18:34:54','2023-11-10 20:32:45'),(3,1,'2023-11-13 10:00:00','una mas',1,1,'2023-11-10 18:38:02','2023-11-10 18:38:02'),(4,1,'2023-11-15 13:00:00','Prueba',1,1,'2023-11-10 18:39:01','2023-11-11 02:38:37'),(5,2,'2023-11-13 11:00:00','Test',0,2,'2023-11-11 15:28:21','2023-11-11 11:04:57'),(6,2,'2023-11-16 06:30:00','Testaaa',1,2,'2023-11-11 15:29:02','2023-11-11 11:02:29'),(7,1,'2023-11-14 15:00:00','Test',1,1,'2023-11-11 15:34:17','2023-11-11 15:34:17'),(8,2,'2023-11-14 06:00:00','Testaaa',1,2,'2023-11-11 10:10:00','2023-11-11 11:02:04'),(9,3,'2023-11-13 10:30:00','otra mas',0,1,'2023-11-11 10:14:05','2023-11-11 10:15:13'),(10,1,'2023-11-16 12:00:00','Lele pancha',1,1,'2023-11-11 17:18:12','2023-11-11 17:18:12'),(11,3,'2023-11-16 06:00:00','Consulta matutina',1,1,'2023-11-11 17:19:19','2023-11-11 17:19:19'),(12,3,'2023-11-20 10:15:00','Test',0,1,'2023-11-12 01:23:13','2023-11-16 21:12:01'),(13,5,'2023-11-24 12:00:00','Primera extraccion',0,3,'2023-11-12 13:07:22','2023-11-19 11:47:53'),(14,6,'2023-11-16 10:30:00','sd',1,4,'2023-11-16 16:13:26','2023-11-16 16:13:26'),(15,7,'2023-11-21 11:00:00','Prueba de cita',1,5,'2023-11-18 13:32:22','2023-11-18 13:36:21'),(16,7,'2023-11-18 15:00:00','otra mas',1,5,'2023-11-18 14:36:11','2023-11-18 14:36:11'),(17,7,'2023-11-18 15:30:00','siguiente',1,5,'2023-11-18 14:36:43','2023-11-18 14:36:43'),(18,7,'2023-11-18 16:00:00','ajja',1,5,'2023-11-18 15:40:30','2023-11-18 15:40:30'),(19,7,'2023-11-18 19:00:00','Test',1,5,'2023-11-19 00:28:56','2023-11-19 00:28:56'),(20,7,'2023-11-19 13:00:00','T1',1,5,'2023-11-19 11:07:57','2023-11-19 11:07:57'),(21,7,'2023-11-19 17:00:00','wbg',1,5,'2023-11-19 11:08:46','2023-11-19 11:11:55'),(22,9,'2023-11-19 15:00:00','aaaaaaa',1,2,'2023-11-19 12:16:47','2023-11-19 12:16:47'),(23,10,'2023-11-26 13:00:00','desde admin',0,6,'2023-11-19 13:52:48','2023-11-19 22:26:57'),(24,11,'2023-11-28 14:00:00','zzzzzzzzzz',1,7,'2023-11-19 13:55:27','2023-11-19 13:55:27'),(25,11,'2023-11-25 15:00:00','zzzzzzzzzz',1,7,'2023-11-19 13:55:27','2023-11-19 13:55:27'),(26,7,'2023-11-19 20:00:00','otra mas',1,5,'2023-11-19 19:39:03','2023-11-19 19:39:03'),(27,15,'2023-11-24 17:30:00','Hdisbs',1,5,'2023-11-20 06:08:33','2023-11-20 06:08:33');
/*!40000 ALTER TABLE `cita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clinica`
--

DROP TABLE IF EXISTS `clinica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinica` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `idDomicilio` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Nombre` (`Nombre`),
  UNIQUE KEY `Nombre_2` (`Nombre`),
  KEY `Clinica_idDomicilio_foreign_idx` (`idDomicilio`),
  CONSTRAINT `Clinica_idDomicilio_foreign_idx` FOREIGN KEY (`idDomicilio`) REFERENCES `domicilio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinica`
--

LOCK TABLES `clinica` WRITE;
/*!40000 ALTER TABLE `clinica` DISABLE KEYS */;
INSERT INTO `clinica` VALUES (1,'ESCOM','2023-11-10 15:36:53','2023-11-15 12:49:22','Lo mejor de los medicos programadores',9),(2,'admin2','2023-11-12 01:29:24','2023-11-12 01:29:24',NULL,NULL);
/*!40000 ALTER TABLE `clinica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuraciones`
--

DROP TABLE IF EXISTS `configuraciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuraciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Dias_laborables` varchar(255) NOT NULL DEFAULT 'Lunes-Viernes',
  `Horario` varchar(255) NOT NULL DEFAULT '09:00-18:00',
  `Duracion_cita` int NOT NULL DEFAULT '30',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuraciones`
--

LOCK TABLES `configuraciones` WRITE;
/*!40000 ALTER TABLE `configuraciones` DISABLE KEYS */;
INSERT INTO `configuraciones` VALUES (1,'Lunes,Martes,Jueves,Viernes','09:00-11:00',30,'2023-11-10 16:16:18','2023-11-20 16:12:24'),(2,'Lunes,Martes,Jueves,Viernes','06:00-12:00',15,'2023-11-10 16:23:13','2023-11-10 16:23:13'),(3,'Viernes','12:00-18:00',30,'2023-11-11 21:03:38','2023-11-11 21:03:38'),(4,'Jueves,Sabado,Martes','10:00-15:00',15,'2023-11-12 13:21:30','2023-11-19 22:40:43'),(5,'Lunes,Martes,Miercoles,Jueves,Viernes,Domingo,Sabado','06:00-08:00',30,'2023-11-19 22:56:37','2023-11-19 22:57:23');
/*!40000 ALTER TABLE `configuraciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `docpac`
--

DROP TABLE IF EXISTS `docpac`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `docpac` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idDoctor` int NOT NULL,
  `idPaciente` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idDoctor` (`idDoctor`),
  KEY `idPaciente` (`idPaciente`),
  CONSTRAINT `docpac_ibfk_1` FOREIGN KEY (`idDoctor`) REFERENCES `doctor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `docpac_ibfk_2` FOREIGN KEY (`idPaciente`) REFERENCES `paciente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `docpac_ibfk_3` FOREIGN KEY (`idDoctor`) REFERENCES `doctor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `docpac_ibfk_4` FOREIGN KEY (`idPaciente`) REFERENCES `paciente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docpac`
--

LOCK TABLES `docpac` WRITE;
/*!40000 ALTER TABLE `docpac` DISABLE KEYS */;
INSERT INTO `docpac` VALUES (1,1,1,'2023-11-10 16:30:09','2023-11-10 16:30:09'),(2,2,2,'2023-11-10 18:07:49','2023-11-10 18:07:49'),(3,2,1,'2023-11-11 15:38:23','2023-11-11 15:38:23'),(4,1,2,'2023-11-11 18:01:32','2023-11-11 18:01:32'),(5,3,3,'2023-11-12 13:07:21','2023-11-12 13:07:21'),(6,1,4,'2023-11-12 13:10:57','2023-11-12 13:10:57'),(7,4,5,'2023-11-18 13:31:59','2023-11-18 13:31:59'),(8,1,5,'2023-11-19 11:10:45','2023-11-19 11:10:45'),(9,4,2,'2023-11-19 11:41:31','2023-11-19 11:41:31'),(10,4,6,'2023-11-19 13:52:47','2023-11-19 13:52:47'),(11,4,7,'2023-11-19 13:55:27','2023-11-19 13:55:27'),(12,1,7,'2023-11-19 23:47:58','2023-11-19 23:47:58'),(13,1,6,'2023-11-19 23:48:50','2023-11-19 23:48:50'),(14,1,3,'2023-11-19 23:51:48','2023-11-19 23:51:48'),(15,3,5,'2023-11-20 06:08:04','2023-11-20 06:08:04');
/*!40000 ALTER TABLE `docpac` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `idConfiguraciones` int NOT NULL,
  `Nombre` varchar(25) NOT NULL,
  `ApellidoP` varchar(25) NOT NULL,
  `ApellidoM` varchar(25) NOT NULL,
  `CURP` varchar(255) NOT NULL,
  `Cedula` varchar(255) NOT NULL,
  `Especialidad` varchar(255) NOT NULL,
  `idDomicilio` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUser` (`idUser`),
  KEY `idConfiguraciones` (`idConfiguraciones`),
  KEY `idDomicilio` (`idDomicilio`),
  CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `doctor_ibfk_2` FOREIGN KEY (`idConfiguraciones`) REFERENCES `configuraciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `doctor_ibfk_3` FOREIGN KEY (`idDomicilio`) REFERENCES `domicilio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `doctor_ibfk_4` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `doctor_ibfk_5` FOREIGN KEY (`idConfiguraciones`) REFERENCES `configuraciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `doctor_ibfk_6` FOREIGN KEY (`idDomicilio`) REFERENCES `domicilio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (1,2,1,'Juan Carlos','Sarmiento','Gutierrez','SAGJ011121HDFRTNA6','SAGJ0111','Psiquiatría',1,'2023-11-10 16:16:18','2023-11-19 20:47:45'),(2,3,2,'Jhovanny','Cruz','Hernandez','JOVA211101DFWDWDWD','JOVAJOVA','Cirugía General',2,'2023-11-10 16:23:14','2023-11-16 21:13:09'),(3,6,3,'Ian Yael','Marcos','Cruz','YAELYAEL1318828288','YAEL1234','Otorrinolaringología',5,'2023-11-11 21:03:39','2023-11-11 21:03:39'),(4,10,4,'Luis','Hernandez','Pillo','LUISLUISLUIS441445','LUIS1215','Oftalmología',8,'2023-11-12 13:21:31','2023-11-12 13:21:31'),(5,14,5,'x','x','x','XXXXXXXXXXXXXXXXXX','XXXXXXXX','Pediatría',13,'2023-11-19 22:56:38','2023-11-19 22:56:38');
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domicilio`
--

DROP TABLE IF EXISTS `domicilio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domicilio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Calle` varchar(255) NOT NULL,
  `Num_ext` varchar(255) NOT NULL,
  `Num_int` varchar(255) DEFAULT NULL,
  `Estado` varchar(255) NOT NULL,
  `Municipio` varchar(255) NOT NULL,
  `Colonia` varchar(255) NOT NULL,
  `CP` int NOT NULL,
  `Telefono` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domicilio`
--

LOCK TABLES `domicilio` WRITE;
/*!40000 ALTER TABLE `domicilio` DISABLE KEYS */;
INSERT INTO `domicilio` VALUES (1,'Crisantemo','2a','12','Mexico','La Paz','Lomas de San Sebas',56512,'5563227495','2023-11-10 16:16:18','2023-11-19 20:47:46'),(2,'Festival','2','2','Mexico','Los Reyes','Lomas de San Sebas',56474,'5544887711','2023-11-10 16:23:14','2023-11-16 21:13:09'),(3,'Crisantemo','2a','12','Mexico','La Paz','Lomas de San Sebas',56512,'5543474429','2023-11-10 16:30:08','2023-11-12 11:57:28'),(4,'5th Avenue','5','5','California','East','Westcool',44,'5588442266','2023-11-10 18:07:48','2023-11-16 21:10:44'),(5,'Gloria','3','3','Ciudad Mexico','Potrero','La loma',12457,'2255446688','2023-11-11 21:03:39','2023-11-11 21:03:39'),(6,'Crisantemo','2a','12','Mexico','La Paz','Lomas de San Sebas',56512,'5577228811','2023-11-12 13:07:21','2023-11-12 13:07:21'),(7,'Crisantemo','4','4','Mexico','La paz','La solodira',78451,'7744115566','2023-11-12 13:10:57','2023-11-12 13:10:57'),(8,'Gloraia','7','7','Ciudad Mexico','San Joaquin','Pantitlan',45781,'8811335599','2023-11-12 13:21:31','2023-11-12 13:21:31'),(9,'Av. Juan de Dios Batiz','ESCOM','12','Ciudad Mexico',' Gustavo A. Madero','Nueva Industrial V',7738,'5543474429','2023-11-12 17:39:58','2023-11-15 12:49:22'),(10,'Geranios','2a','5','Mexico','Iztapalapa','Gloretsa',78451,'9955771133','2023-11-18 13:31:58','2023-11-18 15:23:46'),(11,'t','2','2','t','t','t',78451,'78451214','2023-11-19 13:52:47','2023-11-19 13:52:47'),(12,'z','2','2','z','z','z',78451,'78562145','2023-11-19 13:55:27','2023-11-19 13:55:27'),(13,'x','5','5','x','x','x',54714,'78451296','2023-11-19 22:56:38','2023-11-19 22:56:38');
/*!40000 ALTER TABLE `domicilio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especialidad`
--

DROP TABLE IF EXISTS `especialidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especialidad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidad`
--

LOCK TABLES `especialidad` WRITE;
/*!40000 ALTER TABLE `especialidad` DISABLE KEYS */;
/*!40000 ALTER TABLE `especialidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examen_fisico`
--

DROP TABLE IF EXISTS `examen_fisico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examen_fisico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Peso` int NOT NULL,
  `Estatura` double NOT NULL,
  `Presion_arterial` int NOT NULL,
  `Frecuencia_cardiaca` int NOT NULL,
  `Frecuencia_respiratoria` int NOT NULL,
  `Temperatura` int NOT NULL,
  `Grupo_sanguineo` varchar(255) NOT NULL,
  `Exploracion_detallada` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examen_fisico`
--

LOCK TABLES `examen_fisico` WRITE;
/*!40000 ALTER TABLE `examen_fisico` DISABLE KEYS */;
INSERT INTO `examen_fisico` VALUES (1,200,173,80,80,50,36,'O+','No hay detalles del examen fisico','2023-11-10 16:30:09','2023-11-11 15:36:27'),(2,80,182,80,80,50,36,'O+','No hay detalles del examen fisico','2023-11-10 18:07:49','2023-11-16 21:11:28'),(3,68,160,80,80,50,36,'O+','No hay','2023-11-12 13:07:21','2023-11-12 13:07:21'),(4,100,150,80,80,50,36,'O+','Testing','2023-11-12 13:10:57','2023-11-12 13:10:57'),(5,100,200,90,80,36,36,'O+','no hay','2023-11-18 13:31:59','2023-11-18 13:31:59'),(6,10,10,10,10,10,12,'t','r','2023-11-19 13:52:47','2023-11-19 13:52:47'),(7,20,20,20,20,20,20,'z','z','2023-11-19 13:55:27','2023-11-19 13:55:27');
/*!40000 ALTER TABLE `examen_fisico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historia_clinica_actual`
--

DROP TABLE IF EXISTS `historia_clinica_actual`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historia_clinica_actual` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Motivo_consulta` varchar(255) NOT NULL,
  `Sintomas` varchar(255) NOT NULL,
  `Fecha_inicio_sintomas` varchar(255) NOT NULL,
  `Plan_tratamiento` varchar(255) NOT NULL,
  `idHistorialClinico` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idHistorialClinico` (`idHistorialClinico`),
  CONSTRAINT `historia_clinica_actual_ibfk_1` FOREIGN KEY (`idHistorialClinico`) REFERENCES `historial_clinico` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historia_clinica_actual`
--

LOCK TABLES `historia_clinica_actual` WRITE;
/*!40000 ALTER TABLE `historia_clinica_actual` DISABLE KEYS */;
INSERT INTO `historia_clinica_actual` VALUES (1,'Dolor de cabeza','Dolor punzante en la zona superior de la cabeza','2023-11-06','Medicamento recetado',1,'2023-11-10 16:30:09','2023-11-10 16:30:09'),(2,'Dolor de estomago','Dolor punzante en el estomago','2023-11-09','Medicamento',2,'2023-11-10 18:07:49','2023-11-10 18:07:49'),(3,'Revision acne','Acne en la zona facial','2020-01-12','Tratamiento',3,'2023-11-12 13:07:22','2023-11-12 13:07:22'),(4,'Test','Test','2023-11-12','Test',4,'2023-11-12 13:10:57','2023-11-12 13:10:57'),(5,'Otro malestar','Dolor malo','2023-11-14','Medicinas internas',1,'2023-11-15 19:33:07','2023-11-15 19:33:07'),(6,'dolor','dolor','2023-11-13','tratamiento',5,'2023-11-18 13:31:59','2023-11-18 13:31:59'),(7,'t','t','2023-11-13','t',6,'2023-11-19 13:52:47','2023-11-19 13:52:47'),(8,'z','z','2023-11-13','z',7,'2023-11-19 13:55:27','2023-11-19 13:55:27');
/*!40000 ALTER TABLE `historia_clinica_actual` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historia_medica`
--

DROP TABLE IF EXISTS `historia_medica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historia_medica` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Enfermedades_hereditarias` varchar(255) NOT NULL,
  `Enfermedades_previas` varchar(255) NOT NULL,
  `Cirugias` varchar(255) NOT NULL,
  `Alergias` varchar(255) NOT NULL,
  `Traumatismos` varchar(255) NOT NULL,
  `Vacunas` varchar(255) NOT NULL,
  `Habitos_salud` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historia_medica`
--

LOCK TABLES `historia_medica` WRITE;
/*!40000 ALTER TABLE `historia_medica` DISABLE KEYS */;
INSERT INTO `historia_medica` VALUES (1,'Hipertension y diabetes','Ninguna','Ninguna','A las moscas','Ninguno','1','Higiene,Autocuidado,Alcohol,No_dormir','2023-11-10 16:30:09','2023-11-12 13:45:06'),(2,'Ninguna','Ninguna','Ninguna','Ninguna','Ninguno','1','Higiene,Ejercicio,Autocuidado,Drogas,Alcohol,Tabaquismo','2023-11-10 18:07:49','2023-11-16 21:11:31'),(3,'Ninguna','Bronquities','Ninguna','Medicina','Ninguno','1','Higiene,Autocuidado,No_dormir','2023-11-12 13:07:21','2023-11-12 13:07:21'),(4,'Test','Test','Test','Test','Test','1','Dieta,Drogas','2023-11-12 13:10:57','2023-11-12 13:10:57'),(5,'no hay','no hay','no hay','no hay','no hay','1','Dieta,Ejercicio,Tabaquismo,Alcohol','2023-11-18 13:31:59','2023-11-18 13:31:59'),(6,'t','t','t','t','t','1','Dieta,Alcohol','2023-11-19 13:52:47','2023-11-19 13:52:47'),(7,'z','z','z','z','z','1','Ejercicio,Alcohol','2023-11-19 13:55:27','2023-11-19 13:55:27');
/*!40000 ALTER TABLE `historia_medica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_clinico`
--

DROP TABLE IF EXISTS `historial_clinico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_clinico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idPaciente` int NOT NULL,
  `idHistoriaMedica` int NOT NULL,
  `idExamenFisico` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idPaciente` (`idPaciente`),
  KEY `idHistoriaMedica` (`idHistoriaMedica`),
  KEY `idExamenFisico` (`idExamenFisico`),
  CONSTRAINT `historial_clinico_ibfk_1` FOREIGN KEY (`idPaciente`) REFERENCES `paciente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `historial_clinico_ibfk_4` FOREIGN KEY (`idPaciente`) REFERENCES `paciente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `historial_clinico_ibfk_5` FOREIGN KEY (`idHistoriaMedica`) REFERENCES `historia_medica` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `historial_clinico_ibfk_6` FOREIGN KEY (`idExamenFisico`) REFERENCES `examen_fisico` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_clinico`
--

LOCK TABLES `historial_clinico` WRITE;
/*!40000 ALTER TABLE `historial_clinico` DISABLE KEYS */;
INSERT INTO `historial_clinico` VALUES (1,1,1,1,'2023-11-10 16:30:09','2023-11-10 16:30:09'),(2,2,2,2,'2023-11-10 18:07:49','2023-11-10 18:07:49'),(3,3,3,3,'2023-11-12 13:07:22','2023-11-12 13:07:22'),(4,4,4,4,'2023-11-12 13:10:57','2023-11-12 13:10:57'),(5,5,5,5,'2023-11-18 13:31:59','2023-11-18 13:31:59'),(6,6,6,6,'2023-11-19 13:52:47','2023-11-19 13:52:47'),(7,7,7,7,'2023-11-19 13:55:27','2023-11-19 13:55:27');
/*!40000 ALTER TABLE `historial_clinico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nota`
--

DROP TABLE IF EXISTS `nota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nota` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idDocPac` int NOT NULL,
  `Nota` varchar(255) NOT NULL,
  `idHistorialClinico` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idDocPac` (`idDocPac`),
  KEY `idHistorialClinico` (`idHistorialClinico`),
  CONSTRAINT `nota_ibfk_1` FOREIGN KEY (`idDocPac`) REFERENCES `docpac` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `nota_ibfk_3` FOREIGN KEY (`idDocPac`) REFERENCES `docpac` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `nota_ibfk_4` FOREIGN KEY (`idHistorialClinico`) REFERENCES `historial_clinico` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nota`
--

LOCK TABLES `nota` WRITE;
/*!40000 ALTER TABLE `nota` DISABLE KEYS */;
INSERT INTO `nota` VALUES (1,1,'El paciente cuenta con apoyo SEP',1,'2023-11-10 16:30:09','2023-11-10 16:30:09'),(2,2,'Nota de prueba',2,'2023-11-10 18:07:49','2023-11-10 18:07:49'),(3,5,'Medicamentos de 1000 pesos',3,'2023-11-12 13:07:22','2023-11-12 13:07:22'),(4,6,'test 1',4,'2023-11-12 13:10:57','2023-11-12 13:10:57'),(5,6,'test 2',4,'2023-11-12 13:10:57','2023-11-12 13:10:57'),(6,10,'adqwdwd',6,'2023-11-19 13:52:48','2023-11-19 13:52:48'),(7,11,'z',7,'2023-11-19 13:55:27','2023-11-19 13:55:27'),(8,11,'zzz',7,'2023-11-19 13:55:27','2023-11-19 13:55:27'),(9,11,'zzzzzzzzzz',7,'2023-11-19 13:55:27','2023-11-19 13:55:27');
/*!40000 ALTER TABLE `nota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paciente`
--

DROP TABLE IF EXISTS `paciente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paciente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `Nombre` varchar(25) NOT NULL,
  `ApellidoP` varchar(25) NOT NULL,
  `ApellidoM` varchar(25) NOT NULL,
  `Genero` varchar(10) NOT NULL,
  `Fecha_nacimiento` datetime NOT NULL,
  `CURP` varchar(18) NOT NULL,
  `idDomicilio` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUser` (`idUser`),
  KEY `idDomicilio` (`idDomicilio`),
  CONSTRAINT `paciente_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `paciente_ibfk_2` FOREIGN KEY (`idDomicilio`) REFERENCES `domicilio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `paciente_ibfk_3` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `paciente_ibfk_4` FOREIGN KEY (`idDomicilio`) REFERENCES `domicilio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paciente`
--

LOCK TABLES `paciente` WRITE;
/*!40000 ALTER TABLE `paciente` DISABLE KEYS */;
INSERT INTO `paciente` VALUES (1,4,'Oswaldo','Sarmiento','Leon','M','1977-09-20 18:00:00','SALO772141DWDWDWDW',3,'2023-11-10 16:30:08','2023-11-12 11:57:28'),(2,5,'Chester','Benington','Charleston','M','1980-10-03 18:00:00','CHESTER45454545454',4,'2023-11-10 18:07:48','2023-11-16 21:10:44'),(3,8,'Lizeth','Sarmiento','Gutierrez','F','2003-07-14 18:00:00','SAGU457812MDFRTNA6',6,'2023-11-12 13:07:21','2023-11-12 13:07:21'),(4,9,'test','test','test','M','1999-12-31 18:00:00','TEST255557FEFEFEFE',7,'2023-11-12 13:10:57','2023-11-12 13:10:57'),(5,11,'Andres Manuel','Lopez','Obrador','M','2000-11-20 18:00:00','AAAAAAAAAAAAAAAAAA',10,'2023-11-18 13:31:58','2023-11-18 15:23:45'),(6,12,'t','t','t','F','2000-11-20 18:00:00','TTTTTTTTTTTTTTTTTT',11,'2023-11-19 13:52:47','2023-11-19 13:52:47'),(7,13,'z','Z','Z','M','2000-01-20 18:00:00','ZZZZZZZZZZZZZZZZZZ',12,'2023-11-19 13:55:27','2023-11-19 13:55:27');
/*!40000 ALTER TABLE `paciente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receta`
--

DROP TABLE IF EXISTS `receta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idCita` int NOT NULL,
  `Medicamento` varchar(255) NOT NULL,
  `Unidad` varchar(255) NOT NULL,
  `Dosis` int NOT NULL,
  `Frecuencia` varchar(255) NOT NULL,
  `Via_administracion` varchar(255) NOT NULL,
  `Fecha_inicio` datetime NOT NULL,
  `Fecha_fin` datetime NOT NULL,
  `Indicaciones` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idCita` (`idCita`),
  CONSTRAINT `receta_ibfk_1` FOREIGN KEY (`idCita`) REFERENCES `cita` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `receta_ibfk_2` FOREIGN KEY (`idCita`) REFERENCES `cita` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receta`
--

LOCK TABLES `receta` WRITE;
/*!40000 ALTER TABLE `receta` DISABLE KEYS */;
/*!40000 ALTER TABLE `receta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Correo` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `is_doctor` tinyint(1) NOT NULL DEFAULT '1',
  `idClinica` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Correo` (`Correo`),
  UNIQUE KEY `Correo_2` (`Correo`),
  KEY `idClinica` (`idClinica`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`idClinica`) REFERENCES `clinica` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_ibfk_2` FOREIGN KEY (`idClinica`) REFERENCES `clinica` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin@gmail.com','$2a$10$sJwmKA./WsULrHK4M8gFBuQNBISBe/vHPfOQxDpUB.RsigffF6jl2',1,1,1,'2023-11-10 15:36:53','2023-11-10 15:36:53'),(2,'jucasaguipn09@gmail.com','$2a$10$AcljJtSAWCcU6Qw1t5BM8eAlxTWYvQnRpmNTdbUy8ckpLBDyboyCy',0,1,1,'2023-11-10 16:16:18','2023-11-18 18:18:21'),(3,'jhovanny@hotmail.com','$2a$10$wJKfm/XUfX/H9ZXtoixofOBjc8RK1dwJYGqWSvcVkKFoeYOJUcgR6',0,1,1,'2023-11-10 16:23:13','2023-11-16 21:13:09'),(4,'waldo@gmail.com','$2a$10$Jvvh23GPMYdG4BbSDPuYaOD3Ug55CZjRMMrHK8aBlgJOoBQL7B9De',0,0,1,'2023-11-10 16:30:08','2023-11-12 11:57:28'),(5,'chester@gmail.com','$2a$10$P8BuhYOJkwlyGBicS1wRQOlVO9BI.zpjxeUaqXI62MoUlzBo/jkey',0,0,1,'2023-11-10 18:07:48','2023-11-16 21:10:44'),(6,'yael@gmail.com','$2a$10$.mlNqrCMpjMqxrruy0wFeOSM9qIaadAT7VSX/mqql0uEwTKluWfTS',0,1,1,'2023-11-11 21:03:39','2023-11-11 21:03:39'),(7,'admin2@gmail.com','$2a$10$y9Wl.d/XMsLR9Hz7RfntMuIfsFTievonNCVwRV2udVol6gvzr7uS2',1,1,2,'2023-11-12 01:29:24','2023-11-12 01:29:24'),(8,'liza@hotmail.com','$2a$10$5h6qIQxm0TVMxT.ZYVEdjuDsm4.9e6myRMLewllQNSXwAKCjfiCX.',0,0,1,'2023-11-12 13:07:21','2023-11-12 13:07:21'),(9,'test@gmail.com','$2a$10$oKSvor2..u5kPeoDv0QmbOssbUHE9R11GceEHpRnVfQJ6xElJBQ0C',0,0,1,'2023-11-12 13:10:56','2023-11-12 13:10:56'),(10,'luis@gmail.com','$2a$10$psOLyTA0w95QkFeRpI88petLGub.UyQ5q/zLsRgOFkUgn.6VHfPsq',0,1,1,'2023-11-12 13:21:31','2023-11-12 13:21:31'),(11,'a@a.com','$2a$10$zbCgPgo2P5olm.JnzVltbe6Z/mW0RXb16.I/2L0m/EBZ68MYhvnau',0,0,1,'2023-11-18 13:31:58','2023-11-18 15:23:46'),(12,'testing@gmail.com','$2a$10$CTinidEcmA8jQjkyzAyEz.VG0SgmFzR6fNMtTXRbv0OHgii1K5QDu',0,0,1,'2023-11-19 13:52:47','2023-11-19 13:52:47'),(13,'z@z.com','$2a$10$Cr8o1rmq8ZNRnxGP0F/f3uqSG5vy5rBK4VCJEdWBFZea1YpRoBDHm',0,0,1,'2023-11-19 13:55:26','2023-11-19 13:55:26'),(14,'x@x.com','$2a$10$MxCnRIlOXI8J4F7u7X6igO7qjoOeHAIiztdjrysQJAVKMkc/VJv6W',0,1,1,'2023-11-19 22:56:38','2023-11-19 22:56:38');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-20 16:19:06
