# 🗂️ CRM — Sales Team Management System

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

> A powerful CRM platform built for sales teams. Each sales employee manages up to **200 contacts per day** — tracking follow-ups, leads, rejections, and active deals — while admins get a full bird's-eye view of daily team activity.

---

## ✨ Features

### 👨‍💼 Sales Employee
- 📋 **200 Contacts/Day** — manage a daily list of assigned contacts
- 👤 **Contact Details** — name, phone number, status, and notes per contact
- 🔁 **Follow Up** — mark contacts for follow-up with date reminders
- ❌ **Reject** — mark contacts as rejected with optional reason
- 🔥 **Lead** — flag promising contacts as active leads
- ✅ **Active** — track deals currently in progress
- 📝 **Daily Activity Log** — automatic log of all actions taken in a day

### 🛡️ Admin
- 📊 **Dashboard** — overview of all sales employees' daily performance
- 👁️ **Activity Monitor** — see each employee's contacts, statuses, and updates in real time
- 📅 **Date Filter** — view activity by specific date or date range
- 📈 **Stats & Metrics** — total leads, follow-ups, rejections, and active deals per employee
- 👥 **Employee Management** — add, deactivate, or manage sales staff accounts
- 📤 **Export Reports** — download daily/weekly activity as CSV

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React.js, Redux Toolkit, Tailwind CSS |
| Backend    | Node.js, Express.js                  |
| Database   | MongoDB, Mongoose                    |
| Auth       | JWT, bcrypt.js                       |
| Real-time  | Socket.io                            |
| API        | RESTful API                          |

---

## 👥 Roles & Permissions

| Feature                        | Sales Employee | Admin |
|-------------------------------|:--------------:|:-----:|
| View own contacts              | ✅             | ✅    |
| Update contact status          | ✅             | ❌    |
| View all employees' activity   | ❌             | ✅    |
| Export reports                 | ❌             | ✅    |
| Manage employee accounts       | ❌             | ✅    |
| View dashboard metrics         | ❌             | ✅    |
| Filter by date / employee      | ❌             | ✅    |

---

## 📊 Contact Status Flow

```
Assigned
    │
    ├──▶  Follow Up  ──▶  Lead  ──▶  Active
    │
    └──▶  Rejected
```

Each contact moves through statuses as the sales employee interacts with them during the day.

---

## 📁 Project Structure

```
crm/
├── client/                    # React frontend
│   ├── public/
│   └── src/
│       ├── components/        # Reusable UI (ContactCard, StatusBadge, etc.)
│       ├── pages/
│       │   ├── employee/      # Daily contacts, status update views
│       │   └── admin/         # Dashboard, activity monitor, reports
│       ├── redux/             # State management
│       ├── hooks/             # Custom hooks
│       └── utils/             # Helpers, constants, formatters
│
├── server/                    # Express backend
│   ├── controllers/           # Business logic
│   ├── models/                # Mongoose schemas
│   │   ├── User.js            # Employee & Admin accounts
│   │   ├── Contact.js         # Contact details & status
│   │   └── ActivityLog.js     # Daily activity records
│   ├── routes/                # API routes
│   ├── middleware/            # Auth, role-based access control
│   └── utils/                 # JWT helpers, validators
│
├── .env.example
└── README.md
```

---

## 🗄️ Data Models (Overview)

### User
```
name, email, password, role (admin | employee), isActive, createdAt
```

### Contact
```
assignedTo (employee), name, phoneNumber, status (follow_up | lead | active | rejected),
notes, followUpDate, createdAt, updatedAt
```

### ActivityLog
```
employeeId, date, totalContacts, followed, leads, active, rejected, pending, actions[]
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/crm.git
cd crm
```

**2. Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Server
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Client
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

**3. Install dependencies**

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

**4. Seed an admin account (optional)**

```bash
cd server && npm run seed
```

**5. Run the application**

```bash
# From root — run both concurrently
npm run dev
```

Or separately:

```bash
# Backend (from /server)
npm run dev

# Frontend (from /client)
npm start
```

**6. Open in browser**

```
http://localhost:3000
```

---

## 🖼️ Screenshots

> _Add screenshots of your app here_

| Admin Dashboard | Employee Daily View |
|-----------------|---------------------|
| ![Dashboard](./screenshots/dashboard.png) | ![Contacts](./screenshots/contacts.png) |

---

## 🧪 Running Tests

```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test
```

---

## 🔮 Roadmap

- [ ] WhatsApp / SMS integration for direct contact outreach
- [ ] In-app notifications for follow-up reminders
- [ ] Advanced analytics with charts (leads converted, rejection rate)
- [ ] Bulk contact import via CSV upload
- [ ] Mobile app (React Native)
- [ ] Role: Team Lead (supervises a group of employees)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)

---

> ⭐ If this project helped you, drop a star on GitHub — it means a lot!
