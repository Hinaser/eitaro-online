// Sidebar url
var sidebar_url = "./sidebar.html";

// var `sidebar` will be a value by `require('sdk/ui/sidebar').Sidebar({...})`
var sidebar = null;

// Error messages
var error_messages = {
    no_histories: '履歴がまだありません。' // No history exists yet.
};

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

            // When "get" message comes from sidebar script,
            // prepare the data to show on the sidebar and send it to the sidebar.
            worker.port.on("get", function(){
                // Attach DOM element to the last element of workers array.
                var msg = {};
                msg.type = "set";
                msg.data = JSON.stringify(sidebar_content);
                worker.port.emit(msg.type, msg.data);
            }.bind(this));

            // When "delete" message arrives from the sidebar script,
            // remove the target object from database and refresh sidebar with the latest history data.
            worker.port.on("delete", function(word){
                if(word){
                    this.db.remove(word, function(){
                        this.showHistory();
                    }.bind(this));
                }
            }.bind(this));
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
 * Update content in sidebar
 */
Sidebar.prototype.invalidate_sidebar = function (){
    if(sidebar == null){
        this.build_sidebar();
    }

    if(sidebar_workers != null && sidebar_workers.length > 0){
        // Sanitize html text to eliminate malicious code
        this.sanitize_sidebar_content();
        sidebar_workers[sidebar_workers.length - 1].port.emit("set", JSON.stringify(sidebar_content));
    }

    sidebar.show();
};

/**
 * Show search result with display option
 * @param {string} result - HTML as a text to display on sidebar
 * @param {Object} option - Specifying whether the first row of the data should be expanded or collapsed.
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
 * Open sidebar or panel to display search history
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
 * The former one contains only one search result and the latter contains history or search results.
 */
Sidebar.prototype.sanitize_sidebar_content = function (){
    if(!sidebar_content){
        return;
    }

    if(sidebar_content.type == 'history'){
        if(sidebar_content.history_data && sidebar_content.history_data.records){
            for(var i=0;i<sidebar_content.history_data.records.length;i++){
                sidebar_content.history_data.records[i].result = this.sanitize(sidebar_content.history_data.records[i].result);
            }
        }
    }
    else{
        sidebar_content.single_data = this.sanitize(sidebar_content.single_data);
    }
};



module.exports = Sidebar;
