const API_BASE_URL = window.API_BASE_URL || 'http://localhost:8080/api/todos';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const errorEl = document.getElementById('error');
const emptyState = document.getElementById('empty-state');
const countEl = document.getElementById('todo-count');

function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
}

function clearError() {
    errorEl.classList.add('hidden');
}

async function fetchTodos() {
    try {
        const res = await fetch(API_BASE_URL);
        if (!res.ok) throw new Error('Ro\'yxatni yuklab bo\'lmadi');
        const todos = await res.json();
        renderTodos(todos);
        clearError();
    } catch (err) {
        showError(err.message);
    }
}

function renderTodos(todos) {
    list.innerHTML = '';

    emptyState.classList.toggle('hidden', todos.length > 0);

    const remaining = todos.filter(t => !t.completed).length;
    countEl.textContent = todos.length === 0
        ? '0 ta vazifa'
        : `${remaining} ta qoldi / ${todos.length} ta jami`;

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo));

        const span = document.createElement('span');
        span.textContent = todo.title;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.setAttribute('aria-label', "O'chirish");
        deleteBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        li.append(checkbox, span, deleteBtn);
        list.appendChild(li);
    });
}

async function addTodo(title) {
    try {
        const res = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        if (!res.ok) throw new Error('Qo\'shib bo\'lmadi');
        await fetchTodos();
    } catch (err) {
        showError(err.message);
    }
}

async function toggleTodo(todo) {
    try {
        const res = await fetch(`${API_BASE_URL}/${todo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !todo.completed })
        });
        if (!res.ok) throw new Error('Yangilab bo\'lmadi');
        await fetchTodos();
    } catch (err) {
        showError(err.message);
    }
}

async function deleteTodo(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('O\'chirib bo\'lmadi');
        await fetchTodos();
    } catch (err) {
        showError(err.message);
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    addTodo(title);
    input.value = '';
});

fetchTodos();
