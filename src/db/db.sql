-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ANIECA
-- -----------------------------------------------------
-- Database that stores all data regarding ANIECA management system.

-- -----------------------------------------------------
-- Schema ANIECA
--
-- Database that stores all data regarding ANIECA management system.
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ANIECA` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
-- -----------------------------------------------------
-- Schema invoice-app-test
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema invoice-app-test
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `invoice-app-test` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `ANIECA` ;

-- -----------------------------------------------------
-- Table `ANIECA`.`T_ID_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_ID_type` (
  `idT_ID_type` INT NOT NULL AUTO_INCREMENT,
  `ID_name` VARCHAR(45) NOT NULL,
  `IMT_type` VARCHAR(45) NOT NULL,
  `Doc_type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idT_ID_type`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Student` (
  `idStudent` INT NOT NULL AUTO_INCREMENT,
  `Student_name` VARCHAR(50) NOT NULL,
  `Student_num` INT NULL,
  `Birth_date` VARCHAR(10) NULL,
  `ID_num` VARCHAR(45) NOT NULL,
  `ID_expire_date` DATE NOT NULL,
  `Tax_num` INT NOT NULL,
  `Drive_license_num` VARCHAR(45) NULL,
  `Obs` VARCHAR(255) NULL,
  `T_ID_type_idT_ID_type` INT NOT NULL,
  PRIMARY KEY (`idStudent`, `T_ID_type_idT_ID_type`),
  UNIQUE INDEX `idAluno_UNIQUE` (`idStudent` ASC) VISIBLE,
  INDEX `fk_Student_T_ID_type1_idx` (`T_ID_type_idT_ID_type` ASC) VISIBLE,
  UNIQUE INDEX `ID_num_UNIQUE` (`ID_num` ASC) VISIBLE,
  CONSTRAINT `fk_Student_T_ID_type1`
    FOREIGN KEY (`T_ID_type_idT_ID_type`)
    REFERENCES `ANIECA`.`T_ID_type` (`idT_ID_type`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Banks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Banks` (
  `idBanks` INT NOT NULL AUTO_INCREMENT,
  `Bank_name` VARCHAR(255) NOT NULL,
  `Description` VARCHAR(255) NULL,
  PRIMARY KEY (`idBanks`),
  UNIQUE INDEX `idBanks_UNIQUE` (`idBanks` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Exam_center`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Exam_center` (
  `idExam_center` INT NOT NULL AUTO_INCREMENT,
  `Exam_center_name` VARCHAR(45) NOT NULL,
  `Address` VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NOT NULL,
  `Center_num` TINYINT(3) NULL,
  `Center_code` TINYINT(4) NULL,
  `Tax_num` INT NULL,
  `Zip_code` VARCHAR(45) NULL,
  `Telephone1` INT(11) NULL,
  `Telephone2` INT(11) NULL,
  `Email1` VARCHAR(255) NULL,
  `Email2` VARCHAR(255) NULL,
  `Acc_Bank` INT NULL,
  `Acc_Bank_num` INT NULL,
  `Banks_idBanks` INT NULL,
  `IMT_Bank_num` INT NULL,
  PRIMARY KEY (`idExam_center`),
  UNIQUE INDEX `idC_Exames_UNIQUE` (`idExam_center` ASC) VISIBLE,
  UNIQUE INDEX `Num_centro_UNIQUE` (`Center_num` ASC) VISIBLE,
  INDEX `fk_Exam_center_Banks1_idx` (`Acc_Bank` ASC) VISIBLE,
  INDEX `fk_Exam_center_Banks2_idx` (`Banks_idBanks` ASC) VISIBLE,
  CONSTRAINT `fk_Exam_center_Banks1`
    FOREIGN KEY (`Acc_Bank`)
    REFERENCES `ANIECA`.`Banks` (`idBanks`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Exam_center_Banks2`
    FOREIGN KEY (`Banks_idBanks`)
    REFERENCES `ANIECA`.`Banks` (`idBanks`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`T_delegation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_delegation` (
  `idDelegation` INT NOT NULL AUTO_INCREMENT,
  `Delegation_name` VARCHAR(255) NOT NULL,
  `Delegation_num` INT NULL,
  `Delegation_short` VARCHAR(10) NULL,
  PRIMARY KEY (`idDelegation`),
  UNIQUE INDEX `idDelegation_UNIQUE` (`idDelegation` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`School`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`School` (
  `idSchool` INT NOT NULL AUTO_INCREMENT,
  `Permit` INT NOT NULL,
  `Associate_num` INT NULL,
  `School_name` VARCHAR(45) NOT NULL,
  `Address` VARCHAR(255) NOT NULL,
  `Tax_num` INT NOT NULL,
  `Zip_code` VARCHAR(45) NULL,
  `Location` VARCHAR(45) NULL,
  `Obs` VARCHAR(255) NULL,
  `Telephone1` INT(11) NULL,
  `Telephone2` INT(11) NULL,
  `Email1` VARCHAR(255) NULL,
  `Email2` VARCHAR(255) NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  `Delegation_idDelegation` INT NOT NULL,
  PRIMARY KEY (`idSchool`, `Delegation_idDelegation`),
  UNIQUE INDEX `Alvará_UNIQUE` (`Permit` ASC) VISIBLE,
  UNIQUE INDEX `idEscola_UNIQUE` (`idSchool` ASC) VISIBLE,
  INDEX `fk_School_Exam_center1_idx` (`Exam_center_idExam_center` ASC) VISIBLE,
  UNIQUE INDEX `Associate_num_UNIQUE` (`Associate_num` ASC) VISIBLE,
  INDEX `fk_School_Delegation1_idx` (`Delegation_idDelegation` ASC) VISIBLE,
  CONSTRAINT `fk_School_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_School_Delegation1`
    FOREIGN KEY (`Delegation_idDelegation`)
    REFERENCES `ANIECA`.`T_delegation` (`idDelegation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`T_exam_status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_exam_status` (
  `idexam_status` INT NOT NULL AUTO_INCREMENT,
  `Status` VARCHAR(45) NOT NULL COMMENT 'Pendente; Disponivel; Sem Continuidade;\nMarcado;\nEfectuado;Anulado;\n\n',
  `Process` INT NOT NULL,
  PRIMARY KEY (`idexam_status`),
  UNIQUE INDEX `idStatus_UNIQUE` (`idexam_status` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Type_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Type_category` (
  `idType_category` INT NOT NULL AUTO_INCREMENT,
  `Category` VARCHAR(45) NULL COMMENT 'AL; B; C; D; AP; AL,P;.....',
  PRIMARY KEY (`idType_category`),
  UNIQUE INDEX `idCategorias_UNIQUE` (`idType_category` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Student_license`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Student_license` (
  `idStudent_license` INT NOT NULL AUTO_INCREMENT,
  `Student_license` VARCHAR(45) NOT NULL,
  `Expiration_date` DATE NOT NULL,
  `Active` TINYINT(1) NOT NULL DEFAULT 1,
  `Student_idStudent` INT NOT NULL,
  `School_idSchool` INT NOT NULL,
  `Type_category_idType_category` INT NOT NULL,
  PRIMARY KEY (`idStudent_license`, `Student_idStudent`, `School_idSchool`, `Type_category_idType_category`),
  INDEX `fk_Student_license_Student1_idx` (`Student_idStudent` ASC) VISIBLE,
  INDEX `fk_Student_license_School1_idx` (`School_idSchool` ASC) VISIBLE,
  UNIQUE INDEX `Student_license_UNIQUE` (`Student_license` ASC) VISIBLE,
  INDEX `fk_Student_license_Type_category1_idx` (`Type_category_idType_category` ASC) VISIBLE,
  CONSTRAINT `fk_Student_license_Student1`
    FOREIGN KEY (`Student_idStudent`)
    REFERENCES `ANIECA`.`Student` (`idStudent`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Student_license_School1`
    FOREIGN KEY (`School_idSchool`)
    REFERENCES `ANIECA`.`School` (`idSchool`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Student_license_Type_category1`
    FOREIGN KEY (`Type_category_idType_category`)
    REFERENCES `ANIECA`.`Type_category` (`idType_category`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Role` (
  `idRole` INT NOT NULL AUTO_INCREMENT,
  `Role_name` VARCHAR(45) NULL,
  `Obs` VARCHAR(255) NULL,
  PRIMARY KEY (`idRole`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Account`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Account` (
  `idAccount` INT NOT NULL AUTO_INCREMENT,
  `User` VARCHAR(255) NOT NULL,
  `Hash` VARCHAR(255) NOT NULL,
  `Salt` VARCHAR(255) NOT NULL,
  `User_name` VARCHAR(255) NULL,
  `User_email` VARCHAR(255) NULL,
  `In_session` TINYINT(1) NULL,
  `Createdate` TIMESTAMP NULL,
  `Updatedate` TIMESTAMP NULL,
  `Status` TINYINT(1) NULL,
  `Exam_center_idExam_center` VARCHAR(45) NOT NULL,
  `Role_idRole` INT NOT NULL,
  PRIMARY KEY (`idAccount`),
  INDEX `fk_Account_Role1_idx` (`Role_idRole` ASC) VISIBLE,
  CONSTRAINT `fk_Account_Role1`
    FOREIGN KEY (`Role_idRole`)
    REFERENCES `ANIECA`.`Role` (`idRole`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Exam_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Exam_type` (
  `idExam_type` INT NOT NULL AUTO_INCREMENT,
  `Exam_type_name` VARCHAR(50) NOT NULL,
  `Short` VARCHAR(45) NULL,
  `Description` VARCHAR(45) NULL,
  `Has_route` TINYINT(1) NULL,
  `Num_examiners` TINYINT(2) NULL,
  `Num_students` TINYINT(2) NULL,
  `Duration` TIME NULL,
  `Minimun_age` TINYINT(2) NULL,
  `Has_license` TINYINT(1) NULL,
  `Has_Pair` TINYINT(1) NULL,
  `Final_exam` TINYINT(1) NULL,
  `Code` VARCHAR(3) NULL,
  `High_way` TINYINT(1) NULL,
  `Condicioned_route` TINYINT(1) NULL,
  `Type_category_idType_category` INT NOT NULL,
  PRIMARY KEY (`idExam_type`, `Type_category_idType_category`),
  UNIQUE INDEX `idTipo_exame_UNIQUE` (`idExam_type` ASC) VISIBLE,
  UNIQUE INDEX `Tipo_exame_UNIQUE` (`Exam_type_name` ASC) VISIBLE,
  INDEX `fk_Exam_type_Type_category1_idx` (`Type_category_idType_category` ASC) VISIBLE,
  CONSTRAINT `fk_Exam_type_Type_category1`
    FOREIGN KEY (`Type_category_idType_category`)
    REFERENCES `ANIECA`.`Type_category` (`idType_category`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Timeslot`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Timeslot` (
  `idTimeslot` INT NOT NULL AUTO_INCREMENT,
  `Timeslot_date` DATE NOT NULL,
  `Begin_time` TIME NOT NULL,
  `End_time` TIME NOT NULL,
  `Exam_group` INT NOT NULL,
  `Exam_type_idExam_type` INT NOT NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  PRIMARY KEY (`idTimeslot`),
  INDEX `fk_Timeslot_Exam_type1_idx` (`Exam_type_idExam_type` ASC) VISIBLE,
  INDEX `fk_Timeslot_Exam_center1_idx` (`Exam_center_idExam_center` ASC) VISIBLE,
  CONSTRAINT `fk_Timeslot_Exam_type1`
    FOREIGN KEY (`Exam_type_idExam_type`)
    REFERENCES `ANIECA`.`Exam_type` (`idExam_type`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Timeslot_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`sicc_status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`sicc_status` (
  `idsicc_status` INT NOT NULL AUTO_INCREMENT,
  `state` VARCHAR(255) NOT NULL COMMENT '1-Não marcado ; Marcado ; Erro marcação ; Marcação aceite\n2-Não enviado emissao de carta ; Emissao de carta enviada ; Erro emissao de carta ; Emissao de carta aceite\n3-Resultado não enviado ; Resultado enviado ; Erro resultado ; Resultado aceite',
  `process` VARCHAR(255) NOT NULL COMMENT '1 - booked\n2  -exam\n3- pautas',
  PRIMARY KEY (`idsicc_status`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Booked`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Booked` (
  `idBooked` INT NOT NULL AUTO_INCREMENT,
  `Exam_num` BIGINT(18) NULL,
  `Pauta_num` INT NULL,
  `Booked_date` DATETIME NOT NULL,
  `Obs` VARCHAR(255) NULL,
  `Student_license_idStudent_license` INT NOT NULL,
  `Timeslot_idTimeslot` INT NOT NULL,
  `Account_idAccount` INT NOT NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  `Exam_type_idExam_type` INT NOT NULL,
  `T_exam_status_idexam_status` INT NOT NULL,
  `sicc_status_idsicc_status` INT NOT NULL,
  PRIMARY KEY (`idBooked`, `Student_license_idStudent_license`, `Timeslot_idTimeslot`),
  UNIQUE INDEX `idReservations_UNIQUE` (`idBooked` ASC) VISIBLE,
  INDEX `fk_Reservations_Exam_center1_idx` (`Exam_center_idExam_center` ASC) VISIBLE,
  INDEX `fk_Booked_Student_license1_idx` (`Student_license_idStudent_license` ASC) VISIBLE,
  INDEX `fk_Booked_Account1_idx` (`Account_idAccount` ASC) VISIBLE,
  INDEX `fk_Booked_Exam_type1_idx` (`Exam_type_idExam_type` ASC) VISIBLE,
  INDEX `fk_Booked_T_exam_status1_idx` (`T_exam_status_idexam_status` ASC) VISIBLE,
  INDEX `fk_Booked_Timeslot1_idx` (`Timeslot_idTimeslot` ASC) VISIBLE,
  INDEX `fk_Booked_sicc_status1_idx` (`sicc_status_idsicc_status` ASC) VISIBLE,
  CONSTRAINT `fk_Reservations_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Booked_Student_license1`
    FOREIGN KEY (`Student_license_idStudent_license`)
    REFERENCES `ANIECA`.`Student_license` (`idStudent_license`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Booked_Account1`
    FOREIGN KEY (`Account_idAccount`)
    REFERENCES `ANIECA`.`Account` (`idAccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Booked_Exam_type1`
    FOREIGN KEY (`Exam_type_idExam_type`)
    REFERENCES `ANIECA`.`Exam_type` (`idExam_type`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Booked_T_exam_status1`
    FOREIGN KEY (`T_exam_status_idexam_status`)
    REFERENCES `ANIECA`.`T_exam_status` (`idexam_status`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Booked_Timeslot1`
    FOREIGN KEY (`Timeslot_idTimeslot`)
    REFERENCES `ANIECA`.`Timeslot` (`idTimeslot`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Booked_sicc_status1`
    FOREIGN KEY (`sicc_status_idsicc_status`)
    REFERENCES `ANIECA`.`sicc_status` (`idsicc_status`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`T_exam_results`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_exam_results` (
  `idT_exam_results` INT NOT NULL AUTO_INCREMENT,
  `Result` VARCHAR(45) NOT NULL COMMENT 'Aprovado;\nReprovado;\nFaltou;\nSuspenso;',
  `Code` VARCHAR(3) NOT NULL COMMENT 'AP aprovado\nRP reprovado\nFL faltou\nSP suspenso',
  PRIMARY KEY (`idT_exam_results`),
  UNIQUE INDEX `idResultado_UNIQUE` (`idT_exam_results` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Exam_route`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Exam_route` (
  `idExam_route` INT NOT NULL AUTO_INCREMENT,
  `Route` VARCHAR(255) NULL,
  `Active` TINYINT(1) NULL,
  `Code` INT NULL,
  `High_way` TINYINT(1) NULL,
  `Conditioned_route` TINYINT(1) NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  PRIMARY KEY (`idExam_route`),
  UNIQUE INDEX `idPercurso_exame_UNIQUE` (`idExam_route` ASC) VISIBLE,
  INDEX `fk_Exam_route_Exam_center1_idx` (`Exam_center_idExam_center` ASC) VISIBLE,
  CONSTRAINT `fk_Exam_route_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Examiner`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Examiner` (
  `idExaminer` INT NOT NULL AUTO_INCREMENT,
  `Examiner_name` VARCHAR(50) NOT NULL,
  `Num` INT NULL,
  `License_num` VARCHAR(45) NULL,
  `License_expiration` DATE NULL,
  `Active` TINYINT(1) NULL,
  `Obs` VARCHAR(255) NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  PRIMARY KEY (`idExaminer`, `Exam_center_idExam_center`),
  INDEX `fk_Examiner_Exam_center1_idx` (`Exam_center_idExam_center` ASC) VISIBLE,
  CONSTRAINT `fk_Examiner_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Examiner_qualifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Examiner_qualifications` (
  `idExaminer_qualifications` INT NOT NULL AUTO_INCREMENT,
  `Active` TINYINT(1) NOT NULL,
  `Note` VARCHAR(255) NULL,
  `Exam_type_idExam_type` INT NOT NULL,
  `Examiner_idExaminer` INT NOT NULL,
  PRIMARY KEY (`idExaminer_qualifications`, `Exam_type_idExam_type`, `Examiner_idExaminer`),
  INDEX `fk_Examiner_Type_exam_Exam_type1_idx` (`Exam_type_idExam_type` ASC) VISIBLE,
  UNIQUE INDEX `idExaminer_qualificationscol_UNIQUE` (`idExaminer_qualifications` ASC) VISIBLE,
  INDEX `fk_Examiner_qualifications_Examiner1_idx` (`Examiner_idExaminer` ASC) VISIBLE,
  CONSTRAINT `fk_Examiner_Type_exam_Exam_type1`
    FOREIGN KEY (`Exam_type_idExam_type`)
    REFERENCES `ANIECA`.`Exam_type` (`idExam_type`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Examiner_qualifications_Examiner1`
    FOREIGN KEY (`Examiner_idExaminer`)
    REFERENCES `ANIECA`.`Examiner` (`idExaminer`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Pauta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Pauta` (
  `idPauta` INT NOT NULL AUTO_INCREMENT,
  `Pauta_num` INT NOT NULL,
  `Pauta_date` DATETIME NULL,
  `F_reason` VARCHAR(255) NULL,
  `Timeslot_idTimeslot` INT NOT NULL,
  `Account_idAccount` INT NOT NULL,
  `Exam_type_idExam_type` INT NOT NULL,
  `Exam_route_idExam_route` INT NULL,
  `Examiner_qualifications_idExaminer_qualifications` INT NULL,
  `sicc_status_idsicc_status` INT NOT NULL,
  PRIMARY KEY (`idPauta`, `Timeslot_idTimeslot`),
  UNIQUE INDEX `idPautas_UNIQUE` (`idPauta` ASC) VISIBLE,
  INDEX `fk_Results_Exam_route1_idx` (`Exam_route_idExam_route` ASC) VISIBLE,
  INDEX `fk_Results_Account1_idx` (`Account_idAccount` ASC) VISIBLE,
  INDEX `fk_Results_Exam_type1_idx` (`Exam_type_idExam_type` ASC) VISIBLE,
  INDEX `fk_Pauta_Examiner_qualifications1_idx` (`Examiner_qualifications_idExaminer_qualifications` ASC) VISIBLE,
  INDEX `fk_Pauta_Timeslot1_idx` (`Timeslot_idTimeslot` ASC) VISIBLE,
  INDEX `fk_Pauta_sicc_status1_idx` (`sicc_status_idsicc_status` ASC) VISIBLE,
  CONSTRAINT `fk_Results_Exam_route1`
    FOREIGN KEY (`Exam_route_idExam_route`)
    REFERENCES `ANIECA`.`Exam_route` (`idExam_route`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Results_Account1`
    FOREIGN KEY (`Account_idAccount`)
    REFERENCES `ANIECA`.`Account` (`idAccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Results_Exam_type1`
    FOREIGN KEY (`Exam_type_idExam_type`)
    REFERENCES `ANIECA`.`Exam_type` (`idExam_type`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pauta_Examiner_qualifications1`
    FOREIGN KEY (`Examiner_qualifications_idExaminer_qualifications`)
    REFERENCES `ANIECA`.`Examiner_qualifications` (`idExaminer_qualifications`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pauta_Timeslot1`
    FOREIGN KEY (`Timeslot_idTimeslot`)
    REFERENCES `ANIECA`.`Timeslot` (`idTimeslot`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pauta_sicc_status1`
    FOREIGN KEY (`sicc_status_idsicc_status`)
    REFERENCES `ANIECA`.`sicc_status` (`idsicc_status`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Exam`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Exam` (
  `idExam` INT NOT NULL AUTO_INCREMENT,
  `Exam_num` BIGINT(18) NULL,
  `Car_plate` VARCHAR(8) NULL,
  `Drive_license_emit` TINYINT(1) NULL,
  `Revision` TINYINT(1) NULL,
  `Complain` TINYINT(1) NULL,
  `Booked_idBooked` INT NOT NULL,
  `Account_idAccount` INT NOT NULL,
  `Pauta_idPauta` INT NOT NULL,
  `T_exam_results_idT_exam_results` INT NULL,
  `T_exam_status_idexam_status` INT NULL,
  `sicc_status_idsicc_status` INT NOT NULL,
  PRIMARY KEY (`idExam`),
  UNIQUE INDEX `idExame_UNIQUE` (`idExam` ASC) VISIBLE,
  INDEX `fk_Exam_T_exam_status1_idx` (`T_exam_status_idexam_status` ASC) VISIBLE,
  INDEX `fk_Exam_Booked1_idx` (`Booked_idBooked` ASC) VISIBLE,
  INDEX `fk_Exam_Account1_idx` (`Account_idAccount` ASC) VISIBLE,
  INDEX `fk_Exam_T_exam_results1_idx` (`T_exam_results_idT_exam_results` ASC) VISIBLE,
  INDEX `fk_Exam_Pauta1_idx` (`Pauta_idPauta` ASC) VISIBLE,
  INDEX `fk_Exam_sicc_status1_idx` (`sicc_status_idsicc_status` ASC) VISIBLE,
  CONSTRAINT `fk_Exam_T_exam_status1`
    FOREIGN KEY (`T_exam_status_idexam_status`)
    REFERENCES `ANIECA`.`T_exam_status` (`idexam_status`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Exam_Booked1`
    FOREIGN KEY (`Booked_idBooked`)
    REFERENCES `ANIECA`.`Booked` (`idBooked`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Exam_Account1`
    FOREIGN KEY (`Account_idAccount`)
    REFERENCES `ANIECA`.`Account` (`idAccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Exam_T_exam_results1`
    FOREIGN KEY (`T_exam_results_idT_exam_results`)
    REFERENCES `ANIECA`.`T_exam_results` (`idT_exam_results`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Exam_Pauta1`
    FOREIGN KEY (`Pauta_idPauta`)
    REFERENCES `ANIECA`.`Pauta` (`idPauta`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Exam_sicc_status1`
    FOREIGN KEY (`sicc_status_idsicc_status`)
    REFERENCES `ANIECA`.`sicc_status` (`idsicc_status`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Work_hours`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Work_hours` (
  `idWork_hours` INT NOT NULL AUTO_INCREMENT,
  `Week_day` INT NULL,
  `Start_hour` TIME NULL,
  `End_hour` TIME NULL,
  `Obs` VARCHAR(255) NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  PRIMARY KEY (`idWork_hours`),
  UNIQUE INDEX `idHorario_exame_UNIQUE` (`idWork_hours` ASC) VISIBLE,
  INDEX `fk_Exam_center_schedule_Exam_center1_idx` (`Exam_center_idExam_center` ASC) VISIBLE,
  CONSTRAINT `fk_Exam_center_schedule_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`T_Tax`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_Tax` (
  `idT_Tax` INT NOT NULL AUTO_INCREMENT,
  `Tax` DOUBLE NOT NULL,
  PRIMARY KEY (`idT_Tax`),
  UNIQUE INDEX `idIVA_UNIQUE` (`idT_Tax` ASC) VISIBLE,
  UNIQUE INDEX `Valor_UNIQUE` (`Tax` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Exam_price`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Exam_price` (
  `idExam_price` INT NOT NULL AUTO_INCREMENT,
  `Price` DOUBLE NULL,
  `Price_no_associated` DOUBLE NULL,
  `Tax_emit_drive_license` DOUBLE NULL,
  `Exam_type_idExam_type` INT NOT NULL,
  `T_Tax_idT_Tax` INT NULL,
  PRIMARY KEY (`idExam_price`),
  UNIQUE INDEX `idPreçário_UNIQUE` (`idExam_price` ASC) VISIBLE,
  INDEX `fk_Exam_price_Exam_type1_idx` (`Exam_type_idExam_type` ASC) VISIBLE,
  INDEX `fk_Exam_price_T_Tax1_idx` (`T_Tax_idT_Tax` ASC) VISIBLE,
  CONSTRAINT `fk_Exam_price_Exam_type1`
    FOREIGN KEY (`Exam_type_idExam_type`)
    REFERENCES `ANIECA`.`Exam_type` (`idExam_type`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Exam_price_T_Tax1`
    FOREIGN KEY (`T_Tax_idT_Tax`)
    REFERENCES `ANIECA`.`T_Tax` (`idT_Tax`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Payment` (
  `idPayment` INT NOT NULL AUTO_INCREMENT,
  `Payment_date` DATE NOT NULL,
  `Total_value` DOUBLE NOT NULL,
  `Invoice_num` VARCHAR(255) NULL,
  PRIMARY KEY (`idPayment`),
  UNIQUE INDEX `idPayment_UNIQUE` (`idPayment` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Pendent_payments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Pendent_payments` (
  `idPendent_payments` INT NOT NULL AUTO_INCREMENT,
  `Exam_num` BIGINT(18) NULL,
  `Exam_price` DOUBLE NULL,
  `Tax_price` DOUBLE NULL,
  `Booked_idBooked` INT NOT NULL,
  `Student_license_idStudent_license` INT NOT NULL,
  `Payments_idPayments` INT NULL,
  PRIMARY KEY (`idPendent_payments`),
  UNIQUE INDEX `idPagamentos_UNIQUE` (`idPendent_payments` ASC) VISIBLE,
  INDEX `fk_Pendent_payments_Booked1_idx` (`Booked_idBooked` ASC) VISIBLE,
  INDEX `fk_Pendent_payments_Student_license1_idx` (`Student_license_idStudent_license` ASC) VISIBLE,
  INDEX `fk_Pendent_payments_Payments1_idx` (`Payments_idPayments` ASC) VISIBLE,
  CONSTRAINT `fk_Pendent_payments_Booked1`
    FOREIGN KEY (`Booked_idBooked`)
    REFERENCES `ANIECA`.`Booked` (`idBooked`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pendent_payments_Student_license1`
    FOREIGN KEY (`Student_license_idStudent_license`)
    REFERENCES `ANIECA`.`Student_license` (`idStudent_license`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pendent_payments_Payments1`
    FOREIGN KEY (`Payments_idPayments`)
    REFERENCES `ANIECA`.`Payment` (`idPayment`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`T_Status_check`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_Status_check` (
  `idT_Status_check` INT NOT NULL AUTO_INCREMENT,
  `Status` VARCHAR(45) NOT NULL COMMENT 'Por Depositar;\nDepositado;\nPendente;\nCrédito;\nOferta;',
  `Check_date` DATE NOT NULL,
  UNIQUE INDEX `Status_UNIQUE` (`Status` ASC) VISIBLE,
  PRIMARY KEY (`idT_Status_check`),
  UNIQUE INDEX `idT_Status_check_UNIQUE` (`idT_Status_check` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Invoice_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Invoice_info` (
  `idInvoice_info` INT NOT NULL AUTO_INCREMENT,
  `Invoice_name` VARCHAR(255) NOT NULL,
  `Invoice_address` VARCHAR(255) NOT NULL,
  `Invoice_location` VARCHAR(255) NOT NULL,
  `Invoice_zip_code` VARCHAR(45) NOT NULL,
  `Invoice_tax_number` INT NOT NULL,
  `Invoice_email` VARCHAR(255) NULL,
  `Send_invoice_email` TINYINT(1) NULL DEFAULT 1,
  `School_idSchool` INT NOT NULL,
  PRIMARY KEY (`idInvoice_info`),
  UNIQUE INDEX `idInvoice_info_UNIQUE` (`idInvoice_info` ASC) VISIBLE,
  UNIQUE INDEX `Invoice_tax_number_UNIQUE` (`Invoice_tax_number` ASC) VISIBLE,
  INDEX `fk_Invoice_info_School1_idx` (`School_idSchool` ASC) VISIBLE,
  CONSTRAINT `fk_Invoice_info_School1`
    FOREIGN KEY (`School_idSchool`)
    REFERENCES `ANIECA`.`School` (`idSchool`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Payment_method`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Payment_method` (
  `idPayment_method` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idPayment_method`),
  UNIQUE INDEX `idPayment_method_UNIQUE` (`idPayment_method` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Transactions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Transactions` (
  `idTransactions` INT NOT NULL AUTO_INCREMENT,
  `Transaction_num` INT NULL,
  `Transaction_value` DOUBLE NOT NULL,
  `Transaction_date` DATE NOT NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  `School_idSchool` INT NOT NULL,
  `Payment_method_idPayment_method` INT NOT NULL,
  `Payments_idPayments` INT NULL,
  `T_Status_check_idT_Status_check` INT NULL,
  `Banks_idBanks` INT NULL,
  PRIMARY KEY (`idTransactions`, `Exam_center_idExam_center`, `School_idSchool`, `Payment_method_idPayment_method`),
  UNIQUE INDEX `idTransactions_UNIQUE` (`idTransactions` ASC) VISIBLE,
  INDEX `fk_Transactions_Payments1_idx` (`Payments_idPayments` ASC) VISIBLE,
  INDEX `fk_Transactions_Exam_center1_idx` (`Exam_center_idExam_center` ASC) VISIBLE,
  INDEX `fk_Transactions_T_Status_check1_idx` (`T_Status_check_idT_Status_check` ASC) VISIBLE,
  INDEX `fk_Transactions_Banks1_idx` (`Banks_idBanks` ASC) VISIBLE,
  INDEX `fk_Transactions_Payment_method1_idx` (`Payment_method_idPayment_method` ASC) VISIBLE,
  INDEX `fk_Transactions_School1_idx` (`School_idSchool` ASC) VISIBLE,
  CONSTRAINT `fk_Transactions_Payments1`
    FOREIGN KEY (`Payments_idPayments`)
    REFERENCES `ANIECA`.`Payment` (`idPayment`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Transactions_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Transactions_T_Status_check1`
    FOREIGN KEY (`T_Status_check_idT_Status_check`)
    REFERENCES `ANIECA`.`T_Status_check` (`idT_Status_check`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Transactions_Banks1`
    FOREIGN KEY (`Banks_idBanks`)
    REFERENCES `ANIECA`.`Banks` (`idBanks`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Transactions_Payment_method1`
    FOREIGN KEY (`Payment_method_idPayment_method`)
    REFERENCES `ANIECA`.`Payment_method` (`idPayment_method`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Transactions_School1`
    FOREIGN KEY (`School_idSchool`)
    REFERENCES `ANIECA`.`School` (`idSchool`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Blocked_schools`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Blocked_schools` (
  `idBlocked_schools` INT NOT NULL AUTO_INCREMENT,
  `Examiner_idExaminer` INT NOT NULL,
  `School_idSchool` INT NOT NULL,
  `Obs` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idBlocked_schools`),
  UNIQUE INDEX `idBlocked_schools_UNIQUE` (`idBlocked_schools` ASC) VISIBLE,
  INDEX `fk_Blocked_schools_Examiner1_idx` (`Examiner_idExaminer` ASC) VISIBLE,
  INDEX `fk_Blocked_schools_School1_idx` (`School_idSchool` ASC) VISIBLE,
  CONSTRAINT `fk_Blocked_schools_Examiner1`
    FOREIGN KEY (`Examiner_idExaminer`)
    REFERENCES `ANIECA`.`Examiner` (`idExaminer`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Blocked_schools_School1`
    FOREIGN KEY (`School_idSchool`)
    REFERENCES `ANIECA`.`School` (`idSchool`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Student_note`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Student_note` (
  `idStudent_note` INT NOT NULL AUTO_INCREMENT,
  `Note` VARCHAR(255) NULL,
  `Student_idStudent` INT NOT NULL,
  PRIMARY KEY (`idStudent_note`),
  INDEX `fk_Student_note_Student1_idx` (`Student_idStudent` ASC) VISIBLE,
  CONSTRAINT `fk_Student_note_Student1`
    FOREIGN KEY (`Student_idStudent`)
    REFERENCES `ANIECA`.`Student` (`idStudent`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`T_resource`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_resource` (
  `idT_resource` INT NOT NULL AUTO_INCREMENT,
  `Resource_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idT_resource`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`T_permission`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_permission` (
  `idT_permission` INT NOT NULL AUTO_INCREMENT,
  `Action` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idT_permission`),
  UNIQUE INDEX `Action_UNIQUE` (`Action` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Functionality`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Functionality` (
  `idFunctionality` INT NOT NULL AUTO_INCREMENT,
  `T_resource_idT_resource` INT NOT NULL,
  `T_permission_idT_permission` INT NOT NULL,
  `Role_idRole` INT NOT NULL,
  PRIMARY KEY (`idFunctionality`, `T_resource_idT_resource`, `T_permission_idT_permission`, `Role_idRole`),
  INDEX `fk_Role_T_resource1_idx` (`T_resource_idT_resource` ASC) VISIBLE,
  INDEX `fk_Role_T_permission1_idx` (`T_permission_idT_permission` ASC) VISIBLE,
  INDEX `fk_Functionality_Role1_idx` (`Role_idRole` ASC) VISIBLE,
  CONSTRAINT `fk_Role_T_resource1`
    FOREIGN KEY (`T_resource_idT_resource`)
    REFERENCES `ANIECA`.`T_resource` (`idT_resource`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Role_T_permission1`
    FOREIGN KEY (`T_permission_idT_permission`)
    REFERENCES `ANIECA`.`T_permission` (`idT_permission`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Functionality_Role1`
    FOREIGN KEY (`Role_idRole`)
    REFERENCES `ANIECA`.`Role` (`idRole`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`table1`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`table1` (
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Inventory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Inventory` (
  `idInventory` INT NOT NULL AUTO_INCREMENT,
  `Item` VARCHAR(255) NOT NULL,
  `Amount` INT NOT NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  PRIMARY KEY (`idInventory`),
  INDEX `fk_Inventory_Exam_center1_idx` (`Exam_center_idExam_center` ASC) VISIBLE,
  CONSTRAINT `fk_Inventory_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Reservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Reservation` (
  `idReservation` INT NOT NULL AUTO_INCREMENT,
  `Account_User` VARCHAR(255) NULL,
  `Lock_expiration_date` DATETIME NULL,
  `Timeslot_idTimeslot` INT NOT NULL,
  `T_exam_status_idexam_status` INT NOT NULL DEFAULT 1,
  `Exam_type_idExam_type` INT NOT NULL,
  PRIMARY KEY (`idReservation`),
  UNIQUE INDEX `idReservation_UNIQUE` (`idReservation` ASC) VISIBLE,
  INDEX `fk_Reservation_T_exam_status1_idx` (`T_exam_status_idexam_status` ASC) VISIBLE,
  INDEX `fk_Reservation_Exam_type1_idx` (`Exam_type_idExam_type` ASC) VISIBLE,
  INDEX `fk_Reservation_Timeslot1_idx` (`Timeslot_idTimeslot` ASC) VISIBLE,
  CONSTRAINT `fk_Reservation_T_exam_status1`
    FOREIGN KEY (`T_exam_status_idexam_status`)
    REFERENCES `ANIECA`.`T_exam_status` (`idexam_status`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Reservation_Exam_type1`
    FOREIGN KEY (`Exam_type_idExam_type`)
    REFERENCES `ANIECA`.`Exam_type` (`idExam_type`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Reservation_Timeslot1`
    FOREIGN KEY (`Timeslot_idTimeslot`)
    REFERENCES `ANIECA`.`Timeslot` (`idTimeslot`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Daily_groups`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Daily_groups` (
  `idGroups` INT NOT NULL AUTO_INCREMENT,
  `Group_day` DATE NOT NULL,
  `Max` INT NOT NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  PRIMARY KEY (`idGroups`),
  UNIQUE INDEX `idGroups_UNIQUE` (`idGroups` ASC) VISIBLE,
  INDEX `fk_Groups_Exam_center1_idx` (`Exam_center_idExam_center` ASC) VISIBLE,
  CONSTRAINT `fk_Groups_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Temp_Student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Temp_Student` (
  `idTemp_Student` INT NOT NULL AUTO_INCREMENT,
  `Student_name` VARCHAR(255) NULL,
  `Birth_date` DATE NULL,
  `Tax_num` INT NOT NULL,
  `Drive_license_num` VARCHAR(45) NULL,
  `Obs` VARCHAR(255) NULL,
  `School_Permit` INT NULL,
  `Student_license` VARCHAR(45) NULL,
  `Expiration_date` DATE NULL,
  `Reservation_idReservation` INT NOT NULL,
  `Type_category_idType_category` INT NULL,
  `T_ID_type_idT_ID_type` INT NULL,
  PRIMARY KEY (`idTemp_Student`),
  UNIQUE INDEX `idTemp_Student_UNIQUE` (`idTemp_Student` ASC) VISIBLE,
  INDEX `fk_Temp_Student_Reservation1_idx` (`Reservation_idReservation` ASC) VISIBLE,
  INDEX `fk_Temp_Student_Type_category1_idx` (`Type_category_idType_category` ASC) VISIBLE,
  INDEX `fk_Temp_Student_T_ID_type1_idx` (`T_ID_type_idT_ID_type` ASC) VISIBLE,
  CONSTRAINT `fk_Temp_Student_Reservation1`
    FOREIGN KEY (`Reservation_idReservation`)
    REFERENCES `ANIECA`.`Reservation` (`idReservation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Temp_Student_Type_category1`
    FOREIGN KEY (`Type_category_idType_category`)
    REFERENCES `ANIECA`.`Type_category` (`idType_category`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Temp_Student_T_ID_type1`
    FOREIGN KEY (`T_ID_type_idT_ID_type`)
    REFERENCES `ANIECA`.`T_ID_type` (`idT_ID_type`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `invoice-app-test` ;

-- -----------------------------------------------------
-- Table `invoice-app-test`.`company`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoice-app-test`.`company` (
  `idCompany` INT(11) NOT NULL AUTO_INCREMENT,
  `shortName` VARCHAR(45) NOT NULL,
  `longName` VARCHAR(100) NULL DEFAULT NULL,
  `nif` INT(11) NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  `postalCode` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NULL DEFAULT NULL,
  `country` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `fax` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idCompany`),
  UNIQUE INDEX `nif_UNIQUE` (`nif` ASC) VISIBLE,
  UNIQUE INDEX `idCompany_UNIQUE` (`idCompany` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `invoice-app-test`.`customers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoice-app-test`.`customers` (
  `idCustomer` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `nif` VARCHAR(45) NOT NULL,
  `address` VARCHAR(45) NULL DEFAULT NULL,
  `postalCode` VARCHAR(45) NULL DEFAULT NULL,
  `city` VARCHAR(45) NULL DEFAULT NULL,
  `country` VARCHAR(45) NULL DEFAULT NULL,
  `idCompany` INT(11) NULL DEFAULT NULL,
  `permit` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`idCustomer`),
  UNIQUE INDEX `idCustomer_UNIQUE` (`idCustomer` ASC) VISIBLE,
  UNIQUE INDEX `nif_UNIQUE` (`nif` ASC) VISIBLE,
  INDEX `fk_customers_idCompany_idx` (`idCompany` ASC) VISIBLE,
  CONSTRAINT `fk_customers_idCompany`
    FOREIGN KEY (`idCompany`)
    REFERENCES `invoice-app-test`.`company` (`idCompany`))
ENGINE = InnoDB
AUTO_INCREMENT = 38
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `invoice-app-test`.`invoices`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoice-app-test`.`invoices` (
  `idInvoice` INT(11) NOT NULL AUTO_INCREMENT,
  `reference` VARCHAR(45) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `serie` VARCHAR(45) NOT NULL,
  `invoiceNo` VARCHAR(45) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `idCustomer` INT(11) NOT NULL,
  `hash` VARCHAR(500) NULL DEFAULT NULL,
  `idCompany` INT(11) NULL DEFAULT NULL,
  `header_name` VARCHAR(45) NULL DEFAULT NULL,
  `header_address` VARCHAR(45) NULL DEFAULT NULL,
  `header_postalCode` VARCHAR(45) NULL DEFAULT NULL,
  `header_city` VARCHAR(45) NULL DEFAULT NULL,
  `header_phone` VARCHAR(45) NULL DEFAULT NULL,
  `header_fax` VARCHAR(45) NULL DEFAULT NULL,
  `header_email` VARCHAR(45) NULL DEFAULT NULL,
  `header_number` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idInvoice`),
  UNIQUE INDEX `reference_UNIQUE` (`reference` ASC) VISIBLE,
  UNIQUE INDEX `idInvoice_UNIQUE` (`idInvoice` ASC) VISIBLE,
  INDEX `FK_idCompany_idx` (`idCompany` ASC) VISIBLE,
  INDEX `fk_invoices_idCustomer_idx` (`idCustomer` ASC) VISIBLE,
  CONSTRAINT `fk_invoices_idCustomer`
    FOREIGN KEY (`idCustomer`)
    REFERENCES `invoice-app-test`.`customers` (`idCustomer`)
    ON DELETE RESTRICT)
ENGINE = InnoDB
AUTO_INCREMENT = 767
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `invoice-app-test`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoice-app-test`.`products` (
  `idProduct` INT(11) NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NOT NULL,
  `productType` VARCHAR(45) NOT NULL,
  `idCompany` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`idProduct`),
  UNIQUE INDEX `idProduct_UNIQUE` (`idProduct` ASC) VISIBLE,
  UNIQUE INDEX `code_UNIQUE` (`code` ASC) VISIBLE,
  INDEX `fk_products_idCompany_idx` (`idCompany` ASC) VISIBLE,
  CONSTRAINT `fk_products_idCompany`
    FOREIGN KEY (`idCompany`)
    REFERENCES `invoice-app-test`.`company` (`idCompany`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `invoice-app-test`.`invoices_products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoice-app-test`.`invoices_products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `idInvoice` INT(11) NOT NULL,
  `idProduct` INT(11) NOT NULL,
  `unitPrice` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `quantity` INT(11) NOT NULL DEFAULT '1',
  `tax` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_idinvoice_idx` (`idInvoice` ASC) VISIBLE,
  INDEX `fk_idproduct_idx` (`idProduct` ASC) VISIBLE,
  CONSTRAINT `fk_idinvoice`
    FOREIGN KEY (`idInvoice`)
    REFERENCES `invoice-app-test`.`invoices` (`idInvoice`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_idproduct`
    FOREIGN KEY (`idProduct`)
    REFERENCES `invoice-app-test`.`products` (`idProduct`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 1231243319
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `invoice-app-test`.`paymentmethod`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoice-app-test`.`paymentmethod` (
  `idPayment` INT(11) NOT NULL AUTO_INCREMENT,
  `idInvoice` INT(11) NOT NULL,
  `method` VARCHAR(45) NOT NULL,
  `value` DECIMAL(10,0) NOT NULL,
  PRIMARY KEY (`idPayment`),
  INDEX `FK_idInvoice_idx` (`idInvoice` ASC) VISIBLE,
  CONSTRAINT `FK_payments_idInvoice`
    FOREIGN KEY (`idInvoice`)
    REFERENCES `invoice-app-test`.`invoices` (`idInvoice`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 755
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `invoice-app-test`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoice-app-test`.`users` (
  `idUser` INT(11) NOT NULL AUTO_INCREMENT,
  `user` VARCHAR(45) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE INDEX `idUser_UNIQUE` (`idUser` ASC) VISIBLE,
  UNIQUE INDEX `user_UNIQUE` (`user` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

USE `invoice-app-test` ;

-- -----------------------------------------------------
-- Placeholder table for view `invoice-app-test`.`customers_by_year_month`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoice-app-test`.`customers_by_year_month` (`name` INT, `nif` INT, `address` INT, `postalCode` INT, `city` INT, `country` INT, `permit` INT);

-- -----------------------------------------------------
-- Placeholder table for view `invoice-app-test`.`products_by_year_month`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoice-app-test`.`products_by_year_month` (`code` INT, `description` INT, `productType` INT);

-- -----------------------------------------------------
-- View `invoice-app-test`.`customers_by_year_month`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `invoice-app-test`.`customers_by_year_month`;
USE `invoice-app-test`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `invoice-app-test`.`customers_by_year_month` AS select distinct `invoice-app-test`.`customers`.`name` AS `name`,`invoice-app-test`.`customers`.`nif` AS `nif`,`invoice-app-test`.`customers`.`address` AS `address`,`invoice-app-test`.`customers`.`postalCode` AS `postalCode`,`invoice-app-test`.`customers`.`city` AS `city`,`invoice-app-test`.`customers`.`country` AS `country`,`invoice-app-test`.`customers`.`permit` AS `permit` from (`invoice-app-test`.`customers` join `invoice-app-test`.`invoices` on((`invoice-app-test`.`invoices`.`idCustomer` = `invoice-app-test`.`customers`.`idCustomer`))) where ((year(`invoice-app-test`.`invoices`.`createdAt`) = 2019) and (month(`invoice-app-test`.`invoices`.`createdAt`) = 6));

-- -----------------------------------------------------
-- View `invoice-app-test`.`products_by_year_month`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `invoice-app-test`.`products_by_year_month`;
USE `invoice-app-test`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `invoice-app-test`.`products_by_year_month` AS select distinct `invoice-app-test`.`products`.`code` AS `code`,`invoice-app-test`.`products`.`description` AS `description`,`invoice-app-test`.`products`.`productType` AS `productType` from ((`invoice-app-test`.`products` join `invoice-app-test`.`invoices_products` on((`invoice-app-test`.`products`.`idProduct` = `invoice-app-test`.`invoices_products`.`idProduct`))) join `invoice-app-test`.`invoices` on((`invoice-app-test`.`invoices`.`idInvoice` = `invoice-app-test`.`invoices_products`.`idInvoice`))) where ((year(`invoice-app-test`.`invoices`.`createdAt`) = 2019) and (month(`invoice-app-test`.`invoices`.`createdAt`) = 6));

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
