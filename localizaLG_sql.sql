-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema db_localizaLG
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema db_localizaLG
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `db_localizaLG` DEFAULT CHARACTER SET utf8 ;
USE `db_localizaLG` ;

-- -----------------------------------------------------
-- Table `db_localizaLG`.`tb_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_localizaLG`.`tb_category` (
  `id_category` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_category`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_localizaLG`.`tb_SchoolsLG`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_localizaLG`.`tb_SchoolsLG` (
  `id_SchoolsLG` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `image` VARCHAR(45) NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  `latitude` DECIMAL(30) NOT NULL,
  `longitude` DECIMAL(50) NOT NULL,
  `id_category` INT NOT NULL,
  PRIMARY KEY (`id_SchoolsLG`),
  INDEX `fk_tb_SchoolsLG_tb_category_idx` (`id_category` ASC) VISIBLE,
  CONSTRAINT `fk_tb_SchoolsLG_tb_category`
    FOREIGN KEY (`id_category`)
    REFERENCES `db_localizaLG`.`tb_category` (`id_category`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
