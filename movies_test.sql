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
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  name VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id)
);


CREATE TABLE Genre
(
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  name VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);


CREATE TABLE Movie
(
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  title VARCHAR(50) NOT NULL UNIQUE,
  genreId BIGINT UNSIGNED  NOT NULL,
  numberInStock SMALLINT UNSIGNED NOT NULL,
  dailyRentalRate DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (genreId) REFERENCES Genre(id)
);


CREATE TABLE Customer
(
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  name VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);


CREATE TABLE Rental
(
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  customerId BIGINT UNSIGNED NOT NULL,
  movieId BIGINT UNSIGNED NOT NULL,
  dateOut DATE,
  dateReturned DATE,
  rentalFee DECIMAL(6,2),
  PRIMARY KEY (id),
  FOREIGN KEY (customerId) REFERENCES Customer(id),
  FOREIGN KEY (movieId) REFERENCES Movie(id)
);
