# Activity 8 – Real‑Time Chat Room (Full Stack)

This project is a simple real‑time chat room application built as a full‑stack lab activity.

- **Backend**: NestJS + TypeORM + MySQL + Socket.IO
- **Frontend**: React (Create React App) + Tailwind CSS
- **Auth**: JWT‑based authentication
- **Features**:
  - User signup / login
  - Create private or group chat rooms
  - Join / leave rooms
  - Add/remove members
  - Real‑time messaging with Socket.IO

---

## 1. Requirements

- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+ (comes with Node LTS)
- **MySQL** (or compatible) running locally
- A terminal (PowerShell / cmd / Git Bash on Windows)

---

## 2. Backend Setup (NestJS API)

Backend folder: `activity8-chat-room-backend`

### 2.1. Install dependencies

From the project root (`Activity-8`):

```bash
npm install --prefix activity8-chat-room-backend
```

Or go into the folder and run:

```bash
cd activity8-chat-room-backend
npm install
```

### 2.2. Configure database & environment

The backend uses TypeORM with MySQL. Make sure you have a database created, for example:

- host: `localhost`
- port: `3306`
- database: `chat_room_db` (or any name you prefer)
- user: e.g. `root`
- password: your password

Then configure your connection in the TypeORM config / `.env` file according to how the project is set up (usually something like):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=chat_room_db
JWT_SECRET=your_jwt_secret
```

> Adjust the actual variable names to match your `typeorm.config.ts` and auth configuration.

### 2.3. Run the backend

From the project root:

```bash
npm run start:backend
```

Or directly inside the backend folder:

```bash
cd activity8-chat-room-backend
npm run start:dev
```

The API and Socket.IO server will run by default on **http://localhost:3000**.

---

## 3. Frontend Setup (React App)

Frontend folder: `activity8-chat-room-frontend`

### 3.1. Install dependencies

From the project root:

```bash
npm install --prefix activity8-chat-room-frontend
```

Or inside the folder:

```bash
cd activity8-chat-room-frontend
npm install
```

### 3.2. Configure API URL

The frontend uses an environment variable `REACT_APP_API_URL` to talk to the backend.

Create a `.env` file inside `activity8-chat-room-frontend` (same level as its `package.json`) with:

```env
REACT_APP_API_URL=http://localhost:3000
```

If this file is missing, the frontend falls back to `http://localhost:3000` by default.

### 3.3. Run the frontend

From the project root:

```bash
npm run start:frontend
```

Or inside the frontend folder:

```bash
cd activity8-chat-room-frontend
npm start
```

The React app will start on **http://localhost:3000** or **http://localhost:3001** depending on your setup (Create React App will ask to use another port if 3000 is busy).

---

## 4. Run Frontend & Backend Together

In the root `Activity-8` folder there are helper scripts in `package.json`:

```json
{
  "scripts": {
    "start:frontend": "npm start --prefix activity8-chat-room-frontend",
    "start:backend": "npm run start:dev --prefix activity8-chat-room-backend",
    "dev": "concurrently \"npm run start:backend\" \"npm run start:frontend\""
  }
}
```

First install the root dependencies (for `concurrently`):

```bash
npm install
```

Then start both servers with one command:

```bash
npm run dev
```

- Backend: runs on `http://localhost:3000`
- Frontend: runs on the next free port (usually `http://localhost:3001`)

---

## 5. How the App Works (High‑Level Description)

### Backend (NestJS)

- Exposes REST endpoints for:
  - **Auth**: login, signup, current user (JWT)
  - **Users**: list users
  - **Chat Rooms**: create, list all, list rooms for the current user, get messages
  - **Members**: add / remove members from rooms
  - **Messages**: send messages to a room
- Uses **TypeORM** entities for `User`, `ChatRoom`, `ChatRoomMember`, and `ChatRoomMessage`.
- Uses **Socket.IO** gateway to broadcast new messages in real‑time to users in the same room.

### Frontend (React + Tailwind)

- React single‑page app with the main `ChatRoom` screen.
- Uses **React Query** for data fetching/caching (`currentUser`, `myChatRooms`, `allChatRooms`, etc.).
- Uses **Axios** services for REST calls and a custom Socket.IO client for real‑time events.
- UI features:
  - Sidebar with **Joined Rooms** and **Explore Rooms**.
  - Main chat area with message list and input.
  - Right panel with room details and member list (can be toggled).
  - Modals for:
    - Login / signup (auth module)
    - Create new chat room
    - Join chat room
    - Add new member to a room
    - Leave chat room
    - User account / logout

---


This README describes the overall structure of the lab, how to install dependencies for both frontend and backend, how to run them together, and what the application does end‑to‑end.
