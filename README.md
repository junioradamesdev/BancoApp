BancoApp

A simple bank client management app built with a 3-layer architecture: database, backend API, and frontend.

Features
-List all clients
-Create a new client
-Update a client's balance (deposit/withdraw)
-Delete a client

Tech stack
-Database: SQL Server
-Backend: Node.js, Express, mssql, dotenv
-Frontend: HTML, CSS, JavaScript (no frameworks)

How it works

The frontend calls the backend API using fetch(). The backend uses parameterized queries (.input()) to talk to SQL Server safely, avoiding SQL injection. Database credentials are kept in a .env file, excluded from version control.

Run it locally
Clone the repo.
Inside backend/, create a .env file:
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_SERVER=localhost
   DB_DATABASE=BancoDB
Install dependencies:
   cd backend
   npm install
Start the server:
   node server.js
Open frontend/index.html (Live Server recommended).
API endpoints
Method	Route	Description
GET	/api/clientes	List all clients
POST	/api/clientes	Create a new client
PUT	/api/clientes/:id	Update a client's balance
DELETE	/api/clientes/:id	Delete a client