var { indexedDB, IDBKeyRange } = require('sdk/indexed-db');

// Variables for indexed-db
var db_instance = null;

/*
 * Setup indexeddb
 */
var onerror = function(e) {
    console.error(e.value);
}

var Database = function(){
    this.objstore_name = "histories";
    this.name = "default";
    this.version = "1";
}

// Open database
// Argument 'name' should be the same as configuration item "service-url".
Database.prototype.open = function (name, version) {
    var request = indexedDB.open(name, version);

    request.onupgradeneeded = function(e) {
        var db = e.target.result;
        e.target.transaction.onerror = onerror;

        if(db.objectStoreNames.contains(this.objstore_name)) {
            db.deleteObjectStore(this.objstore_name);
        }

        var store = db.createObjectStore(this.objstore_name, {keyPath: ["word"]});
        store.createIndex("dtime", "dtime", {unique: false});
        store.createIndex("word", "word", {unique: true});
    };

    request.onsuccess = function(e) {
        db_instance = e.target.result;
        console.log(db_instance);
    };

    request.onerror = onerror;
};

// Close and reopen database
Database.prototype.reopen = function (name, version){
    db_instance.close();
    this.open(name, version);
}

// Add object to objectstore.
// In order to overwrite timestamp, delete the object first before adding it.
Database.prototype.add = function (word, result) {
    var db = db_instance;
    var trans = db.transaction([this.objstore_name], "readwrite");
    var store = trans.objectStore(this.objstore_name);
    var delete_request = store.index("word").openKeyCursor(word);
    delete_request.onsuccess = function(){
        var cursor = delete_request.result;
        if(cursor){
            store.delete(cursor.primaryKey);
            cursor.continue();
        }

        var put_request = store.put({
            "dtime": new Date(),
            "word": word,
            "result": result
        });

        put_request.onerror = onerror;
    }
};

// Simply remove object from objectstore.
Database.prototype.remove = function (word, callback) {
    var db = db_instance;
    var trans = db.transaction([this.objstore_name], "readwrite");
    var store = trans.objectStore(this.objstore_name);
    var delete_request = store.index("word").openKeyCursor(word);
    delete_request.onsuccess = function(){
        var cursor = delete_request.result;
        if(cursor){
            store.delete(cursor.primaryKey);
            cursor.continue();
        }
    }

    if(callback){
        trans.oncomplete = function(){
            callback();
        }
    }
}

// Remove all objects from object store.
Database.prototype.clear = function () {
    var db = db_instance;
    var trans = db.transaction([this.objstore_name], "readwrite");
    var store = trans.objectStore(this.objstore_name);
    store.clear();
};

// Get object by key
Database.prototype.get = function (callback, key) {
    var cb = callback;
    var db = db_instance;
    var trans = db.transaction([this.objstore_name], "readwrite");
    var store = trans.objectStore(this.objstore_name);

    var request = store.get(key);

    request.onerror = onerror;
    request.onsuccess = function(e){
        cb(request.result);
    };
};

// Get object by 'word' index from objectstore.
Database.prototype.findByWord = function (key, callback) {
    var cb = callback;
    var db = db_instance;
    var trans = db.transaction([this.objstore_name], "readwrite");
    var store = trans.objectStore(this.objstore_name);

    var request = store.index('word').get(key);

    request.onerror = onerror;
    request.onsuccess = function(e){
        cb(request.result);
    };
};

// List all keys in the objectstore.
Database.prototype.getAllKeys = function (key, callback){
    var cb = callback;
    var db = db_instance;
    var trans = db.transaction([this.objstore_name], "readwrite");
    var store = trans.objectStore(this.objstore_name);

    var request = store.index(key).getAllKeys()

    request.onerror = onerror;
    request.onsuccess = function(e){
        cb(request.result);
    };
}

// Extract all objects in the objectstore.
// sort_key: One of the [dtime, word]
// direction: 'prev' or 'next'. 'prev' means descend order, 'next' means ascend order.
Database.prototype.getAll = function (sort_key, direction, callback) {
    console.log("getAll");
    var db = db_instance;
    var trans = db.transaction([this.objstore_name], "readwrite");
    var store = trans.objectStore(this.objstore_name);
    var items = new Array();

    trans.oncomplete = function() {
        callback(items);
    }

    var cursorRequest = null;

    // Check if records exist
    var count = store.count();
    count.onsuccess = function(){
        if(count.result < 1) {
            cursorRequest = store.openCursor(null);
        }
        else if(sort_key == "dtime"){
            if(direction == "prev"){
                cursorRequest = store.index("dtime").openCursor(null, "prev");
            }
            else {
                cursorRequest = store.index("dtime").openCursor(null, "next");
            }
        }
        else{
            if(direction == "prev"){
                cursorRequest = store.index("word").openCursor(null, "prev");
            }
            else {
                cursorRequest = store.index("word").openCursor(null, "next");
            }
        }

        cursorRequest.onsuccess = function(e) {
            var result = e.target.result;
            if(!!result == false)
                return;

            items.push(result.value);
            result.continue();
        };

        cursorRequest.onerror = onerror;
    };
};

module.exports = Database;
