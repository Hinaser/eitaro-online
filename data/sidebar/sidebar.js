/**
 * Defining behaviour of a sidebar on Firefox Browser
 * @file Manages sidebar on browser.
 * DependsOn jQuery.
 */

/*
 * NOTE FOR injecting dynamic html text to sidebar content.
 *
 * In this script, there are multiple codes that dynamic html text is injected to sidebar html.
 * I'll explain what I did to remove security risks for malicious script to be injected with those dynamic html.
 *
 * A html text to be injected always arrives from addon script via `set` message.
 * This sidebar content script listens to the `set` message after sidebar content is loaded.
 * The origin where `set` message is emitted is always the same one source.
 *
 * It is from a method named `invalidate_sidebar()` in `lib/sidebar.js`.
 *
 * Every time just before `set` event is emitted via the `invalidate_sidebar()`, html sanitizing is always done.
 * So html text from lib/sidebar.js is always sanitized and clean before being injected in this script.
 *
 * For additional sanitizing process, please see lib/sidebar.js.
 */

/**
 * Representation of a sidebar on Firefox Browser.
 * @constructor
 */
const Sidebar = function(){
    this.content = null;
};

/**
 * Initialize sidebar. This must be called every time sidebar content html is loaded.
 */
Sidebar.prototype.initialize = function(){
    this.content = $("#content");

    // Show loading gif once sidebar is opened.
    sidebar.prepare();
};

/**
 * Clear current DOM
 */
Sidebar.prototype.clearContents = function (){
    this.content.empty();
};

/**
 * Show loading gif image until data to display arrives.
 */
Sidebar.prototype.prepare = function (){
    this.content.empty();

    let loading_image = $("<img>", {src: "../common/loader.gif"});
    this.content.append(loading_image);
};

/**
 * Set font size of sidebar
 * @param {string} size - font size in pixel
 */
Sidebar.prototype.setFontSize = function(size){
    let fontSize = size + "px";
    this.content.css("fontSize", fontSize);
};

/**
 * Set error message to sidebar
 * @param {Object} data - Object which contains html text data to display.
 */
Sidebar.prototype.setError = function (data){
    // Set font size
    this.setFontSize(data.option.fontSize);

    this.content.empty();
    // Please see the header comment of this file for security concern.
    this.content.append(data.single_data);
};

/**
 * Set single search result to sidebar
 * @param {Object} data - Object which contains html text data to display.
 */
Sidebar.prototype.setSingle = function(data){
    // Set font size
    this.setFontSize(data.option.fontSize);

    this.content.empty();
    // Please see the header comment of this file for security concern.
    this.content.append(data.single_data);
};

/**
 * Set search history data to sidebar
 * @param {Object} data - Object which contains html text data to display.
 */
Sidebar.prototype.setHistory = function (data){
    // Setup display html
    let showFirstData = data.option.show_first_data;
    let records = data.history_data;
    let histories = "";

    records.forEach(function (element, index, array) {
        if (index == 0 && showFirstData) {
            histories += "<div id='" + index + "' class='history'><div class='title'><a class='word' data-hidden='no' data-href='" + index + "'>" + element.word + "</a><a class='remove-item' data-word='" + element.word + "'>削除</a></div><div class='data'>" + element.result + "</div></div>";
        }
        else {
            histories += "<div id='" + index + "' class='history'><div class='title'><a class='word' data-hidden='yes' data-href='" + index + "'>" + element.word + "</a><a class='remove-item' data-word='" + element.word + "'>削除</a></div><div class='data hidden'>" + element.result + "</div></div>";
        }
    });

    // Set font size
    this.setFontSize(data.option.fontSize);

    this.content.empty();
    // Please see the header comment of this file for security concern.
    this.content.append(histories);

    // Setup Onclick event on div.title
    // If wherever inside the div is clicked, then expand/hide search result area.
    let div = $(".title");
    div.on("click", onClick_title);

    // Setup onclick event for delete button.
    // When the button is clicked, send message to main script that the clicked word should be deleted from indexeddb.
    let delete_btn = $(".remove-item");
    delete_btn.on("click", onClick_delete);
};

/**
 * EventHandler when .title is clicked.
 * @param e
 */
function onClick_title(e) {
    var href = this.childNodes[0].dataset.href;
    var children = document.getElementById(href).childNodes;

    if (this.childNodes[0].dataset.hidden == 'yes') {
        children[1].className = 'data';
        this.childNodes[0].dataset.hidden = 'no';
    }
    else {
        children[1].className = 'data hidden';
        this.childNodes[0].dataset.hidden = 'yes';
    }
}

/**
 * EventHandler when .remove-item is clicked.
 * @param e
 */
function onClick_delete(e) {
    e.stopPropagation();
    var word = this.dataset.word;

    if (!confirm(word + ' を本当に削除してよろしいですか？')) { // 'Are you sure to delete ' + word
        return;
    }

    addon.port.emit("delete", word);
}



let sidebar = new Sidebar();

$(document).ready(function(){
    sidebar.initialize();

    addon.port.on("prepare", function () {
        sidebar.prepare();
    });

    addon.port.on("clear", function(){
        sidebar.clearContents();
    });

    addon.port.on("set_font_size", function(size){
        sidebar.setFontSize(size);
    });

    // Listen 'set' message from main script.
    // When the message arrives, set the html data in the message to sidebar.
    addon.port.on("set", function (json) {
        let data = JSON.parse(json);

        sidebar.clearContents();

        if(data.type == 'single'){
            sidebar.setSingle(data);
        }
        else if(data.type == 'history'){
            sidebar.setHistory(data);
        }
        else if(data.type == 'error'){
            sidebar.setError(data);
        }
    });

    // Send get message to main script when sidebar is ready
    addon.port.emit("get");
});

$(window).unload(function(){
    sidebar.clearContents();
});
