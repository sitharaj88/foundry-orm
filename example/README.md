# TypeScript ORM Example with Express.js

This is a sample Express.js application demonstrating the usage of the TypeScript ORM library with SQLite.

## Installation

```bash
cd example
npm install
```

## Running the Application

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

- `GET /` - API documentation
- `GET /health` - Database health check
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

## Example API Calls

### Create a user
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":30}'
```

### Get all users
```bash
curl http://localhost:3000/users
```

### Get user by ID
```bash
curl http://localhost:3000/users/1
```

### Update a user
```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated","email":"john@example.com","age":31}'
```

### Delete a user
```bash
curl -X DELETE http://localhost:3000/users/1
```

## Database

The application uses SQLite and creates a file `example.db` in the example directory.
