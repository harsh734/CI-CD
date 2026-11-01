# 📝 Todo Task Management App

A simple **Task Management (Todo) application** built with a modern
full‑stack architecture:

-   **Frontend:** React (Personal Project)
-   **Backend:** Node.js (Express)
-   **Database:** PostgreSQL

The goal of this project is to demonstrate how to design a small but
scalable task management system with both **core features (MVP)** and
**advanced UX features**.

------------------------------------------------------------------------

# 🚀 Tech Stack

  Layer      Technology
  ---------- ----------------------------------------
  Frontend   React
  Backend    Node.js + Express
  Database   PostgreSQL
  Storage    Local Storage (for client persistence)

------------------------------------------------------------------------

# 📦 Project Features

## 1️⃣ Core Features (MVP)

These are the **minimum features required** for the application to
function.

### Input Task

-   A text input field where users can type a task.

### Add Task

-   Press **Add button** or **Enter key** to add a new task.
-   Automatically clears the input field after adding.
-   Prevent adding **empty tasks**.

### Render List

-   Display all tasks in a list format.

### Delete Task

-   Each task contains a **delete button (trash icon)**.
-   Removes the task completely from the list.

### Toggle Status

-   Click task text or checkbox to toggle:
    -   **Completed**
    -   **Active**
-   Completed tasks display **strikethrough text**.

------------------------------------------------------------------------

## 2️⃣ UX/UI Features

These features make the application more user‑friendly.

### Edit Task

-   **Double click** a task to enable inline editing.

### Task Counter

Display the number of unfinished tasks.

Example:

    You have 3 tasks remaining

### Filter Tasks

Users can filter tasks using three options:

-   **All**
-   **Active**
-   **Completed**

### Clear Completed

A button that removes **all completed tasks** instantly.

------------------------------------------------------------------------

## 3️⃣ Storage & Advanced Features

These features make the application more powerful and persistent.

### Local Storage

Tasks are stored in **browser local storage**.

Benefits: - Data persists after refresh - Tasks remain after closing and
reopening the browser

### Timestamp

Each task records its creation time.

Example:

    Created at 10:30 AM

### Priority Levels

Users can assign priority levels to tasks:

  Priority    Description
  ----------- ---------------
  🔴 High     Urgent tasks
  🟡 Medium   Normal tasks
  🟢 Low      Relaxed tasks

Each priority level is represented by **different colors**.

### Drag & Drop

Users can **drag and reorder tasks** to change their priority or order.

------------------------------------------------------------------------

# 🏗 Suggested Project Structure

    todo-app
    │
    ├── frontend (React)
    │   ├── components
    │   ├── pages
    │   ├── hooks
    │   ├── services
    │   └── App.jsx
    │
    ├── backend (NodeJS)
    │   ├── controllers
    │   ├── routes
    │   ├── services
    │   ├── models
    │   └── server.js
    │
    ├── database
    │   └── migrations
    │
    └── README.md

------------------------------------------------------------------------

# 🗄 Database Design (Example)

  Column       Type
  ------------ -----------
  id           UUID
  title        TEXT
  status       BOOLEAN
  priority     VARCHAR
  created_at   TIMESTAMP

  : **tasks**

------------------------------------------------------------------------

# ⚙️ API Example

### Create Task

    POST /api/tasks

Body:

    {
      "title": "Learn React",
      "priority": "high"
    }

------------------------------------------------------------------------

### Get Tasks

    GET /api/tasks

------------------------------------------------------------------------

### Update Task

    PUT /api/tasks/:id

------------------------------------------------------------------------

### Delete Task

    DELETE /api/tasks/:id

------------------------------------------------------------------------

# 🧠 Future Improvements

Possible future upgrades:

-   Authentication (JWT)
-   Task categories
-   Team collaboration
-   Real-time sync (WebSocket)
-   Mobile responsive UI
-   Notifications

------------------------------------------------------------------------

# 👨‍💻 Author

**Code Web Không Khó**

A project created to demonstrate how to build a **full‑stack task
management system using React + Node.js + PostgreSQL**.
