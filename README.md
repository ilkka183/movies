# movies
This is a simple movie rental service. It's a REST API created by node.js and express. Movies are stored in a MySQL database. Jason Web Tokens are used for authentication.

## MySQL Tables
There are two databases. movies.sql for the actual database and movies_test.sql for the intergation tests.

### User
This API requires an authorization. User must first register and then login in order to use the API. User data is stored into this table.

### Genre
Movie genres.

### Movie
Movies.

### Customer
Customers who cab rent the movies.

### Rental
A rental row with customer and movie IDs.

## Folders

### common
Some common code.

### config
Configuation settings.

### middleware
All common code have been set into middlewares. Here are some authorization and error handling middlewares. In the routes are just core handling.

### models
Javascript classes for each MySQL table. They have some finding and validating methods.

### rest
Here are the RESTClient test files for each routes. It's lake a Postman but can be used inside VisualCode.

### routes
All the routes have been collected into this folder. Endpoints have been implemented into separate files.

### startup
index.js file has kept as simple as possible. All the initialization code have been stored into this folder to separate files.

### tests
Here are all the unit and intergation tests on separate folders.
