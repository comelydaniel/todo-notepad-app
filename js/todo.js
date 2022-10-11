const user = document.getElementById('user')
const categoryContainer =  document.getElementById('category-list');
const categoryForm =  document.getElementById('category-form');
const inputCategory =  document.getElementById('input-category');
const deleteCategory = document.getElementById('delete-category')
const taskContainer =  document.getElementById('main-list');
const categoryTitle =  document.getElementById('category-title');
const taskCount =  document.getElementById('task-count');
const taskList =  document.getElementById('todo-list');
const taskForm =  document.getElementById('task-form');
const inputTask =  document.getElementById('input-todo');
const deleteCheckedTask = document.getElementById('clear-checked');
const taskTemplate = document.getElementById('task-template');


console.log(taskTemplate)

const LOCAL_STORAGE_LISTS_KEY = "category.list";
const LOCAL_STORAGE_SELECTED_LIST_KEY = "category.selectedId";
const LOCAL_STORAGE_USER_KEY = 'user.name';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LISTS_KEY)) || [];
let selectedId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY);
let userName = localStorage.getItem(LOCAL_STORAGE_USER_KEY) || prompt('enter your name');

welcome(`${userName}`)

function welcome(username) {
    user.innerHTML = username
    saveToStorage()
}

categoryForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const categoryName = inputCategory.value;
    if(categoryName === null || categoryName === "") return;
    const categoryItem = createProperties(categoryName);
    inputCategory.value = null;
    lists.push(categoryItem);
    renderAndSave()
})

taskForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const taskName = inputTask.value;
    if(taskName === null || taskName === "") return;
    const task = createPropertiesTask(taskName);
    inputTask.value = null;
    const selectedCategory = lists.find(list => list.id === selectedId)
    selectedCategory.tasks.push(task);
    renderAndSave()
})

function renderAndSave() {
    saveToStorage()
    render()
}

function renderCategory() {
    lists.forEach(list => {
        const category = document.createElement('li');
        category.dataset.listid = list.id;
        category.classList.add = ('category-item');
        category.innerText = list.name;
        if (list.id === selectedId) {
            category.classList.add = ('active-category')
        }
        categoryContainer.appendChild(category)
    })
}

function render() {
    clearContainer(categoryContainer)
    renderCategory()

    const selectedCategory = lists.find(list => list.id === selectedId)
    console.log(selectedCategory)
    if(selectedId === null) {
        taskContainer.style.visibility = 'hidden'
    } else {
        taskContainer.style.visibility = ''
        categoryTitle.innerText = selectedCategory.name 
        renderTaskList(selectedCategory)
        clearContainer(taskList)
        renderTaskCount(selectedCategory) 
    } 
}

function renderTaskList(selectedCategory) {
    selectedCategory.tasks.forEach(task => {
        console.log(task)
        const taskEl = document.importNode(taskTemplate.content, true)
        console.log(taskTemplate.content, taskEl)
        const checkbox = taskEl.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.status
        const label = taskEl.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        taskList.appendChild(taskEl)
        console.log(taskList)
    })
}

function renderTaskCount(selectedCategory) {
    let taskDone = selectedCategory.tasks.filter(task => !task.status).length
    let taskWord = (taskDone === 1) ? `Task` : `Tasks`
    taskCount.innerText = ` ${taskDone} ${taskWord} Remaining`
}

taskList.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'input') {
        const selectedCategory = lists.find(list => list.id === selectedId)
        console.log
        console.log(selectedCategory.tasks)
        const selectedTask = selectedCategory.tasks.find(task => task.id === e.target.id)
        selectedTask.status = e.target.checked
        saveToStorage()
        renderTaskCount(selectedCategory)
    }
})

categoryContainer.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'li') {
        selectedId = e.target.dataset.listid
        renderAndSave()
    }
})

deleteCheckedTask.addEventListener('click', e => {
    const selectedCategory = lists.find(list => list.id === selectedId)
    selectedCategory.tasks = selectedCategory.tasks.filter(task => !task.status)
    renderAndSave()
})

deleteCategory.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedId)
    selectedId = null
    renderAndSave()
})

function saveToStorage() {
    localStorage.setItem(LOCAL_STORAGE_LISTS_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, selectedId);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, userName);
}

function clearContainer(element) {
    while(element.firstChild) {
      element.removeChild(element.firstChild)
    }
}

function createProperties(name) {
    return {id: Date.now().toString(), name: name, tasks: []}
}

function createPropertiesTask(name) {
    return {id: Date.now().toString(), name: name, status: false}
}

render()

/*waveForm = document.querySelectorAll('.input');

console.log(waveForm)

waveForm.forEach(form => {
    form.addEventListener('click', () => {
        form.classList.add('wave')
    })
})*/


