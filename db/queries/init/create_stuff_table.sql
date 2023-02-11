-- Make the stuff table
CREATE TABLE `inventory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `item` VARCHAR(45) NOT NULL,
  `time` VARCHAR(45) NOT NULL,
  `difficulty` VARCHAR(150) NOT NULL,
  `instructions` VARCHAR(150) NOT NULL,
  `keyfocusarea` VARCHAR(150) NOT NULL,
  `description` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`)
);