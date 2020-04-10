//Initialize global variables
var formEl = document.querySelector('#task-form');
var tasksToDoEl = document.querySelector('#tasks-to-do');
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector('#tasks-in-progress');
var tasksCompletedEl = document.querySelector('#tasks-completed');
var tasks = [];

var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form.");
        return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute('data-task-id');

    if (isEdit) {
        var taskId = formEl.getAttribute('data-task-id');
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }

    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

    //send data as an argument to createTaskEl
    createTaskEl(taskDataObj);
    }
};

var createTaskEl = function(taskDataObj) {
    //create list items
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';

    //add task id as a custom attribute
    listItemEl.setAttribute('data-task-id', taskIdCounter);
    listItemEl.setAttribute("draggable", "true");

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement('div');
    //give it a class name
    taskInfoEl.className = 'task-info';
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);

    //add entire list  item to list
    listItemEl.appendChild(taskActionsEl);
    if (taskDataObj.status === 'to do') {
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
        tasksToDoEl.appendChild(listItemEl);
    }
    else if (taskDataObj.status === 'in progress') {
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
        tasksInProgressEl.appendChild(listItemEl);
    }
    else if (taskDataObj.status === 'completed') {
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
        tasksCompletedEl.appendChild(listItemEl);
    }

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);
    saveTasks();

    //increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId){
    //create div to contain task actions
    var actionContainerEl = document.createElement('div');
    actionContainerEl.className = 'task-actions';

    //create edit button
    var editButtonEl = document.createElement('button');
    editButtonEl.textContent = 'Edit';
    editButtonEl.className = 'btn edit-btn';
    editButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement('button');
    deleteButtonEl.textContent = 'Delete';
    deleteButtonEl.className = 'btn delete-btn';
    deleteButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //create select drop down
    var statusSelectEl = document.createElement('select');
    statusSelectEl.className = 'select-status';
    statusSelectEl.setAttribute('name', 'status-change');
    statusSelectEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ['To Do', 'In Progress', 'Completed'];

    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement('option');
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute('value', statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

//Handle Edit Press
var editTask = function(taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector('h3.task-name').textContent;
    

    var taskType = taskSelected.querySelector('span.task-type').textContent;
    
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    document.querySelector('#save-task').textContent = "Save Task";

    formEl.setAttribute('data-task-id', taskId);
};

// Push edit of tasks to form

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector('h3.task-name').textContent = taskName;
    taskSelected.querySelector('span.task-type').textContent = taskType;

    //loop through tasks array and task object with new content
    for (var i = 0; i <tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    saveTasks();

    alert("Task Updated!");

    formEl.removeAttribute('data-task-id');
    document.querySelector('#save-task').textContent = "Add Task";
};

// Handle Delete Press
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    var updatedTaskArr = [];
    for (var i = 0; i < tasks.length; i++){
        //if tasks[i].id doesn't match the value of taskId, keep and push
        if (tasks[i].id !== parseInt(taskId)){
            updatedTaskArr.push(tasks[i]);
        }
    }

    tasks = updatedTaskArr;
    saveTasks();
};

var taskButtonHandler = function(event) {
    //get target element from eevent
    var targetEl = event.target;

    //edit button clicked
    if (targetEl.matches('.edit-btn')) {
        var taskId = targetEl.getAttribute('data-task-id');
        editTask(taskId);
    }

    //delete button clicked
    else if (targetEl.matches('.delete-btn')) {
        var taskId = event.target.getAttribute('data-task-id');
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function(event){
    //get the task item's id
    var taskId = event.target.getAttribute('data-task-id');

    //get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === 'to do'){
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === 'in progress') {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === 'completed') {
        tasksCompletedEl.appendChild(taskSelected);
    }

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

var dragTaskHandler = function(event){
    var taskId = event.target.getAttribute('data-task-id');
    event.dataTransfer.setData('text/plain', taskId);
};

var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest('.task-list');
    if (taskListEl) {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};

var dropTaskHandler = function(event){
    var id = event.dataTransfer.getData('text/plain');
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneEl = event.target.closest('.task-list');
    var statusType = dropZoneEl.id;

    //set status of task based on dropZone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");

    if (statusType === 'tasks-to-do') {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === 'tasks-in-progress') {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === 'tasks-completed') {
        statusSelectEl.selectedIndex = 2;
    }

    dropZoneEl.removeAttribute("style");
    dropZoneEl.appendChild(draggableElement);

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    saveTasks();
};

//Function for drag leave function
var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest('.task-list');
    if (taskListEl){
        taskListEl.removeAttribute('style');
    }
};

var saveTasks = function() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

var loadTasks = function() {
    //Get task items from local storage
     var savedTasks = localStorage.getItem('tasks');
    //check for null local storage, if so, assign empty array to tasks
    if (!savedTasks) {
        return false;
    }

    // Convert tasks back into array of objects
    savedTasks = JSON.parse(savedTasks);

    for (var i = 0; i < savedTasks.length; i++) {
    //pass each task object into the createTaskEl() function
    createTaskEl(savedTasks[i]);
    }
};

loadTasks();

//Handle Submit Pushes
formEl.addEventListener('submit', taskFormHandler);
//Handle Edit or Delete
pageContentEl.addEventListener('click', taskButtonHandler);
//Handle Selection Changes
pageContentEl.addEventListener('change', taskStatusChangeHandler)
//Create draggable tasks
pageContentEl.addEventListener('dragstart', dragTaskHandler);
//define drop zone
pageContentEl.addEventListener('dragover', dropZoneDragHandler);
// define drop handling
pageContentEl.addEventListener('drop', dropTaskHandler);
// define drop leave handling
pageContentEl.addEventListener('dragleave', dragLeaveHandler);