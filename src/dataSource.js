'use strict';
function LocalStorage(key) {
    this.key = key;
}

LocalStorage.prototype.getData = function () {
    return JSON.parse(localStorage.getItem(this.key)) || [];
}

LocalStorage.prototype.setData = function (data) {
    localStorage.setItem(this.key, JSON.stringify(data));
}

function SessionStorage(key) {
    this.key = key;
}
SessionStorage.prototype.getData = function () {
    return JSON.parse(sessionStorage.getItem(this.key)) || [];
}

SessionStorage.prototype.setData = function (data) {
    sessionStorage.setItem(this.key, JSON.stringify(data));
}


function WebApi() {
    this.url = 'https://todo-backend-express.herokuapp.com/';
    var xhr = new XMLHttpRequest();


    this.getData = function (callback) {
        xhr.open('GET', this.url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(JSON.parse(xhr.response));
            }
        };
        xhr.send();
    }

    this.setData = function (data) {
        xhr.open("POST", this.url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    },

        this.deleteItem = function (id) {
            xhr.open("DELETE", this.url + id, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
        }

    this.toggleItem = function (id, status) {
        xhr.open("PATCH", this.url + id, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({ completed: status }));
    }

}
var dataSourceModule = (function () {
    function DataSource(storageKey) {
        this.key = storageKey;
        this.createStorageInstance = new AbstractDataSource(this.key);
    }

    DataSource.prototype.dataSource = {
        LocalStorage: "LocalStorage",
        SessionStorage: "SessionStorage",
        WebApi: "WebAPI"
    };

    DataSource.prototype.uniqueId = function (item) {
        return item.slice(42, 47);
    }

    DataSource.prototype.getData = function (selectedOption, callback, e) {
        return this.createStorageInstance.getData(selectedOption, callback, e);
    }

    DataSource.prototype.storeData = function (taskData, selectedOption) {
        this.createStorageInstance.setData(taskData, selectedOption);
    }

    DataSource.prototype.deleteItem = function (id, selectedOption) {
        this.createStorageInstance.deleteItem(id, selectedOption);
    }

    DataSource.prototype.patchItem = function (id, status, selectedOption) {
        this.createStorageInstance.patchItem(id, status, selectedOption);
    }
    DataSource.prototype.addTaskToStorage = function (inputFieldValue) {
        for (var i in this.dataSource) {
            if (this.dataSource[i] === "WebAPI") {
                this.createStorageInstance.setData({
                    title: inputFieldValue,
                    order: null,
                    completed: false,
                    url: ""
                }, this.dataSource[i])
            }
            else {
                var id = Math.floor(Date.now() / 1000)
                var taskData = this.getData(this.dataSource[i]);
                taskData.push({
                    title: inputFieldValue,
                    order: id,
                    completed: false
                });
                this.storeData(taskData, this.dataSource[i]);
            }
        }
        return id;
    }

    DataSource.prototype.removeCompletedTasksFromStorage = function (selectedOption) {
        var taskData = this.getData(selectedOption);
        taskData = taskData.filter(function (elem) {
            return elem.completed !== true;
        })
        this.storeData(taskData, selectedOption);
        return taskData;
    }

    DataSource.prototype.updateStatusInStorage = function (uniqueId, selectedOption, status) {
        if (selectedOption === this.dataSource.WebApi) {
            this.patchItem(uniqueId, status, selectedOption);
        }
        else {
            var taskData = this.getData(selectedOption);
            var selectedItem = taskData.find(function (taskObject) {
                return taskObject.order === uniqueId;
            });
            selectedItem.completed = !selectedItem.completed;
            this.storeData(taskData, selectedOption);
        }
    }

    DataSource.prototype.updateStorage = function (itemId, taskData) {
        var item = taskData.findIndex(function (taskObject) {
            return taskObject.order === itemId;
        });
        taskData.splice(item, 1);
    }

    function dataSourceInstance(storageKey) {
        return new DataSource(storageKey);
    }

    return {
        instance: dataSourceInstance
    }

})()
