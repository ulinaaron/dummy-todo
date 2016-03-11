/**
 * Dummy ToDo App
 * Warning: This is not intended for real world use at this time.
 */

var taskInput = document.getElementById('new-task'); //new-task
var addButton = document.getElementById('add-button'); //first button
var incompleteTasksHolder = document.getElementById('incomplete-tasks'); //incomplete-tasks
var completedTasksHolder = document.getElementById('completed-tasks'); //completed-tasks
var todoItemSet = []; //Create an array to contain todo objects
var storageKey = 'todoItem'; //String used to identify the key in the localStorage

// Generate a unique UUID
// Thanks to: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
var generateUnique = function(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

//Set up the storage with Basil.js
var store = new window.Basil({
    namespace: 'todo-app'
});

var getStore = function() {
    //Get the stored array
    var storeSet = store.get(storageKey);
    
    //Check to see if storage object is created
    if ( storeSet === null ) {
        //Store the array into a localStorage set
        store.set(storageKey, todoItemSet);
    }

    return todoItemSet = storeSet;
}

// Repopulates the localStorage with the todoItemSet array
var updateStore = function() {       
    // Now send the array to the storage
    store.set(storageKey, todoItemSet);
}

var storeTaskItem = function() {
    var todoItem = {
        unique: generateUnique(), // Generate unique id for reference
        // Get the name of the task from the input
        name: taskInput.value,
        // Use status to determine if task is complete or incomplete
        // default: false (incomplete)
        status: false,
    };
    
    // Add the item to the windowed array
    todoItemSet.push(todoItem);
    
    updateStore();
}

// Cycle through all the Items in the storage
var cycleItems = function(item ,callback) {
    var unique = item.getAttribute('data-unique');
    
    // Iterate over the items in the todoItemSet
    for (var i = 0; i < todoItemSet.length; i++ ) {
      // If the stored unique is the same as the data-unique
        if (todoItemSet[i].unique === unique ) {
            callback = callback || function () {}; // Hook for an action
            updateStore(); // Refresh storage
            break;
        }
    }
}


//New Task List Item
var createNewTaskElement = function(taskString, unique) {
  //Create List Item
  var listItem = document.createElement('li');
  
  // Create a data attribute with the uniqueID for easier identifying
  listItem.setAttribute('data-unique', unique);
  
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

// Show current todos in storage
var showTasks = function() {
    
    // Cycle through all the items in the storage
    for (var i = 0; i < todoItemSet.length; i++ ) {
        var storedItemName = todoItemSet[i].name; // Name of the item in storage
        var indexId = i; // Used to match IDs when modifying tasks
        var unique = todoItemSet[i].unique;
        var listItem = createNewTaskElement(storedItemName, unique); // Create the markup using the name in each of the storage objects
        
        // Check the item's status to figure out which holder to append it to
        if ( todoItemSet[i].status ) {
            completedTasksHolder.appendChild(listItem);
            bindTaskEvents(listItem, taskIncomplete, indexId);
        } else {
            incompleteTasksHolder.appendChild(listItem);
            bindTaskEvents(listItem, taskCompleted, indexId);
        }
    }
}
    
// Add a new task
var addTask = function() {
  // Create a new list item with the text from #new-task
  var listItemValue = taskInput.value;
  var listItem = createNewTaskElement(listItemValue);
  
  // Append listItem to incompleteTasksHolder
  if ( listItemValue.length > 1 ) {
    console.log('Add task...');
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
  }
  
  // Add the new item to the storage
  // Needs to be executed before the input text is cleared
  window.storeTaskItem();
  
  // Clear out the input when task is added
  taskInput.value = '';
}

//Edit an existing task
var editTask = function() {
  console.log('Edit task...');
  
  var listItem = this.parentNode;
  var unique = listItem.getAttribute('data-unique');
  
  var editInput = listItem.querySelector('input[type=text]');
  var label = listItem.querySelector('label');
  var editButton = listItem.querySelector('button.edit');
  
  var containsClass = listItem.classList.contains('editMode');
  
  // If the class of the parent is .editMode
  if ( containsClass ) {
    //Switch from .editMode
    //label text become the input's value
    label.innerText = editInput.value;
    
    // Set the button's text to Edit
    editButton.innerText = 'Edit';
    
    //Toggle .save on the edit button off
    editButton.classList.toggle('save');
    
    // Iterate over the items in the todoItemSet
    for (var i = 0; i < todoItemSet.length; i++ ) {
      // If the stored unique is the same as the data-unique
        if (todoItemSet[i].unique === unique ) {
            todoItemSet[this].name = editInput.value; // Update object
            updateStore(); // Refresh storage
            break;
        }
    }
    
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
  var unique = listItem.getAttribute('data-unique');
  
  // Iterate over the items in the todoItemSet
    for (var i = 0; i < todoItemSet.length; i++ ) {
      // If the stored unique is the same as the data-unique
        if (todoItemSet[i].unique === unique ) {
            todoItemSet.splice(i, 1);
            updateStore(); // Refresh storage
            break;
        }
    }

  //Remove the parent list item
  ul.removeChild(listItem);
}
  

//Mark a Task as complete
var taskCompleted = function() {
    console.log('Complete task...');
    
    //Append the task list item to the #completed-tasks
    var listItem = this.parentNode;
    
    var unique = listItem.getAttribute('data-unique');
  
    // Iterate over the items in the todoItemSet
    // ToDo: use a cycle function and have arguement for only the action that needs to be performed
    for (var i = 0; i < todoItemSet.length; i++ ) {
        // If the stored unique is the same as the data-unique
        if (todoItemSet[i].unique === unique ) {
            todoItemSet[i].status = true;
            updateStore(); // Refresh storage
            break;
        }
    }
    
    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);
}

//Mark as a Task as incomplete
var taskIncomplete = function() {
  console.log('Incomplete task...');
  
  //Append the task list item to the #incomplete-tasks
  var listItem = this.parentNode;
  
  var unique = listItem.getAttribute('data-unique');
  
    // Iterate over the items in the todoItemSet
    // ToDo: use a cycle function and have arguement for only the action that needs to be performed
    for (var i = 0; i < todoItemSet.length; i++ ) {
        // If the stored unique is the same as the data-unique
        if (todoItemSet[i].unique === unique ) {
            todoItemSet[i].status = false;
            updateStore(); // Refresh storage
            break;
        }
    }
  
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
    editButton.addEventListener('click', editTask);
  
    //bind deleteTask to delete button
    deleteButton.addEventListener('click', deleteTask);
  
    //bind taskCompleted to the checkbox
    checkBox.addEventListener('change', checkBoxEventHandler);
}

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

// On load we need to populate the todoItemSet with the objects in the localStorage
window.getStore();

// On load we need to populate the markup with objects in the storage key
window.showTasks();

//Set the click handler to the addTask function
addButton.addEventListener('click', addTask);