/*

  Movies Database

  Command line:
  mysql -u movies -p
  mysql -u movies -p < movies.sql
  mysql --user=root --password=OhiOn330!
  mysql --user=root --password=OhiOn330! < movies.sql

*/

DROP DATABASE movies;
CREATE DATABASE movies CHARACTER SET utf8mb4;
CONNECT movies;
SET NAMES 'utf8';

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'OhiOn330!';
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


INSERT INTO User(name, email, password, isAdmin) VALUES('Ilkka Salmenius', 'ilkka.salmenius@gmail.com', 'huuhaa', TRUE);
INSERT INTO User(name, email, password, isAdmin) VALUES('Jaakko Salmenius', 'jaakko.salmenius@gmail.com', 'huuhaa', FALSE);
INSERT INTO User(name, email, password, isAdmin) VALUES('Mikko Salmenius', 'mikko.salmenius@gmail.com', 'huuhaa', FALSE);

INSERT INTO Genre(name) VALUES('Action');
INSERT INTO Genre(name) VALUES('Comedy');
INSERT INTO Genre(name) VALUES('Thriller');
INSERT INTO Genre(name) VALUES('Romance');

INSERT INTO Movie(title, genreId, numberInStock, dailyRentalRate) VALUES('Terminator', 1, 6, 2.5);
INSERT INTO Movie(title, genreId, numberInStock, dailyRentalRate) VALUES('Die Hard', 1, 5, 2.5);
INSERT INTO Movie(title, genreId, numberInStock, dailyRentalRate) VALUES('Get Out', 3, 8, 3.5);
INSERT INTO Movie(title, genreId, numberInStock, dailyRentalRate) VALUES('Trip to Italy', 2, 7, 3.5);
INSERT INTO Movie(title, genreId, numberInStock, dailyRentalRate) VALUES('Airplane', 2, 7, 3.5);
INSERT INTO Movie(title, genreId, numberInStock, dailyRentalRate) VALUES('Wedding Crashers', 2, 7, 3.5);
INSERT INTO Movie(title, genreId, numberInStock, dailyRentalRate) VALUES('Gone Girl', 3, 7, 3.5);
INSERT INTO Movie(title, genreId, numberInStock, dailyRentalRate) VALUES('The Sixth Sense', 3, 7, 3.5);
INSERT INTO Movie(title, genreId, numberInStock, dailyRentalRate) VALUES('The Avengers', 2, 7, 3.5);

INSERT INTO Customer(name) VALUES('Matti Meikäläinen');
INSERT INTO Customer(name) VALUES('Maija Meikäläinen');
INSERT INTO Customer(name) VALUES('Mika Meikäläinen');
