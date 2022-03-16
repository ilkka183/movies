# movies
This is a simple movie rental service. It is a REST API created by node.js express. Movies are in a MySQL database. Jason Web Tokens are used for authentication.

## MySQL Tables
There are two databases. movies.sql for the actual database and movies_test.sql for the intergation tests.

### User
This API required an authorization. User must first register and then login in order to use the API. User data is stored into this table.

### Genre
Movie genres.

### Movie
Movies.

### Customer
Customers who rent the movies.

### Rental
A rental object with customer and movie IDs.

## Folders

### common
Some common code.

### config
Configuation settings.

### middleware
All common code have been set into middlewares. In the routes are just core handling.

### models
Javascript model classes for each MySQL table.

### rest
Here are the RESTClient test files for each routes.

### routes
All the routes have been collected in this folder. Endpoints have been implemented into separate files.

### startup
index.js file has kept as simple as possible. All the initialization code have been store on this folder on separate files.

### tests
Here are the unit and intergation tests on separate folders.
