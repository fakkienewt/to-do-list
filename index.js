const btnAdd = document.querySelector('.add');
const input = document.querySelector('#input-add');
const list = document.querySelector('.task-list');
const btn = document.querySelectorAll('.btn');
const deleteEl = document.querySelectorAll('.delete');
const mainEdit = document.querySelector('#main-edit-form');
const closeEdit = document.querySelector('.close-edit');
const editInput = document.querySelector('.edit-input');
document.querySelector('.button-save').addEventListener('click', saveFunc);

let items = JSON.parse(localStorage.getItem("todoItems") ?? '[]');
refreshItems();

let lastId = 0;
let editId;

btnAdd.addEventListener('click', () => {
    if (input.value === '') return;
    create();
    input.value = '';
});

function create() {
    const item = { id: lastId++, text: input.value, done: false };
    items.push(item);
    saveToLocalStorage();
    refreshItems();
};

function refreshItems() {
    list.innerHTML = '';
    items.forEach((item) => {
        list.innerHTML +=
            `<div class="task-item">
        <div class="btn" data-id ="${item.id}">${item.text}
        <input type="checkbox" name="enabled" data-id="${item.id}" class="delete-input input-checkbox"${item.done ? 'checked' : ''}/></div> 
        <div class="button-add">
            <div class="delete" data-id="${item.id}">Delete</div>
            <div class="edit" data-id="${item.id}">Edit</div>
        </div>
        </div>`;
        saveToLocalStorage();
    });
    document.querySelectorAll('.delete').forEach(el => el.addEventListener('click', deleteFunc));
    function deleteFunc() {
        let id = this.getAttribute("data-id");
        items = items.filter(item => item.id != id);
        saveToLocalStorage();
        refreshItems();
    }
    document.querySelectorAll('.edit').forEach(el => el.addEventListener('click', editFunc));
    function editFunc() {
        mainEdit.style.display = 'flex';
        const id = +this.getAttribute("data-id");
        const text = items.find(x => x.id === id).text;
        editInput.value = text;
        editId = id;
        saveToLocalStorage();
        refreshItems();
    }
    document.querySelectorAll('.input-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const id = this.getAttribute("data-id");
            const item = items.find(item => item.id == id); 
            if (item) {
                item.done = this.checked;
                saveToLocalStorage();
                refreshItems();
            }
        });
    });
};

const btnSort = document.querySelector('.sort');
btnSort.addEventListener('click', sortFunc);
function sortFunc() {
    items.sort((a, b) => a.text.localeCompare(b.text));
    saveToLocalStorage();
    refreshItems();
};

function saveFunc() {
    const id = editId;
    const item = items.find(item => item.id === id);
    if (editInput.value === '') return;
    item.text = editInput.value;
    mainEdit.style.display = 'none';
    saveToLocalStorage();
    refreshItems();
};

function saveToLocalStorage() {
    localStorage.setItem('todoItems', JSON.stringify(items));
};

document.querySelector('.close-edit').addEventListener('click', () => mainEdit.style.display = 'none');

