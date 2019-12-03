'use strict';
function AbstractDataSource(key) {
    this.key = key;
}

AbstractDataSource.prototype.setData = function (data, storageType) {
    getStorageInstance(storageType, this.key).setData(data);
}

AbstractDataSource.prototype.getData = function (storageType, callback) {
    return getStorageInstance(storageType, this.key).getData(callback);
}

AbstractDataSource.prototype.deleteItem = function (id, storageType) {
    getStorageInstance(storageType).deleteItem(id);
}

AbstractDataSource.prototype.patchItem = function (id, status, storageType) {
    getStorageInstance(storageType).toggleItem(id, status);
}

function getStorageInstance(storageType, key) {

    var storage = {

        LocalStorage: function(){
            return new LocalStorage(key)
        },

        SessionStorage: function(){
            return new SessionStorage(key)
        },

        WebAPI: function () {
            return new WebApi();
        }
    };
    return storage[storageType]();
}

