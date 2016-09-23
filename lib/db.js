"use strict";

let { indexedDB, IDBKeyRange } = require("sdk/indexed-db");

// Private variable for indexed-db
let db = null;

let onerror = function(e) {
    console.error(e.value);
};

/**
 * Constructor for initializaing Indexed-db
 * @constructor
 */
let Database = function(){
    this.objstore_name = "histories";
    this.name = "default";
    this.version = "1";
};

//
// Argument `name` should be the same as configuration item "service-url".
/**
 * Open database
 * @param {string} name - Name of indexed-db
 * @param {Function=} callback - Executed after db opened successfully.
 */
Database.prototype.open = function (name, callback) {
    let request = indexedDB.open(name, this.version);
    this.name = name;

    request.onupgradeneeded = (e)=>{
        let temp_db = e.target.result;
        e.target.transaction.onerror = onerror;

        if(temp_db.objectStoreNames.contains(this.objstore_name)) {
            temp_db.deleteObjectStore(this.objstore_name);
        }

        let store;
        try{
            store = temp_db.createObjectStore(this.objstore_name, {keyPath: ["word"]});
        }catch(e){
            console.error(e);
            throw e;
        }
        store.createIndex("dtime", "dtime", {unique: false});
        store.createIndex("word", "word", {unique: true});
    };

    request.onsuccess = (e)=>{
        db = e.target.result;

        if(callback){
            callback();
        }
    };

    request.onerror = onerror;
};

/**
 * Close and reopen database
 * @param {string} name - Name of indexed-db.
 */
Database.prototype.reopen = function (name){
    this.close();
    this.open(name);
};

/**
 * Close database
 */
Database.prototype.close = function(){
    if(db){
        db.close();
    }
};

//
//
/**
 * Add object to objectstore.
 * In order to overwrite timestamp, this method deletes the object first before adding it.
 * @param {string} word - Search keyword
 * @param {string} result - Search result by the keyword
 */
Database.prototype.add = function (word, result) {
    let trans = db.transaction([this.objstore_name], "readwrite");
    let store = trans.objectStore(this.objstore_name);
    let delete_request = store.index("word").openKeyCursor(word);
    delete_request.onsuccess = function(){
        let cursor = delete_request.result;
        if(cursor){
            store.delete(cursor.primaryKey);
            cursor.continue();
        }

        let put_request = store.put({
            "dtime": new Date(),
            "word": word,
            "result": result
        });

        put_request.onerror = onerror;
    }
};

/**
 * Simply remove object from objectstore.
 * @param {string} word - Search keyword
 * @param {removeCallback} callback - Executed when remove operation completes.
 */
Database.prototype.remove = function (word, callback) {
    let trans = db.transaction([this.objstore_name], "readwrite");
    let store = trans.objectStore(this.objstore_name);
    let delete_request = store.index("word").openKeyCursor(word);
    delete_request.onsuccess = function(){
        let cursor = delete_request.result;
        if(cursor){
            store.delete(cursor.primaryKey);
            cursor.continue();
        }
    };

    if(callback){
        trans.oncomplete = function(){
            callback();
        }
    }
};

/**
 * Executed when remove operation for objectstore is completed.
 * @callback removeCallback
 */

/**
 * Remove all objects from object store.
 */
Database.prototype.clear = function () {
    let trans = db.transaction([this.objstore_name], "readwrite");
    let store = trans.objectStore(this.objstore_name);
    store.clear();
};

/**
 * Get result object by past search keyword from object store.
 * @param {string} key - Search keyword stored which might be stored in objectstore
 * @param {findCallback}callback - Executed when search operation is done successfully.
 */
Database.prototype.findByWord = function (key, callback) {
    let cb = callback;
    let trans = db.transaction([this.objstore_name], "readwrite");
    let store = trans.objectStore(this.objstore_name);

    let request = store.index("word").get(key);

    request.onerror = onerror;
    request.onsuccess = function(e){
        cb(request.result);
    };
};

/**
 * Executed after findByWord is completed successfully.
 * @callback findCallback
 * @param {Object} result - Result object corrensponding to a search keyword.
 */

/**
 * List all keys in the objectstore.
 * @param {string} keyname - Name of key in object store. e.g. `word`/`data`
 * @param {getAllKeysCallback} callback
 */
Database.prototype.getAllKeys = function (keyname, callback){
    let cb = callback;
    let trans = db.transaction([this.objstore_name], "readwrite");
    let store = trans.objectStore(this.objstore_name);

    let request = store.index(keyname).getAllKeys();

    request.onerror = onerror;
    request.onsuccess = function(e){
        cb(request.result);
    };
};

/**
 * Executed after findByWord is completed successfully.
 * @callback getAllKeysCallback
 * @param {Array.<string>} result - List of keys.
 */

/**
 * Extract all objects in the objectstore.
 * @param {string} sort_key - One of the [dtime, word]
 * @param {string} direction -`prev` or`next`.`prev` means descend order,`next` means ascend order.
 * @param {getAllCallback} callback
 */
Database.prototype.getAll = function (sort_key, direction, callback) {
    let trans = db.transaction([this.objstore_name], "readwrite");
    let store = trans.objectStore(this.objstore_name);
    let items = [];

    trans.oncomplete = function() {
        callback(items);
    };

    let cursorRequest = null;

    // Check if records exist
    let count = store.count();
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
            let result = e.target.result;
            if(!!result == false)
                return;

            items.push(result.value);
            result.continue();
        };

        cursorRequest.onerror = onerror;
    };
};

/**
 * Executed when getAll query to objectstore is completed.
 * @callback getAllCallback
 * @param {Array.<Object>} - Object list. Object layout is {date: {string}, word: {string}, result: {string}}
 */

module.exports = Database;
