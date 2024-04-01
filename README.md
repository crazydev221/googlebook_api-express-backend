# Book Search and Bookmarking Backend

This is a simple book search and bookmarking application where users can search for books using the Google Books API, register with email and password, login to their accounts, add books to their bookmark list, list their bookmarks, and remove books from their bookmarks.

## User Stories

- **Search Books**: Users can search for books by title, author, or keywords using the Google Books API.
- **User Registration**: Users can register with their email and password.
- **User Login**: Users can login to their accounts using their registered email and password.
- **Add Bookmarks**: Logged-in users can add books to their bookmark list.
- **List Bookmarks**: Logged-in users can list their bookmarks.
- **Remove Bookmarks**: Logged-in users can remove books from their bookmarks.
- **Prevent Duplicate Bookmarks**: Users cannot bookmark the same book twice.

## Technologies Used

- Node.js
- Express.js
- MySQL
- Redis
- Google Books API
- bcrypt for password hashing
- jsonwebtoken for authentication
- body-parser for parsing JSON requests

## Setup Instructions

### 1. Clone the repository:
    
    git clone https://github.com/topdev-full/express-booking-backend
    
### 2. Install dependencies:
    
    npm install
    
### 3. Set up your MySQL database:

- Create a database named `googlebook_backend`.
- Import the database schema from the `database_schema.sql` file.

### 4. Set up your Redis database:

- Start the Redis server on port 6379.
- You can change the port number in /const/env.js 

### 5. Configure environment variables:

- Modify a `env.js` file in the const directory.
- Define the following environment variables:

   ```
    BACKEND_PORT = <backend_port> (default: 3000)
    MYSQL_HOST = <your_mysql_host>
    MYSQL_USER = <your_mysql_user>
    MYSQL_DB = <your_mysql_db_name>
    MYSQL_PASSWORD = <your_mysql_password> (default: googlebook_backend)
    REDIS_HOST = <your_redis_host>
    REDIS_PORT = <your_redis_port> (default: 6379)
    JWT_SECRET = <your_jwt_secret>
   ```

### 6. Start the application:
    
    npm start
    
    
## API Endpoints

1. **User Registration**
   - `POST /auth/register`: Register a new user with email and password.

2. **User Login**
   - `POST /auth/login`: Login with registered email and password. Returns a JWT token.

3. **Book Search**
   - public `GET /bookmark/search?query=search_query`: Search for books by title, author, or keywords.

4. **Add Bookmark**
   - private `POST /bookmark/add`: Add a book to the user's bookmark list.

5. **List Bookmarks**
   - private `GET /bookmark/list`: List all bookmarks of the logged-in user.

6. **Remove Bookmark**
   - private `DELETE /bookmark/remove/:id`: Remove a book from the user's bookmark list by book ID.

## Contributors

- Ihor Kompanets

Feel free to contribute by submitting pull requests or opening issues.

