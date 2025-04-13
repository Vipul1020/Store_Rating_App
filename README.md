\# Store Rating Web Application

A full-stack web application allowing users to discover and rate stores. Features role-based access control for Normal Users, Store Owners, and System Administrators.

\#\# Description

This application provides a platform where registered users can submit ratings (1-5 stars) for various stores listed on the site. Different user roles grant access to specific functionalities, enabling store management, user administration, and personalized user experiences.

\#\# Features

\*\*Common:\*\*  
\* User Authentication (Login for all roles, Logout)  
\* Password Change for logged-in users

\*\*Normal User:\*\*  
\* Sign Up / Registration  
\* View a list of all registered stores  
\* Search stores by Name and Address  
\* View Store Details: Name, Address, Overall Average Rating, User's own submitted rating (if any)  
\* Submit a new rating (1-5) for a store  
\* Modify their previously submitted rating for a store

\*\*Store Owner:\*\*  
\* View a list of users who have submitted ratings for \*their\* specific store  
\* View the calculated average rating for \*their\* store  
\* (Login, Logout, Password Change inherited)

\*\*System Administrator:\*\*  
\* Add new Stores  
\* Add new Users (Normal, Store Owner, or Admin role)  
\* View Admin Dashboard displaying:  
    \* Total number of registered users  
    \* Total number of registered stores  
    \* Total number of submitted ratings  
\* View a list of all stores (including Name, Email, Address, calculated Rating)  
\* View a list of all users (Normal & Admin) (including Name, Email, Address, Role)  
\* Filter user and store lists based on Name, Email, Address, Role (where applicable)  
\* View details of any specific user (including store's average rating if they are a Store Owner)  
\* (Login, Logout, Password Change inherited)

\*\*General:\*\*  
\* Role-based access control for all functionalities.  
\* Input validation for forms (Name, Email, Password, Address, Rating).  
\* Basic sorting support for user/store lists (implementation details may vary).

\#\# Tech Stack

\* \*\*Frontend:\*\*  
    \* React.js (with Vite)  
    \* Material UI (MUI)  
    \* React Router (\`react-router-dom\`)  
    \* Axios (for API calls)  
\* \*\*Backend:\*\*  
    \* Node.js  
    \* Express.js  
    \* PostgreSQL (\`pg\` driver)  
    \* JSON Web Tokens (JWT for Authentication)  
    \* bcrypt (for Password Hashing)  
    \* Express Validator (for Input Validation)  
    \* CORS, dotenv  
\* \*\*Database:\*\*  
    \* PostgreSQL

\#\# Project Structure

.  
├── client/ \# React Frontend (Vite \+ MUI)  
│ ├── public/  
│ ├── src/  
│ ├── index.html  
│ ├── package.json  
│ └── vite.config.js  
├── server/ \# Node.js Backend (Express \+ PostgreSQL)  
│ ├── config/  
│ ├── controllers/  
│ ├── middleware/  
│ ├── models/ \# (If using ORM models, otherwise DB logic in controllers)  
│ ├── routes/  
│ ├── .env \# (Needs to be created from .env.example)  
│ ├── .env.example  
│ ├── package.json  
│ └── server.js  
└── README.md \# This file  
\#\# Prerequisites

\* \[Node.js\](https://nodejs.org/) (v16 or later recommended)  
\* \[npm\](https://www.npmjs.com/) or \[yarn\](https://yarnpkg.com/)  
\* \[PostgreSQL\](https://www.postgresql.org/download/) server (running locally or accessible remotely)  
\* \[Git\](https://git-scm.com/)

\#\# Getting Started

Follow these steps to set up and run the project locally:

1\.  \*\*Clone the Repository:\*\*  
    \`\`\`bash  
    git clone \<your-repository-url\>  
    cd \<repository-folder-name\>  
    \`\`\`

2\.  \*\*Install Backend Dependencies:\*\*  
    \`\`\`bash  
    cd server  
    npm install  
    \# or: yarn install  
    \`\`\`

3\.  \*\*Install Frontend Dependencies:\*\*  
    \`\`\`bash  
    cd ../client  
    npm install  
    \# or: yarn install  
    \`\`\`

4\.  \*\*Set up PostgreSQL Database:\*\*  
    \* Ensure your PostgreSQL server is running.  
    \* Connect using \`psql\` or a GUI tool like \`pgAdmin\`.  
    \* Create a new database (e.g., \`store\_ratings\_pg\_db\`).  
        \`\`\`sql  
        CREATE DATABASE store\_ratings\_pg\_db;  
        \`\`\`  
    \* Connect to the newly created database.  
    \* Execute the SQL script provided (\`schema.sql\` \- \*ensure you have this file from the project setup\*) to create the necessary tables (\`users\`, \`stores\`, \`ratings\`) and types.

5\.  \*\*Configure Environment Variables (Backend):\*\*  
    \* Navigate back to the \`server\` directory: \`cd ../server\`  
    \* Create a \`.env\` file by copying the example: \`cp .env.example .env\` (on Linux/macOS) or copy/paste manually on Windows.  
    \* Edit the \`.env\` file and fill in your specific configuration:  
        \* \`DB\_HOST\`: Database server host (e.g., \`localhost\`)  
        \* \`DB\_PORT\`: Database server port (e.g., \`5432\`)  
        \* \`DB\_USER\`: Your PostgreSQL username (e.g., \`postgres\` or a dedicated app user)  
        \* \`DB\_PASSWORD\`: Your PostgreSQL user's password  
        \* \`DB\_NAME\`: The name of the database you created (e.g., \`store\_ratings\_pg\_db\`)  
        \* \`JWT\_SECRET\`: A \*\*strong, random secret key\*\* for signing tokens (use a generator).  
        \* \`PORT\`: The port the backend server will run on (e.g., \`5001\`).  
        \* \`BCRYPT\_SALT\_ROUNDS\`: (Optional, defaults usually fine)

6\.  \*\*Run the Backend Server:\*\*  
    \* While in the \`server\` directory:  
        \`\`\`bash  
        npm run dev  
        \# or: node server.js  
        \`\`\`  
    \* The server should start (usually on port 5001\) and connect to the database.

7\.  \*\*Run the Frontend Development Server:\*\*  
    \* Open a \*\*new terminal window/tab\*\*.  
    \* Navigate to the \`client\` directory: \`cd ../client\`  
    \* Run the Vite development server:  
        \`\`\`bash  
        npm run dev  
        \`\`\`  
    \* Vite will typically start the frontend on \`http://localhost:3000\` (or another port if 3000 is busy) and automatically proxy API requests to your backend (as configured in \`vite.config.js\`).

8\.  \*\*Access the Application:\*\*  
    \* Open your web browser and navigate to the URL provided by the Vite development server (e.g., \`http://localhost:3000\`).

\#\# Environment Variables (.env)

The backend server requires a \`.env\` file in the \`/server\` directory with the following variables:

\* \`PORT\`: Port for the Express server (e.g., 5001\)  
\* \`DB\_HOST\`: PostgreSQL host (e.g., localhost)  
\* \`DB\_PORT\`: PostgreSQL port (e.g., 5432\)  
\* \`DB\_USER\`: PostgreSQL username  
\* \`DB\_PASSWORD\`: PostgreSQL password  
\* \`DB\_NAME\`: PostgreSQL database name  
\* \`JWT\_SECRET\`: \*\*Crucial:\*\* A long, random, secret string for JWT signing.  
\* \`BCRYPT\_SALT\_ROUNDS\`: Cost factor for bcrypt hashing (e.g., 10\)

\*(See \`.env.example\` for a template)\*

\#\# Example Credentials for Testing

You will need to create users to test different roles. You can do this via the API (Admin creating users) or directly in the database using pgAdmin (remembering to hash passwords first). Here are some example credentials you might use for testing login after creating the users:

\* \*\*Admin:\*\*  
    \* Email: \`ac\_admin@gmail.com\`  
    \* Password: \`ValidPass7\*\` \*(Use the plain text password for API login)\*  
\* \*\*Normal User:\*\*  
    \* Email: \`ac\_normal@gmail.com\`  
    \* Password: \`ValidPass5$\` \*(Or the latest password you set)\*  
\* \*\*Store Owner:\*\*  
    \* Email: \`ac\_owner@example.com\`  
    \* Password: \`ValidPass6&\` \*(Use the plain text password for API login)\*

\*\*⚠️ Important:\*\* These are \*examples\* for local development and testing only. Ensure these specific users exist in your database before trying to log in with them. Do not commit sensitive credentials or use weak passwords in production or shared repositories.

\#\# API Endpoints Overview (Base Path: /api)

\* \`/auth\`: Registration, Login, Password Change  
\* \`/users\`: User management (Admin)  
\* \`/stores\`: Store listing (User/Admin), Store creation (Admin), Owner-specific views  
\* \`/ratings\`: Rating submission/update (User)  
\* \`/dashboard\`: Statistics (Admin)

\*(Refer to backend route files for detailed endpoints and required roles)\*

\---

\*\*Note:\*\* This is an ongoing project developed for an assignment/challenge. While the core functionality is implemented, there are many potential areas for improvement, including enhanced UI/UX, more comprehensive error handling, automated testing, advanced filtering/sorting UI, and further feature development.

