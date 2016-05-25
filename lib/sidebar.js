// Sidebar url
var sidebar_url = "./sidebar/sidebar.html";

// var `sidebar` will be a value by `require('sdk/ui/sidebar').Sidebar({...})`
var sidebar = null;

// Error messages
var error_messages = {
    no_histories: '履歴がまだありません。' // No history exists yet.
};

/**
 * @type {Function} - Callback function to be executed at the time sidebar just opens.
 */
var onOpen = null;

/**
 * The html text to be sent to sidebar content script.
 * When sidebar content script receives this content, it will set the html on the sidebar.
 * @typedef {Object} SidebarContent
 * @property {string} type - One of ['single', 'history', 'error']
 * @property {string} single_data - Used when type is 'single'
 * @property {Object} history_data - Used when type is 'history'
 * @property {Object} option
 */

/**
 * Content of sidebar to be displayed
 * @type {SidebarContent}
 */
var sidebar_content = {
    type: null,
    single_data: null,
    history_data: null,
    option: sidebar_content_default_option
};

// Default option for sidebar content
var sidebar_content_default_option = {
    show_first_data: false
};

/**
 * ID of Sidebar
 * @type {string} sidebar_id
 */
var sidebar_id = "eitaro-sidebar";

/**
 * Array of sidebar workers
 * @type {Array}
 */
var sidebar_workers = [];

/**
 *
 * @param {string} title
 * @param {Object} db - Indexed db
 * @param {Function} sanitizer
 * @constructor
 */
var Sidebar = function(title, db, sanitizer){
    this.id = sidebar_id;
    this.title = title;
    this.db = db;
    this.sanitize = sanitizer;
};

/**
 * Initialize sidebar
 */
Sidebar.prototype.build_sidebar = function (){
    sidebar = require('sdk/ui/sidebar').Sidebar({
        id: this.id,
        title: this.title,
        url: sidebar_url,
        onAttach: function(worker){
            sidebar_workers.push(worker);

            // When sidebar content script is loaded, execute reserved script on openning sidebar.
            worker.port.on("get", function(){
                onOpen(worker);
            });

            // When "delete" message arrives from the sidebar script,
            // remove the target object from database and refresh sidebar with the latest history data.
            worker.port.on("delete", this.delete.bind(this));
        }.bind(this),
        onDetach: function(worker){
            var index = sidebar_workers.indexOf(worker);
            if(index != -1){
                sidebar_workers.splice(index, 1);
                if(sidebar_workers.length < 1){
                    sidebar.dispose();
                    sidebar = null;
                }
            }
        }.bind(this)
    });
};

/**
 * Show or Hide search result history
 * @param {Object} option - Specifying whether the first row of the data should be expanded or collapsed.
 */
Sidebar.prototype.toggleHistory = function(option){
    // If sidebar is opening
    if(sidebar && sidebar_workers && sidebar_workers.length > 0){
        // If sidebar is displaying search result history
        if(sidebar_content != null && sidebar_content.type == 'history'){
            sidebar.hide();
        }
    }
    // If sidebar is not shown, then show search result history on sidebar.
    else{
        this.showHistory(option);
    }
};

/**
 * Delete a word from db
 * @param {string} word - word to be deleted from database
 */
Sidebar.prototype.delete = function(word){
    if(word){
        this.db.remove(word, function(){
            this.showHistory();
        }.bind(this));
    }
};

/**
 * Update content in sidebar
 */
Sidebar.prototype.invalidate_sidebar = function (){
    var set = function(worker){
        // Sanitize html text to eliminate malicious code
        // Actually, sanitizing is done on main.js so this code is a bit redundant if it is single_data search.
        // But sanitizing data in indexed-db is still necessary for hisotry data search/display
        // because there could be so many possibilities for malicious html text to be added to indexed db from unknown/external source.
        this.sanitize_sidebar_content();
        worker.port.emit("set", JSON.stringify(sidebar_content));
    }.bind(this);

    // if sidebar is collapsed/close.
    if(sidebar == null || sidebar_workers == null || sidebar_workers.length < 1){
        onOpen = set;
        this.build_sidebar();
        sidebar.show();
    }
    // If sidebar is opening.
    else {
        set(sidebar_workers[sidebar_workers.length - 1]);
    }
};

/**
 * Tell sidebar content script to prepare for displaying search result.
 */
Sidebar.prototype.prepare = function(){
    var prepare = function(worker){
        worker.port.emit("prepare", null);
    };

    // if sidebar is collapsed/close.
    if(sidebar == null || sidebar_workers == null || sidebar_workers.length < 1){
        onOpen = prepare;
        this.build_sidebar();
        sidebar.show();
    }
    // If sidebar is opening.
    else{
        prepare(sidebar_workers[sidebar_workers.length - 1]);
    }
};

/**
 * Show search result with display option
 * @param {string} result - HTML as a text to display on sidebar
 * @param {Object=} option - Specifying whether the first row of the data should be expanded or collapsed.
 */
Sidebar.prototype.showSearchResult = function(result, option){
    sidebar_content.type = 'single';
    sidebar_content.single_data = result;
    if(option){
        sidebar_content.option = option;
    }
    else{
        sidebar_content.option = sidebar_content_default_option;
    }
    this.invalidate_sidebar();
};

/**
 * Open sidebar to display search history
 * @param {Object} option - Specifying whether the first row of the data should be expanded or collapsed.
 */
Sidebar.prototype.showHistory = function (option) {
    this.db.getAll("dtime", "prev", function(objects){
        var records = [];

        objects.forEach(function(element, index, array){
            records.push({
                word: array[index].word,
                result: array[index].result
            });
        });

        if(records != null && records.length > 0){
            sidebar_content.type = 'history';
            sidebar_content.history_data = records;
            if(option){
                sidebar_content.option = option;
            }
            else{
                sidebar_content.option = sidebar_content_default_option;
            }
            this.invalidate_sidebar();
        }
        else{
            sidebar_content.type = 'error';
            sidebar_content.single_data = error_messages.no_histories;
            this.invalidate_sidebar();
        }
    }.bind(this));
};

/**
 * Sanitize sidebar content.
 * Sidebar content has 2 type. The normal sidebar content and content with search history.
 * The former one contains only one search result and the latter contains multiple history of search results.
 * So way of sanitizing
 *
 * If you read the code of this method, you will notice that sanitizing logic is not described here.
 * The sanitizing logic is not defined in this script because sanitizing logic is a common utility and such logic should not be defined
 * in a specific script file.
 * I can try to define such a code in this file, but such sanitization is not limited to be used here.
 * So I decided to inject sanitizing function as a parameter when `Sidebar` class is instantiated.
 *
 * For your shortcut.
 * Sanitizing logic comes from a method `parseHTML` in `lib/utils.js`.
 * However, the logic in `lib/utils.js` also comes from Firefox SDK's official page pointed in below.
 * https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion#Safely_Using_Remote_HTML
 *
 */
Sidebar.prototype.sanitize_sidebar_content = function (){
    if(!sidebar_content){
        return;
    }

    if(sidebar_content.type == 'history'){
        if(sidebar_content.history_data && sidebar_content.history_data.records){
            for(var i=0;i<sidebar_content.history_data.records.length;i++){
                // ** SANITIZING ** //
                sidebar_content.history_data.records[i].result = this.sanitize(sidebar_content.history_data.records[i].result);
            }
        }
    }
    else{
        // ** SANITIZING ** //
        sidebar_content.single_data = this.sanitize(sidebar_content.single_data);
    }
};



module.exports = Sidebar;
