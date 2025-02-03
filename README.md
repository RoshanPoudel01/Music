Artist Management 
This project is a full-stack web application consisting of a as Node.js backend and a React.js frontend. The backend uses PostgreSQL as the database and is set up for demonstration purposes. The frontend provides the user interface for interacting with the backend.

## Installation Clone the repository to your local machine: git clone

https://github.com/RoshanPoudel01/Music.git

Navigate to the project directory: cd Music

Backend Setup Go to the backend folder: cd backend

Install the required packages using Yarn: yarn

Start the backend server: yarn start

The backend will now be running at http://localhost:3000 . The backend uses Node.js and communicates with a PostgreSQL database.

Frontend Setup Go to the frontend folder: cd frontend

Install the required packages using Yarn: yarn Start the frontend application:
yarn start

The frontend will now be running at http://localhost:6005 . It will communicate with the backend and display data accordingly.

Database Setup This project uses PostgreSQL as the database. Please ensure you have PostgreSQL installed and running on your local machine.

Set up your PostgreSQL database with the necessary tables. Connect the backend to your PostgreSQL instance by configuring the connection string in the .env file.

For local development, there is an .env file present in both the backend and frontend directories to manage environment-specific configurations.

Backend .env: The environment variables for the backend, including database credentials, should be placed in this file.

Frontend .env: The frontend environment variables such as the API url is configured here.

Note: The .env files are intentionally left as placeholders for demonstration purposes.
