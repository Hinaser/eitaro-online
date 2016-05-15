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

// Where the search result content should be displayed. One of the ["tab", "sidebar", "panel"].
var display_target = "tab";

// Setting of frame which boards search input field and buttons.
var frame_url = "./frame.html";
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

// Utility
var util = require('lib/util');

// Db setup
var Database = require('lib/db');
var db = new Database();
db.open(service_url);


// Initial sidebar setup
var Sidebar = require('lib/sidebar');
var sidebar = new Sidebar("英太郎 ONLINE", db, util.sanitizeHtml);

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
        db.clear();
    }
});
prefs.on("export", function(){
    util.exportFormattedDataToFile(db);
});
prefs.on("dump", function(){
    util.exportDumpToFile(db);
});

/*
 * Definition of functions
 */

// Search keyword from configured url
function search(search_keyword){
    // Trim extra space. If search_keyword is empty, stop processing.
    search_keyword = util.trim_space(search_keyword);
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
    var result = util.parseSearchResult(response.text, service_selector, prefs.prefs['servicedeselector']);

    if(prefs.prefs['displaytarget'] == "panel"){
        +function(url){
            var xhr = Request({
                url: url,
                onComplete: function(response){
                    panel_content = result;
                    db.add(search_keyword, panel_content);
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
        var xhr = Request({
            url: request_url,
            onComplete: function(response){
                db.add(search_keyword, result);
                if(prefs.prefs["preservehistory"]){
                    sidebar.showHistory({show_first_data: true});
                }
                else {
                    sidebar.showSearchResult(result);
                }
            }
        });
        xhr.get();
    }
    else {
        var store_result_as_history = function(tab){
            var window = getTabContentWindow (getTabForId(tab.id));
            var html_as_string = window.document.documentElement.outerHTML;
            db.add(search_keyword, result);
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


// Open configuration tab
function config() {
    tabs.open("about:addons");
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
            sidebar.showHistory();
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



