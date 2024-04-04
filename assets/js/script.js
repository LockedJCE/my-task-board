// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let time = new Date().getTime();
    let randomNum = Math.floor(Math.random() * 1000);
    return 'task-' + time + '-' + randomNum; 
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let card = $("<div>").addClass("card").attr("id", task.id);
    let cardHeader = $("<div>").addClass("card-header").text(task.title);
    let cardBody = $("<div>").addClass("card-body").text(task.description);
    let cardFooter = $("<div>").addClass("card-footer").text(task.dueDate);
    card.append(cardHeader, cardBody, cardFooter);
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#todo").empty();
    $("#in-progress").empty();
    $("#done").empty();
    taskList.forEach(task => {
        let card = createTaskCard(task);
        if (task.status === "todo") {
            $("#todo").append(card);
        } else if (task.status === "in-progress") {
            $("#in-progress").append(card);
        } else {
            $("#done").append(card);
        }
        card.draggable({
            revert: "invalid",
            start: function(event, ui) {
                $(this).css("z-index", 10000);
            },
            stop: function(event, ui) {
                $(this).css("z-index", "");
            }
        });
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    let title = $("#title").val();
    let description = $("#description").val();
    let dueDate = $("#due-date").val();
    let status = "todo";
    let id = generateTaskId();
    let task = {id, title, description, dueDate, status};
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    $("#add-task-form").trigger("reset");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let taskId = $(this).closest(".card").attr("id");
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = ui.draggable.attr("id");
    let status = $(this).attr("id");
    taskList = taskList.map(task => {
        if (task.id === taskId) {
            task.status = status;
        }
        return task;
    });
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    if (!taskList) {
        taskList = [];
    }
    if (!nextId) {
        nextId = 1;
    }
    renderTaskList();
    $("#add-task-form").on("submit", handleAddTask);
    $(document).on("click", ".card-header", handleDeleteTask);
    $(".lane").droppable({
        accept: ".card",
        drop: handleDrop
    });
    $("#due-date").datepicker();
});
