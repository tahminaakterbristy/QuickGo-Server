# Server for QuickGo Courier

This is the backend/server-side application for the "QuickGo Courier" web application. It handles RESTful API routes, communicates with the MongoDB database, manages authentication and authorization, and processes all the core logic required by the frontend.


##  Features

- RESTful API development
- JSON Web Token (JWT) based Authentication & Authorization
-  Role-based access control (User & Admin)
- Admin can manage users and perform restricted actions and manage parcel status.
- CRUD operations (Create, Read, Update, Delete)
- CORS enabled for cross-origin requests
- Environment-based configuration with dotenv


##  Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **JWT** – Secure user authentication
- **Dotenv** – Manage environment variables
- **Cors** – Cross-origin resource sharing


### ✅ Prerequisites

Before you begin, ensure you have installed:
- Node.js
- npm
- MongoDB Atlas account or local MongoDB setup

###  Installation
1. Clone the repository:
```bash
git clone https://github.com/tahminaakterbristy/QuickGo-Server.git
cd QuickGo-Server
