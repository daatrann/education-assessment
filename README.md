## Table of Contents

- [Technologies used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Run the App](#run-the-app)
  - [Run Unit Tests](#run-unit-tests)
- [About the Project](#about-the-project)
  - [Models](#models)
  - [Design choices](#design-choices)
  - [Endpoints](#endpoints)

## Technologies Used

- **Backend**: NodeJS, ExpressJS
- **Testing tool**: Jest
- **Database**: MySQL, Prisma
- **Containerization**: Docker engine and Docker Compose

## Project Structure

```
src
├─ config
│  ├─ env.js
│  ├─ logger.js
│  ├─ prisma.js
│  └─ server.js
├─ langs
│  └─ en.js
├─ middlewares
│  └─ globalErrorHandler.js
├─ v1
│  ├─ controller
│  │  └─ teacher.controller.js
│  ├─ routes
│  │  ├─ teacher.router.js
│  │  └─ v1Router.js
│  └─ service
│     └─ teachers.service.js
└─ utils
   ├─ AppError.js
   ├─ AppResponse.js
   ├─ catchAsync.js
   └─ regex.js
```

## Prerequisites

Ensure that you have the following installed:

- [Docker](https://www.docker.com/get-started/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Clone the repository and navigate to the project directory:

  ```bash
  git clone https://github.com/FUnmthank02/education-be.git
  cd education-be
  ```

## Installation

### Run the App

#### 1. Build and start the containers

Run the follow command to start the containers:

```bash
docker-compose up --build
```

This will setup:

- A MySQL server in a container with a mounted volume for persistent storage
- Seed the database with initial data (`seed.ts`)
- Setup a NodeJS environment and the API server in another container
- Run the server to listen on port 3000

#### 2. Access the API server

The application is available at:

```
http://localhost:3000
```

### Run Unit Tests

Similarly, open another interactive shell session inside the api server container and execute the test runner

```bash
npm run test
```

## About the Project

The project is built around 2 data models `Student` and `Teacher` represented by their corresponding entities. Prisma was chosen to interact with the MySQL database. All main functionalities involve around managing the relationship between the two models, including handling registration, get common students, get notification list, and suspend a student.

### Models

We delegate management of the tables to Prisma, including the creation and handling of the bridge table TeacherStudent. The underlying database has following structure:

(timestamp fields are also created and managed by Prisma)

#### The Teacher Model

Represents the teachers in the system, manages multiple student entities.

- email: the primary key that uniquely identifies a teacher
- students: a relation field representing a list of student entities that the teacher manages

#### The Student Model

Represents the students in the system, can be registered to multiple teacher entities.

- email: the primary key that uniquely identifies a student
- isSuspend: a boolean value indicating if a student is suspended or not
- teachers: a relation field representing a list of teacher entities the student is registered to

#### The Registration Model

Facilitate the many-to-many relationship between the Teacher and Student entities by storing the association between their email addresses

- teacherId: a foreign key referencing a row in the Teacher table
- studentId: a foreign key referencing a row in the Student table

Both foreign keys creates a composite primary key that uniquely identifies a relationship in the table. Prisma automatically manages and maintains the table and the relationship between the Student and Teacher tables.

### Endpoints

#### Register Students

- **Endpoint:** `POST /api/register`
- **Headers:** `Content-Type: application/json`
- **Success Status:** 204
- **Request Body:**
  - `teacher`: Email of the teacher.
  - `students`: List of student emails.

#### Retrieve Common Students

- **Endpoint:** `GET /api/commonstudents`
- **Success Status:** 200
- **Query Parameters:**
  - `teacher`: One or more teacher emails.
- **Success Response Example:**
  ```json
  {
    "students": ["commonstudent1@gmail.com", "commonstudent2@gmail.com"]
  }
  ```

#### Suspend a Student

- **Endpoint:** `POST /api/suspend`
- **Headers:** `Content-Type: application/json`
- **Success Status:** 204
- **Request Body:**
  - `student`: Email of the student.

#### Retrieve for Notifications

- **Endpoint:** `POST /api/retrievefornotifications`
- **Headers:** `Content-Type: application/json`
- **Success Status:** 200
- **Request Body:**
  - `teacher`: Email of the teacher.
  - `notification`: Text of the notification.
- **Success Response Example:**
  ```json
  {
    "recipients": ["student1@gmail.com", "student2@gmail.com"]
  }
  ```

#### Error Responses

- **Error Response Example:**

```json
{
  "message": [
    "each value in teacher must be an email",
    "teacher must contain at least 1 elements",
    "teacher must be an array"
  ]
}
```