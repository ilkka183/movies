/*

  Movies Test Database

  Command line:
  mysql -u movies_test -p
  mysql -u movies_test -p < movies.sql
  mysql --user=root --password=huuhaa
  mysql --user=root --password=huuhaa < movies_test.sql
  
*/

DROP DATABASE movies_test;
CREATE DATABASE movies_test CHARACTER SET utf8mb4;
CONNECT movies_test;
SET NAMES 'utf8';

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'huuhaa';
flush privileges;


CREATE TABLE User
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  Name VARCHAR(100) NOT NULL UNIQUE,
  Email VARCHAR(100) NOT NULL UNIQUE,
  Password VARCHAR(100) NOT NULL,
  IsAdmin BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (Id)
);


CREATE TABLE Genre
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  Name VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (Id)
);


CREATE TABLE Movie
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  Title VARCHAR(50) NOT NULL UNIQUE,
  GenreId BIGINT UNSIGNED  NOT NULL,
  NumberInStock SMALLINT UNSIGNED NOT NULL,
  DailyRentalRate DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (GenreId) REFERENCES Genre(Id)
);


CREATE TABLE Customer
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  Name VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (Id)
);


CREATE TABLE Rental
(
  Id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  CustomerId BIGINT UNSIGNED NOT NULL,
  MovieId BIGINT UNSIGNED NOT NULL,
  DateOut DATE,
  DateReturned DATE,
  RentalFee DECIMAL(6,2),
  PRIMARY KEY (Id),
  FOREIGN KEY (CustomerId) REFERENCES Customer(Id),
  FOREIGN KEY (MovieId) REFERENCES Movie(Id)
);
