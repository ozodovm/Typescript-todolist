let eForm = document.querySelector(".form");
let eList = document.querySelector(".list");


let eDeleteAllBtn = document.createElement("button");
eDeleteAllBtn.className = "bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md transition-all duration-300 mt-5";
eDeleteAllBtn.textContent = "Delete All Completed";
eDeleteAllBtn.className = "bg-red-500 mx-auto hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md transition-all duration-300 mt-5";
eDeleteAllBtn.style.display = "none";
eDeleteAllBtn.addEventListener("click", handleDeleteAllCompleted);
document.body.appendChild(eDeleteAllBtn);

interface TodosType {
  id: number;
  title: string;
  isCompleted: boolean;
}

function saveStorage(key: string, data: string | Array<TodosType>): void {
  if (Array.isArray(data)) {
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    localStorage.setItem(key, data);
  }
}

function getStorage(key: string) {
  const data = localStorage.getItem(key);
  if (data && typeof JSON.parse(data) !== "string") {
    return JSON.parse(data);
  } else if (data) {
    return data;
  }
}

let todos: Array<TodosType> = getStorage("todos") || [];

eForm?.addEventListener("submit", function (e: Event) {
  e.preventDefault();
  const target = e.target as HTMLFormElement;
  const data: TodosType = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    title: target.todo.value,
    isCompleted: false,
  };
  todos.push(data);
  saveStorage("todos", todos);
  renderTodos(todos);
  target.reset();
});

function renderTodos(arr: Array<TodosType>): void {
  if (eList) {
    eList.innerHTML = "";
    arr.forEach((item: TodosType, index: number) => {
      let elItem = document.createElement("li");
      elItem.className =
        "bg-white p-4 rounded-lg shadow-md flex items-center justify-between hover:bg-gray-100 transition-colors duration-300";
      elItem.innerHTML = `
        <div class="flex items-center space-x-3">
          <input type="checkbox" id="todo-${index}" ${item.isCompleted ? "checked" : ""} onchange="handleToggle(${item.id})"/>
          <span class="text-gray-500">${index + 1}.</span>
          <strong class="text-gray-800 ${item.isCompleted ? 'line-through' : ''}">${item.title}</strong>
        </div>
        <div class="flex space-x-2">
          <button onclick="handleEdit(${item.id})" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-md transition-all duration-300">Update</button>
          <button onclick="handleDelete(${item.id})" class="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-4 py-2 rounded-md transition-all duration-300">Delete</button>
        </div>
      `;
      eList?.appendChild(elItem);
    });

    toggleDeleteAllButton();
  }
}

function toggleDeleteAllButton(): void {
  const hasCompletedTodos = todos.some((todo) => todo.isCompleted);
  if (hasCompletedTodos) {
    eDeleteAllBtn.style.display = "block";
  } else {
    eDeleteAllBtn.style.display = "none";
  }
}

function handleDelete(id: number) {
  const deleteIndex = todos.findIndex((item: TodosType) => item.id == id);
  todos.splice(deleteIndex, 1);
  renderTodos(todos);
  saveStorage("todos", todos);
}

function handleToggle(id: number) {
  const todoIndex = todos.findIndex((item: TodosType) => item.id === id);
  if (todoIndex > -1) {
    todos[todoIndex].isCompleted = !todos[todoIndex].isCompleted;
    saveStorage('todos', todos);
    renderTodos(todos);
  }
}

function handleEdit(id: number) {
  const todoIndex = todos.findIndex((item: TodosType) => item.id == id);
  const todo = todos[todoIndex];

  const editForm = document.createElement('div');
  editForm.innerHTML = `
    <input type="text" value="${todo.title}" class="edit-input p-2 border border-gray-300 rounded w-full mb-2"/>
    <button class="save-button bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded">Save</button>
  `;
  editForm.className = 'edit-form flex items-center space-x-2';

  const listItem = eList?.children[todoIndex];
  if (listItem) {
    listItem.innerHTML = ''; 
    listItem.appendChild(editForm);
  }

  const editInput = editForm.querySelector('.edit-input') as HTMLInputElement;
  const saveButton = editForm.querySelector('.save-button');

  saveButton?.addEventListener('click', () => {
    todo.title = editInput.value;
    todos[todoIndex] = todo;
    saveStorage('todos', todos);
    renderTodos(todos);
  });
}

function handleDeleteAllCompleted() {
  todos = todos.filter(todo => !todo.isCompleted);
  saveStorage('todos', todos);
  renderTodos(todos);
}

renderTodos(todos);