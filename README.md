# movies
This is a simple movie rental service. It is a REST API created by node.js express. Movies are in a MySQL database. Jason Web Tokens are used for authentication.

## MySQL Tables
### User
### Genre
### Movie
### Customer
### Rental

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
Here is a RESTClient test file for each routes.

### routes
All the routes have been collected in this folder. Endpoins have been implemented into separate files.

### startup
index.js file has kept as simple as possible. All the initialization code have been store on this folder on separate files.

### tests
Here are unit and intergation tests on the separate folder.
