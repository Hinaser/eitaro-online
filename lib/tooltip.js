// Load SDK Library
var Tabs = require("sdk/tabs");

// Script list which are loaded when tooltip content script initializes.
var scripts_path = [
    './common/jquery-2.2.4.min.js',
    './common/jquery-ui.min.js',
    './common/html.css.js',
    './common/jquery-ui.css.js',
    './common/loading.gif.js',
    './common/remove-button.svg.js',
    './tooltip/tooltip.css.js',
    './tooltip/tooltip.js'
];

/**
 * Array of tab-id and its corresponding worker
 * workers itself has only 2 elements.
 * workers[0] holds array of tab ids.
 * workers[1] holds array of worker instances.
 *
 * workers[0][n] corresponds to workers[1][n] by index n.
 * workers[0][n] has tab id of workers#n
 * workers[1][n] has worker instance of workers#n
 *
 * @type {Array.<Array>}
 */
var workers= [[],[]];

/**
 * Representation of tooltip
 * @param {Function} sanitizer - Sanitizing function to clean up html text for content script of tooltip.
 * @constructor
 */
var Tooltip = function(sanitizer){
    this.sanitize = sanitizer;
    this.fontSize = 12;
};

/**
 * Initialize tooltip.
 * When tab is loading, it deletes worker from worker list variable.
 */
Tooltip.prototype.init = function(){
    Tabs.on("ready", function(tab){
        if(isTabAlreadyAttached(tab)){
            deleteWorker(tab);
        }
    });
};

/**
 * Send `prepare` message to content script.
 * Content script of tooltip will show loading animation image after receiving this message.
 * @param option
 */
Tooltip.prototype.prepare = function(option){
    sendMessage(Tabs.activeTab, 'prepare', {option: option});
};

/**
 * Send `open` message with html text to display to content script.
 * For security reason, html text is always sanitized before sending to content script.
 * @param {string} content - html text to be displayed on tooltip.
 * @param {Object} option - Indicating where to set tooltip in window.
 * @property {boolean} show_near_selection - Whether tooltip should appear near the text selection.
 * @property {string} position - "top-left", "bottom-right" and like so on.
 */
Tooltip.prototype.show = function(content, option){
    content = this.sanitize(content);

    option.fontSize = this.fontSize;
    
    sendMessage(Tabs.activeTab, 'open', {
        html: content,
        option: option
    });
};

/**
 * Request font size change to all open tabs.
 * @param {int} size - font size
 */
Tooltip.prototype.setFontSize = function(size){
    this.fontSize = size;

    for(let tab of Tabs){
        if(!isWorkerDead(tab)){
            sendMessage(tab, 'set_font_size', {
                size: size
            });
        }
    }
};

/**
 * Check if worker of specified tab id is dead.
 * @param tab
 * @returns {boolean} - true if worker is dead. false if worker is alive.
 */
function isWorkerDead(tab){
    var worker = getWorkerOfTab(tab);

    if(!worker){
        return true;
    }

    try{
        worker.port.emit('ping', "");
        return false;
    }
    catch(e){
        return true;
    }
}

/**
 * Attach worker instance to current active tab.
 * @returns {*} - Worker instance.
 */
function attach(){
    var tab = Tabs.activeTab;

    if(isTabAlreadyAttached(tab)){
        deleteWorker(tab);
    }

    var worker = tab.attach({
        contentScriptFile: scripts_path
    });

    workers[0].push(tab.id);
    workers[1].push(worker);

    tab.on('close', deleteWorker);

    return worker;
}

/**
 * Send message to content script.
 * @param tab
 * @param {string} message - Message name. i.e. open/prepare.
 * @param {Object} data - Object containing data to be processed in content script.
 */
function sendMessage(tab, message, data){
    var worker;

    if(!isTabAlreadyAttached(tab) || isWorkerDead(tab)){
        worker = attach();
    }
    else{
        worker = getWorkerOfTab(tab);
    }

    worker.port.emit(message, JSON.stringify(data));
}

/**
 * Check if tab is already managed
 * @param tab
 * @returns {boolean} - true if tab is managed. false if not.
 */
function isTabAlreadyAttached(tab){
    return workers[0].indexOf(tab.id) > -1;
}

/**
 * Get worker instance of a corresponding tab
 * @param tab
 * @returns {*} - Worker instance
 */
function getWorkerOfTab(tab){
    let index = workers[0].indexOf(tab.id);
    if(index < 0){
        return null;
    }
    return workers[1][index];
}

/**
 * Delete worker instance from list variable
 * @param tab
 */
function deleteWorker(tab){
    var index = workers[0].indexOf(tab.id);
    if(index != -1){
        workers[0].splice(index, 1);
        workers[1].splice(index, 1);
    }
}

module.exports = Tooltip;
