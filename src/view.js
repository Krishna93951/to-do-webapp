'use strict';
var viewModule = (function () {
    
    
    function _View(rootElementId) {
        this.rootElement = document.querySelector(rootElementId);
    }

    _View.prototype.initialize = function () {
        this.createAppContainer();
        this.createAppTitle();
        this.createInputContainer();
        this.createTextBox();
        this.createAddButton();
        this.createStorageSelector();
        this.createToDoList();
        this.createDeleteButton(); -
            this.createAppFooter();
    }

    _View.prototype.createAppContainer = function () {
        var appContainer = createElement('div', { class: 'main' });
        this.appendRootElement(appContainer);
    }

    _View.prototype.createAppTitle = function () {
        var title = createElement('p', { class: 'header' });
        title.innerText = 'To-do List';
        this.appendAppContainer(title);
    }

    _View.prototype.createAppFooter = function () {
        var itemCount = createElement('p', { class: 'taskCount' });
        this.appendRootElement(itemCount);
    }

    _View.prototype.createInputContainer = function () {
        var inputContainer = createElement('div', { class: 'inputContainer' });
        this.appendAppContainer(inputContainer);
    }

    _View.prototype.createTextBox = function () {
        var textbox = createElement('input', { class: ' inputField', maxlength: '40', placeholder: 'Enter your Todo ....' })
        this.appendInputContainer(textbox);
    }

    _View.prototype.createStorageSelector = function () {
        var dropdown = createElement('select', { class: 'storageDropdown' });
        this.appendStorageTypes(dropdown);
        this.attachStorageSelectorEvent(dropdown);
        this.appendInputContainer(dropdown);
    }

    _View.prototype.appendStorageTypes = function (dropdown) {
        var options = ['LocalStorage', 'SessionStorage', 'WebAPI'];
        var option;
        for (var i = 0; i < options.length; i++) {
            option = createElement('option', { value: options[i] })
            option.innerText = options[i];
            dropdown.appendChild(option);
        }
    }

    _View.prototype.attachStorageSelectorEvent = function (dropdown) {
        var _this = this;
        var dropdownEvent = new Event('onStorageChange');
        dropdown.addEventListener('change', function () {
            _this.rootElement.dispatchEvent(dropdownEvent);
        });
    }

    _View.prototype.createAddButton = function () {
        var addButton = createElement('button', { class: 'addBtn' });
        addButton.innerText = 'Add';
        this.bindAddButton(addButton);
        this.appendInputContainer(addButton);
    }

    _View.prototype.bindAddButton = function (addButton) {
        var _this = this;
        var addButtonEvent = new Event('onAdd');
        addButton.addEventListener('click', function () {
            _this.rootElement.dispatchEvent(addButtonEvent);
        })
    }

    _View.prototype.createToDoList = function () {
        var list = createElement('ul', { class: 'todoList' });
        this.appendAppContainer(list);
    }

    _View.prototype.createDeleteButton = function () {
        var deleteCompletedTasks = createElement('button', { class: 'delete-completed-task-button' });
        deleteCompletedTasks.innerText = 'Delete Completed ';
        this.attachEventToDeleteButton(deleteCompletedTasks);
        this.appendAppContainer(deleteCompletedTasks);
    }

    _View.prototype.attachEventToDeleteButton = function (deleteCompletedTasks) {
        var _this = this;
        var deleteEvent = new Event('onCompletedTasks');
        deleteCompletedTasks.addEventListener('click', function () {
            _this.rootElement.dispatchEvent(deleteEvent);
        })
    }

    _View.prototype.appendAppContainer = function (element) {
        this.rootElement.querySelector('.main').append(element);
    }

    _View.prototype.appendInputContainer = function (element) {
        this.rootElement.querySelector('.inputContainer').append(element);
    }

    _View.prototype.appendRootElement = function (element) {
        this.rootElement.append(element);
    }

    _View.prototype.createListElements = function (id, input, status) {
        var li = createElement('li', { class: 'listItem' });
        var taskDetails = {
            id: id,
            taskTitle: input,
            status: status,
        }
        this.appendItemToList(li, taskDetails);
    }

    _View.prototype.appendItemToList = function (li, taskDetails) {
        li.append(this.createCheckbox(taskDetails.status, taskDetails.id), this.createTaskTitle(taskDetails.taskTitle, taskDetails.id), this.createTaskDeletionButton(li, taskDetails.id));
        this.rootElement.querySelector('.todoList').append(li);
    }

    _View.prototype.createCheckbox = function (status, id) {
        var selectionBox = createElement('input', { type: 'checkbox', class: 'toggleStatusBox' });
        selectionBox.checked = status;
        this.attachEventToCheckbox(selectionBox, id, selectionBox);
        return selectionBox;
    }

    _View.prototype.attachEventToCheckbox = function (selectionBox, id, status) {
        var _this = this;
        var checkboxEvent = new CustomEvent('onCheckbox', { detail: { id: id, checkbox: selectionBox } });
        selectionBox.addEventListener('change', function () {
            _this.rootElement.dispatchEvent(checkboxEvent);
        })
    }

    _View.prototype.createTaskTitle = function (inputField, id) {
        var spanElement = createElement('span', { id: id });
        spanElement.innerText = inputField;
        return spanElement;
    }

    _View.prototype.createTaskDeletionButton = function (li, id) {
        var deleteTask = createElement('button', { class: 'deleteTask' });
        deleteTask.innerText = 'X';
        this.attachEventToDeleteTask(li, deleteTask, id)
        return deleteTask;
    }


    _View.prototype.attachEventToDeleteTask = function (li, deleteTask, id) {
        var _this = this;
        var delTask = new CustomEvent('deleteItem', { detail: { id: id, name: li } });
        deleteTask.addEventListener('click', function () {
            _this.rootElement.dispatchEvent(delTask);
        })
    }

    _View.prototype.clearTextField = function () {
        var textField = this.rootElement.querySelector('.inputField');
        textField.value = '';
        this.focusTextField(textField);

    }

    _View.prototype.focusTextField = function (textField) {
        textField.focus();
    }

    _View.prototype.clearToDoList = function () {
        this.rootElement.querySelector('.todoList').innerText = '';
    }

    _View.prototype.displayTotalTasksCount = function (totalCount) {
        this.rootElement.querySelector('.taskCount').innerText = totalCount;
    }

    _View.prototype.displayTasks = function (taskData) {
        var _this = this;
        taskData.forEach(function (taskData) {
            _this.createListElements(taskData.order, taskData.title, taskData.completed, taskData.url);
        });
    }

    _View.prototype.getStorageType = function () {
        return this.rootElement.querySelector('.storageDropdown').value;
    }

    _View.prototype.getInputFieldValue = function () {
        return this.rootElement.querySelector('.inputField').value;
    }

    return {
       instance: _View
    }
})();