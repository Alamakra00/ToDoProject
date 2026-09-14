// Логика даты и дня недели
const dayOfWeek = document.querySelector('.dayOfDWeek');
const date = document.querySelector('.date');

const now = new Date();
const daysOfWeek = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];
const dayName = daysOfWeek[now.getDay()];
dayOfWeek.textContent = dayName;

const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];
const monthName = months[now.getMonth()];
date.textContent = now.getDate() + ' ' + monthName;

// Хранилище задач
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let activeTasksList = [];
let finishedTasksList = [];

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

const toDoList = document.getElementById('toDoList');

// создаёт DOM-элемент задачи (без сохранения — только отрисовка)
function createTaskElement(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;

  li.innerHTML = `
    <input type="checkbox" class="checkbox" ${task.done ? 'checked' : ''} />
    <div class="textInLi">
      <p class="timeOfCheck" style="${
        task.done ? 'text-decoration: line-through; opacity: 0.7;' : ''
      }">${task.timeText}</p>
      <p class="toDo" style="${
        task.done ? 'text-decoration: line-through; opacity: 0.7;' : ''
      }">${task.text}</p>
      <button class="delete-button">Delete</button>
    </div>
  `;

  const checkbox = li.querySelector('.checkbox');
  const timeOfCheck = li.querySelector('.timeOfCheck');
  const toDo = li.querySelector('.toDo');
  const deleteBtn = li.querySelector('.delete-button');

  checkbox.addEventListener('change', () => {
    tasks = tasks.map((t) =>
      t.id === task.id ? { ...t, done: checkbox.checked } : t
    );
    saveToLocalStorage();

    if (checkbox.checked) {
      timeOfCheck.setAttribute(
        'style',
        'text-decoration: line-through; opacity: 0.7;'
      );
      toDo.setAttribute(
        'style',
        'text-decoration: line-through; opacity: 0.7;'
      );
      saveToFinishedTasks();
    } else {
      timeOfCheck.setAttribute('style', 'text-decoration: none; opacity: 1;');
      toDo.setAttribute('style', 'text-decoration: none; opacity: 1;');
      saveToActiveTasks();
    }
  });

  deleteBtn.addEventListener('click', () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    saveToLocalStorage();
    li.remove();
  });

  toDoList.appendChild(li);
}

// добавляет новую задачу: сохраняет в массив, в localStorage и отрисовывает
function addTask(timeText, text) {
  const newTask = {
    id: Date.now(),
    timeText,
    text,
    done: false,
  };

  tasks = [...tasks, newTask];
  saveToLocalStorage();
  createTaskElement(newTask);
}

function updateTaskLists(task) {
  if (task.done) {
    activeTasksList = activeTasksList.filter((t) => t.id !== task.id);
    finishedTasksList = [...finishedTasksList, task];
  } else {
    finishedTasksList = finishedTasksList.filter((t) => t.id !== task.id);
    activeTasksList = [...activeTasksList, task];
  }
  saveToLocalStorage();
}

// отрисовка всех задач, сохранённых с прошлого раза
function renderActiveTasks() {
  activeTasksList.forEach((task) => createTaskElement(task));
}
function renderFinishedTasks() {
  finishedTasksList.forEach((task) => createTaskElement(task));
}
function renderSavedTasks() {
  activeTasksList = tasks.filter((task) => !task.done);
  finishedTasksList = tasks.filter((task) => task.done);

  renderActiveTasks();
  renderFinishedTasks();
}

renderSavedTasks();

// всплывающее окно при нажатии на createToDoBtn
const createToDoBtn = document.querySelector('.createTodo');
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');
const cancelBtn = document.getElementById('cancelBtn');
const addBtn = document.getElementById('addBtn');
const descriptionInput = document.getElementById('descriptionInput');
const dateInput = document.getElementById('dateInput');
const reminderToggle = document.getElementById('reminderToggle');

function openModal() {
  modal.classList.add('active');
  overlay.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  overlay.classList.remove('active');
  descriptionInput.value = '';
  dateInput.value = '';
  reminderToggle.checked = false;
}

createToDoBtn.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

addBtn.addEventListener('click', () => {
  const description = descriptionInput.value.trim();
  const rawDate = dateInput.value;

  if (!description || !rawDate) return;

  const dateObj = new Date(rawDate);
  const formattedTime = dateObj.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  addTask(formattedTime, description);
  closeModal();
});

// реализация "ВСЁ,АКТИВНЫЕ,ЗАВЕРШЕННЫЕ"
const allBtn = document.querySelector('.allBtn');
const activeBtn = document.querySelector('.activeBtn');
const finishedBtn = document.querySelector('.finishedBtn');

// Function to clear the current task list in the DOM
function clearTaskList() {
  toDoList.innerHTML = '';
}

// Function to render tasks based on a filtered list
function renderTasks(filteredTasks) {
  clearTaskList();
  filteredTasks.forEach((task) => createTaskElement(task));
}

// Event listener for "All Tasks" button
allBtn.addEventListener('click', () => {
  renderTasks(tasks); // Render all tasks
});

// Event listener for "Active Tasks" button
activeBtn.addEventListener('click', () => {
  const activeTasks = tasks.filter((task) => !task.done); // Filter active tasks
  renderTasks(activeTasks);
});

// Event listener for "Finished Tasks" button
finishedBtn.addEventListener('click', () => {
  const finishedTasks = tasks.filter((task) => task.done); // Filter finished tasks
  renderTasks(finishedTasks);
});
