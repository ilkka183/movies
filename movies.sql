/*

  Movies Database

  Command line:
  mysql -u movies -p
  mysql -u movies -p < movies.sql
  mysql --user=root --password=huuhaa
  mysql --user=root --password=huuhaa < movies.sql

*/

DROP DATABASE movies;
CREATE DATABASE movies CHARACTER SET utf8mb4;
CONNECT movies;
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
  Name VARCHAR(100) NOT NULL UNIQUE,
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
  Name VARCHAR(100) NOT NULL UNIQUE,
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


INSERT INTO User(Name, Email, Password, IsAdmin) VALUES('Ilkka Salmenius', 'ilkka.salmenius@gmail.com', 'huuhaa', TRUE);
INSERT INTO User(Name, Email, Password, IsAdmin) VALUES('Jaakko Salmenius', 'jaakko.salmenius@gmail.com', 'huuhaa', FALSE);
INSERT INTO User(Name, Email, Password, IsAdmin) VALUES('Mikko Salmenius', 'mikko.salmenius@gmail.com', 'huuhaa', FALSE);

INSERT INTO Genre(Name) VALUES('Action');
INSERT INTO Genre(Name) VALUES('Comedy');
INSERT INTO Genre(Name) VALUES('Thriller');
INSERT INTO Genre(Name) VALUES('Romance');

INSERT INTO Movie(Title, GenreId, NumberInStock, DailyRentalRate) VALUES('Terminator', 1, 6, 2.5);
INSERT INTO Movie(Title, GenreId, NumberInStock, DailyRentalRate) VALUES('Die Hard', 1, 5, 2.5);
INSERT INTO Movie(Title, GenreId, NumberInStock, DailyRentalRate) VALUES('Get Out', 3, 8, 3.5);
INSERT INTO Movie(Title, GenreId, NumberInStock, DailyRentalRate) VALUES('Trip to Italy', 2, 7, 3.5);
INSERT INTO Movie(Title, GenreId, NumberInStock, DailyRentalRate) VALUES('Airplane', 2, 7, 3.5);
INSERT INTO Movie(Title, GenreId, NumberInStock, DailyRentalRate) VALUES('Wedding Crashers', 2, 7, 3.5);
INSERT INTO Movie(Title, GenreId, NumberInStock, DailyRentalRate) VALUES('Gone Girl', 3, 7, 3.5);
INSERT INTO Movie(Title, GenreId, NumberInStock, DailyRentalRate) VALUES('The Sixth Sense', 3, 7, 3.5);
INSERT INTO Movie(Title, GenreId, NumberInStock, DailyRentalRate) VALUES('The Avengers', 1, 7, 3.5);

INSERT INTO Customer(Name) VALUES('Matti Meikäläinen');
INSERT INTO Customer(Name) VALUES('Maija Meikäläinen');
INSERT INTO Customer(Name) VALUES('Mika Meikäläinen');
