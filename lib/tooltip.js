// Load SDK Library
const Tabs = require("sdk/tabs");

// Script list which are loaded when tooltip content script initializes.
const scripts_path = [
    './common/jquery-2.2.4.min.js',
    './common/jquery-ui.min.js',
    './common/html.css.js',
    './common/jquery-ui.css.js',
    './common/loading.gif.js',
    './common/icons.svg.js',
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
let workers= [[],[]];


/**
 * Representation of tooltip
 * @param {Function} sanitizer - Sanitizing function to clean up html text for content script of tooltip.
 * @constructor
 */
const Tooltip = function(sanitizer){
    this.sanitize = sanitizer;
    this.fontSize = 12;
    this.prefs = null;
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
 * Set pref instance to tooltip
 * @param _prefs - Instance of require('sdk/prefs')
 */
Tooltip.prototype.setPrefs = function(_prefs){
    prefs = _prefs;
}

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
    // Remove malicious javascript content
    content = this.sanitize(content);

    // Set font size
    option.fontSize = this.fontSize;

    // Set last position
    option.last_position = {};
    ["top", "right", "bottom", "left"].forEach(function(el, i, arr){
        option.last_position[el] = prefs.get("panel_position_" + el);
    });
    option.use_last_position = prefs.get("remember_latest_panel_position");

    // Set last width
    option.last_size = {};
    ["width", "height"].forEach(function(el, i, arr){
        option.last_size[el] = prefs.get("panel_" + el);
    });
    option.use_last_size = prefs.get("remember_latest_panel_size");

    // Set flag indicating whether tooltip should dismiss if outside of tooltip is clicked
    option["dismiss_when_outside_clicked"] = prefs.get("dismiss_panel_when_outside_area_is_clicked");

    // Send message to content script
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
    let worker = getWorkerOfTab(tab);

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
    let tab = Tabs.activeTab;

    if(isTabAlreadyAttached(tab)){
        deleteWorker(tab);
    }

    let worker = tab.attach({
        contentScriptFile: scripts_path
    });

    workers[0].push(tab.id);
    workers[1].push(worker);

    tab.on('close', deleteWorker);

    worker.port.on("resized", (data) => {
        const position = JSON.parse(data);
        ["top", "right", "bottom", "left"].forEach((el, i, arr) => {
            prefs.set("panel_position_" + el, position[el]);
        });
        ["width", "height"].forEach((el, i, arr) => {
            prefs.set("panel_" + el, position[el]);
        });
    });

    worker.port.on("moved", (data) => {
        const position = JSON.parse(data);
        ["top", "right", "bottom", "left"].forEach((el, i, arr) => {
            prefs.set("panel_position_" + el, position[el]);
        });
        ["width", "height"].forEach((el, i, arr) => {
            prefs.set("panel_" + el, position[el]);
        });
    });

    return worker;
}

/**
 * Send message to content script.
 * @param tab
 * @param {string} message - Message name. i.e. open/prepare.
 * @param {Object} data - Object containing data to be processed in content script.
 */
function sendMessage(tab, message, data){
    let worker;

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
    let index = workers[0].indexOf(tab.id);
    if(index != -1){
        workers[0].splice(index, 1);
        workers[1].splice(index, 1);
    }
}

module.exports = Tooltip;
