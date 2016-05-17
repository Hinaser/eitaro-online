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
var { Cc, Ci } = require("chrome");
var cm = require("sdk/context-menu");
var tabs = require("sdk/tabs");
var { getTabForId, getTabContentWindow } = require ("sdk/tabs/utils");
var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);

// Variable to manage opened tab. Once a tab is opened by this script,
// the tab will be re-used to display information. So we need to track which tab is opened by this script.
var opened_tab = null;

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


// Utility
var Util = require('lib/util');

// Db setup
var Database = require('lib/db');
var db = new Database();
db.open(prefs.prefs["serviceurl"]);

// Sidebar setup
var Sidebar = require('lib/sidebar');
var sidebar = new Sidebar("英太郎 ONLINE", db, Util.sanitizeHtml);

// Panel setup
var Panel = require('lib/panel');
var panel = new Panel(prefs.prefs["panelposition"]);

prefs.on("preservehistory", function(){
    prefs.prefs["displaytarget"] = "sidebar";
});
prefs.on("panelposition", function(){
    panel.set_panel_position(prefs.prefs["panelposition"]);
    prefs.prefs["displaytarget"] = "panel";
});
prefs.on("alwaysopennewtab", function(){
    prefs.prefs["displaytarget"] = "tab";
});
prefs.on("servicename", function(){
    toolbar_title = prefs.prefs["servicename"] + "で検索";
    var msg = {};
    msg.type = "update-placeholder";
    msg.data = toolbar_title;
    frame.postMessage(JSON.stringify(msg), frame_url);
    sidebar_title = prefs.prefs["servicename"];
});
prefs.on("serviceurl", function(){
});
prefs.on("serviceselector", function(){
    prefs.prefs["serviceselector"] = prefs.prefs["serviceselector"];
});
prefs.on("clearresult", function(){
    if (prompts.confirm(null, "警告", "全ての履歴が削除され、元に戻せませんがよろしいですか？")) {
        db.clear();
    }
});
prefs.on("export", function(){
    Util.exportFormattedDataToFile(db);
});
prefs.on("dump", function(){
    Util.exportDumpToFile(db);
});

// Search keyword from configured url
function search(search_keyword){
    // Trim extra space. If search_keyword is empty, stop processing.
    search_keyword = Util.trim_space(search_keyword);
    if(!search_keyword || /^\s*$/.test(search_keyword)){
        prompts.alert(null, "注意", "検索キーワードが空です。");
        return;
    }

    // Reopen indexeddb if service url has changed since last search()
    if(db.name != prefs.prefs["serviceurl"]){
        db.reopen(prefs.prefs["serviceurl"]);
    }

    // Get search keyword from input field and construct url for dictionary service
    var request_url = prefs.prefs["serviceurl"].replace("{0}", search_keyword);

    if(prefs.prefs['displaytarget'] == "panel"){
        var xhr = Request({
            url: request_url,
            onComplete: function(response){
                var safeHtmlTxt = Util.parseSearchResult(response.text, prefs.prefs["serviceselector"], prefs.prefs['servicedeselector']);
                db.add(search_keyword, safeHtmlTxt);
                panel.show(safeHtmlTxt);
            }
        });
        xhr.get();
    }
    else if(prefs.prefs['displaytarget'] == "sidebar"){
        var xhr = Request({
            url: request_url,
            onComplete: function(response){
                var safeHtmlTxt = Util.parseSearchResult(response.text, prefs.prefs["serviceselector"], prefs.prefs['servicedeselector']);
                db.add(search_keyword, safeHtmlTxt);
                if(prefs.prefs["preservehistory"]){
                    sidebar.showHistory({show_first_data: true});
                }
                else {
                    sidebar.showSearchResult(safeHtmlTxt);
                }
            }
        });
        xhr.get();
    }
    else {
        var store_result_as_history = function(tab){
            var window = getTabContentWindow (getTabForId(tab.id));
            var html_as_string = window.document.documentElement.outerHTML;
            var safeHtmlTxt = Util.parseSearchResult(html_as_string, prefs.prefs["serviceselector"], prefs.prefs['servicedeselector']);
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



