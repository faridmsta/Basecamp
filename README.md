# MyBasecamp2 — Project Management Application

A full-featured project management tool built with **Node.js**, **Express**, **PostgreSQL** (Sequelize ORM), and **EJS** templates styled with **Tailwind CSS**.

---

## 🌐 Live Demo

> **Hosted on Railway:**  
> **https://mybasecamp2-production.up.railway.app**

---

## ✨ Features

### Projects
- Create, view, edit, and delete projects
- Status tracking: `active`, `archived`, `completed`
- Only the project owner or a global admin can edit / delete

### Attachments *(new in MyBasecamp2)*
- **Any** project member can upload attachments (PNG, JPG/JPEG, PDF, TXT — max 10 MB)
- Each attachment records its **format**, original filename, file size, and uploader
- Attachments are displayed in the `Project#show` page with format badges, size info, and direct download links
- The uploader or project admin can delete an attachment

### Discussion Threads *(new in MyBasecamp2)*
- Only the **project admin** (owner or global admin) can create, edit, or delete threads
- Each project can have multiple threads

### Messages *(new in MyBasecamp2)*
- **Any** project member can post messages inside a thread
- The message author or an admin can edit or delete their own messages
- Messages are displayed in chronological order inside the thread view

### Users & Authentication
- Register / log in with email + password (bcrypt hashed)
- Session-based authentication with connect-flash messages
- Role-based access: `user` vs `admin`

---

## 🗂 Project Structure

```
my_basecamp2/
├── app.js                        # Express application entry point
├── config/
│   ├── database.js               # Sequelize / PostgreSQL connection
│   └── upload.js                 # Multer file-upload configuration
├── controllers/
│   ├── attachmentsController.js  # Attachment#create, #destroy
│   ├── messagesController.js     # Message#create, #edit, #update, #destroy
│   ├── projectsController.js     # Project CRUD
│   ├── rolesController.js        # Admin role management
│   ├── sessionsController.js     # Login / logout
│   ├── threadsController.js      # Thread CRUD
│   └── usersController.js        # User registration / profile
├── middleware/
│   └── auth.js                   # requireLogin, requireAdmin, requireProjectAccess, …
├── models/
│   ├── Attachment.js
│   ├── Message.js
│   ├── Project.js
│   ├── Thread.js
│   ├── User.js
│   └── index.js                  # Associations & sequelize export
├── public/
│   └── uploads/                  # Uploaded attachment files (git-ignored)
├── routes/
│   ├── admin.js
│   ├── attachments.js            # POST/DELETE /projects/:projectId/attachments
│   ├── index.js                  # Master router
│   ├── projects.js
│   ├── sessions.js
│   ├── threads.js                # CRUD /projects/:projectId/threads + messages
│   └── users.js
└── views/
    ├── layouts/
    ├── messages/
    │   └── edit.ejs
    ├── partials/
    ├── projects/
    │   └── show.ejs              # Displays attachments + threads sections
    └── threads/
        ├── edit.ejs
        ├── new.ejs
        └── show.ejs              # Thread view with message list + post form
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14

### Installation

```bash
git clone <repo-url>
cd my_basecamp2
npm install
```

### Environment Variables

Create a `.env` file (see `.env.example`):

```env
NODE_ENV=development
PORT=3000
SESSION_SECRET=your_secret_here

DB_HOST=localhost
DB_PORT=5432
DB_NAME=mybasecamp2
DB_USER=postgres
DB_PASS=yourpassword
```

### Run Development Server

```bash
npm run dev
# → http://localhost:3000
```

The database tables are automatically created/migrated via `sequelize.sync({ alter: true })` on startup.

---

## 📡 Deployment (Railway)

This app is deployed on [Railway](https://railway.app):

1. Connect your GitHub repo to Railway
2. Add a **PostgreSQL** plugin — Railway auto-injects `DATABASE_URL`
3. Set environment variables: `SESSION_SECRET`, `NODE_ENV=production`
4. The `start` script (`node app.js`) is used automatically

> **Live URL:** https://mybasecamp2-production.up.railway.app

---

## 🔑 Authorization Matrix

| Action                        | Who can do it                        |
|-------------------------------|--------------------------------------|
| View project                  | Project owner + admins               |
| Edit / delete project         | Project owner + admins               |
| Upload attachment             | Any project member                   |
| Delete attachment             | Uploader + admins                    |
| Create / edit / delete thread | Project admin (owner or global admin)|
| Post a message                | Any project member                   |
| Edit / delete message         | Message author + admins              |

---

## 🛠 Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Runtime     | Node.js (CommonJS)                      |
| Framework   | Express 5                               |
| Database    | PostgreSQL via Sequelize 6              |
| Auth        | express-session + bcryptjs              |
| Views       | EJS + express-ejs-layouts               |
| Styling     | Tailwind CSS (CDN)                      |
| File Upload | Multer (disk storage)                   |
| Flash       | connect-flash                           |

---

## 📄 License

ISC
