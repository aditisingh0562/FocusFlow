// ========== TIMER ==========
let isRunning = false;
let session = 'Focus';
let timer;
let timeLeft = 25 * 60;

// 🔊 Audio when timer ends
const chime = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3');

function updateTimeDisplay() {
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');
  document.getElementById('time').textContent = `${mins}:${secs}`;
}

function toggleTimer() {
  if (!isRunning) {
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimeDisplay();
      } else {
        clearInterval(timer);
        chime.play(); // 🔊 Play sound when timer ends
        session = session === 'Focus' ? 'Break' : 'Focus';
        timeLeft = session === 'Focus' ? 25 * 60 : 5 * 60;
        document.getElementById('session-label').textContent = `${session} Time`;
        alert(`${session} time starts now!`);
        toggleTimer();
      }
    }, 1000);
  } else {
    clearInterval(timer);
  }
  isRunning = !isRunning;
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = session === 'Focus' ? 25 * 60 : 5 * 60;
  updateTimeDisplay();
  isRunning = false;
}

updateTimeDisplay();

// ========== TASK MANAGER ==========
const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');

document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed: false })
  });
  const task = await res.json();
  renderTask(task);
  taskInput.value = '';
});

async function loadTasks() {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();
  tasks.forEach(renderTask);
}

function renderTask(task) {
  const li = document.createElement('li');

  // ✅ Add checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.style.marginRight = '10px';
  checkbox.onchange = () => {
    task.completed = checkbox.checked;
    li.classList.toggle('completed', task.completed);
  };

  // Task title
  const span = document.createElement('span');
  span.textContent = task.title;
  if (task.completed) {
    li.classList.add('completed');
  }

  // 🗑️ Delete button
  const btn = document.createElement('button');
  btn.textContent = '🗑️';
  btn.onclick = async () => {
    await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
    li.remove();
  };

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(btn);
  taskList.appendChild(li);
}

loadTasks();
