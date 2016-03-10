//Problem: User interaction doesn't provide desired results.
//Solution: Add interactivty so the user can manage daily tasks.

var taskInput = document.getElementById('new-task'); //new-task
var addButton = document.getElementById('add-button'); //first button
var incompleteTasksHolder = document.getElementById('incomplete-tasks'); //incomplete-tasks
var completedTasksHolder = document.getElementById('completed-tasks'); //completed-tasks

//New Task List Item
var createNewTaskElement = function(taskString) {
  //Create List Item
  var listItem = document.createElement('li');
  
  //input (checkbox)
  var checkBox = document.createElement('input'); // checkbox
  //label
  var label = document.createElement('label');
  //input (text)
  var editInput = document.createElement('input'); // text
  //button.edit
  var editButton = document.createElement('button');
  //button.delete
  var deleteButton = document.createElement('button');
  
  checkBox.type = 'checkbox';
  editInput.type = 'text';
  
  editButton.innerText = 'Edit';
  editButton.className = 'edit';
  deleteButton.innerText = 'Delete';
  deleteButton.className = 'delete';
  
  label.innerText = taskString;
  
  //Each elements, needs modifying
  
  //Each element needs appending
  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  
  return listItem;
}
    
//Add a new task
var addTask = function() {
  //Create a new list item with the text from #new-task
  var listItemValue = taskInput.value;
  var listItem = createNewTaskElement(listItemValue);
  
  //Append listItem to incompleteTasksHolder
  if ( listItemValue.length > 1 ) {
    console.log('Add task...');
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
  }
  
  // Clear out the input when task is added
  taskInput.value = '';
}

//Edit an existing task
var editTask = function() {
  console.log('Edit task...');
  
  var listItem = this.parentNode;
  
  var editInput = listItem.querySelector('input[type=text]');
  var label = listItem.querySelector('label');
  var editButton = listItem.querySelector('button.edit');
  
  var containsClass = listItem.classList.contains('editMode');
  
  //if the class of the parent is .editMode
  if ( containsClass ) {
    //Switch from .editMode
    //label text become the input's value
    label.innerText = editInput.value;
    
    // Set the button's text to Edit
    editButton.innerText = 'Edit';
    
    //Toggle .save on the edit button off
    editButton.classList.toggle('save');
  } else {
    //Switch to .editMode
    //input value becomes the label's text
    editInput.value = label.innerText;
    
    //Change edit button's text to Save
    editButton.innerText = 'Save';
    //Toggle .save to on of the button.edit
    editButton.classList.toggle('save');
  }
  
  //Toggle .editMode on the list item
  listItem.classList.toggle('editMode');
  
}

//Delete an existing task
var deleteTask = function() {
  console.log('Delete task...');
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  
  //Remove the parent list item
  ul.removeChild(listItem);
}
  

//Mark a Task as complete
var taskCompleted = function() {
  console.log('Complete task...');
  //Append the task list item to the #completed-tasks
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
}

//Mark as a Task as incomplete
var taskIncomplete = function() {
  console.log('Incomplete task...');
  //Append the task list item to the #incomplete-tasks
  var listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
}

var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
  console.log('Bind list item events');
  //select taskListItem's children
  var checkBox = taskListItem.querySelector('input[type=checkbox]');
  var editButton = taskListItem.querySelector('button.edit');
  var deleteButton = taskListItem.querySelector('button.delete');
  
    //bind the editTask to edit button
    editButton.onclick = editTask;
  
    //bind deleteTask to delete button
    deleteButton.onclick = deleteTask;
  
    //bind taskCompleted to the checkbox
    checkBox.onchange = checkBoxEventHandler;
}

// Psuedo AJAX Request
var ajaxRequest = function() {
  console.log('AJAX request');
}

//Set the click handler to the addTask function
addButton.addEventListener('click', addTask);
addButton.addEventListener('click', ajaxRequest) ;

//cycle of the incompleteTasksHolder ul list items
for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
  //bind events to list item's children (taskCompleted)
  bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}
    

//cycle of the completeTasksHolder ul list items
for (var i = 0; i < completedTasksHolder.children.length; i++) {
  //bind events to list item's children (taskImcomplete)
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}
