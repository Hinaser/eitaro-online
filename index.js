/*
 * The MIT License (MIT) Copyright (c) 2016-2016 Rindo Hinase
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*
 * Variable initialization
 */
// Variables for firefox addon sdk
var { Frame } = require("sdk/ui/frame");
var { Toolbar} = require("sdk/ui/toolbar");
var prefs = require('sdk/simple-prefs');
var { Hotkey } = require('sdk/hotkeys');
var { Request } = require('sdk/request');
var panels = require("sdk/panel");
var { indexedDB, IDBKeyRange } = require('sdk/indexed-db');
var { Cc, Ci } = require("chrome");
var cm = require("sdk/context-menu");
var tabs = require("sdk/tabs");
var { getTabForId, getTabContentWindow } = require ("sdk/tabs/utils");
var parser = Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser);
var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);

// Variables for indexed-db
var database = {};
var db_objstore_name = "histories";
var db_name = "default";
var db_version = "1";

// Variable to manage opened tab. Once a tab is opened by this script,
// the tab will be re-used to display information. So we need to track which tab is opened by this script.
var opened_tab = null;

// Variables for search service configurations.
// This is not so important. Just used for placeholder and context menu label and so on.
var service_name = prefs.prefs["servicename"];
// This is a critical value. This is a url which enables to search something user wants. e.g. https://gXXgle.co.jp/search?q={0} or so.
var service_url = prefs.prefs["serviceurl"]; 
// This is a CSS selector string. When search result page is returned, we need to trim unnecessary contents.
// This value specifies which html element should be treated as a search result content.
var service_selector = prefs.prefs["serviceselector"];
// Just a bunch of error messages.
var service_error_msg = {
    parse_error: "DOMの解析に失敗しました。設定のサービスURLやサービスセレクタの内容をもう一度確認してください。サービスURLの例(あくまで例です。): http://eXw.alc.XX.jp/search?q={0}"
    , no_histories: "履歴がまだありません。"
};

// Where the search result content should be displayed. One of the ["tab", "sidebar", "panel"].
var display_target = "tab";

// Setting of frame which boards search input field and buttons.
var frame_url = "./frame.html"
var frame = new Frame({
    url: frame_url,
    onMessage: (e) => {
        obj = JSON.parse(e.data);
        routeMsg(obj, e);
    }
});

// Setting of toolbar.
var toolbar_name = "Search toolbar";
var toolbar_title = prefs.prefs["servicename"] + "で検索";
var toolbar =Toolbar({
    name: toolbar_name,
    title: toolbar_title,
    items: [frame]
});

// Setting for panel
var panel_url = "./panel.html";
// This `panel_content` holds html text to display on panel.
var panel_content = "";
var panel_position = null;
set_panel_position();
// Panel to display lookup result
var panel = panels.Panel({
    contentURL: panel_url
});
panel.on("show", function(){
    panel.port.emit("set", panel_content);
});

// Setting for sidebar
var sidebar_url = "./sidebar.html"
// var `sidebar` will be a value by `require('sdk/ui/sidebar').Sidebar({...})`
var sidebar = null;
// Sidebar will display single search result or search history list.
// The variable below indicates which is the latest content on the sidebar.
// The reason why this variable is used is that message, which is sent to sidebar script with sidebar contents,
// is different based on the latest contents. ,,, Sorry I know this explanation won't make you understood any more.
// I should have coded the script structure more carefully to make things clearer... 
// The thing complicating is that the logic to prepare sidebar content and the method to send it to sidebar script
// and the way to parse the data to show the content is separated and not be able to controll directly.
var sidebar_latest_open_type = "search"; // "search" or "history"
// The html text to be sent to sidebar content script.
// When sidebar content script receives this content, it will directly set the html on the sidebar.
var sidebar_content = "";
// The 'Object' which has header data and search history data(a list of pair of search word and result).
// When sidebar content script receives this content, it will parse the object to display list data appropriately.
var sidebar_history_content = "";
var sidebar_id = "eitaro-sidebar";
var sidebar_title = prefs.prefs["servicename"];
// I began to doubt whether this worker variable is necessary.
var sidebar_workers = [];
// If configured to display search result with past search history, the latest search result should not be collapsed
// as other search history result. If the value below is false, all list data will be shown collapsed.
// if it is true, then only the first row of search result data will be expanded while the others remain collapsed.
var sidebar_show_latest_data = false;





/*
 * Utility functions
 */
// Sanitize html text
function sanitizeHtml(html_text) {
    var document = parser.parseFromString(html_text, "text/html");
    // Sanitize html text here by using the function provided by mozilla
    // https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion#Safely_Using_Remote_HTML
    var html_flagment = parseHTML(document, html_text, true, null, false);

    var div = document.createElement('div');
    div.appendChild(html_flagment);
    return div.innerHTML;
}

// Sanitize sidebar content.
// Sidebar content has 2 type. The normal sidebar content and content with search history.
// The former one contains only one search result and the latter contains history or search results.
function sanitize_sidebar_content(with_history){
    if(with_history){
        if(sidebar_history_content && sidebar_history_content.data){
            for(var i=0;i<sidebar_history_content.data.records.length;i++){
                sidebar_history_content.data.records[i].result = sanitizeHtml(sidebar_history_content.data.records[i].result);
            }
        }
    }
    else{
        sidebar_content = sanitizeHtml(sidebar_content);
    }
}

/*
 * Setup indexeddb
 */
database.onerror = function(e) {
    console.error(e.value);
}

// Open database
// Argument 'name' should be the same as configuration item "service-url".
function db_open(name, version) {
    var request = indexedDB.open(name, version);

    request.onupgradeneeded = function(e) {
        var db = e.target.result;
        e.target.transaction.onerror = database.onerror;

        if(db.objectStoreNames.contains(db_objstore_name)) {
            db.deleteObjectStore(db_objstore_name);
        }

        var store = db.createObjectStore(db_objstore_name, {keyPath: ["word"]});
        store.createIndex("dtime", "dtime", {unique: false});
        store.createIndex("word", "word", {unique: true});
    };

    request.onsuccess = function(e) {
        database.db = e.target.result;
    };

    request.onerror = database.onerror;
};

// Close and reopen database
function db_reopen(name, version){
    database.db.close();
    db_open(name, version);
}

// Add object to objectstore.
// In order to overwrite timestamp, delete the object first before adding it.
function db_addObject(word, result) {
    var db = database.db;
    var trans = db.transaction([db_objstore_name], "readwrite");
    var store = trans.objectStore(db_objstore_name);
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

        put_request.onerror = database.onerror;
    }
};

// Simply remove object from objectstore.
function db_removeObject(word, callback) {
    var db = database.db;
    var trans = db.transaction([db_objstore_name], "readwrite");
    var store = trans.objectStore(db_objstore_name);
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
function db_clearObject() {
    var db = database.db;
    var trans = db.transaction([db_objstore_name], "readwrite");
    var store = trans.objectStore(db_objstore_name);
    store.clear();
};

// Get object by key
function db_getObject(callback, key) {
    var cb = callback;
    var db = database.db;
    var trans = db.transaction([db_objstore_name], "readwrite");
    var store = trans.objectStore(db_objstore_name);

    var request = store.get(key);

    request.onerror = database.onerror;
    request.onsuccess = function(e){
        cb(request.result);
    };
};

// Get object by 'word' index from objectstore.
function db_getObjectByWord(key, callback) {
    var cb = callback;
    var db = database.db;
    var trans = db.transaction([db_objstore_name], "readwrite");
    var store = trans.objectStore(db_objstore_name);

    var request = store.index('word').get(key);

    request.onerror = database.onerror;
    request.onsuccess = function(e){
        cb(request.result);
    };
};

// List all keys in the objectstore.
function db_getAllKeys(key, callback){
    var cb = callback;
    var db = database.db;
    var trans = db.transaction([db_objstore_name], "readwrite");
    var store = trans.objectStore(db_objstore_name);

    var request = store.index(key).getAllKeys()

    request.onerror = database.onerror;
    request.onsuccess = function(e){
        cb(request.result);
    };
}

// Extract all objects in the objectstore.
// sort_key: One of the [dtime, word]
// direction: 'prev' or 'next'. 'prev' means descend order, 'next' means ascend order.
function db_getAllObjects(sort_key, direction, callback) {
    var db = database.db;
    var trans = db.transaction([db_objstore_name], "readwrite");
    var store = trans.objectStore(db_objstore_name);
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

        cursorRequest.onerror = database.onerror;
    };
};

// Open db
db_name = service_url;
db_open(db_name, db_version);



/*
 * sidebar setup
 */
// When sidebar instance is not set, setup sidebar
function build_sidebar(){
    sidebar = require('sdk/ui/sidebar').Sidebar({
        id: sidebar_id,
        title: sidebar_title,
        url: sidebar_url,
        onAttach: function(worker){
            sidebar_workers.push(worker);

            // When "get" message comes from sidebar script,
            // prepare the data to show on the sidebar and send it to the sidebar.
            worker.port.on("get", function(){
                // Attach DOM element to the last element of workers array.
                var msg = {};
                if(sidebar_latest_open_type == "search"){
                    sanitize_sidebar_content(false); // Sanitize sidebar content
                    msg.type = "set";
                    msg.data = sidebar_content;
                }
                else {
                    sanitize_sidebar_content(true); // Sanitize sidebar content with history
                    msg.type = "set-history";
                    msg.data = JSON.stringify(sidebar_history_content);
                }
                worker.port.emit(msg.type, msg.data);
            });

            // When "delete" message arrives from the sidebar script,
            // remove the target object from database and refresh sidebar with the latest history data.
            worker.port.on("delete", function(word){
                if(word){
                    db_removeObject(word, function(){
                        history();
                    });
                }
            });
        },
        onDetach: function(worker){
            var index = sidebar_workers.indexOf(worker);
            if(index != -1){
                sidebar_workers.splice(index,1);
                if(sidebar_workers.length < 1){
                    sidebar.dispose();
                    sidebar = null;
                }
            }
        }
    });
};

// Update content in sidebar
function update_sidebar(with_history){
    if(sidebar == null){
        build_sidebar();
    }
    if(sidebar_workers != null && sidebar_workers.length >= 1){
        if(with_history){
            // Sanitize html text to eliminate malicious code
            sanitize_sidebar_content(true);
            sidebar_workers[sidebar_workers.length - 1].port.emit("set-history", JSON.stringify(sidebar_history_content));
        }
        else{
            // Sanitize html text to eliminate malicious code
            sanitize_sidebar_content(false);
            sidebar_workers[sidebar_workers.length - 1].port.emit("set", sidebar_content);
        }
    }

    sidebar.show();
}


// Initial sidebar setup
build_sidebar();

// Preference setup
function set_panel_position(){
    switch(prefs.prefs["panelposition"]){
        case "left":
            panel_position = {
                left: 10,
                top: 0,
                bottom: 10
            };
            break;
        case "top":
            panel_position = {
                left: 10,
                top: 0,
                right: 10
            };
            break;
        case "right":
            panel_position = {
                top: 0,
                bottom: 10,
                right: 10
            };
            break;
        case "bottom":
            panel_position = {
                left: 10,
                bottom: 10,
                right: 10
            };
            break;
        default:
            panel_position = null;
            break;
    }
}
prefs.on("preservehistory", function(){
    prefs.prefs["displaytarget"] = "sidebar";
});
prefs.on("panelposition", function(){
    set_panel_position();
    prefs.prefs["displaytarget"] = "panel";
});
prefs.on("alwaysopennewtab", function(){
    prefs.prefs["displaytarget"] = "tab";
});
prefs.on("servicename", function(){
    service_name = prefs.prefs["servicename"];
    toolbar_title = service_name + "で検索";
    var msg = {};
    msg.type = "update-placeholder";
    msg.data = toolbar_title;
    frame.postMessage(JSON.stringify(msg), frame_url);
    sidebar_title = service_name;
});
prefs.on("serviceurl", function(){
    service_url = prefs.prefs["serviceurl"];
});
prefs.on("serviceselector", function(){
    service_selector = prefs.prefs["serviceselector"];
});
prefs.on("clearresult", function(){
    if (prompts.confirm(null, "警告", "全ての履歴が削除され、元に戻せませんがよろしいですか？")) {
        clear_result();
    }
});
prefs.on("export", function(){
    exportFormattedDataToFile();
});
prefs.on("dump", function(){
    exportDumpToFile();
});

/*
 * Definition of functions
 */
// Romove extra spaces
function trim_space(word) {
    return word.replace(/\s+/g, ' ').trim();
}

// Store search result to global variable
function store_result(word, result){
    db_addObject(word, result);
}

// Clear search result history
function clear_result(){
    db_clearObject();
}

// Search keyword from configured url
function search(search_keyword){
    // Trim extra space. If search_keyword is empty, stop processing.
    search_keyword = trim_space(search_keyword);
    if(!search_keyword || /^\s*$/.test(search_keyword)){
        prompts.alert(null, "注意", "検索キーワードが空です。");
        return;
    }

    // Reopen indexeddb if service url has changed since last search()
    if(db_name != service_url){
        db_name = service_url;
        db_reopen(db_name, db_version);
    }

    // Get search keyword from input field and construct url for dictionary service
    var request_url = service_url.replace("{0}", search_keyword);

    if(prefs.prefs['displaytarget'] == "panel"){
        +function(url){
            var xhr = Request({
                url: url,
                onComplete: function(response){
                    panel_content = parseSearchResult(response.text);
                    store_result(search_keyword, panel_content);
                    // Show panel
                    panel.show({
                        position: panel_position
                    });
                }
            });
            xhr.get();
        }(request_url);
    }
    else if(prefs.prefs['displaytarget'] == "sidebar"){
        +function(url){
            var xhr = Request({
                url: url,
                onComplete: function(response){
                    sidebar_latest_open_type = "search";
                    sidebar_content = parseSearchResult(response.text);
                    store_result(search_keyword, sidebar_content);
                    if(!testAndShowResultHistory()){
                        // Activate sidebar
                        update_sidebar(false);
                    }
                }
            });
            xhr.get();
        }(request_url);
    }
    else {
        var store_result_as_history = function(tab){
            var window = getTabContentWindow (getTabForId(tab.id));
            var html_as_string = window.document.documentElement.outerHTML;
            store_result(search_keyword, parseSearchResult(html_as_string));
        };

        // Open tab for translation page if there are no tabs already opened by this extension.
        // If there is a tab opend by this script, then reuse the tab for displaying translation page.
        if (prefs.prefs['alwaysopennewtab'] || opened_tab === null) {
            tabs.open({
                url: request_url,
                onOpen: function onOpen(tab) {
                    opened_tab = tab;
                    tab.on("close", function(tab){
                        opened_tab = null;
                    });
                    
                    // In order to save search result history, get tab content when tab is loaded and store the resulted document.
                    tab.on("ready", store_result_as_history);
                }
            });
        }
        else {
            opened_tab.activate();
            // In order to save search result history, get tab content when tab is loaded and store the resulted document.
            opened_tab.on("ready", store_result_as_history);
            opened_tab.url = request_url;
        }
    }
}

// Analyze search result and return
function parseSearchResult(html_as_string){
    var content_to_return = null;
    var document = parser.parseFromString(html_as_string, "text/html");
    var sizzle = Sizzle(document);

    try {
        // I don't like to use [0] but since Sizzle always returns array, I submit... orz
        content_to_return = sizzle(service_selector)[0];
        // Remove child nodes which jeopardizes page content.
        if(!/^\s*$/.test(prefs.prefs["servicedeselector"])){
            sizzle(service_selector + " " + prefs.prefs["servicedeselector"]).forEach(function(ele){
                content_to_return.removeChild(ele);
            });
        }
        content_to_return = content_to_return.innerHTML;
    } catch(e) {
        content_to_return = service_error_msg.parse_error;
    }

    return content_to_return;
}

// Set result history following to the latest search result if configured to do so.
// If it is not configured, then return the original search result without editing anything.
function testAndShowResultHistory(){
    if(prefs.prefs["preservehistory"]){
        sidebar_show_latest_data = true;
        history();
        return true;
    }

    return false;
}

// Open configuration tab
function config() {
    tabs.open("about:addons");
}

// Open sidebar or panel to display search history
function history() {
    db_getAllObjects("dtime", "prev", function(objects){
        var records = new Array;

        objects.forEach(function(element, index, array){
            records.push({
                word: array[index].word,
                result: array[index].result
            });
        });

        if(records != null && records.length > 0){
            sidebar_latest_open_type = "history";
            sidebar_history_content = {
                showFirstData: sidebar_show_latest_data,
                data: records
            };
            update_sidebar(true);
        }
        else{
            sidebar_latest_open_type = "search";
            sidebar_content = service_error_msg.no_histories;
            update_sidebar(false);
        }
    });
}

// Export search result history data without readable format into a file
function exportDumpToFile(){
    const nsIFilePicker = Ci.nsIFilePicker;
    var fp = Cc["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(require('sdk/window/utils').getMostRecentBrowserWindow().content, "保存先のファイル名を入力・選択してください", nsIFilePicker.modeSave);
    fp.appendFilter("JSON(JavaScript Object Notation) file", "*.json");
    fp.defaultExtension = "json";
    var res = fp.show();
    if(res != nsIFilePicker.returnCancel){
        var theFile = fp.file;
        var fileIO = require("sdk/io/file");
        db_getAllObjects("dtime", "prev", function(item){
            var TextWriter = fileIO.open(theFile.path, "w");
            if (!TextWriter.closed) {
                TextWriter.write(JSON.stringify(item));
                TextWriter.close();
            }
        });
    }
}

// Export search result history data with readable format into a file
function exportFormattedDataToFile(){
    const nsIFilePicker = Ci.nsIFilePicker;
    var fp = Cc["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(require('sdk/window/utils').getMostRecentBrowserWindow().content, "保存先のファイル名を入力・選択してください", nsIFilePicker.modeSave);
    fp.appendFilters(nsIFilePicker.filterHTML);
    fp.defaultExtension = "html";
    var res = fp.show();
    if(res != nsIFilePicker.returnCancel){
        var theFile = fp.file;
        var fileIO = require("sdk/io/file");
        db_getAllObjects("dtime", "prev", function(item){
            var TextWriter = fileIO.open(theFile.path, "w");
            if (!TextWriter.closed) {
                var text_to_write = "<html>\n" +
                                    "<head>\n" + 
                                    "<style type='text/css'>\n" + 
                                    "  table {\n" +
                                    "    font-size: 12px;\n" +
                                    "    border-collapse: collapse;\n" +
                                    "  }\n" +
                                    "  \n" +
                                    "  td {\n" +
                                    "    padding: 2px;\n" +
                                    "    border: 1px solid #777;\n" +
                                    "  }\n" +
                                    "</style>\n" + 
                                    "<script>\n" + 
                                    "  var data = " + JSON.stringify(item) + ";\n" +
                                    "  window.onload = function () {\n" +
                                    "    var tr_inner_template = '<td>{0}</td><td>{1}</td><td>{2}</td>';\n" +
                                    "    var tbody = document.getElementById('table-body');\n" +
                                    "    for(var i=0;i<data.length;i++) {\n" +
                                    "      var tr = document.createElement('tr');\n" +
                                    "      td = tr_inner_template.replace('{0}', data[i].dtime).replace('{1}', data[i].word).replace('{2}', data[i].result);\n" +
                                    "      tr.innerHTML = td;\n" +
                                    "      tbody.appendChild(tr);\n" +
                                    "    }\n" +
                                    "  }\n" +
                                    "</script>\n" + 
                                    "</head>\n" + 
                                    "<body>\n" + 
                                    "  <table>\n" + 
                                    "    <thead>\n" + 
                                    "      <tr>\n" + 
                                    "        <td>Date</td>\n" + 
                                    "        <td>Word</td>\n" + 
                                    "        <td>Result</td>\n" + 
                                    "      </tr>\n" + 
                                    "    </thead>\n" + 
                                    "    <tbody id='table-body'>\n" + 
                                    "    </tbody>\n" + 
                                    "  </table>\n" + 
                                    "</body>\n" + 
                                    "</html>\n";
                TextWriter.write(text_to_write);
                TextWriter.close();
            }
        });
    }
}

// Route or Assign incoming message from sub component script to combined target operation
function routeMsg(obj, event) {
    switch(obj.type) {
        case 'search':
            search(obj.value);
            break;
        case 'config':
            config();
            break;
        case 'history':
            sidebar_show_latest_data = false;
            history();
            break;
        case 'debug':
            try{
                console.log(JSON.parse(obj.value));
            }
            catch(e){
                console.log(obj.value);
            }
            break;
    }
}

var getFocus = Hotkey({
    combo: "ctrl-L",
    onPress: function(){
        var msg = {};
        msg.type = "focus";
        msg.data = "";
        frame.postMessage(JSON.stringify(msg), frame_url);
    }
});

// Setup context menu
/*
cm.Item({
    label: "test",
    context: cm.SelectionContext(),
    contentScript: 'self.on("context", function () {' +
                   '  var selection = window.getSelection().toString();' +
                   '  if(!!selection) {' +
                   '    if(selection.length > 15) {' +
                   '      selection = selection.substr(0, 15);' +
                   '      selection += "..."' +
                   '    }' +
                   '    return "' + service_name + 'で \\"" + selection + "\\" を検索";' +
                   '  }' +
                   '});' +
                   'self.on("click", function () {' +
                   '  var msg = {};' +
                   '  msg.type = "search";' +
                   '  msg.data = window.getSelection().toString();' +
                   '  self.postMessage(JSON.stringify(msg));' +
                   '});',
    onMessage: function (msg) {
        obj = JSON.parse(msg);
        switch(obj.type){
            case "search":
                search(obj.data);
                break;
        }
    }
});
*/
var context_menu_item = null;
context_menu_item = cm.Item({
    label: "label",
    context: cm.SelectionContext(),
    contentScriptFile: './context_menu.js',
    onMessage: function (msg) {
        obj = JSON.parse(msg);
        switch(obj.type){
            case "search":
                search(obj.data);
                break;
            //case "get-service-name":
            //    break;
        }
    }
});



/****************************
 * EXTERNAL CODES/LIBRARIES *
 ****************************/

/*
 * The code below is a copy from this page.
 * https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion#Safely_Using_Remote_HTML
 */
/**
 * Safely parse an HTML fragment, removing any executable
 * JavaScript, and return a document fragment.
 *
 * @param {Document} doc The document in which to create the
 *     returned DOM tree.
 * @param {string} html The HTML fragment to parse.
 * @param {boolean} allowStyle If true, allow <style> nodes and
 *     style attributes in the parsed fragment. Gecko 14+ only.
 * @param {nsIURI} baseURI The base URI relative to which resource
 *     URLs should be processed. Note that this will not work for
 *     XML fragments.
 * @param {boolean} isXML If true, parse the fragment as XML.
 */
function parseHTML(doc, html, allowStyle, baseURI, isXML) {
    let PARSER_UTILS = "@mozilla.org/parserutils;1";

    // User the newer nsIParserUtils on versions that support it.
    if (PARSER_UTILS in Cc) {
        let parser = Cc[PARSER_UTILS]
                               .getService(Ci.nsIParserUtils);
        if ("parseFragment" in parser)
            return parser.parseFragment(html, allowStyle ? parser.SanitizerAllowStyle : 0,
                                        !!isXML, baseURI, doc.documentElement);
    }

    return Cc["@mozilla.org/feed-unescapehtml;1"]
                     .getService(Ci.nsIScriptableUnescapeHTML)
                     .parseFragment(html, !!isXML, baseURI, doc.documentElement);
}

/*
 * The code under this comment lines is modified based on Sizzle by jQuery Foundation.
 * Here is a description for license information.
 */
/*!
 * ============================================================
 * Sizzle CSS Selector Engine v2.3.1-pre
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-02-23
 * ============================================================
 */
function Sizzle(d) {
    var window = {};
    window.document = d;

    var i,
        support,
        Expr,
        getText,
        isXML,
        tokenize,
        compile,
        select,
        outermostContext,
        sortInput,
        hasDuplicate,

        // Local document vars
        setDocument,
        document,
        docElem,
        documentIsHTML,
        rbuggyQSA,
        rbuggyMatches,
        matches,
        contains,

        // Instance-specific data
        expando = "sizzle" + 1 * new Date(),
        preferredDoc = window.document,
        dirruns = 0,
        done = 0,
        classCache = createCache(),
        tokenCache = createCache(),
        compilerCache = createCache(),
        sortOrder = function( a, b ) {
            if ( a === b ) {
                hasDuplicate = true;
            }
            return 0;
        },

        // Instance methods
        hasOwn = ({}).hasOwnProperty,
        arr = [],
        pop = arr.pop,
        push_native = arr.push,
        push = arr.push,
        slice = arr.slice,
        // Use a stripped-down indexOf as it's faster than native
        // https://jsperf.com/thor-indexof-vs-for/5
        indexOf = function( list, elem ) {
            var i = 0,
                len = list.length;
            for ( ; i < len; i++ ) {
                if ( list[i] === elem ) {
                    return i;
                }
            }
            return -1;
        },

        booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

        // Regular expressions

        // http://www.w3.org/TR/css3-selectors/#whitespace
        whitespace = "[\\x20\\t\\r\\n\\f]",

        // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
        identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

        // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
        attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
            // Operator (capture 2)
            "*([*^$|!~]?=)" + whitespace +
            // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
            "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
            "*\\]",

        pseudos = ":(" + identifier + ")(?:\\((" +
            // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
            // 1. quoted (capture 3; capture 4 or capture 5)
            "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
            // 2. simple (capture 6)
            "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
            // 3. anything else (capture 2)
            ".*" +
            ")\\)|)",

        // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
        rwhitespace = new RegExp( whitespace + "+", "g" ),
        rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

        rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
        rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

        rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

        rpseudo = new RegExp( pseudos ),
        ridentifier = new RegExp( "^" + identifier + "$" ),

        matchExpr = {
            "ID": new RegExp( "^#(" + identifier + ")" ),
            "CLASS": new RegExp( "^\\.(" + identifier + ")" ),
            "TAG": new RegExp( "^(" + identifier + "|[*])" ),
            "ATTR": new RegExp( "^" + attributes ),
            "PSEUDO": new RegExp( "^" + pseudos ),
            "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
            "bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
            // For use in libraries implementing .is()
            // We use this for POS matching in `select`
            "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
        },

        rinputs = /^(?:input|select|textarea|button)$/i,
        rheader = /^h\d$/i,

        rnative = /^[^{]+\{\s*\[native \w/,

        // Easily-parseable/retrievable ID or TAG or CLASS selectors
        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

        rsibling = /[+~]/,

        // CSS escapes
        // http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
        runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
        funescape = function( _, escaped, escapedWhitespace ) {
            var high = "0x" + escaped - 0x10000;
            // NaN means non-codepoint
            // Support: Firefox<24
            // Workaround erroneous numeric interpretation of +"0x"
            return high !== high || escapedWhitespace ?
                escaped :
                high < 0 ?
                    // BMP codepoint
                    String.fromCharCode( high + 0x10000 ) :
                    // Supplemental Plane codepoint (surrogate pair)
                    String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
        },

        // CSS string/identifier serialization
        // https://drafts.csswg.org/cssom/#common-serializing-idioms
        rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
        fcssescape = function( ch, asCodePoint ) {
            if ( asCodePoint ) {

                // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
                if ( ch === "\0" ) {
                    return "\uFFFD";
                }

                // Control characters and (dependent upon position) numbers get escaped as code points
                return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
            }

            // Other potentially-special ASCII characters get backslash-escaped
            return "\\" + ch;
        },

        // Used for iframes
        // See setDocument()
        // Removing the function wrapper causes a "Permission Denied"
        // error in IE
        unloadHandler = function() {
            setDocument();
        },

        disabledAncestor = addCombinator(
            function( elem ) {
                return elem.disabled === true;
            },
            { dir: "parentNode", next: "legend" }
        );

    // Optimize for push.apply( _, NodeList )
    try {
        push.apply(
            (arr = slice.call( preferredDoc.childNodes )),
            preferredDoc.childNodes
        );
        // Support: Android<4.0
        // Detect silently failing push.apply
        arr[ preferredDoc.childNodes.length ].nodeType;
    } catch ( e ) {
        push = { apply: arr.length ?

            // Leverage slice if possible
            function( target, els ) {
                push_native.apply( target, slice.call(els) );
            } :

            // Support: IE<9
            // Otherwise append directly
            function( target, els ) {
                var j = target.length,
                    i = 0;
                // Can't trust NodeList.length
                while ( (target[j++] = els[i++]) ) {}
                target.length = j - 1;
            }
        };
    }

    function Sizzle( selector, context, results, seed ) {
        var m, i, elem, nid, match, groups, newSelector,
            newContext = context && context.ownerDocument,

            // nodeType defaults to 9, since context defaults to document
            nodeType = context ? context.nodeType : 9;

        results = results || [];

        // Return early from calls with invalid selector or context
        if ( typeof selector !== "string" || !selector ||
            nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

            return results;
        }

        // Try to shortcut find operations (as opposed to filters) in HTML documents
        if ( !seed ) {

            if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
                setDocument( context );
            }
            context = context || document;

            if ( documentIsHTML ) {

                // If the selector is sufficiently simple, try using a "get*By*" DOM method
                // (excepting DocumentFragment context, where the methods don't exist)
                if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

                    // ID selector
                    if ( (m = match[1]) ) {

                        // Document context
                        if ( nodeType === 9 ) {
                            if ( (elem = context.getElementById( m )) ) {

                                // Support: IE, Opera, Webkit
                                // TODO: identify versions
                                // getElementById can match elements by name instead of ID
                                if ( elem.id === m ) {
                                    results.push( elem );
                                    return results;
                                }
                            } else {
                                return results;
                            }

                            // Element context
                        } else {

                            // Support: IE, Opera, Webkit
                            // TODO: identify versions
                            // getElementById can match elements by name instead of ID
                            if ( newContext && (elem = newContext.getElementById( m )) &&
                                contains( context, elem ) &&
                                elem.id === m ) {

                                results.push( elem );
                                return results;
                            }
                        }

                        // Type selector
                    } else if ( match[2] ) {
                        push.apply( results, context.getElementsByTagName( selector ) );
                        return results;

                        // Class selector
                    } else if ( (m = match[3]) && support.getElementsByClassName &&
                        context.getElementsByClassName ) {

                        push.apply( results, context.getElementsByClassName( m ) );
                        return results;
                    }
                }

                // Take advantage of querySelectorAll
                if ( support.qsa &&
                    !compilerCache[ selector + " " ] &&
                    (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

                    if ( nodeType !== 1 ) {
                        newContext = context;
                        newSelector = selector;

                        // qSA looks outside Element context, which is not what we want
                        // Thanks to Andrew Dupont for this workaround technique
                        // Support: IE <=8
                        // Exclude object elements
                    } else if ( context.nodeName.toLowerCase() !== "object" ) {

                        // Capture the context ID, setting it first if necessary
                        if ( (nid = context.getAttribute( "id" )) ) {
                            nid = nid.replace( rcssescape, fcssescape );
                        } else {
                            context.setAttribute( "id", (nid = expando) );
                        }

                        // Prefix every selector in the list
                        groups = tokenize( selector );
                        i = groups.length;
                        while ( i-- ) {
                            groups[i] = "#" + nid + " " + toSelector( groups[i] );
                        }
                        newSelector = groups.join( "," );

                        // Expand context for sibling selectors
                        newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
                            context;
                    }

                    if ( newSelector ) {
                        try {
                            push.apply( results,
                                newContext.querySelectorAll( newSelector )
                            );
                            return results;
                        } catch ( qsaError ) {
                        } finally {
                            if ( nid === expando ) {
                                context.removeAttribute( "id" );
                            }
                        }
                    }
                }
            }
        }

        // All others
        return select( selector.replace( rtrim, "$1" ), context, results, seed );
    }

    /**
     * Create key-value caches of limited size
     * @returns {function(string, object)} Returns the Object data after storing it on itself with
     *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *	deleting the oldest entry
     */
    function createCache() {
        var keys = [];

        function cache( key, value ) {
            // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
            if ( keys.push( key + " " ) > Expr.cacheLength ) {
                // Only keep the most recent entries
                delete cache[ keys.shift() ];
            }
            return (cache[ key + " " ] = value);
        }
        return cache;
    }

    /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */
    function markFunction( fn ) {
        fn[ expando ] = true;
        return fn;
    }

    /**
     * Support testing using an element
     * @param {Function} fn Passed the created element and returns a boolean result
     */
    function assert( fn ) {
        var el = document.createElement("fieldset");

        try {
            return !!fn( el );
        } catch (e) {
            return false;
        } finally {
            // Remove from its parent by default
            if ( el.parentNode ) {
                el.parentNode.removeChild( el );
            }
            // release memory in IE
            el = null;
        }
    }

    /**
     * Adds the same handler for all of the specified attrs
     * @param {String} attrs Pipe-separated list of attributes
     * @param {Function} handler The method that will be applied
     */
    function addHandle( attrs, handler ) {
        var arr = attrs.split("|"),
            i = arr.length;

        while ( i-- ) {
            Expr.attrHandle[ arr[i] ] = handler;
        }
    }

    /**
     * Checks document order of two siblings
     * @param {Element} a
     * @param {Element} b
     * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
     */
    function siblingCheck( a, b ) {
        var cur = b && a,
            diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
                a.sourceIndex - b.sourceIndex;

        // Use IE sourceIndex if available on both nodes
        if ( diff ) {
            return diff;
        }

        // Check if b follows a
        if ( cur ) {
            while ( (cur = cur.nextSibling) ) {
                if ( cur === b ) {
                    return -1;
                }
            }
        }

        return a ? 1 : -1;
    }

    /**
     * Returns a function to use in pseudos for input types
     * @param {String} type
     */
    function createInputPseudo( type ) {
        return function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && elem.type === type;
        };
    }

    /**
     * Returns a function to use in pseudos for buttons
     * @param {String} type
     */
    function createButtonPseudo( type ) {
        return function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return (name === "input" || name === "button") && elem.type === type;
        };
    }

    /**
     * Returns a function to use in pseudos for :enabled/:disabled
     * @param {Boolean} disabled true for :disabled; false for :enabled
     */
    function createDisabledPseudo( disabled ) {
        // Known :disabled false positives:
        // IE: *[disabled]:not(button, input, select, textarea, optgroup, option, menuitem, fieldset)
        // not IE: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
        return function( elem ) {

            // Check form elements and option elements for explicit disabling
            return "label" in elem && elem.disabled === disabled ||
                "form" in elem && elem.disabled === disabled ||

                // Check non-disabled form elements for fieldset[disabled] ancestors
                "form" in elem && elem.disabled === false && (
                    // Support: IE6-11+
                    // Ancestry is covered for us
                    elem.isDisabled === disabled ||

                    // Otherwise, assume any non-<option> under fieldset[disabled] is disabled
                    /* jshint -W018 */
                    elem.isDisabled !== !disabled &&
                        ("label" in elem || !disabledAncestor( elem )) !== disabled
                );
        };
    }

    /**
     * Returns a function to use in pseudos for positionals
     * @param {Function} fn
     */
    function createPositionalPseudo( fn ) {
        return markFunction(function( argument ) {
            argument = +argument;
            return markFunction(function( seed, matches ) {
                var j,
                    matchIndexes = fn( [], seed.length, argument ),
                    i = matchIndexes.length;

                // Match elements found at the specified indexes
                while ( i-- ) {
                    if ( seed[ (j = matchIndexes[i]) ] ) {
                        seed[j] = !(matches[j] = seed[j]);
                    }
                }
            });
        });
    }

    /**
     * Checks a node for validity as a Sizzle context
     * @param {Element|Object=} context
     * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
     */
    function testContext( context ) {
        return context && typeof context.getElementsByTagName !== "undefined" && context;
    }

    // Expose support vars for convenience
    support = Sizzle.support = {};

    /**
     * Detects XML nodes
     * @param {Element|Object} elem An element or a document
     * @returns {Boolean} True iff elem is a non-HTML XML node
     */
    isXML = Sizzle.isXML = function( elem ) {
        // documentElement is verified for cases where it doesn't yet exist
        // (such as loading iframes in IE - #4833)
        var documentElement = elem && (elem.ownerDocument || elem).documentElement;
        return documentElement ? documentElement.nodeName !== "HTML" : false;
    };

    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */
    setDocument = Sizzle.setDocument = function( node ) {
        var hasCompare, subWindow,
            doc = node ? node.ownerDocument || node : preferredDoc;

        // Return early if doc is invalid or already selected
        if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
            return document;
        }

        // Update global variables
        document = doc;
        docElem = document.documentElement;
        documentIsHTML = !isXML( document );

        // Support: IE 9-11, Edge
        // Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
        if ( preferredDoc !== document &&
            (subWindow = document.defaultView) && subWindow.top !== subWindow ) {

            // Support: IE 11, Edge
            if ( subWindow.addEventListener ) {
                subWindow.addEventListener( "unload", unloadHandler, false );

                // Support: IE 9 - 10 only
            } else if ( subWindow.attachEvent ) {
                subWindow.attachEvent( "onunload", unloadHandler );
            }
        }

        /* Attributes
        ---------------------------------------------------------------------- */

        // Support: IE<8
        // Verify that getAttribute really returns attributes and not properties
        // (excepting IE8 booleans)
        support.attributes = assert(function( el ) {
            el.className = "i";
            return !el.getAttribute("className");
        });

        /* getElement(s)By*
        ---------------------------------------------------------------------- */

        // Check if getElementsByTagName("*") returns only elements
        support.getElementsByTagName = assert(function( el ) {
            el.appendChild( document.createComment("") );
            return !el.getElementsByTagName("*").length;
        });

        // Support: IE<9
        support.getElementsByClassName = rnative.test( document.getElementsByClassName );

        // Support: IE<10
        // Check if getElementById returns elements by name
        // The broken getElementById methods don't pick up programmatically-set names,
        // so use a roundabout getElementsByName test
        support.getById = assert(function( el ) {
            docElem.appendChild( el ).id = expando;
            return !document.getElementsByName || !document.getElementsByName( expando ).length;
        });

        // ID filter and find
        if ( support.getById ) {
            Expr.filter["ID"] = function( id ) {
                var attrId = id.replace( runescape, funescape );
                return function( elem ) {
                    return elem.getAttribute("id") === attrId;
                };
            };
            Expr.find["ID"] = function( id, context ) {
                if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
                    var elem = context.getElementById( id );
                    return elem ? [ elem ] : [];
                }
            };
        } else {
            Expr.filter["ID"] =  function( id ) {
                var attrId = id.replace( runescape, funescape );
                return function( elem ) {
                    var node = typeof elem.getAttributeNode !== "undefined" &&
                        elem.getAttributeNode("id");
                    return node && node.value === attrId;
                };
            };

            // Support: IE 6 - 7 only
            // getElementById is not reliable as a find shortcut
            Expr.find["ID"] = function( id, context ) {
                if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
                    var node, i, elems,
                        elem = context.getElementById( id );

                    if ( elem ) {

                        // Verify the id attribute
                        node = elem.getAttributeNode("id");
                        if ( node && node.value === id ) {
                            return [ elem ];
                        }

                        // Fall back on getElementsByName
                        elems = context.getElementsByName( id );
                        i = 0;
                        while ( (elem = elems[i++]) ) {
                            node = elem.getAttributeNode("id");
                            if ( node && node.value === id ) {
                                return [ elem ];
                            }
                        }
                    }

                    return [];
                }
            };
        }

        // Tag
        Expr.find["TAG"] = support.getElementsByTagName ?
            function( tag, context ) {
                if ( typeof context.getElementsByTagName !== "undefined" ) {
                    return context.getElementsByTagName( tag );

                    // DocumentFragment nodes don't have gEBTN
                } else if ( support.qsa ) {
                    return context.querySelectorAll( tag );
                }
            } :

            function( tag, context ) {
                var elem,
                    tmp = [],
                    i = 0,
                    // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
                    results = context.getElementsByTagName( tag );

                // Filter out possible comments
                if ( tag === "*" ) {
                    while ( (elem = results[i++]) ) {
                        if ( elem.nodeType === 1 ) {
                            tmp.push( elem );
                        }
                    }

                    return tmp;
                }
                return results;
            };

        // Class
        Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
            if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
                return context.getElementsByClassName( className );
            }
        };

        /* QSA/matchesSelector
        ---------------------------------------------------------------------- */

        // QSA and matchesSelector support

        // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
        rbuggyMatches = [];

        // qSa(:focus) reports false when true (Chrome 21)
        // We allow this because of a bug in IE8/9 that throws an error
        // whenever `document.activeElement` is accessed on an iframe
        // So, we allow :focus to pass through QSA all the time to avoid the IE error
        // See https://bugs.jquery.com/ticket/13378
        rbuggyQSA = [];

        if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
            // Build QSA regex
            // Regex strategy adopted from Diego Perini
            assert(function( el ) {
                // Select is set to empty string on purpose
                // This is to test IE's treatment of not explicitly
                // setting a boolean content attribute,
                // since its presence should be enough
                // https://bugs.jquery.com/ticket/12359
                docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
                    "<select id='" + expando + "-\r\\' msallowcapture=''>" +
                    "<option selected=''></option></select>";

                // Support: IE8, Opera 11-12.16
                // Nothing should be selected when empty strings follow ^= or $= or *=
                // The test attribute must be unknown in Opera but "safe" for WinRT
                // https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
                if ( el.querySelectorAll("[msallowcapture^='']").length ) {
                    rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
                }

                // Support: IE8
                // Boolean attributes and "value" are not treated correctly
                if ( !el.querySelectorAll("[selected]").length ) {
                    rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
                }

                // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
                if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
                    rbuggyQSA.push("~=");
                }

                // Webkit/Opera - :checked should return selected option elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                // IE8 throws error here and will not see later tests
                if ( !el.querySelectorAll(":checked").length ) {
                    rbuggyQSA.push(":checked");
                }

                // Support: Safari 8+, iOS 8+
                // https://bugs.webkit.org/show_bug.cgi?id=136851
                // In-page `selector#id sibling-combinator selector` fails
                if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
                    rbuggyQSA.push(".#.+[+~]");
                }
            });

            assert(function( el ) {
                el.innerHTML = "<a href='' disabled='disabled'></a>" +
                    "<select disabled='disabled'><option/></select>";

                // Support: Windows 8 Native Apps
                // The type and name attributes are restricted during .innerHTML assignment
                var input = document.createElement("input");
                input.setAttribute( "type", "hidden" );
                el.appendChild( input ).setAttribute( "name", "D" );

                // Support: IE8
                // Enforce case-sensitivity of name attribute
                if ( el.querySelectorAll("[name=d]").length ) {
                    rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
                }

                // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                // IE8 throws error here and will not see later tests
                if ( el.querySelectorAll(":enabled").length !== 2 ) {
                    rbuggyQSA.push( ":enabled", ":disabled" );
                }

                // Support: IE9-11+
                // IE's :disabled selector does not pick up the children of disabled fieldsets
                docElem.appendChild( el ).disabled = true;
                if ( el.querySelectorAll(":disabled").length !== 2 ) {
                    rbuggyQSA.push( ":enabled", ":disabled" );
                }

                // Opera 10-11 does not throw on post-comma invalid pseudos
                el.querySelectorAll("*,:x");
                rbuggyQSA.push(",.*:");
            });
        }

        if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
            docElem.webkitMatchesSelector ||
            docElem.mozMatchesSelector ||
            docElem.oMatchesSelector ||
            docElem.msMatchesSelector) )) ) {

            assert(function( el ) {
                // Check to see if it's possible to do matchesSelector
                // on a disconnected node (IE 9)
                support.disconnectedMatch = matches.call( el, "*" );

                // This should fail with an exception
                // Gecko does not error, returns false instead
                matches.call( el, "[s!='']:x" );
                rbuggyMatches.push( "!=", pseudos );
            });
        }

        rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
        rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

        /* Contains
        ---------------------------------------------------------------------- */
        hasCompare = rnative.test( docElem.compareDocumentPosition );

        // Element contains another
        // Purposefully self-exclusive
        // As in, an element does not contain itself
        contains = hasCompare || rnative.test( docElem.contains ) ?
            function( a, b ) {
                var adown = a.nodeType === 9 ? a.documentElement : a,
                    bup = b && b.parentNode;
                return a === bup || !!( bup && bup.nodeType === 1 && (
                    adown.contains ?
                        adown.contains( bup ) :
                        a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
                ));
            } :
            function( a, b ) {
                if ( b ) {
                    while ( (b = b.parentNode) ) {
                        if ( b === a ) {
                            return true;
                        }
                    }
                }
                return false;
            };

        /* Sorting
        ---------------------------------------------------------------------- */

        // Document order sorting
        sortOrder = hasCompare ?
        function( a, b ) {

            // Flag for duplicate removal
            if ( a === b ) {
                hasDuplicate = true;
                return 0;
            }

            // Sort on method existence if only one input has compareDocumentPosition
            var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
            if ( compare ) {
                return compare;
            }

            // Calculate position if both inputs belong to the same document
            compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
                a.compareDocumentPosition( b ) :

                // Otherwise we know they are disconnected
                1;

            // Disconnected nodes
            if ( compare & 1 ||
                (!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

                // Choose the first element that is related to our preferred document
                if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
                    return -1;
                }
                if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
                    return 1;
                }

                // Maintain original order
                return sortInput ?
                    ( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
                    0;
            }

            return compare & 4 ? -1 : 1;
        } :
        function( a, b ) {
            // Exit early if the nodes are identical
            if ( a === b ) {
                hasDuplicate = true;
                return 0;
            }

            var cur,
                i = 0,
                aup = a.parentNode,
                bup = b.parentNode,
                ap = [ a ],
                bp = [ b ];

            // Parentless nodes are either documents or disconnected
            if ( !aup || !bup ) {
                return a === document ? -1 :
                    b === document ? 1 :
                    aup ? -1 :
                    bup ? 1 :
                    sortInput ?
                    ( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
                    0;

                // If the nodes are siblings, we can do a quick check
            } else if ( aup === bup ) {
                return siblingCheck( a, b );
            }

            // Otherwise we need full lists of their ancestors for comparison
            cur = a;
            while ( (cur = cur.parentNode) ) {
                ap.unshift( cur );
            }
            cur = b;
            while ( (cur = cur.parentNode) ) {
                bp.unshift( cur );
            }

            // Walk down the tree looking for a discrepancy
            while ( ap[i] === bp[i] ) {
                i++;
            }

            return i ?
                // Do a sibling check if the nodes have a common ancestor
                siblingCheck( ap[i], bp[i] ) :

                // Otherwise nodes in our document sort first
                ap[i] === preferredDoc ? -1 :
                bp[i] === preferredDoc ? 1 :
                0;
        };

        return document;
    };

    Sizzle.matches = function( expr, elements ) {
        return Sizzle( expr, null, null, elements );
    };

    Sizzle.matchesSelector = function( elem, expr ) {
        // Set document vars if needed
        if ( ( elem.ownerDocument || elem ) !== document ) {
            setDocument( elem );
        }

        // Make sure that attribute selectors are quoted
        expr = expr.replace( rattributeQuotes, "='$1']" );

        if ( support.matchesSelector && documentIsHTML &&
            !compilerCache[ expr + " " ] &&
            ( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
            ( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

            try {
                var ret = matches.call( elem, expr );

                // IE 9's matchesSelector returns false on disconnected nodes
                if ( ret || support.disconnectedMatch ||
                    // As well, disconnected nodes are said to be in a document
                    // fragment in IE 9
                        elem.document && elem.document.nodeType !== 11 ) {
                    return ret;
                }
            } catch (e) {}
        }

        return Sizzle( expr, document, null, [ elem ] ).length > 0;
    };

    Sizzle.contains = function( context, elem ) {
        // Set document vars if needed
        if ( ( context.ownerDocument || context ) !== document ) {
            setDocument( context );
        }
        return contains( context, elem );
    };

    Sizzle.attr = function( elem, name ) {
        // Set document vars if needed
        if ( ( elem.ownerDocument || elem ) !== document ) {
            setDocument( elem );
        }

        var fn = Expr.attrHandle[ name.toLowerCase() ],
            // Don't get fooled by Object.prototype properties (jQuery #13807)
            val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
                fn( elem, name, !documentIsHTML ) :
                undefined;

        return val !== undefined ?
            val :
            support.attributes || !documentIsHTML ?
                elem.getAttribute( name ) :
                (val = elem.getAttributeNode(name)) && val.specified ?
                    val.value :
                    null;
    };

    Sizzle.escape = function( sel ) {
        return (sel + "").replace( rcssescape, fcssescape );
    };

    Sizzle.error = function( msg ) {
        throw new Error( "Syntax error, unrecognized expression: " + msg );
    };

    /**
     * Document sorting and removing duplicates
     * @param {ArrayLike} results
     */
    Sizzle.uniqueSort = function( results ) {
        var elem,
            duplicates = [],
            j = 0,
            i = 0;

        // Unless we *know* we can detect duplicates, assume their presence
        hasDuplicate = !support.detectDuplicates;
        sortInput = !support.sortStable && results.slice( 0 );
        results.sort( sortOrder );

        if ( hasDuplicate ) {
            while ( (elem = results[i++]) ) {
                if ( elem === results[ i ] ) {
                    j = duplicates.push( i );
                }
            }
            while ( j-- ) {
                results.splice( duplicates[ j ], 1 );
            }
        }

        // Clear input after sorting to release objects
        // See https://github.com/jquery/sizzle/pull/225
        sortInput = null;

        return results;
    };

    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
    getText = Sizzle.getText = function( elem ) {
        var node,
            ret = "",
            i = 0,
            nodeType = elem.nodeType;

        if ( !nodeType ) {
            // If no nodeType, this is expected to be an array
            while ( (node = elem[i++]) ) {
                // Do not traverse comment nodes
                ret += getText( node );
            }
        } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
            // Use textContent for elements
            // innerText usage removed for consistency of new lines (jQuery #11153)
            if ( typeof elem.textContent === "string" ) {
                return elem.textContent;
            } else {
                // Traverse its children
                for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                    ret += getText( elem );
                }
            }
        } else if ( nodeType === 3 || nodeType === 4 ) {
            return elem.nodeValue;
        }
        // Do not include comment or processing instruction nodes

        return ret;
    };

    Expr = Sizzle.selectors = {

        // Can be adjusted by the user
        cacheLength: 50,

        createPseudo: markFunction,

        match: matchExpr,

        attrHandle: {},

        find: {},

        relative: {
            ">": { dir: "parentNode", first: true },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: true },
            "~": { dir: "previousSibling" }
        },

        preFilter: {
            "ATTR": function( match ) {
                match[1] = match[1].replace( runescape, funescape );

                // Move the given value to match[3] whether quoted or unquoted
                match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

                if ( match[2] === "~=" ) {
                    match[3] = " " + match[3] + " ";
                }

                return match.slice( 0, 4 );
            },

            "CHILD": function( match ) {
                /* matches from matchExpr["CHILD"]
                    1 type (only|nth|...)
                    2 what (child|of-type)
                    3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                    4 xn-component of xn+y argument ([+-]?\d*n|)
                    5 sign of xn-component
                    6 x of xn-component
                    7 sign of y-component
                    8 y of y-component
                */
                match[1] = match[1].toLowerCase();

                if ( match[1].slice( 0, 3 ) === "nth" ) {
                    // nth-* requires argument
                    if ( !match[3] ) {
                        Sizzle.error( match[0] );
                    }

                    // numeric x and y parameters for Expr.filter.CHILD
                    // remember that false/true cast respectively to 0/1
                    match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
                    match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

                    // other types prohibit arguments
                } else if ( match[3] ) {
                    Sizzle.error( match[0] );
                }

                return match;
            },

            "PSEUDO": function( match ) {
                var excess,
                    unquoted = !match[6] && match[2];

                if ( matchExpr["CHILD"].test( match[0] ) ) {
                    return null;
                }

                // Accept quoted arguments as-is
                if ( match[3] ) {
                    match[2] = match[4] || match[5] || "";

                    // Strip excess characters from unquoted arguments
                } else if ( unquoted && rpseudo.test( unquoted ) &&
                    // Get excess from tokenize (recursively)
                    (excess = tokenize( unquoted, true )) &&
                    // advance to the next closing parenthesis
                    (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

                    // excess is a negative index
                    match[0] = match[0].slice( 0, excess );
                    match[2] = unquoted.slice( 0, excess );
                }

                // Return only captures needed by the pseudo filter method (type and argument)
                return match.slice( 0, 3 );
            }
        },

        filter: {

            "TAG": function( nodeNameSelector ) {
                var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
                return nodeNameSelector === "*" ?
                    function() { return true; } :
                    function( elem ) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
            },

            "CLASS": function( className ) {
                var pattern = classCache[ className + " " ];

                return pattern ||
                    (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
                    classCache( className, function( elem ) {
                        return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
                    });
            },

            "ATTR": function( name, operator, check ) {
                return function( elem ) {
                    var result = Sizzle.attr( elem, name );

                    if ( result == null ) {
                        return operator === "!=";
                    }
                    if ( !operator ) {
                        return true;
                    }

                    result += "";

                    return operator === "=" ? result === check :
                        operator === "!=" ? result !== check :
                        operator === "^=" ? check && result.indexOf( check ) === 0 :
                        operator === "*=" ? check && result.indexOf( check ) > -1 :
                        operator === "$=" ? check && result.slice( -check.length ) === check :
                        operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
                        operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
                        false;
                };
            },

            "CHILD": function( type, what, argument, first, last ) {
                var simple = type.slice( 0, 3 ) !== "nth",
                    forward = type.slice( -4 ) !== "last",
                    ofType = what === "of-type";

                return first === 1 && last === 0 ?

                    // Shortcut for :nth-*(n)
                    function( elem ) {
                        return !!elem.parentNode;
                    } :

                    function( elem, context, xml ) {
                        var cache, uniqueCache, outerCache, node, nodeIndex, start,
                            dir = simple !== forward ? "nextSibling" : "previousSibling",
                            parent = elem.parentNode,
                            name = ofType && elem.nodeName.toLowerCase(),
                            useCache = !xml && !ofType,
                            diff = false;

                        if ( parent ) {

                            // :(first|last|only)-(child|of-type)
                            if ( simple ) {
                                while ( dir ) {
                                    node = elem;
                                    while ( (node = node[ dir ]) ) {
                                        if ( ofType ?
                                            node.nodeName.toLowerCase() === name :
                                            node.nodeType === 1 ) {

                                            return false;
                                        }
                                    }
                                    // Reverse direction for :only-* (if we haven't yet done so)
                                    start = dir = type === "only" && !start && "nextSibling";
                                }
                                return true;
                            }

                            start = [ forward ? parent.firstChild : parent.lastChild ];

                            // non-xml :nth-child(...) stores cache data on `parent`
                            if ( forward && useCache ) {

                                // Seek `elem` from a previously-cached index

                                // ...in a gzip-friendly way
                                node = parent;
                                outerCache = node[ expando ] || (node[ expando ] = {});

                                // Support: IE <9 only
                                // Defend against cloned attroperties (jQuery gh-1709)
                                uniqueCache = outerCache[ node.uniqueID ] ||
                                    (outerCache[ node.uniqueID ] = {});

                                cache = uniqueCache[ type ] || [];
                                nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
                                diff = nodeIndex && cache[ 2 ];
                                node = nodeIndex && parent.childNodes[ nodeIndex ];

                                while ( (node = ++nodeIndex && node && node[ dir ] ||

                                    // Fallback to seeking `elem` from the start
                                    (diff = nodeIndex = 0) || start.pop()) ) {

                                    // When found, cache indexes on `parent` and break
                                    if ( node.nodeType === 1 && ++diff && node === elem ) {
                                        uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
                                        break;
                                    }
                                }

                            } else {
                                // Use previously-cached element index if available
                                if ( useCache ) {
                                    // ...in a gzip-friendly way
                                    node = elem;
                                    outerCache = node[ expando ] || (node[ expando ] = {});

                                    // Support: IE <9 only
                                    // Defend against cloned attroperties (jQuery gh-1709)
                                    uniqueCache = outerCache[ node.uniqueID ] ||
                                        (outerCache[ node.uniqueID ] = {});

                                    cache = uniqueCache[ type ] || [];
                                    nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
                                    diff = nodeIndex;
                                }

                                // xml :nth-child(...)
                                // or :nth-last-child(...) or :nth(-last)?-of-type(...)
                                if ( diff === false ) {
                                    // Use the same loop as above to seek `elem` from the start
                                    while ( (node = ++nodeIndex && node && node[ dir ] ||
                                        (diff = nodeIndex = 0) || start.pop()) ) {

                                        if ( ( ofType ?
                                            node.nodeName.toLowerCase() === name :
                                            node.nodeType === 1 ) &&
                                            ++diff ) {

                                            // Cache the index of each encountered element
                                            if ( useCache ) {
                                                outerCache = node[ expando ] || (node[ expando ] = {});

                                                // Support: IE <9 only
                                                // Defend against cloned attroperties (jQuery gh-1709)
                                                uniqueCache = outerCache[ node.uniqueID ] ||
                                                    (outerCache[ node.uniqueID ] = {});

                                                uniqueCache[ type ] = [ dirruns, diff ];
                                            }

                                            if ( node === elem ) {
                                                break;
                                            }
                                        }
                                    }
                                }
                            }

                            // Incorporate the offset, then check against cycle size
                            diff -= last;
                            return diff === first || ( diff % first === 0 && diff / first >= 0 );
                        }
                    };
            },

            "PSEUDO": function( pseudo, argument ) {
                // pseudo-class names are case-insensitive
                // http://www.w3.org/TR/selectors/#pseudo-classes
                // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                // Remember that setFilters inherits from pseudos
                var args,
                    fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
                        Sizzle.error( "unsupported pseudo: " + pseudo );

                // The user may use createPseudo to indicate that
                // arguments are needed to create the filter function
                // just as Sizzle does
                if ( fn[ expando ] ) {
                    return fn( argument );
                }

                // But maintain support for old signatures
                if ( fn.length > 1 ) {
                    args = [ pseudo, pseudo, "", argument ];
                    return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
                        markFunction(function( seed, matches ) {
                            var idx,
                                matched = fn( seed, argument ),
                                i = matched.length;
                            while ( i-- ) {
                                idx = indexOf( seed, matched[i] );
                                seed[ idx ] = !( matches[ idx ] = matched[i] );
                            }
                        }) :
                        function( elem ) {
                            return fn( elem, 0, args );
                        };
                }

                return fn;
            }
        },

        pseudos: {
            // Potentially complex pseudos
            "not": markFunction(function( selector ) {
                // Trim the selector passed to compile
                // to avoid treating leading and trailing
                // spaces as combinators
                var input = [],
                    results = [],
                    matcher = compile( selector.replace( rtrim, "$1" ) );

                return matcher[ expando ] ?
                    markFunction(function( seed, matches, context, xml ) {
                        var elem,
                            unmatched = matcher( seed, null, xml, [] ),
                            i = seed.length;

                        // Match elements unmatched by `matcher`
                        while ( i-- ) {
                            if ( (elem = unmatched[i]) ) {
                                seed[i] = !(matches[i] = elem);
                            }
                        }
                    }) :
                    function( elem, context, xml ) {
                        input[0] = elem;
                        matcher( input, null, xml, results );
                        // Don't keep the element (issue #299)
                        input[0] = null;
                        return !results.pop();
                    };
            }),

            "has": markFunction(function( selector ) {
                return function( elem ) {
                    return Sizzle( selector, elem ).length > 0;
                };
            }),

            "contains": markFunction(function( text ) {
                text = text.replace( runescape, funescape );
                return function( elem ) {
                    return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
                };
            }),

            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // http://www.w3.org/TR/selectors/#lang-pseudo
            "lang": markFunction( function( lang ) {
                // lang value must be a valid identifier
                if ( !ridentifier.test(lang || "") ) {
                    Sizzle.error( "unsupported lang: " + lang );
                }
                lang = lang.replace( runescape, funescape ).toLowerCase();
                return function( elem ) {
                    var elemLang;
                    do {
                        if ( (elemLang = documentIsHTML ?
                            elem.lang :
                            elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

                            elemLang = elemLang.toLowerCase();
                            return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
                        }
                    } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
                    return false;
                };
            }),

            // Miscellaneous
            "target": function( elem ) {
                var hash = window.location && window.location.hash;
                return hash && hash.slice( 1 ) === elem.id;
            },

            "root": function( elem ) {
                return elem === docElem;
            },

            "focus": function( elem ) {
                return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
            },

            // Boolean properties
            "enabled": createDisabledPseudo( false ),
            "disabled": createDisabledPseudo( true ),

            "checked": function( elem ) {
                // In CSS3, :checked should return both checked and selected elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                var nodeName = elem.nodeName.toLowerCase();
                return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
            },

            "selected": function( elem ) {
                // Accessing this property makes selected-by-default
                // options in Safari work properly
                if ( elem.parentNode ) {
                    elem.parentNode.selectedIndex;
                }

                return elem.selected === true;
            },

            // Contents
            "empty": function( elem ) {
                // http://www.w3.org/TR/selectors/#empty-pseudo
                // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
                //   but not by others (comment: 8; processing instruction: 7; etc.)
                // nodeType < 6 works because attributes (2) do not appear as children
                for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                    if ( elem.nodeType < 6 ) {
                        return false;
                    }
                }
                return true;
            },

            "parent": function( elem ) {
                return !Expr.pseudos["empty"]( elem );
            },

            // Element/input types
            "header": function( elem ) {
                return rheader.test( elem.nodeName );
            },

            "input": function( elem ) {
                return rinputs.test( elem.nodeName );
            },

            "button": function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === "button" || name === "button";
            },

            "text": function( elem ) {
                var attr;
                return elem.nodeName.toLowerCase() === "input" &&
                    elem.type === "text" &&

                    // Support: IE<8
                    // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                    ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
            },

            // Position-in-collection
            "first": createPositionalPseudo(function() {
                return [ 0 ];
            }),

            "last": createPositionalPseudo(function( matchIndexes, length ) {
                return [ length - 1 ];
            }),

            "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
                return [ argument < 0 ? argument + length : argument ];
            }),

            "even": createPositionalPseudo(function( matchIndexes, length ) {
                var i = 0;
                for ( ; i < length; i += 2 ) {
                    matchIndexes.push( i );
                }
                return matchIndexes;
            }),

            "odd": createPositionalPseudo(function( matchIndexes, length ) {
                var i = 1;
                for ( ; i < length; i += 2 ) {
                    matchIndexes.push( i );
                }
                return matchIndexes;
            }),

            "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                var i = argument < 0 ? argument + length : argument;
                for ( ; --i >= 0; ) {
                    matchIndexes.push( i );
                }
                return matchIndexes;
            }),

            "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                var i = argument < 0 ? argument + length : argument;
                for ( ; ++i < length; ) {
                    matchIndexes.push( i );
                }
                return matchIndexes;
            })
        }
    };

    Expr.pseudos["nth"] = Expr.pseudos["eq"];

    // Add button/input type pseudos
    for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
        Expr.pseudos[ i ] = createInputPseudo( i );
    }
    for ( i in { submit: true, reset: true } ) {
        Expr.pseudos[ i ] = createButtonPseudo( i );
    }

    // Easy API for creating new setFilters
    function setFilters() {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();

    tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
        var matched, match, tokens, type,
            soFar, groups, preFilters,
            cached = tokenCache[ selector + " " ];

        if ( cached ) {
            return parseOnly ? 0 : cached.slice( 0 );
        }

        soFar = selector;
        groups = [];
        preFilters = Expr.preFilter;

        while ( soFar ) {

            // Comma and first run
            if ( !matched || (match = rcomma.exec( soFar )) ) {
                if ( match ) {
                    // Don't consume trailing commas as valid
                    soFar = soFar.slice( match[0].length ) || soFar;
                }
                groups.push( (tokens = []) );
            }

            matched = false;

            // Combinators
            if ( (match = rcombinators.exec( soFar )) ) {
                matched = match.shift();
                tokens.push({
                    value: matched,
                    // Cast descendant combinators to space
                    type: match[0].replace( rtrim, " " )
                });
                soFar = soFar.slice( matched.length );
            }

            // Filters
            for ( type in Expr.filter ) {
                if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
                    (match = preFilters[ type ]( match ))) ) {
                    matched = match.shift();
                    tokens.push({
                        value: matched,
                        type: type,
                        matches: match
                    });
                    soFar = soFar.slice( matched.length );
                }
            }

            if ( !matched ) {
                break;
            }
        }

        // Return the length of the invalid excess
        // if we're just parsing
        // Otherwise, throw an error or return tokens
        return parseOnly ?
            soFar.length :
            soFar ?
                Sizzle.error( selector ) :
                // Cache the tokens
                tokenCache( selector, groups ).slice( 0 );
    };

    function toSelector( tokens ) {
        var i = 0,
            len = tokens.length,
            selector = "";
        for ( ; i < len; i++ ) {
            selector += tokens[i].value;
        }
        return selector;
    }

    function addCombinator( matcher, combinator, base ) {
        var dir = combinator.dir,
            skip = combinator.next,
            key = skip || dir,
            checkNonElements = base && key === "parentNode",
            doneName = done++;

        return combinator.first ?
            // Check against closest ancestor/preceding element
            function( elem, context, xml ) {
                while ( (elem = elem[ dir ]) ) {
                    if ( elem.nodeType === 1 || checkNonElements ) {
                        return matcher( elem, context, xml );
                    }
                }
            } :

            // Check against all ancestor/preceding elements
            function( elem, context, xml ) {
                var oldCache, uniqueCache, outerCache,
                    newCache = [ dirruns, doneName ];

                // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
                if ( xml ) {
                    while ( (elem = elem[ dir ]) ) {
                        if ( elem.nodeType === 1 || checkNonElements ) {
                            if ( matcher( elem, context, xml ) ) {
                                return true;
                            }
                        }
                    }
                } else {
                    while ( (elem = elem[ dir ]) ) {
                        if ( elem.nodeType === 1 || checkNonElements ) {
                            outerCache = elem[ expando ] || (elem[ expando ] = {});

                            // Support: IE <9 only
                            // Defend against cloned attroperties (jQuery gh-1709)
                            uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

                            if ( skip && skip === elem.nodeName.toLowerCase() ) {
                                elem = elem[ dir ] || elem;
                            } else if ( (oldCache = uniqueCache[ key ]) &&
                                oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

                                // Assign to newCache so results back-propagate to previous elements
                                return (newCache[ 2 ] = oldCache[ 2 ]);
                            } else {
                                // Reuse newcache so results back-propagate to previous elements
                                uniqueCache[ key ] = newCache;

                                // A match means we're done; a fail means we have to keep checking
                                if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            };
    }

    function elementMatcher( matchers ) {
        return matchers.length > 1 ?
            function( elem, context, xml ) {
                var i = matchers.length;
                while ( i-- ) {
                    if ( !matchers[i]( elem, context, xml ) ) {
                        return false;
                    }
                }
                return true;
            } :
            matchers[0];
    }

    function multipleContexts( selector, contexts, results ) {
        var i = 0,
            len = contexts.length;
        for ( ; i < len; i++ ) {
            Sizzle( selector, contexts[i], results );
        }
        return results;
    }

    function condense( unmatched, map, filter, context, xml ) {
        var elem,
            newUnmatched = [],
            i = 0,
            len = unmatched.length,
            mapped = map != null;

        for ( ; i < len; i++ ) {
            if ( (elem = unmatched[i]) ) {
                if ( !filter || filter( elem, context, xml ) ) {
                    newUnmatched.push( elem );
                    if ( mapped ) {
                        map.push( i );
                    }
                }
            }
        }

        return newUnmatched;
    }

    function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
        if ( postFilter && !postFilter[ expando ] ) {
            postFilter = setMatcher( postFilter );
        }
        if ( postFinder && !postFinder[ expando ] ) {
            postFinder = setMatcher( postFinder, postSelector );
        }
        return markFunction(function( seed, results, context, xml ) {
            var temp, i, elem,
                preMap = [],
                postMap = [],
                preexisting = results.length,

                // Get initial elements from seed or context
                elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

                // Prefilter to get matcher input, preserving a map for seed-results synchronization
                matcherIn = preFilter && ( seed || !selector ) ?
                    condense( elems, preMap, preFilter, context, xml ) :
                    elems,

                matcherOut = matcher ?
                    // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                    postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                        // ...intermediate processing is necessary
                        [] :

                        // ...otherwise use results directly
                results :
                    matcherIn;

            // Find primary matches
            if ( matcher ) {
                matcher( matcherIn, matcherOut, context, xml );
            }

            // Apply postFilter
            if ( postFilter ) {
                temp = condense( matcherOut, postMap );
                postFilter( temp, [], context, xml );

                // Un-match failing elements by moving them back to matcherIn
                i = temp.length;
                while ( i-- ) {
                    if ( (elem = temp[i]) ) {
                        matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
                    }
                }
            }

            if ( seed ) {
                if ( postFinder || preFilter ) {
                    if ( postFinder ) {
                        // Get the final matcherOut by condensing this intermediate into postFinder contexts
                        temp = [];
                        i = matcherOut.length;
                        while ( i-- ) {
                            if ( (elem = matcherOut[i]) ) {
                                // Restore matcherIn since elem is not yet a final match
                                temp.push( (matcherIn[i] = elem) );
                            }
                        }
                        postFinder( null, (matcherOut = []), temp, xml );
                    }

                    // Move matched elements from seed to results to keep them synchronized
                    i = matcherOut.length;
                    while ( i-- ) {
                        if ( (elem = matcherOut[i]) &&
                            (temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

                            seed[temp] = !(results[temp] = elem);
                        }
                    }
                }

                // Add elements to results, through postFinder if defined
            } else {
                matcherOut = condense(
                    matcherOut === results ?
                        matcherOut.splice( preexisting, matcherOut.length ) :
                        matcherOut
                );
                if ( postFinder ) {
                    postFinder( null, results, matcherOut, xml );
                } else {
                    push.apply( results, matcherOut );
                }
            }
        });
    }

    function matcherFromTokens( tokens ) {
        var checkContext, matcher, j,
            len = tokens.length,
            leadingRelative = Expr.relative[ tokens[0].type ],
            implicitRelative = leadingRelative || Expr.relative[" "],
            i = leadingRelative ? 1 : 0,

            // The foundational matcher ensures that elements are reachable from top-level context(s)
            matchContext = addCombinator( function( elem ) {
                return elem === checkContext;
            }, implicitRelative, true ),
            matchAnyContext = addCombinator( function( elem ) {
                return indexOf( checkContext, elem ) > -1;
            }, implicitRelative, true ),
            matchers = [ function( elem, context, xml ) {
                var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                    (checkContext = context).nodeType ?
                        matchContext( elem, context, xml ) :
                        matchAnyContext( elem, context, xml ) );
                // Avoid hanging onto element (issue #299)
                checkContext = null;
                return ret;
            } ];

        for ( ; i < len; i++ ) {
            if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
                matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
            } else {
                matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

                // Return special upon seeing a positional matcher
                if ( matcher[ expando ] ) {
                    // Find the next relative operator (if any) for proper handling
                    j = ++i;
                    for ( ; j < len; j++ ) {
                        if ( Expr.relative[ tokens[j].type ] ) {
                            break;
                        }
                    }
                    return setMatcher(
                        i > 1 && elementMatcher( matchers ),
                        i > 1 && toSelector(
                            // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                            tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
                        ).replace( rtrim, "$1" ),
                        matcher,
                        i < j && matcherFromTokens( tokens.slice( i, j ) ),
                        j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
                        j < len && toSelector( tokens )
                    );
                }
                matchers.push( matcher );
            }
        }

        return elementMatcher( matchers );
    }

    function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
        var bySet = setMatchers.length > 0,
            byElement = elementMatchers.length > 0,
            superMatcher = function( seed, context, xml, results, outermost ) {
                var elem, j, matcher,
                    matchedCount = 0,
                    i = "0",
                    unmatched = seed && [],
                    setMatched = [],
                    contextBackup = outermostContext,
                    // We must always have either seed elements or outermost context
                    elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
                    // Use integer dirruns iff this is the outermost matcher
                    dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                    len = elems.length;

                if ( outermost ) {
                    outermostContext = context === document || context || outermost;
                }

                // Add elements passing elementMatchers directly to results
                // Support: IE<9, Safari
                // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
                    if ( byElement && elem ) {
                        j = 0;
                        if ( !context && elem.ownerDocument !== document ) {
                            setDocument( elem );
                            xml = !documentIsHTML;
                        }
                        while ( (matcher = elementMatchers[j++]) ) {
                            if ( matcher( elem, context || document, xml) ) {
                                results.push( elem );
                                break;
                            }
                        }
                        if ( outermost ) {
                            dirruns = dirrunsUnique;
                        }
                    }

                    // Track unmatched elements for set filters
                    if ( bySet ) {
                        // They will have gone through all possible matchers
                        if ( (elem = !matcher && elem) ) {
                            matchedCount--;
                        }

                        // Lengthen the array for every element, matched or not
                        if ( seed ) {
                            unmatched.push( elem );
                        }
                    }
                }

                // `i` is now the count of elements visited above, and adding it to `matchedCount`
                // makes the latter nonnegative.
                matchedCount += i;

                // Apply set filters to unmatched elements
                // NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
                // equals `i`), unless we didn't visit _any_ elements in the above loop because we have
                // no element matchers and no seed.
                // Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
                // case, which will result in a "00" `matchedCount` that differs from `i` but is also
                // numerically zero.
                if ( bySet && i !== matchedCount ) {
                    j = 0;
                    while ( (matcher = setMatchers[j++]) ) {
                        matcher( unmatched, setMatched, context, xml );
                    }

                    if ( seed ) {
                        // Reintegrate element matches to eliminate the need for sorting
                        if ( matchedCount > 0 ) {
                            while ( i-- ) {
                                if ( !(unmatched[i] || setMatched[i]) ) {
                                    setMatched[i] = pop.call( results );
                                }
                            }
                        }

                        // Discard index placeholder values to get only actual matches
                        setMatched = condense( setMatched );
                    }

                    // Add matches to results
                    push.apply( results, setMatched );

                    // Seedless set matches succeeding multiple successful matchers stipulate sorting
                    if ( outermost && !seed && setMatched.length > 0 &&
                        ( matchedCount + setMatchers.length ) > 1 ) {

                        Sizzle.uniqueSort( results );
                    }
                }

                // Override manipulation of globals by nested matchers
                if ( outermost ) {
                    dirruns = dirrunsUnique;
                    outermostContext = contextBackup;
                }

                return unmatched;
            };

        return bySet ?
            markFunction( superMatcher ) :
            superMatcher;
    }

    compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
        var i,
            setMatchers = [],
            elementMatchers = [],
            cached = compilerCache[ selector + " " ];

        if ( !cached ) {
            // Generate a function of recursive functions that can be used to check each element
            if ( !match ) {
                match = tokenize( selector );
            }
            i = match.length;
            while ( i-- ) {
                cached = matcherFromTokens( match[i] );
                if ( cached[ expando ] ) {
                    setMatchers.push( cached );
                } else {
                    elementMatchers.push( cached );
                }
            }

            // Cache the compiled function
            cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

            // Save selector and tokenization
            cached.selector = selector;
        }
        return cached;
    };

    /**
     * A low-level selection function that works with Sizzle's compiled
     *  selector functions
     * @param {String|Function} selector A selector or a pre-compiled
     *  selector function built with Sizzle.compile
     * @param {Element} context
     * @param {Array} [results]
     * @param {Array} [seed] A set of elements to match against
     */
    select = Sizzle.select = function( selector, context, results, seed ) {
        var i, tokens, token, type, find,
            compiled = typeof selector === "function" && selector,
            match = !seed && tokenize( (selector = compiled.selector || selector) );

        results = results || [];

        // Try to minimize operations if there is only one selector in the list and no seed
        // (the latter of which guarantees us context)
        if ( match.length === 1 ) {

            // Reduce context if the leading compound selector is an ID
            tokens = match[0] = match[0].slice( 0 );
            if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                    context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

                context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
                if ( !context ) {
                    return results;

                    // Precompiled matchers will still verify ancestry, so step up a level
                } else if ( compiled ) {
                    context = context.parentNode;
                }

                selector = selector.slice( tokens.shift().value.length );
            }

            // Fetch a seed set for right-to-left matching
            i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
            while ( i-- ) {
                token = tokens[i];

                // Abort if we hit a combinator
                if ( Expr.relative[ (type = token.type) ] ) {
                    break;
                }
                if ( (find = Expr.find[ type ]) ) {
                    // Search, expanding context for leading sibling combinators
                    if ( (seed = find(
                        token.matches[0].replace( runescape, funescape ),
                        rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
                    )) ) {

                        // If seed is empty or no tokens remain, we can return early
                        tokens.splice( i, 1 );
                        selector = seed.length && toSelector( tokens );
                        if ( !selector ) {
                            push.apply( results, seed );
                            return results;
                        }

                        break;
                    }
                }
            }
        }

        // Compile and execute a filtering function if one is not provided
        // Provide `match` to avoid retokenization if we modified the selector above
        ( compiled || compile( selector, match ) )(
            seed,
            context,
            !documentIsHTML,
            results,
            !context || rsibling.test( selector ) && testContext( context.parentNode ) || context
        );
        return results;
    };

    // One-time assignments

    // Sort stability
    support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

    // Support: Chrome 14-35+
    // Always assume duplicates if they aren't passed to the comparison function
    support.detectDuplicates = !!hasDuplicate;

    // Initialize against the default document
    setDocument();

    // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
    // Detached nodes confoundingly follow *each other*
    support.sortDetached = assert(function( el ) {
        // Should return 1, but returns 4 (following)
        return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
    });

    // Support: IE<8
    // Prevent attribute/property "interpolation"
    // https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    if ( !assert(function( el ) {
        el.innerHTML = "<a href='#'></a>";
        return el.firstChild.getAttribute("href") === "#" ;
    }) ) {
        addHandle( "type|href|height|width", function( elem, name, isXML ) {
            if ( !isXML ) {
                return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
            }
        });
    }

    // Support: IE<9
    // Use defaultValue in place of getAttribute("value")
    if ( !support.attributes || !assert(function( el ) {
        el.innerHTML = "<input/>";
        el.firstChild.setAttribute( "value", "" );
        return el.firstChild.getAttribute( "value" ) === "";
    }) ) {
        addHandle( "value", function( elem, name, isXML ) {
            if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
                return elem.defaultValue;
            }
        });
    }

    // Support: IE<9
    // Use getAttributeNode to fetch booleans when getAttribute lies
    if ( !assert(function( el ) {
        return el.getAttribute("disabled") == null;
    }) ) {
        addHandle( booleans, function( elem, name, isXML ) {
            var val;
            if ( !isXML ) {
                return elem[ name ] === true ? name.toLowerCase() :
                        (val = elem.getAttributeNode( name )) && val.specified ?
                        val.value :
                    null;
            }
        });
    }

    // EXPOSE
    var _sizzle = window.Sizzle;

    Sizzle.noConflict = function() {
        if ( window.Sizzle === Sizzle ) {
            window.Sizzle = _sizzle;
        }

        return Sizzle;
    };

    // EXPOSE

    return Sizzle;
};
