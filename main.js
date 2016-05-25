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
 LOAD FIREFOX SDK
 */
var { Frame } = require("sdk/ui/frame");
var { Toolbar} = require("sdk/ui/toolbar");
var { Hotkey } = require('sdk/hotkeys');
var { Request } = require('sdk/request');
var { Cc, Ci } = require("chrome");
var cm = require("sdk/context-menu");
var tabs = require("sdk/tabs");
var { getTabForId, getTabContentWindow } = require ("sdk/tabs/utils");
var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);

/*
 LOAD USER LIBRARIES
 */
var Util = require('lib/util');
var Sidebar = require('lib/sidebar');
var Panel = require('lib/panel');
var Tooltip = require('lib/tooltip');
var Prefs = require('lib/prefs');
var Database = require('lib/db');

/*
 SET PARAMETERS FOR USER DEFINED CLASSES
 */
var db_default_name = function(prefs){
    return prefs.get("service_url");
};
var sidebar_default_title = "英太郎 ONLINE";
var html_default_sanitizer = Util.sanitizeHtml;
var panel_default_position = function(prefs){
    return prefs.get("panel_position");
};
var frame_url = "./frame.html";
var frame_option = {
    url: frame_url,
    onMessage: (e) => {
        let obj = JSON.parse(e.data);
        routeMessage(obj, e);
    }
};
var toolbar_option = function(frame, prefs){
    return {
        name: "Search toolbar",
        title: prefs.get("service_name") + "で検索",
        items: [frame]
    };
};
var hotkey_option = function(frame, frame_url){
    return {
        combo: "ctrl-L",
        onPress: function(){
            var msg = {};
            msg.type = "focus";
            msg.data = "";
            frame.postMessage(JSON.stringify(msg), frame_url);
        }
    };
};
var context_menu_option = {
    label: "label",
    context: cm.SelectionContext(),
    contentScriptFile: './context_menu.js',
    onMessage: function (msg) {
        let obj = JSON.parse(msg);
        switch (obj.type) {
            case "search":
                search(obj.data);
                break;
        }
    }
};

/*
 INITIALIZE USER DEFINED CLASSES
 */
var prefs = new Prefs();
var db = new Database();
var sidebar = new Sidebar(sidebar_default_title, db, html_default_sanitizer);
var panel = new Panel(panel_default_position(prefs));
var tooltip = new Tooltip();
var frame = new Frame(frame_option);
var toolbar =Toolbar(toolbar_option(frame, prefs));
var getFocus = Hotkey(hotkey_option(frame, frame_url));
var context_menu_item = cm.Item(context_menu_option);

/*
 INITIALIZE DB AND PREFS
 */
db.open(db_default_name(prefs));
prefs.init(frame, frame_url, panel, db);

// Variable to manage opened tab. Once a tab is opened by this script,
// the tab will be re-used to display information. So we need to track which tab is opened by this script.
var opened_tab = null;

/**
 * Route or Assign incoming message from sub component script to combined target operation
 * @param {Object} obj - Object sent from content script
 * @param event
 */
function routeMessage(obj, event) {
    switch(obj.type) {
        case 'search':
            let keyword = obj.value;
            search(keyword);
            break;
        case 'config':
            config();
            break;
        case 'history':
            history();
            break;
        case 'debug':
            debug(obj);
            break;
    }
}

/**
 * Search keyword from configured url
 * @param {string} search_keyword - Keyword to search
 */
function search(search_keyword){
    // Trim extra space. If search_keyword is empty, stop processing.
    search_keyword = Util.trim_space(search_keyword);

    // If search keyword is empty, then alert it and end function.
    if(!search_keyword || /^\s*$/.test(search_keyword)){
        prompts.alert(null, "注意", "検索キーワードが空です。"); // "Caution", "Search keyword is empty"
        return;
    }

    // Reopen indexeddb if service url has changed since last search()
    if(db.name != prefs.get("service_url")){
        db.reopen(prefs.get("service_url"));
    }

    // Get search keyword from input field and construct url for dictionary service
    var request_url = prefs.get("service_url").replace("{0}", search_keyword);

    if(prefs.get('display_target') == "panel"){
        search_for_panel(search_keyword, request_url);
    }
    else if(prefs.get('display_target') == "sidebar"){
        search_for_sidebar(search_keyword, request_url);
    }
    else {
        search_for_tab(search_keyword, request_url);
    }
}

/**
 * Open configuration tab
 */
function config() {
    tabs.open("about:addons");
}

/**
 * Show search history on sidebar
 */
function history() {
    sidebar.toggleHistory();
}

/**
 * Debug message from content scripts
 * @param {Object} obj - Object sent from content script
 */
function debug(obj) {
    try{
        console.log(JSON.parse(obj.value));
    }
    catch(e){
        console.log(obj.value);
    }
}

/**
 * Handle searching for panel
 * @param {string} search_keyword - Keyword to search
 * @param {string} request_url - Url of search service
 */
function search_for_panel(search_keyword, request_url){
    tooltip.prepare({
        show_near_selection: prefs.get('show_panel_near_selection'),
        position: prefs.get('panel_position')
    });

    var xhr = Request({
        url: request_url,
        onComplete: function(response){
            var safeHtmlTxt;

            // Assume that url is invalid.
            if(response.status == 0){
                safeHtmlTxt = 'サービスURLが正しく設定されていない可能性があります'; // Service url might be invalid.
                tooltip.show(safeHtmlTxt, {
                    show_near_selection: prefs.get('show_panel_near_selection')
                });
                return;
            }

            try{
                safeHtmlTxt = Util.parseSearchResult(response.text, prefs.get("service_selector"), prefs.get('service_deselector'));

                if(prefs.get("save_search_history")){
                    db.add(search_keyword, safeHtmlTxt);
                }
            }
            catch(e){
                safeHtmlTxt = e.message;
            }

            tooltip.show(safeHtmlTxt, {
                show_near_selection: prefs.get('show_panel_near_selection'),
                position: prefs.get('panel_position')
            });
        }
    });

    xhr.get();
}

/**
 * Handle searching for sidebar
 * @param {string} search_keyword - Keyword to search
 * @param {string} request_url - Url of search service
 */
function search_for_sidebar(search_keyword, request_url){
    // Show loading gif on sidebar until ajax request completes
    sidebar.prepare();

    var xhr = Request({
        url: request_url,
        onComplete: function(response){
            var safeHtmlTxt;

            // Assume that url is invalid.
            if(response.status == 0){
                safeHtmlTxt = 'サービスURLが正しく設定されていない可能性があります'; // Service url might be invalid.
                sidebar.showSearchResult(safeHtmlTxt);
                return;
            }

            try{
                safeHtmlTxt = Util.parseSearchResult(response.text, prefs.get("service_selector"), prefs.get('service_deselector'));

                if(prefs.get("save_search_history")) {
                    db.add(search_keyword, safeHtmlTxt);
                }

                if(prefs.get("show_result_with_history") && prefs.get("save_search_history")){
                    sidebar.showHistory({show_first_data: true});
                }
                else {
                    sidebar.showSearchResult(safeHtmlTxt);
                }
            }
            catch(e){
                safeHtmlTxt = e.message;
                sidebar.showSearchResult(safeHtmlTxt);
            }
        }
    });

    xhr.get();
}

/**
 * Handle searching for tab
 * @param {string} search_keyword - Keyword to search
 * @param {string} request_url - Url of search service
 */
function search_for_tab(search_keyword, request_url){
    var save_contents = function(tab){
        try{
            var window = getTabContentWindow (getTabForId(tab.id));
            var html_as_string = window.document.documentElement.outerHTML;
            var safeHtmlTxt = Util.parseSearchResult(html_as_string, prefs.get("service_selector"), prefs.get('service_deselector'));

            if(prefs.get("save_search_history")){
                db.add(search_keyword, safeHtmlTxt);
            }
        }
        catch(e){}
    };

    // Open tab for translation page if there are no tabs already opened by this extension.
    // If there is a tab opend by this script, then reuse the tab for displaying translation page.
    if (prefs.get('always_open_new_tab') || opened_tab === null) {
        tabs.open({
            url: request_url,
            onOpen: function onOpen(tab) {
                opened_tab = tab;
                tab.on("close", function(tab){
                    opened_tab = null;
                });

                // In order to save search result history, get tab content when tab is loaded and store the resulted document.
                tab.on("ready", save_contents);
            }
        });
    }
    else {
        opened_tab.activate();
        // In order to save search result history, get tab content when tab is loaded and store the resulted document.
        opened_tab.on("ready", save_contents);
        opened_tab.url = request_url;
    }
}
