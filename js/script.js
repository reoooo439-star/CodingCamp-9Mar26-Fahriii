// Time and Date Display
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    document.getElementById('time').textContent = timeString;
    document.getElementById('date').textContent = dateString;
}

updateTime();
setInterval(updateTime, 1000);

// Theme Toggle
const theme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', theme);

const themeToggle = document.getElementById('themeToggle');
themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', function() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// To-Do List
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let sortMode = localStorage.getItem('sortMode') || 'default';

document.getElementById('sortSelect').value = sortMode;

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function sortTasks() {
    if (sortMode === 'alphabetical') {
        tasks.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === 'completed') {
        tasks.sort((a, b) => {
            if (a.completed === b.completed) {
                return 0;
            }
            return a.completed ? 1 : -1;
        });
    }
    // 'default' keeps original order
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    sortTasks();
    
    tasks.forEach(function(task, index) {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        
        li.innerHTML = '<input type="checkbox" class="task-checkbox" ' + (task.completed ? 'checked' : '') + 
                   ' onchange="toggleTask(' + index + ')">' +
            '<span class="task-text">' + task.name + '</span>' +
            '<button class="task-delete" onclick="deleteTask(' + index + ')">Delete</button>';
        
        taskList.appendChild(li);
    });
}

function addTask() {
    const input = document.getElementById('taskInput');
    const taskName = input.value.trim();
    
    if (taskName) {
        tasks.push({ name: taskName, completed: false });
        saveTasks();
        renderTasks();
        input.value = '';
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

document.getElementById('addBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
});

document.getElementById('sortSelect').addEventListener('change', function(e) {
    sortMode = e.target.value;
    localStorage.setItem('sortMode', sortMode);
    renderTasks();
});

renderTasks();

// Timer
let timerInterval;
let selectedMinutes = parseInt(localStorage.getItem('timerMinutes')) || 25;
let timeLeft = selectedMinutes * 60;
let isRunning = false;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerDisplay').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function setTimerPreset(minutes) {
    if (!isRunning) {
        selectedMinutes = minutes;
        timeLeft = minutes * 60;
        localStorage.setItem('timerMinutes', minutes);
        updateTimerDisplay();
        
        document.querySelectorAll('.preset-btn').forEach(function(btn) {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.minutes) === minutes) {
                btn.classList.add('active');
            }
        });
    }
}

document.querySelectorAll('.preset-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        setTimerPreset(parseInt(btn.dataset.minutes));
    });
    
    if (parseInt(btn.dataset.minutes) === selectedMinutes) {
        btn.classList.add('active');
    }
});

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(function() {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                pauseTimer();
                alert('Timer completed!');
            }
        }, 1000);
    }
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    timeLeft = selectedMinutes * 60;
    updateTimerDisplay();
}

document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);

updateTimerDisplay();

// Quick Links
let links = JSON.parse(localStorage.getItem('links')) || [
    { name: 'Gmail', url: 'https://gmail.com' },
    { name: 'Calendar', url: 'https://calendar.google.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'YouTube', url: 'https://youtube.com' }
];

function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}

function renderLinks() {
    const linksGrid = document.getElementById('linksGrid');
    linksGrid.innerHTML = '';
    
    links.forEach(function(link, index) {
        const linkCard = document.createElement('div');
        linkCard.className = 'link-card-wrapper';
        
        linkCard.innerHTML = '<a href="' + link.url + '" target="_blank" class="link-card">' + link.name + '</a>' +
            '<button class="link-delete" onclick="deleteLink(' + index + ')">×</button>';
        
        linksGrid.appendChild(linkCard);
    });
}

function addLink() {
    const nameInput = document.getElementById('linkNameInput');
    const urlInput = document.getElementById('linkUrlInput');
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    
    if (name && url) {
        const formattedUrl = url.startsWith('http') ? url : 'https://' + url;
        links.push({ name: name, url: formattedUrl });
        saveLinks();
        renderLinks();
        nameInput.value = '';
        urlInput.value = '';
    }
}

function deleteLink(index) {
    links.splice(index, 1);
    saveLinks();
    renderLinks();
}

document.getElementById('addLinkBtn').addEventListener('click', addLink);
document.getElementById('linkUrlInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addLink();
});

renderLinks();
