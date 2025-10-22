# Todo Management System

A full-stack application for managing users and todos with complete CRUD operations.

## Features

### User Management

- ✅ **Create Users** - Add new users with name, age, and email
- ✅ **Read Users** - View all users in a clean table format
- ✅ **Update Users** - Edit existing user information
- ✅ **Delete Users** - Remove users from the system
- ✅ **Form Validation** - Email format, required fields, age range validation

### Todo Management

- ✅ **Create Todos** - Add new todos with title, description, and assignment
- ✅ **Read Todos** - View all todos with status and assignment information
- ✅ **Update Todos** - Edit existing todo details
- ✅ **Delete Todos** - Remove todos from the system
- ✅ **Status Management** - Update todo status (pending, in_progress, completed)
- ✅ **User Assignment** - Assign todos to specific users
- ✅ **Form Validation** - Required fields, status validation

## Architecture

### Backend (Node.js + Fastify + Drizzle ORM)

```
todo-backend-devops/
├── src/
│   ├── db/
│   │   ├── db.ts              # Database connection
│   │   └── schema.ts          # Database schema definitions
│   ├── users/
│   │   ├── http/
│   │   │   └── user.http.ts   # User HTTP routes
│   │   ├── use-case/
│   │   │   └── user.usecase.ts # User business logic
│   │   └── users.repo.ts      # User data access layer
│   └── todos/
│       ├── http/
│       │   └── todos.http.ts  # Todo HTTP routes
│       ├── use-case/
│       │   └── todos.usecase.ts # Todo business logic
│       └── todo.repo.ts       # Todo data access layer
└── index.ts                   # Server entry point
```

### Frontend (Next.js + TypeScript + Tailwind CSS)

```
todo-fe-devops/
├── src/
│   ├── app/
│   │   └── page.tsx           # Main application page
│   ├── components/
│   │   ├── UserCreationForm.tsx # User creation form
│   │   ├── UserForm.tsx       # User edit form
│   │   ├── UserList.tsx       # User list display
│   │   ├── TodoForm.tsx       # Todo creation/edit form
│   │   └── TodoList.tsx       # Todo list display
│   ├── services/
│   │   ├── userService.ts     # User API service
│   │   └── todoService.ts     # Todo API service
│   └── types/
│       └── index.ts           # Shared TypeScript types
```

## API Endpoints

### Users

- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user by ID
- `DELETE /users/:id` - Delete user by ID

### Todos

- `POST /todos` - Create a new todo
- `GET /todos` - Get all todos
- `GET /todos/:id` - Get todo by ID
- `PUT /todos/:id` - Update todo by ID
- `DELETE /todos/:id` - Delete todo by ID
- `PUT /todos/:id/status` - Update todo status

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);
```

### Todos Table

```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  assignedTo INTEGER REFERENCES users(id),
  status todo_status NOT NULL DEFAULT 'pending',
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  completedAt TIMESTAMP
);
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Bun (recommended) or npm

### Backend Setup

```bash
cd todo-backend-devops
bun install
bun run dev
```

### Frontend Setup

```bash
cd todo-fe-devops
bun install
bun run dev
```

### Database Setup

1. Create a PostgreSQL database
2. Update connection string in backend environment
3. Run migrations: `bun run drizzle-kit push`

## Usage

1. **Start with Users**: Create users first as they can be assigned to todos
2. **Create Todos**: Add todos and optionally assign them to users
3. **Manage Status**: Update todo status as work progresses
4. **Edit & Delete**: Modify or remove users and todos as needed

## UI Features

- **Clean, Premium Design** - Luxurious interface following design preferences
- **Dark Mode Support** - Toggle between light and dark themes
- **Responsive Layout** - Works on desktop and mobile devices
- **Real-time Validation** - Form validation with user-friendly error messages
- **Loading States** - Visual feedback during API operations
- **Success/Error Messages** - Clear feedback for all operations

## Technology Stack

### Backend

- **Fastify** - Fast and efficient web framework
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Relational database
- **TypeScript** - Type safety and better development experience

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety across the application
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - Modern React patterns

## Development Notes

- Repository layer contains only database query logic
- Data transformation happens in the use-case layer
- Clean separation of concerns between layers
- Comprehensive error handling throughout the application
- Type-safe API calls with proper TypeScript interfaces
