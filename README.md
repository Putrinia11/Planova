# Planova – Task Management System

## 1. Project Overview

**Planova** is a web-based task management application designed to help users organise their daily tasks, manage schedules, and monitor their productivity efficiently.

The system provides a simple and user-friendly interface that allows users to create and manage tasks, organise them into categories, view schedules through a calendar, and track their overall progress through reports and analytics.

Planova aims to make daily task management easier by bringing essential productivity tools together in one platform.

## 2. Features

Planova includes the following features:

- **User Login** – Provides a login interface with username and password validation.
- **Dashboard** – Displays an overview of total tasks, completed tasks, pending tasks, overdue tasks, upcoming tasks and recent activities.
- **Task Management** – Allows users to add, view, edit, delete and manage tasks based on their status, priority and due dates.
- **Calendar** – Provides a monthly calendar view to organise schedules, view upcoming deadlines and check tasks based on selected dates.
- **Categories Management** – Allows users to create and manage task categories to organise tasks more effectively.
- **Reports & Analytics** – Displays task statistics, completion rates, task status, due dates and category-based reports.
- **User Profile** – Allows users to view and update their personal profile information.
- **Light & Dark Mode** – Provides a theme option to customise the application's appearance.
- **Responsive Interface** – Supports different screen sizes, including desktop and mobile devices.

## 3. Technologies Used

The project is developed using the following technologies:

| Technology | Purpose |
|---|---|
| HTML5 | Structures the web pages |
| CSS3 | Styles and designs the interface |
| JavaScript | Handles application functionality and interactions |
| Bootstrap 5 | Provides responsive layout components |
| Bootstrap Icons | Provides icons throughout the application |
| Local Storage | Stores tasks, categories, activities and profile information in the browser |
| Session Storage | Manages the current login session |

## 4. Project Structure

```text
Planova/
│
├── index.html          # Login page
├── dashboard.html      # Main dashboard
├── task.html           # Task management page
├── calendar.html       # Calendar page
├── categories.html     # Categories management page
├── reports.html        # Reports and analytics page
├── profile.html        # User profile page
│
├── style.css           # Application styling
├── script.js           # JavaScript functionality
├── planovalogo.png     # Application logo
└── README.md           # Project documentation
```

## 5. Getting Started

Follow these steps to run Planova on your computer.

### Prerequisites

- A web browser (Google Chrome, Microsoft Edge, Firefox, etc.).
- A code editor such as Visual Studio Code (optional).

### Installation

1. Download or clone the Planova repository.
2. Extract the project folder if downloaded as a ZIP file.
3. Open the project folder using Visual Studio Code or another code editor.
4. Open `index.html` in your web browser.
5. Log in using the demo credentials provided below.
6. Start managing your tasks using Planova.

## 6. Demo Login Credentials

Use the following credentials to access the application:

| Field | Credentials |
|---|---|
| Username | `admin` |
| Password | `123456` |

**Note:** These are demo credentials defined in the JavaScript source code.

## 7. Data Storage

Planova uses the browser's Local Storage and Session Storage to manage application data.

- **Local Storage:** Stores task information, categories, user profile details, activities, theme preferences and remembered usernames.
- **Session Storage:** Stores the current login session and username.

Data is stored locally in the browser and is not connected to an external database.

## 8. Future Improvements

Potential improvements for future development include:

- Implementing a secure authentication system.
- Integrating a database for permanent data storage.
- Adding task reminders and notifications.
- Supporting multiple user accounts.
- Introducing additional productivity and reporting features.

## 9. Project Purpose

Planova is developed as a web-based task management project to demonstrate the application of web development technologies in creating a functional and user-friendly productivity system.

---

**Planova – Organise Your Tasks, Manage Your Time.**