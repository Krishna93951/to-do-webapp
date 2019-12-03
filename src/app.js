var appModule = (function () {
    'use strict';

    function _App(viewInstance, dataSourceInstance) {
        this.view = viewInstance;
        this.modal = dataSourceInstance;
        this.rootElement = this.view.rootElement;
        this.view.initialize();
        this.selectedOption = this.view.getStorageType();
    }

    _App.prototype.init = function () {
        var view = this.view;
        view.displayTasks(this.modal.getData(this.selectedOption));
        this.renderTasksCount();
        this.attachEvents();
    }

    _App.prototype.attachEvents = function () {
        var this_ = this;
        var event = {
            keypress: function (e) {
                if (e.keyCode === 13) {
                    this_.onAddTask();
                }
            },
            onCheckbox: this.toggleStatus.bind(this),
            onStorageChange: this.onStorageChange.bind(this),
            onAdd: this.onAddTask.bind(this),
            onCompletedTasks: this.onRemoveCompletedTasks.bind(this),
            deleteItem: this.onRemoveTask.bind(this)
        }
        for (var key in event) {
            this.rootElement.addEventListener(key, event[key]);
        }
    }

    _App.prototype.onStorageChange = function () {
        var selectedOption = this.view.getStorageType();
        var dataSource = this.modal;
        var view = this.view;
        view.clearTextField();
        view.clearToDoList();
        if (selectedOption === "WebAPI") {
            dataSource.getData(selectedOption, this.displayWebApiData.bind(this));
        }
        else {
            view.displayTasks(dataSource.getData(selectedOption));
            this.renderTasksCount();
        }
    }

    _App.prototype.onAddTask = function () {
        var view = this.view;
        var inputFieldValue = view.getInputFieldValue();
        var selectedOption = this.selectedOption;
        var dataSource = this.modal;
        if (inputFieldValue) {
            var id = dataSource.addTaskToStorage(inputFieldValue);
            view.createListElements(id, inputFieldValue);
            view.clearTextField();
            if (selectedOption === "WebAPI") {
                dataSource.getData(selectedOption, this.displayWebApiData.bind(this))
            }
            else {
                this.renderTasksCount();
            }
        }
        else {
            var notifyMessage = {
                invalidInput: "Enter Valid Input"
            };
            alert(notifyMessage.invalidInput);
        }
    }

    _App.prototype.displayWebApiData = function (response) {
        var id
        var this_ = this;
        var view = this.view;
        view.clearTextField();
        view.clearToDoList();
        response.forEach(function (response) {
            id = this_.modal.uniqueId(response.url);
            view.createListElements(id, response.title, response.completed);
        });
        this.webApiTaskCount(response)
    }

    _App.prototype.onRemoveTask = function (e) {
        var selectedOption = this.selectedOption;
        var dataSource = this.modal;
        var taskObject = e.detail;
        var itemId = taskObject.id;
        taskObject.name.remove();
        if (selectedOption === "WebAPI") {
            dataSource.deleteItem(itemId, selectedOption);
            dataSource.getData(selectedOption, this.webApiTaskCount.bind(this))
        }
        else {
            var taskData = dataSource.getData(selectedOption);
            dataSource.updateStorage(itemId, taskData);
            dataSource.storeData(taskData, selectedOption);
            this.renderTasksCount();
        }
    }

    _App.prototype.toggleStatus = function (e) {
        var selectedOption = this.selectedOption;
        var dataSource = this.modal;
        var taskObject = e.detail;
        var uniqueId = taskObject.id;
        if (selectedOption === "WebAPI") {
            var status = taskObject.checkbox.checked;
            dataSource.patchItem(uniqueId, selectedOption, status);
            dataSource.getData(selectedOption, this.webApiTaskCount.bind(this));
        }
        else {
            dataSource.updateStatusInStorage(uniqueId, selectedOption);
            this.renderTasksCount();
        }

    }

    _App.prototype.webApiTaskCount = function (response) {
        this.renderTasksCount(response);
    }


    _App.prototype.onRemoveCompletedTasks = function () {
        var selectedOption = this.selectedOption();
        var dataSource = this.modal;
        var view = this.view;
        if (selectedOption === 'WebAPI') {
            dataSource.getData(selectedOption, this.callbackForRemoveCompleted.bind(this));
        }
        else {
            view.clearToDoList();
            view.displayTasks(dataSource.removeCompletedTasksFromStorage(selectedOption))
            this.renderTasksCount();
        }
    }

    _App.prototype.callbackForRemoveCompleted = function (response) {
        var id;
        var selectedOption = this.selectedOption();
        var dataSource = this.modal;
        var completedTask = response.filter(function (taskObject) {
            return taskObject.completed === true;
        })
        completedTask.forEach(function (completedTask) {
            id = dataSource.uniqueId(completedTask.url);
            dataSource.deleteItem(id, selectedOption);
        })
        this.view.clearToDoList();
        dataSource.getData(selectedOption, this.displayWebApiData.bind(this));
    }

    _App.prototype.renderTasksCount = function (APIdata) {
        var selectedOption = this.selectedOption;
        var storageData = selectedOption === "WebAPI" ? APIdata : this.modal.getData(selectedOption);
        var completedTasksCount = this.reckoningTaskCount(storageData);
        var pendingTasksCount = storageData.length - completedTasksCount;
        var countMessage = {
            "All Tasks: ": storageData.length,
            " / Completed Tasks: ": completedTasksCount,
            " / Pending Tasks: ": pendingTasksCount
        }
        var totalCount = '';
        for (var i in countMessage) {
            totalCount += i + countMessage[i];
        }
        this.view.displayTotalTasksCount(totalCount);
    }

    _App.prototype.reckoningTaskCount = function (storageData) {
        var count = 0;
        var arrayLength = storageData.length;
        for (var i = 0; i < arrayLength; i++) {
            if (storageData[i].completed === true) {
                count++
            };
        }
        return count
    }

    function _appInstance(viewInstance, dataSourceInstance) {
        return new _App(viewInstance, dataSourceInstance);
    }

    return {
        instance: _appInstance
    }

})();
