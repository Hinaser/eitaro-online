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
var { Cc, Ci } = require("chrome");
var cm = require("sdk/context-menu");
var tabs = require("sdk/tabs");
var { getTabForId, getTabContentWindow } = require ("sdk/tabs/utils");
var parser = Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser);
var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);

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
var sidebar_url = "./sidebar.html";
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
        if(sidebar_history_content && sidebar_history_content.data && sidebar_history_content.data.records){
            for(var i=0;i<sidebar_history_content.data.records.length;i++){
                sidebar_history_content.data.records[i].result = sanitizeHtml(sidebar_history_content.data.records[i].result);
            }
        }
    }
    else{
        sidebar_content = sanitizeHtml(sidebar_content);
    }
}

// Db setup
var Database = require('lib/db');
db = new Database();
db.open(service_url);


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
                    db.remove(word, function(){
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
    db.add(word, result);
}

// Clear search result history
function clear_result(){
    db.clear();
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
    if(db.name != service_url){
        db.reopen(service_url);
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

    try {
        content_to_return = document.querySelector(service_selector);

        // Remove child nodes which jeopardizes page content.
        try {
            if(!/^\s*$/.test(prefs.prefs["servicedeselector"])){
                let node_list = document.querySelectorAll(service_selector + " " + prefs.prefs["servicedeselector"]);
                let node_array = Array.from(node_list); // Converts nodeList into Array of nodes
                node_array.forEach(function(ele){
                    ele.parentNode.removeChild(ele);
                });
            }
        }
        catch(e){
            console.error(e);
        }

        content_to_return = content_to_return.innerHTML;
    } catch(e) {
        console.error(e);
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
    db.getAll("dtime", "prev", function(objects){
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
        db.getAll("dtime", "prev", function(item){
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
        db.getAll("dtime", "prev", function(item){
            var TextWriter = fileIO.open(theFile.path, "w");
            if (!TextWriter.closed) {
                var text_to_write = "<html>\n" +
                                    "<head>\n" +
                                    "<meta charset='utf-8'>\n" +
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
