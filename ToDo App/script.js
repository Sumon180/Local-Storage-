
const taskInput = document.querySelector(".task_input input"),
taskBox = document.querySelector(".task_box"),
clearAll = document.querySelector(".clear_btn"),
filters = document.querySelectorAll(".filters span");

let editId;
let isEditTask = false;

// getting localstorege todo list
let todos = JSON.parse(localStorage.getItem("todo_list"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter){
    let li = "";
    if(todos){
        todos.forEach((todo, id) => {
            //if todo status is complited, set the isCompleted value to checked
            let isComplited = todo.status == "complited" ? "checked" : "";
            if(filter == todo.status || filter == "all"){
                li+= `<li class="task">
                        <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isComplited}>
                            <p class="${isComplited}">${todo.name}</p>
                        </label>
                        <div class="setting">
                            <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                            <ul class="task_menu">
                                <li onclick="editTask(${id}, '${todo.name}')"><i class="fa-sharp fa-solid fa-pen"></i>Edit</li>
                                <li onclick="deleteTask(${id})"><i class="fa-sharp fa-solid fa-trash"></i>Delete</li>
                            </ul>
                        </div>
                  </li>`;
            }
            
        });
    }
    // if li isn't empty, insert this value inside taskbox else insert span
    taskBox.innerHTML = li || `<span>You don't have any task here.</span>`;
}
showTodo("all");

function showMenu(selectedTask){
    //getting task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e =>{
        //removing show class from the task menu on the document click
        if(e.target.tagName != "I" || e.target != selectedTask){
            taskMenu.classList.remove("show");
        }
    });
}

function editTask(taskId, taskName){
    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;
}

function deleteTask(deletId){
    //removing selected task from array/todos
    todos.splice(deletId, 1);
    localStorage.setItem("todo_list", JSON.stringify(todos));
    showTodo("all");
}

clearAll.addEventListener("click", () =>{
    //removing All array/todos
    todos.splice(0, todos.length);
    localStorage.setItem("todo_list", JSON.stringify(todos));
    showTodo("all");
})

function updateStatus(selectedTask){
    // getting paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked){
        taskName.classList.add("checked");
        // updating the status of selected task to complited
        todos[selectedTask.id].status = "complited";
    }else{
        taskName.classList.remove("checked");
        // updating the status of selected task to pending
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo_list", JSON.stringify(todos));
}

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask){
        if(!isEditTask){//if isEditTask isn't true
            if(!todos){ // if todos isn't exist, pass an empty array to todos
                todos = [];
            }
            let taskInfo = {name: userTask, status: "pending"};
            todos.push(taskInfo); //adding new task to todos
        }else{
            isEditTask = false;
            todos[editId].name = userTask;
        }
        
        taskInput.value = ""; //input empty after "enter" key[]
        
        localStorage.setItem("todo_list", JSON.stringify(todos));
        showTodo("all");
    }
});