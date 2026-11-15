
// Get HTML elements
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");
const loginMessage = document.getElementById("loginMessage");

const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

// Demo credentials
const correctUsername = "admin";
const correctPassword = "123456";

// Display previously remembered username
window.addEventListener("DOMContentLoaded", function () {
    const savedUsername = localStorage.getItem("taskflowUsername");

    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberMe.checked = true;
    }
});


// Show or hide password
if (togglePassword) {
    togglePassword.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.classList.remove("bi-eye");
            eyeIcon.classList.add("bi-eye-slash");
            togglePassword.setAttribute("aria-label", "Hide password");
        } else {
            passwordInput.type = "password";
            eyeIcon.classList.remove("bi-eye-slash");
            eyeIcon.classList.add("bi-eye");
            togglePassword.setAttribute("aria-label", "Show password");
        }
    });
}

// Display login message
function showMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = "login-message " + type;
}

// Login form validation
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Check login credentials
    if (
        username === correctUsername &&
        password === correctPassword
    ) {
        // Remember username only (never save the password)
        if (rememberMe.checked) {
            localStorage.setItem("taskflowUsername", username);
        } else {
            localStorage.removeItem("taskflowUsername");
        }

        // Save demo login session
        sessionStorage.setItem("taskflowLoggedIn", "true");
        sessionStorage.setItem("taskflowCurrentUser", username);

        showMessage(
            "Login successful! Your account is ready.",
            "success"
        );

        window.location.href = "dashboard.html";
        // when the Dashboard page is created.

    } else {
        showMessage(
            "Invalid username or password. Please try again.",
            "error"
        );
    }
});
}

// ==============================
// TASKFLOW SIDEBAR NAVIGATION
// ==============================

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const sidebarClose = document.getElementById("sidebarClose");
const sidebarOverlay = document.getElementById("sidebarOverlay");

// Open sidebar on mobile
if (menuToggle) {
    menuToggle.addEventListener("click", function () {
        sidebar.classList.add("show");
        sidebarOverlay.classList.add("show");
    });
}

// Close sidebar
function closeSidebar() {
    if (sidebar) {
        sidebar.classList.remove("show");
    }

    if (sidebarOverlay) {
        sidebarOverlay.classList.remove("show");
    }
}

if (sidebarClose) {
    sidebarClose.addEventListener("click", closeSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
}

// Display saved username
const dashboardUsername = document.getElementById("dashboardUsername");

if (dashboardUsername) {
    const savedUsername = sessionStorage.getItem("taskflowCurrentUser");

    if (savedUsername) {
        dashboardUsername.textContent = savedUsername;
    }
}

// ==============================
// TASKFLOW DASHBOARD INTEGRATION
// ==============================

(function () {

    const dashboardTotal = document.getElementById("dashboardTotalTasks");
    const dashboardCompleted = document.getElementById("dashboardCompletedTasks");
    const dashboardPending = document.getElementById("dashboardPendingTasks");
    const dashboardOverdue = document.getElementById("dashboardOverdueTasks");

    const upcomingContainer = document.getElementById("dashboardUpcomingTasks");
    const activityContainer = document.getElementById("dashboardRecentActivities");
    const productivityCanvas = document.getElementById("weeklyProductivityChart");
    const todayDate = document.getElementById("todayDate");

    // Stop if this is not the Dashboard page
    if (!dashboardTotal) return;

    // Display current date
    if (todayDate) {
        todayDate.textContent = new Date().toLocaleDateString("en-MY", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    // Read saved tasks
    function getTasks() {
        try {
            const tasks = JSON.parse(
                localStorage.getItem("taskflowTasks")
            ) || [];

            return Array.isArray(tasks) ? tasks : [];

        } catch (error) {
            return [];
        }
    }

    // Read saved activities
    
function getActivities() {
    try {
        const activities = JSON.parse(
            localStorage.getItem("taskflowActivities")
        ) || [];

        if (!Array.isArray(activities)) return [];

        // Hide all deleted task activities
        return activities.filter(activity =>
            activity.action !== "Deleted task"
        );

    } catch (error) {
        return [];
    }
}


    const tasks = getTasks();

    // Calculate task statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = tasks.length;

    const completed = tasks.filter(task =>
        task.status === "Completed"
    ).length;

    const pending = tasks.filter(task =>
        task.status === "Pending"
    ).length;

    const overdue = tasks.filter(task => {
        if (!task.dueDate || task.status === "Completed") {
            return false;
        }

        const dueDate = new Date(task.dueDate + "T00:00:00");

        return dueDate < today;
    }).length;

    // Update summary cards
    dashboardTotal.textContent = total;
    dashboardCompleted.textContent = completed;
    dashboardPending.textContent = pending;
    dashboardOverdue.textContent = overdue;

    // Update Overall Progress
const progressPercentage = total > 0
    ? Math.round((completed / total) * 100)
    : 0;

const progressNumber = document.getElementById("dashboardProgressPercentage");
const progressText = document.getElementById("dashboardProgressText");
const progressBar = document.getElementById("dashboardProgressBar");

if (progressNumber) {
    progressNumber.textContent = progressPercentage + "%";
}

if (progressText) {
    progressText.textContent = completed + " of " + total + " tasks completed";
}

if (progressBar) {
    progressBar.style.width = progressPercentage + "%";
}


    // ==============================
    // UPCOMING TASKS
    // ==============================

    if (upcomingContainer) {

        upcomingContainer.innerHTML = "";

        const upcomingTasks = tasks
            .filter(task => {
                if (!task.dueDate || task.status === "Completed") {
                    return false;
                }

                const dueDate = new Date(task.dueDate + "T00:00:00");

                return dueDate >= today;
            })
            .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
            .slice(0, 5);

        if (upcomingTasks.length === 0) {

            upcomingContainer.innerHTML = `
                <p class="dashboard-empty-message">
                    No upcoming tasks.
                </p>
            `;

        } else {

            upcomingTasks.forEach(task => {

                const item = document.createElement("div");
                item.className = "upcoming-task";

                let priorityClass = "task-medium";

                if (task.priority === "High") {
                    priorityClass = "task-high";
                } else if (task.priority === "Low") {
                    priorityClass = "task-low";
                }

                const indicator = document.createElement("div");
                indicator.className = `task-indicator ${priorityClass}`;

                const details = document.createElement("div");
                details.className = "task-details";

                const title = document.createElement("h4");
                title.textContent = task.title;

                const category = document.createElement("p");
                category.innerHTML = '<i class="bi bi-folder"></i> ';

                const categoryText = document.createTextNode(
                    task.category || "Uncategorised"
                );

                category.appendChild(categoryText);
                details.append(title, category);

                const date = document.createElement("span");
                date.className = "task-date";
                date.textContent = new Date(
                    task.dueDate + "T00:00:00"
                ).toLocaleDateString("en-MY", {
                    day: "numeric",
                    month: "short"
                });

                item.append(indicator, details, date);
                upcomingContainer.appendChild(item);
            });
        }
    }


    // ==============================
    // RECENT ACTIVITIES
    // ==============================

    if (activityContainer) {

        activityContainer.innerHTML = "";

        const activities = getActivities().slice(0, 5);

        if (activities.length === 0) {

            activityContainer.innerHTML = `
                <p class="dashboard-empty-message">
                    No recent activities.
                </p>
            `;

        } else {

            activities.forEach(activity => {

                const item = document.createElement("div");
                item.className = "activity-item";

                const icon = document.createElement("div");
                icon.className = "activity-icon";

                const iconElement = document.createElement("i");

               if (activity.action === "Added task") {
                icon.classList.add("activity-added");
                iconElement.className = "bi bi-plus";

                } else if (activity.action === "Updated status to Completed") {
                icon.classList.add("activity-completed");
                iconElement.className = "bi bi-check2";

                } else {
                icon.classList.add("activity-updated");
                iconElement.className = "bi bi-pencil";
                }   

                icon.appendChild(iconElement);

                const details = document.createElement("div");
                details.className = "activity-details";

                const title = document.createElement("h4");
                title.textContent = `${activity.action}: ${activity.title}`;

                const date = document.createElement("p");
                date.textContent = new Date(
                    activity.date
                ).toLocaleString("en-MY", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit"
                });

                details.append(title, date);
                item.append(icon, details);

                activityContainer.appendChild(item);
            });
        }
    }


    // ==============================
    // WEEKLY PRODUCTIVITY CHART
    // ==============================

    if (productivityCanvas && typeof Chart !== "undefined") {

        const now = new Date();
        const dayOfWeek = now.getDay();

        const monday = new Date(now);
        monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        monday.setHours(0, 0, 0, 0);

        const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        const weeklyCounts = [0, 0, 0, 0, 0, 0, 0];

        tasks.forEach(task => {

            if (task.status !== "Completed" || !task.completedAt) {
                return;
            }

            const completedDate = new Date(task.completedAt);

            if (isNaN(completedDate.getTime())) return;

            const difference = Math.floor(
                (completedDate - monday) / (1000 * 60 * 60 * 24)
            );

            if (difference >= 0 && difference < 7) {
                weeklyCounts[difference]++;
            }
        });

        // Avoid creating duplicate charts
        if (Chart.getChart(productivityCanvas)) {
            Chart.getChart(productivityCanvas).destroy();
        }

        new Chart(productivityCanvas, {
            type: "bar",

            data: {
                labels: labels,

                datasets: [{
                    label: "Completed Tasks",
                    data: weeklyCounts,

                    backgroundColor: "#A8B99A",
                    hoverBackgroundColor: "#8FA580",

                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: 22
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: false
                    }
                },

                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: "#948A80"
                        },
                        grid: {
                            color: "#F1EAE2"
                        }
                    },

                    x: {
                        ticks: {
                            color: "#948A80"
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

})();

// ==============================
// TASKFLOW - MY TASKS FUNCTIONS
// ==============================

(function () {

    // Check whether the current page is My Tasks
    const taskForm = document.getElementById("taskForm");

    if (!taskForm) {
        return;
    }

    // Get HTML elements
    const taskModalElement = document.getElementById("taskModal");
    const taskModal = new bootstrap.Modal(taskModalElement);

    const openAddTask = document.getElementById("openAddTask");
    const taskTableBody = document.getElementById("tasksTableBody");
    const emptyTaskMessage = document.getElementById("emptyTaskMessage");

    const taskSearch = document.getElementById("taskSearch");
    const statusFilter = document.getElementById("statusFilter");
    const priorityFilter = document.getElementById("priorityFilter");

    const taskId = document.getElementById("taskId");
    const taskTitle = document.getElementById("taskTitle");
    const taskDescription = document.getElementById("taskDescription");
    const taskCategory = document.getElementById("taskCategory");
    const taskDueDate = document.getElementById("taskDueDate");
    const taskPriority = document.getElementById("taskPriority");
    const taskStatus = document.getElementById("taskStatus");

    const taskModalTitle = document.getElementById("taskModalTitle");
    const saveTaskButton = document.getElementById("saveTaskButton");

    // Get saved tasks from localStorage
    const STORAGE_KEY = "taskflowTasks";

    let tasks = [];

    let currentPage = 1;
    const tasksPerPage = 5;

    try {
        tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        if (!Array.isArray(tasks)) {
            tasks = [];
        }
    } catch (error) {
        tasks = [];
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    
// Save recent activities
function saveActivity(action, taskTitle) {
    let activities = [];

    try {
        activities = JSON.parse(
            localStorage.getItem("taskflowActivities")
        ) || [];
    } catch (error) {
        activities = [];
    }

    activities.unshift({
        action: action,
        title: taskTitle,
        date: new Date().toISOString()
    });

    // Keep only the latest 20 activities
    activities = activities.slice(0, 20);

    localStorage.setItem(
        "taskflowActivities",
        JSON.stringify(activities)
    );
    }

    // Generate unique task ID
    function generateTaskId() {
        return Date.now().toString() + Math.random().toString(36).slice(2, 7);
    }

    // Prevent HTML injection in task information
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            const characters = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return characters[character];
        });
    }

    // Format due date
    function formatDate(dateValue) {
        if (!dateValue) return "-";

        const date = new Date(dateValue + "T00:00:00");

        return date.toLocaleDateString("en-MY", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    // Update task summary
    function updateTaskSummary() {

        const total = tasks.length;

        const pending = tasks.filter(task =>
            task.status === "Pending"
        ).length;

        const inProgress = tasks.filter(task =>
            task.status === "In Progress"
        ).length;

        const completed = tasks.filter(task =>
            task.status === "Completed"
        ).length;

        document.getElementById("totalTaskCount").textContent = total;
        document.getElementById("pendingTaskCount").textContent = pending;
        document.getElementById("progressTaskCount").textContent = inProgress;
        document.getElementById("completedTaskCount").textContent = completed;
    }

    // Display tasks in table
 
function displayTasks() {
    const searchValue = taskSearch.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;
    const selectedPriority = priorityFilter.value;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = String(task.title || "").toLowerCase().includes(searchValue);
        const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
        const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    if (currentPage > totalPages) {
        currentPage = Math.max(1, totalPages);
    }

    const startIndex = (currentPage - 1) * tasksPerPage;
    const paginatedTasks = filteredTasks.slice(
        startIndex,
        startIndex + tasksPerPage
    );

    taskTableBody.innerHTML = "";

    document.getElementById("displayTaskCount").textContent =
        filteredTasks.length + (filteredTasks.length === 1 ? " task" : " tasks");

    emptyTaskMessage.classList.toggle("show", filteredTasks.length === 0);

    // Display only 5 tasks
    paginatedTasks.forEach(task => {
        const row = document.createElement("tr");

        let priorityClass = "priority-medium";
        if (task.priority === "High") priorityClass = "priority-high";
        else if (task.priority === "Low") priorityClass = "priority-low";

        let statusClass = "status-pending";
        if (task.status === "In Progress") statusClass = "status-in-progress";
        else if (task.status === "Completed") statusClass = "status-completed";

        const description = task.description
            ? escapeHTML(task.description)
            : "No description";

        row.innerHTML = `
            <td>
                <div class="task-name-cell">
                    <strong>${escapeHTML(task.title)}</strong>
                    <small>${description}</small>
                </div>
            </td>
            <td>${escapeHTML(task.category)}</td>
            <td>${formatDate(task.dueDate)}</td>
            <td><span class="task-badge ${priorityClass}">${escapeHTML(task.priority)}</span></td>
            <td>
                <select class="status-select" data-action="status" data-id="${escapeHTML(task.id)}" aria-label="Update task status">
                    <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
                </select>
            </td>
            <td>
                <div class="task-actions">
                    <button class="task-action-button" data-action="edit" data-id="${escapeHTML(task.id)}" title="Edit task" aria-label="Edit task"><i class="bi bi-pencil"></i></button>
                    <button class="task-action-button delete-task-button" data-action="delete" data-id="${escapeHTML(task.id)}" title="Delete task" aria-label="Delete task"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        `;

        taskTableBody.appendChild(row);
    });

    // Render pagination buttons
    const pagination = document.getElementById("taskPagination");

    if (pagination) {
        pagination.innerHTML = "";

        if (totalPages > 1) {
            const previousButton = document.createElement("button");
            previousButton.textContent = "Previous";
            previousButton.className = "pagination-button";
            previousButton.disabled = currentPage === 1;

            previousButton.addEventListener("click", function () {
                currentPage--;
                displayTasks();
            });

            pagination.appendChild(previousButton);

            for (let page = 1; page <= totalPages; page++) {
                const pageButton = document.createElement("button");
                pageButton.textContent = page;
                pageButton.className = "pagination-button";

                if (page === currentPage) {
                    pageButton.classList.add("active");
                }

                pageButton.addEventListener("click", function () {
                    currentPage = page;
                    displayTasks();
                });

                pagination.appendChild(pageButton);
            }

            const nextButton = document.createElement("button");
            nextButton.textContent = "Next";
            nextButton.className = "pagination-button";
            nextButton.disabled = currentPage === totalPages;

            nextButton.addEventListener("click", function () {
                currentPage++;
                displayTasks();
            });

            pagination.appendChild(nextButton);
        }
    }

    updateTaskSummary();

}

    // Clear form
    function clearTaskForm() {
        taskForm.reset();
        taskId.value = "";
        taskPriority.value = "Medium";
        taskStatus.value = "Pending";
    }

    // Open Add Task modal
    openAddTask.addEventListener("click", function () {

        clearTaskForm();

        taskModalTitle.textContent = "Add New Task";
        saveTaskButton.textContent = "Save Task";

        taskModal.show();
    });

    // Save or update task
    taskForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const title = taskTitle.value.trim();

        if (!title) {
            alert("Please enter a task name.");
            return;
        }

        const existingTask = tasks.find(task =>
            task.id === taskId.value
        );

        
    const taskData = {
        id: taskId.value || generateTaskId(),
        title: title,
        description: taskDescription.value.trim(),
        category: taskCategory.value,
        dueDate: taskDueDate.value,
        priority: taskPriority.value,
        status: taskStatus.value,
        completedAt: taskStatus.value === "Completed"
        ? (existingTask?.completedAt || new Date().toISOString())
        : ""
    };

        
        if (existingTask) {
             tasks = tasks.map(task =>
             task.id === taskId.value ? taskData : task
    );

         saveActivity("Updated task", title);

    } else {
        tasks.push(taskData);

        saveActivity("Added task", title);
    }

        saveTasks();
        displayTasks();
        taskModal.hide();
        clearTaskForm();
    });

    // Handle Edit, Delete and Status Update
    taskTableBody.addEventListener("click", function (event) {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const action = button.dataset.action;
        const id = button.dataset.id;

        const selectedTask = tasks.find(task => task.id === id);

        if (!selectedTask) return;

        // Edit task
        if (action === "edit") {

            taskId.value = selectedTask.id;
            taskTitle.value = selectedTask.title;
            taskDescription.value = selectedTask.description || "";
            taskCategory.value = selectedTask.category;
            taskDueDate.value = selectedTask.dueDate;
            taskPriority.value = selectedTask.priority;
            taskStatus.value = selectedTask.status;

            taskModalTitle.textContent = "Edit Task";
            saveTaskButton.textContent = "Update Task";

            taskModal.show();
        }

        // Delete task
        if (action === "delete") {

            const confirmDelete = confirm(
                "Are you sure you want to delete this task?"
            );

            
        if (confirmDelete) {
             
            tasks = tasks.filter(task => task.id !== id);

            saveTasks();
            displayTasks();
        }

        }
    });

    
// Update task status
taskTableBody.addEventListener("change", function (event) {

    const select = event.target.closest('select[data-action="status"]');

    if (!select) return;

    const id = select.dataset.id;

    const selectedTask = tasks.find(task => task.id === id);

    if (!selectedTask) return;

    const oldStatus = selectedTask.status;
    const newStatus = select.value;

    if (oldStatus === newStatus) return;

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                status: newStatus,
                completedAt: newStatus === "Completed"
                    ? new Date().toISOString()
                    : ""
            };
        }

        return task;
    });

    saveTasks();

    saveActivity(
        "Updated status to " + newStatus,
        selectedTask.title
    );

    displayTasks();
});

    // Search tasks
    taskSearch.addEventListener("input", function () {
    currentPage = 1;
    displayTasks();
});

statusFilter.addEventListener("change", function () {
    currentPage = 1;
    displayTasks();
});

priorityFilter.addEventListener("change", function () {
    currentPage = 1;
    displayTasks();
});

// Display saved tasks when page opens
displayTasks();

})();

// ==============================
// TASKFLOW - CALENDAR FUNCTIONS
// ==============================

(function () {

    // Run only on Calendar page
    const calendarDays = document.getElementById("calendarDays");

    if (!calendarDays) {
        return;
    }

    // HTML elements
    const monthYear = document.getElementById("calendarMonthYear");
    const previousMonth = document.getElementById("previousMonth");
    const nextMonth = document.getElementById("nextMonth");
    const todayButton = document.getElementById("calendarToday");

    const upcomingTaskList = document.getElementById("upcomingTaskList");
    const noUpcomingTasks = document.getElementById("noUpcomingTasks");

    const selectedDateTitle = document.getElementById("selectedDateTitle");
    const selectedDateCount = document.getElementById("selectedDateCount");
    const selectedDateTasks = document.getElementById("selectedDateTasks");
    const noSelectedTasks = document.getElementById("noSelectedTasks");

    // Task details modal
    const taskModalElement = document.getElementById("calendarTaskModal");
    const taskModal = new bootstrap.Modal(taskModalElement);

    // Load tasks saved from My Tasks page
    const STORAGE_KEY = "taskflowTasks";

    function getSavedTasks() {
        try {
            const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            return Array.isArray(savedTasks) ? savedTasks : [];
        } catch (error) {
            return [];
        }
    }

    let tasks = getSavedTasks();

    // Current date
    const today = new Date();

    let currentMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    let selectedDate = getDateKey(today);

    // Create local date key (YYYY-MM-DD)
    function getDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    // Format date for display
    function formatDate(dateValue) {
        if (!dateValue) return "-";

        const date = new Date(dateValue + "T00:00:00");

        return date.toLocaleDateString("en-MY", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    // Escape text before displaying it in HTML
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            const characters = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return characters[character];
        });
    }

    // Get CSS class based on task status
    function getStatusClass(status) {
        if (status === "Completed") {
            return "completed";
        }

        if (status === "In Progress") {
            return "in-progress";
        }

        return "pending";
    }

    // Render monthly calendar
    function renderCalendar() {

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        monthYear.textContent = currentMonth.toLocaleDateString("en-MY", {
            month: "long",
            year: "numeric"
        });

        calendarDays.innerHTML = "";

        // First day of the month
        const firstDay = new Date(year, month, 1).getDay();

        // Number of days in current month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Previous month's last day
        const daysInPreviousMonth = new Date(year, month, 0).getDate();

        // Display six weeks (42 calendar cells)
        for (let i = 0; i < 42; i++) {

            let date;
            let isOtherMonth = false;

            if (i < firstDay) {

                const day = daysInPreviousMonth - firstDay + i + 1;

                date = new Date(year, month - 1, day);
                isOtherMonth = true;

            } else if (i >= firstDay + daysInMonth) {

                const day = i - firstDay - daysInMonth + 1;

                date = new Date(year, month + 1, day);
                isOtherMonth = true;

            } else {

                const day = i - firstDay + 1;

                date = new Date(year, month, day);
            }

            const dateKey = getDateKey(date);

            const isToday = dateKey === getDateKey(today);
            const isSelected = dateKey === selectedDate;

            // Find tasks due on this date
            const dayTasks = tasks.filter(task =>
                task.dueDate === dateKey
            );

            const dayCell = document.createElement("div");

            dayCell.className = "calendar-day";

            if (isOtherMonth) {
                dayCell.classList.add("other-month");
            }

            if (isToday) {
                dayCell.classList.add("today");
            }

            if (isSelected) {
                dayCell.classList.add("selected-day");
            }

            dayCell.dataset.date = dateKey;

            let taskHTML = "";

            dayTasks.slice(0, 2).forEach(task => {

                const statusClass = getStatusClass(task.status);

                taskHTML += `
                    <button
                        type="button"
                        class="calendar-task-chip ${statusClass}"
                        data-task-id="${escapeHTML(task.id)}"
                        title="${escapeHTML(task.title)}"
                    >
                        ${escapeHTML(task.title)}
                    </button>
                `;
            });

            if (dayTasks.length > 2) {
                taskHTML += `
                    <span class="more-task-label">
                        +${dayTasks.length - 2} more
                    </span>
                `;
            }

            dayCell.innerHTML = `
                <div class="day-number">${date.getDate()}</div>
                ${taskHTML}
            `;

            calendarDays.appendChild(dayCell);
        }
    }

    // Display tasks for selected date
    function renderSelectedDateTasks() {

        const date = new Date(selectedDate + "T00:00:00");

        selectedDateTitle.textContent = "Tasks for " +
            date.toLocaleDateString("en-MY", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

        const dateTasks = tasks.filter(task =>
            task.dueDate === selectedDate
        );

        selectedDateCount.textContent =
            dateTasks.length + (dateTasks.length === 1 ? " task" : " tasks");

        selectedDateTasks.innerHTML = "";

        noSelectedTasks.style.display =
            dateTasks.length === 0 ? "block" : "none";

        dateTasks.forEach(task => {

            const statusClass = getStatusClass(task.status);

            const item = document.createElement("div");

            item.className = "selected-task-item";

            item.innerHTML = `
                <div class="selected-task-main">

                    <span class="selected-task-indicator ${statusClass}"></span>

                    <div>
                        <strong>${escapeHTML(task.title)}</strong>
                        <small>
                            ${escapeHTML(task.category)} ·
                            ${escapeHTML(task.priority)} Priority ·
                            ${escapeHTML(task.status)}
                        </small>
                    </div>

                </div>

                <button
                    type="button"
                    class="selected-task-view"
                    data-task-id="${escapeHTML(task.id)}"
                >
                    View Details
                </button>
            `;

            selectedDateTasks.appendChild(item);
        });
    }

    // Display upcoming deadlines
    function renderUpcomingTasks() {

        const todayKey = getDateKey(today);

        const upcomingTasks = tasks
            .filter(task =>
                task.dueDate >= todayKey &&
                task.status !== "Completed"
            )
            .sort((a, b) =>
                a.dueDate.localeCompare(b.dueDate)
            )
            .slice(0, 6);

        upcomingTaskList.innerHTML = "";

        noUpcomingTasks.style.display =
            upcomingTasks.length === 0 ? "block" : "none";

        upcomingTasks.forEach(task => {

            const statusClass = getStatusClass(task.status);

            const item = document.createElement("div");

            item.className = "upcoming-task-item";

            item.innerHTML = `
                <span class="upcoming-task-marker ${statusClass}"></span>

                <div class="upcoming-task-info">
                    <button
                        type="button"
                        data-task-id="${escapeHTML(task.id)}"
                    >
                        ${escapeHTML(task.title)}
                    </button>

                    <small>${escapeHTML(task.category)}</small>
                </div>

                <span class="upcoming-task-date">
                    ${formatDate(task.dueDate)}
                </span>
            `;

            upcomingTaskList.appendChild(item);
        });
    }

    // Show task details modal
    function showTaskDetails(id) {

        const task = tasks.find(item => item.id === id);

        if (!task) return;

        document.getElementById("detailTaskTitle").textContent =
            task.title;

        document.getElementById("detailTaskDescription").textContent =
            task.description || "No description provided.";

        document.getElementById("detailTaskCategory").textContent =
            task.category;

        document.getElementById("detailTaskDate").textContent =
            formatDate(task.dueDate);

        document.getElementById("detailTaskPriority").textContent =
            task.priority;

        document.getElementById("detailTaskStatus").textContent =
            task.status;

        taskModal.show();
    }

    // Handle calendar day and task clicks
    calendarDays.addEventListener("click", function (event) {

        const taskButton = event.target.closest("[data-task-id]");

        if (taskButton) {
            showTaskDetails(taskButton.dataset.taskId);
            return;
        }

        const dayCell = event.target.closest(".calendar-day");

        if (dayCell) {

            selectedDate = dayCell.dataset.date;

            renderCalendar();
            renderSelectedDateTasks();
        }
    });

    // Handle task clicks in upcoming and selected date lists
    function handleTaskListClick(event) {

        const taskButton = event.target.closest("[data-task-id]");

        if (!taskButton) return;

        showTaskDetails(taskButton.dataset.taskId);
    }

    upcomingTaskList.addEventListener("click", handleTaskListClick);
    selectedDateTasks.addEventListener("click", handleTaskListClick);

    // Previous month
    previousMonth.addEventListener("click", function () {

        currentMonth.setMonth(currentMonth.getMonth() - 1);

        renderCalendar();
    });

    // Next month
    nextMonth.addEventListener("click", function () {

        currentMonth.setMonth(currentMonth.getMonth() + 1);

        renderCalendar();
    });

    // Return to current month and date
    todayButton.addEventListener("click", function () {

        currentMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        selectedDate = getDateKey(today);

        renderCalendar();
        renderSelectedDateTasks();
    });

    // Initial display
    renderCalendar();
    renderSelectedDateTasks();
    renderUpcomingTasks();

})();

// ==============================
// TASKFLOW - CATEGORIES FUNCTIONS
// ==============================

(function () {

    // Run only on Categories page
    const categoryGrid = document.getElementById("categoryGrid");

    if (!categoryGrid) {
        return;
    }

    const categoryForm = document.getElementById("categoryForm");
    const categoryModalElement = document.getElementById("categoryModal");
    const categoryModal = new bootstrap.Modal(categoryModalElement);

    const openCategoryModal = document.getElementById("openCategoryModal");
    const categoryNameInput = document.getElementById("categoryName");
    const categoryIconInput = document.getElementById("categoryIcon");
    const categoryOriginalName = document.getElementById("categoryOriginalName");

    const categoryModalTitle = document.getElementById("categoryModalTitle");
    const saveCategoryButton = document.getElementById("saveCategoryButton");

    const categoryTaskList = document.getElementById("categoryTaskList");
    const categoryEmptyMessage = document.getElementById("categoryEmptyMessage");

    const STORAGE_KEY = "taskflowCategories";
    const TASK_KEY = "taskflowTasks";

    // Default categories
    const defaultCategories = [
        { name: "Academic", icon: "bi-book" },
        { name: "Personal", icon: "bi-person-heart" },
        { name: "Work", icon: "bi-briefcase" },
        { name: "Shopping", icon: "bi-basket" },
        { name: "Others", icon: "bi-folder" }
    ];

    // Load saved categories
    function loadCategories() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

            return Array.isArray(saved) ? saved : [...defaultCategories];
        } catch (error) {
            return [...defaultCategories];
        }
    }

    let categories = loadCategories();
    let selectedCategory = null;

    // Load tasks created in My Tasks
    function loadTasks() {
        try {
            const saved = JSON.parse(localStorage.getItem(TASK_KEY)) || [];
            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            return [];
        }
    }

    function saveCategories() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    }

    function saveTasks(tasks) {
        localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
    }

    // Escape text before displaying it
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            const characters = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return characters[character];
        });
    }

    // Get number of tasks in a category
    function getCategoryTaskCount(categoryName) {
        const tasks = loadTasks();

        return tasks.filter(task =>
            task.category === categoryName
        ).length;
    }

    // Update overview numbers
    function updateCategoryOverview() {
        const tasks = loadTasks();

        document.getElementById("totalCategories").textContent =
            categories.length;

        document.getElementById("totalCategoryTasks").textContent =
            tasks.length;
    }

    // Display category cards
    function displayCategories() {

        categoryGrid.innerHTML = "";

        categories.forEach(category => {

            const card = document.createElement("div");

            card.className = "category-card";

            const count = getCategoryTaskCount(category.name);

            card.innerHTML = `
                <div class="category-card-top">

                    <div class="category-icon">
                        <i class="bi ${escapeHTML(category.icon)}"></i>
                    </div>

                    <div class="category-menu">

                        <button
                            type="button"
                            data-action="edit"
                            data-name="${escapeHTML(category.name)}"
                            title="Edit category"
                            aria-label="Edit category"
                        >
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button
                            type="button"
                            data-action="delete"
                            data-name="${escapeHTML(category.name)}"
                            title="Delete category"
                            aria-label="Delete category"
                        >
                            <i class="bi bi-trash"></i>
                        </button>

                    </div>

                </div>

                <h3>${escapeHTML(category.name)}</h3>

                <p>Organise your ${escapeHTML(category.name.toLowerCase())} tasks.</p>

                <div class="category-card-bottom">

                    <span class="category-task-count">
                        ${count} ${count === 1 ? "Task" : "Tasks"}
                    </span>

                    <button
                        type="button"
                        class="view-category-button"
                        data-action="view"
                        data-name="${escapeHTML(category.name)}"
                    >
                        View Tasks
                    </button>

                </div>
            `;

            categoryGrid.appendChild(card);
        });

        updateCategoryOverview();
    }

    // Clear category form
    function clearCategoryForm() {
        categoryForm.reset();
        categoryOriginalName.value = "";
        categoryIconInput.value = "bi-book";
    }

    // Open Add Category modal
    openCategoryModal.addEventListener("click", function () {

        clearCategoryForm();

        categoryModalTitle.textContent = "Add New Category";
        saveCategoryButton.textContent = "Save Category";

        categoryModal.show();
    });

    // Save or update category
    categoryForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const newName = categoryNameInput.value.trim();
        const newIcon = categoryIconInput.value;
        const oldName = categoryOriginalName.value;

        if (!newName) {
            alert("Please enter a category name.");
            return;
        }

        // Prevent duplicate category names
        const duplicate = categories.some(category =>
            category.name.toLowerCase() === newName.toLowerCase() &&
            category.name !== oldName
        );

        if (duplicate) {
            alert("This category already exists.");
            return;
        }

        if (oldName) {

            // Update existing category
            categories = categories.map(category => {

                if (category.name === oldName) {
                    return {
                        name: newName,
                        icon: newIcon
                    };
                }

                return category;
            });

            // Update category name in existing tasks
            const tasks = loadTasks().map(task => {

                if (task.category === oldName) {
                    return {
                        ...task,
                        category: newName
                    };
                }

                return task;
            });

            saveTasks(tasks);

            if (selectedCategory === oldName) {
                selectedCategory = newName;
            }

        } else {

            // Add new category
            categories.push({
                name: newName,
                icon: newIcon
            });
        }

        saveCategories();
        displayCategories();

        if (selectedCategory) {
            displayCategoryTasks(selectedCategory);
        }

        categoryModal.hide();
        clearCategoryForm();
    });

    // Handle category Edit, Delete and View buttons
    categoryGrid.addEventListener("click", function (event) {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const action = button.dataset.action;
        const name = button.dataset.name;

        const category = categories.find(item =>
            item.name === name
        );

        if (!category) return;

        // Edit category
        if (action === "edit") {

            categoryOriginalName.value = category.name;
            categoryNameInput.value = category.name;
            categoryIconInput.value = category.icon;

            categoryModalTitle.textContent = "Edit Category";
            saveCategoryButton.textContent = "Update Category";

            categoryModal.show();
        }

        // Delete category
        if (action === "delete") {

            if (name === "Others") {
                alert("The Others category cannot be deleted.");
                return;
            }

            const confirmDelete = confirm(
                `Delete "${name}"? Tasks in this category will be moved to Others.`
            );

            if (!confirmDelete) return;

            // Move related tasks to Others
            const tasks = loadTasks().map(task => {

                if (task.category === name) {
                    return {
                        ...task,
                        category: "Others"
                    };
                }

                return task;
            });

            saveTasks(tasks);

            categories = categories.filter(item =>
                item.name !== name
            );

            if (selectedCategory === name) {
                selectedCategory = null;
                resetCategoryTaskView();
            }

            saveCategories();
            displayCategories();

            if (selectedCategory === "Others") {
                displayCategoryTasks("Others");
            }
        }

        // View tasks in selected category
        if (action === "view") {

            selectedCategory = name;
            displayCategoryTasks(name);
        }
    });

    // Display tasks belonging to selected category
    function displayCategoryTasks(categoryName) {

        const tasks = loadTasks().filter(task =>
            task.category === categoryName
        );

        document.getElementById("selectedCategoryTitle").textContent =
            categoryName + " Tasks";

        document.getElementById("selectedCategoryDescription").textContent =
            "Tasks assigned to " + categoryName + ".";

        categoryTaskList.innerHTML = "";

        categoryEmptyMessage.classList.toggle(
            "show",
            tasks.length === 0
        );

        tasks.forEach(task => {

            let statusClass = "";

            if (task.status === "Completed") {
                statusClass = "completed";
            } else if (task.status === "In Progress") {
                statusClass = "in-progress";
            }

            const item = document.createElement("div");

            item.className = "category-task-item";

            item.innerHTML = `
                <div>
                    <strong>${escapeHTML(task.title)}</strong>

                    <small>
                        Due: ${escapeHTML(task.dueDate || "-")} ·
                        ${escapeHTML(task.priority || "Medium")} Priority
                    </small>
                </div>

                <span class="category-task-status ${statusClass}">
                    ${escapeHTML(task.status || "Pending")}
                </span>
            `;

            categoryTaskList.appendChild(item);
        });
    }

    // Clear selected category view
    function resetCategoryTaskView() {

        selectedCategory = null;

        document.getElementById("selectedCategoryTitle").textContent =
            "Category Tasks";

        document.getElementById("selectedCategoryDescription").textContent =
            "Tasks assigned to this category";

        categoryTaskList.innerHTML = "";
        categoryEmptyMessage.classList.remove("show");
    }

    document.getElementById("clearCategoryView").addEventListener(
        "click",
        resetCategoryTaskView
    );

    // Initial display
    saveCategories();
    displayCategories();

})();


/* ==============================
   REPORTS PAGE
================================ */

(function () {
    const statusCanvas = document.getElementById("statusChart");

    // Only run this code on Reports page
    if (!statusCanvas) return;

    const tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];
    const savedCategories = JSON.parse(localStorage.getItem("taskflowCategories")) || [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedTasks = tasks.filter(task =>
        String(task.status || "").toLowerCase() === "completed"
    );

    const pendingTasks = tasks.filter(task =>
        String(task.status || "").toLowerCase() === "pending"
    );

    const inProgressTasks = tasks.filter(task =>
        String(task.status || "").toLowerCase() === "in progress"
    );

    const overdueTasks = tasks.filter(task => {
        if (!task.dueDate) return false;

        const dueDate = new Date(task.dueDate + "T00:00:00");

        return dueDate < today &&
            String(task.status || "").toLowerCase() !== "completed";
    });

    const totalTasks = tasks.length;
    const completionRate = totalTasks === 0
        ? 0
        : Math.round((completedTasks.length / totalTasks) * 100);

    // Display report date
    document.getElementById("reportDate").textContent =
        today.toLocaleDateString("en-MY", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    // Update summary cards
    document.getElementById("reportTotal").textContent = totalTasks;
    document.getElementById("reportCompleted").textContent = completedTasks.length;
    document.getElementById("reportPending").textContent = pendingTasks.length;
    document.getElementById("reportOverdue").textContent = overdueTasks.length;

    // Update completion rate
    document.getElementById("completionRate").textContent = completionRate + "%";
    document.getElementById("summaryCompletionRate").textContent = completionRate + "%";
    document.getElementById("completionProgress").style.width = completionRate + "%";

    document.getElementById("inProgressCount").textContent =
        inProgressTasks.length;

    // Chart colors
    const chartColors = {
        completed: "#A8B99A",
        pending: "#E99A91",
        progress: "#E9D5CB",
        other: "#D8D0C6"
    };

    // Task Status Doughnut Chart
    new Chart(statusCanvas, {
        type: "doughnut",
        data: {
            labels: ["Completed", "Pending", "In Progress"],
            datasets: [{
                data: [
                    completedTasks.length,
                    pendingTasks.length,
                    inProgressTasks.length
                ],
                backgroundColor: [
                    chartColors.completed,
                    chartColors.pending,
                    chartColors.progress
                ],
                borderWidth: 0,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "68%",
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Custom legend
    document.getElementById("statusLegend").innerHTML = `
        <div class="legend-item">
            <span class="legend-dot" style="background:${chartColors.completed}"></span>
            Completed
        </div>
        <div class="legend-item">
            <span class="legend-dot" style="background:${chartColors.pending}"></span>
            Pending
        </div>
        <div class="legend-item">
            <span class="legend-dot" style="background:${chartColors.progress}"></span>
            In Progress
        </div>
    `;

    // Weekly tasks by due date
    const weekStart = new Date(today);
    const dayNumber = (today.getDay() + 6) % 7;
    weekStart.setDate(today.getDate() - dayNumber);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const weeklyCounts = weekdays.map((day, index) => {
        const currentDate = new Date(weekStart);
        currentDate.setDate(weekStart.getDate() + index);

        return tasks.filter(task => {
            if (!task.dueDate) return false;

            const dueDate = new Date(task.dueDate + "T00:00:00");

            return dueDate.getTime() === currentDate.getTime();
        }).length;
    });

    new Chart(document.getElementById("weeklyChart"), {
        type: "bar",
        data: {
            labels: weekdays,
            datasets: [{
                label: "Tasks",
                data: weeklyCounts,
                backgroundColor: "#E99A91",
                borderRadius: 7,
                maxBarThickness: 35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        color: "#91877F"
                    },
                    grid: {
                        color: "#F1ECE6"
                    }
                },
                x: {
                    ticks: {
                        color: "#91877F"
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Tasks by Category Chart
    const categoryNames = savedCategories.map(category =>
        typeof category === "string" ? category : category.name
    ).filter(Boolean);

    tasks.forEach(task => {
        const name = task.category || "Others";

        if (!categoryNames.includes(name)) {
            categoryNames.push(name);
        }
    });

    if (categoryNames.length === 0) {
        categoryNames.push("No categories");
    }

    const categoryCounts = categoryNames.map(category =>
        tasks.filter(task => (task.category || "Others") === category).length
    );

    new Chart(document.getElementById("categoryChart"), {
        type: "bar",
        data: {
            labels: categoryNames,
            datasets: [{
                label: "Tasks",
                data: categoryCounts,
                backgroundColor: [
                    "#E99A91",
                    "#A8B99A",
                    "#E9D5CB",
                    "#D8C5B7",
                    "#C8B7A8",
                    "#B9C7AD"
                ],
                borderRadius: 7,
                maxBarThickness: 35
            }]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        color: "#91877F"
                    },
                    grid: {
                        color: "#F1ECE6"
                    }
                },
                y: {
                    ticks: {
                        color: "#91877F"
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Most used category
    const categoryWithMostTasks = categoryNames
        .map((name, index) => ({
            name: name,
            count: categoryCounts[index]
        }))
        .filter(category => category.count > 0)
        .sort((a, b) => b.count - a.count)[0];

    document.getElementById("mostUsedCategory").textContent =
        categoryWithMostTasks ? categoryWithMostTasks.name : "No tasks yet";

})();

/* ==============================
   MY PROFILE PAGE
================================= */

(function () {
    const profileForm = document.getElementById("profileForm");

    // Only run on My Profile page
    if (!profileForm) return;

    const fullNameInput = document.getElementById("fullName");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");

    const displayName = document.getElementById("profileDisplayName");
    const displayUsername = document.getElementById("profileDisplayUsername");

    const editButton = document.getElementById("editProfileBtn");
    const cancelButton = document.getElementById("cancelProfileBtn");
    const formActions = document.getElementById("profileFormActions");
    const feedback = document.getElementById("profileFeedback");

    const defaultProfile = {
        fullName: "Admin",
        username: "admin",
        email: "",
        phone: ""
    };

    let profile = JSON.parse(localStorage.getItem("taskflowProfile")) || defaultProfile;

    function displayProfile() {
        fullNameInput.value = profile.fullName || "";
        usernameInput.value = profile.username || "admin";
        emailInput.value = profile.email || "";
        phoneInput.value = profile.phone || "";

        displayName.textContent = profile.fullName || "Admin";
        displayUsername.textContent = "@" + (profile.username || "admin");
    }

    function setEditing(isEditing) {
        fullNameInput.disabled = !isEditing;
        emailInput.disabled = !isEditing;
        phoneInput.disabled = !isEditing;

        editButton.hidden = isEditing;
        formActions.hidden = !isEditing;

        if (isEditing) {
            feedback.textContent = "";
            fullNameInput.focus();
        }
    }

    function cancelEditing() {
        displayProfile();
        setEditing(false);
        feedback.textContent = "";
    }

    // Load saved profile
    displayProfile();

    // Enable editing
    editButton.addEventListener("click", function () {
        setEditing(true);
    });

    // Cancel changes
    cancelButton.addEventListener("click", function () {
        cancelEditing();
    });

    // Save profile changes
    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const updatedName = fullNameInput.value.trim();
        const updatedEmail = emailInput.value.trim();

        if (!updatedName) {
            feedback.style.color = "#D98279";
            feedback.textContent = "Please enter your full name.";
            fullNameInput.focus();
            return;
        }

        if (updatedEmail && !emailInput.checkValidity()) {
            feedback.style.color = "#D98279";
            feedback.textContent = "Please enter a valid email address.";
            emailInput.focus();
            return;
        }

        profile = {
            fullName: updatedName,
            username: profile.username || "admin",
            email: updatedEmail,
            phone: phoneInput.value.trim()
        };

        localStorage.setItem("taskflowProfile", JSON.stringify(profile));

        displayProfile();
        setEditing(false);

        feedback.style.color = "#78936B";
        feedback.textContent = "Profile updated successfully!";
    });

})();

/* ==============================
   TASKFLOW LOGOUT & LOGIN PROTECTION
================================= */

(function () {

    // Check whether the current page is the Login page
    const currentPage = window.location.pathname.split("/").pop();
    const isLoginPage = currentPage === "" || currentPage === "index.html";

    // Protect internal pages from users who are not logged in
    if (!isLoginPage) {
        const isLoggedIn = sessionStorage.getItem("taskflowLoggedIn") === "true";

        if (!isLoggedIn) {
            window.location.replace("index.html");
            return;
        }
    }

    // Create the logout confirmation modal
    const modalHTML = `
        <div class="modal fade" id="logoutConfirmationModal" tabindex="-1"
             aria-labelledby="logoutModalTitle" aria-hidden="true">

            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content taskflow-logout-modal">

                    <div class="modal-body text-center">

                        <div class="logout-modal-icon">
                            <i class="bi bi-box-arrow-right"></i>
                        </div>

                        <h5 id="logoutModalTitle">Confirm Logout</h5>

                        <p>Are you sure you want to log out of your TaskFlow account?</p>

                        <div class="logout-modal-actions">
                            <button type="button" class="logout-cancel-button"
                                    data-bs-dismiss="modal">
                                Cancel
                            </button>

                            <button type="button" class="logout-confirm-button"
                                    id="confirmLogoutBtn">
                                Yes, Logout
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to the page
    if (!document.getElementById("logoutConfirmationModal")) {
        document.body.insertAdjacentHTML("beforeend", modalHTML);
    }

    const logoutModalElement = document.getElementById("logoutConfirmationModal");

    // Open confirmation modal when Logout is clicked
    document.addEventListener("click", function (event) {
        const logoutLink = event.target.closest("#logoutLink");

        if (!logoutLink) return;

        event.preventDefault();

        if (typeof bootstrap !== "undefined") {
            const logoutModal = bootstrap.Modal.getOrCreateInstance(logoutModalElement);
            logoutModal.show();
        }
    });

    // Confirm logout
    document.getElementById("confirmLogoutBtn").addEventListener("click", function () {

        // Clear login session
        sessionStorage.removeItem("taskflowLoggedIn");
        sessionStorage.removeItem("taskflowCurrentUser");

        // Redirect to Login page
        window.location.replace("index.html");
    });

})();

// ==============================
// TASKFLOW DARK / LIGHT MODE
// ==============================

(function () {

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const themeText = document.getElementById("themeText");

    // Get saved theme
    let currentTheme = localStorage.getItem("taskflowTheme") || "light";

    function applyTheme(theme) {

        document.body.classList.toggle("dark-mode", theme === "dark");

        if (themeIcon && themeText) {

            if (theme === "dark") {
                themeIcon.className = "bi bi-moon";
                themeText.textContent = "Dark Mode";
            } else {
                themeIcon.className = "bi bi-sun";
                themeText.textContent = "Light Mode";
            }
        }
    }

    // Apply theme when page loads
    applyTheme(currentTheme);

    // Toggle theme
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {

            currentTheme = currentTheme === "light" ? "dark" : "light";

            localStorage.setItem("taskflowTheme", currentTheme);

            applyTheme(currentTheme);
        });
    }

})();
