-- Make the stuff table
CREATE TABLE `assignments` (
  `assignmentId INT NOT NULL AUTO_INCREMENT,
  `item` VARCHAR(45) NOT NULL,
  `time` VARCHAR(45) NOT NULL,
  `difficulty` VARCHAR(150) NOT NULL,
  `instructions` VARCHAR(150) NOT NULL,
  `keyfocusarea` VARCHAR(150) NOT NULL,
  `description` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`assignmentId`),
  INDEX assignmentCategory_idx (categoryId ASC),
  CONSTRAINT assignmentSubject
    FOREIGN KEY (categoryId)
    REFERENCES subjects (categoryId)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);

);