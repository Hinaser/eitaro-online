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
 * Callback on search request from tab
 * @callback Searcher
 * @param word - A search word to be processed
 */

/**
 * Callback on sanitizing content to be shown on tab
 * @callback Sanitizer
 * @param {string} content - content to be sanitized
 */

/**
 * Representation of tooltip
 * @param {Sanitizer} sanitizer - Sanitizing function to clean up html text for content script of tooltip.
 * @param {Searcher} searcher - Search function requested from text selection on tab page
 * @constructor
 */
const Tooltip = function(sanitizer, searcher){
    this.sanitize = sanitizer;
    this.search = searcher;
    this.prefs = null;
};

/**
 * Initialize tooltip.
 * When tab is loading, it deletes worker from worker list variable.
 * @param prefs - Instance of require('sdk/prefs')
 * @throws {Error} - When `this.prefs` is empty, throw an Error.
 */
Tooltip.prototype.init = function(prefs){
    // When prefs is empty, throw an exception.
    if(!prefs){
        throw new Error("Prefs instance variable must be set");
    }
    this.prefs = prefs;

    // Triggered when content in a tab is loaded/reloaded.
    // Everytime when page is loaded, worker on the tab will be always refreshed.
    Tabs.on("ready", (tab) => {
        if(this.isTabAlreadyAttached(tab)){
            this.deleteWorker(tab);
        }

        this.attach(tab);

        // Initialize tooltip configuration
        this.setFontSize(prefs.get("font_size"));
        this.toggleShowButtonForSelection(prefs.get("show_search_button_for_selection"), tab);
    });

    /**
     * @todo Remove the line below after it turns out to be unnecessary.
     * COMMENT: "open" event on Tabs is triggered when a new tab is opened. This means that DOM in the tab is not loaded.
     *          Since tooltip requires DOM to show its components, listening to "open" event seems unnecessary.
     */
    // Tabs.on("open", this.attach.bind(this));

    // Attach workers to all tabs when Tooltip is instantiated.
    // Assuming when browser starts with many tabs without worker attached.
    for(let tab of Tabs) {
        this.attach(tab);

        // Initialize tooltip configuration
        this.setFontSize(prefs.get("font_size"));
        this.toggleShowButtonForSelection(prefs.get("show_search_button_for_selection"), tab);
    }
};

/**
 * Set option from preference
 * @param {Object=} option
 * @returns {Object} - Constructed option itself
 */
Tooltip.prototype.initOption = function(option={}){
    // When this.prefs is empty, throw an exception.
    if(!this.prefs){
        throw new Error("Prefs instance variable must be set");
    }

    // Set selection option
    option.show_near_selection = this.prefs.get("show_panel_near_selection");

    // Set position setting
    option.position = this.prefs.get("panel_position");

    // Set font size
    option.fontSize = parseInt(this.prefs.get("font_size"));

    // Set last position
    option.last_position = {};
    ["top", "right", "bottom", "left"].forEach((el, i, arr) => {
        option.last_position[el] = this.prefs.get("panel_position_" + el);
    });
    option.use_last_position = this.prefs.get("remember_latest_panel_position");

    // Set last width
    option.last_size = {};
    ["width", "height"].forEach((el, i, arr) => {
        option.last_size[el] = this.prefs.get("panel_" + el);
    });
    option.use_last_size = this.prefs.get("remember_latest_panel_size");

    // Set flag indicating whether tooltip should dismiss if outside of tooltip is clicked
    option["dismiss_when_outside_clicked"] = this.prefs.get("dismiss_panel_when_outside_area_is_clicked");

    // Set boolean flag whether to enable auto resizing for selection
    option.auto_sizing_panel_for_selection = this.prefs.get("auto_sizing_panel_for_selection");

    // Set boolean flag whether to hide panel delete button
    option.hide_show_remove_button = this.prefs.get("hide_show_panel_remove_button");

    // Set boolean flag whether to show search button for selection
    option.show_search_button_for_selection = this.prefs.get("show_search_button_for_selection");

    return option;
};

/**
 * Send `prepare` message to content script.
 * Content script of tooltip will show loading animation image after receiving this message.
 * @param {Object=} option
 */
Tooltip.prototype.prepare = function(option={}){
    // Set option from preference
    option = this.initOption(option);

    this.sendMessage(Tabs.activeTab, 'prepare', {option: option});
};

/**
 * Send `open` message with html text to display to content script.
 * For security reason, html text is always sanitized before sending to content script.
 * @param {string} content - html text to be displayed on tooltip.
 * @param {Object=} option - Indicating where to set tooltip in window.
 * @property {boolean} show_near_selection - Whether tooltip should appear near the text selection.
 * @property {string} position - "top-left", "bottom-right" and like so on.
 */
Tooltip.prototype.show = function(content, option={}){
    // Remove malicious javascript content
    content = this.sanitize(content);

    // Set option from preference
    option = this.initOption(option);

    // Send message to content script
    this.sendMessage(Tabs.activeTab, 'open', {
        html: content,
        option: option
    });
};

/**
 * Request font size change to all open tabs.
 * @param {int} size - font size
 */
Tooltip.prototype.setFontSize = function(size){
    for(let tab of Tabs){
        if(!this.isWorkerDead(tab)){
            this.sendMessage(tab, 'set_font_size', {
                size: size
            });
        }
    }
};

/**
 * Toggle setting for search button to appear on selection.
 * @param {boolean} shouldShow
 * @param {Object=} tab - If this is not null, then change is limited only to specified tab. If it is null, all opened tabs are affected.
 */
Tooltip.prototype.toggleShowButtonForSelection = function(shouldShow, tab=null){
    if(tab) {
        this.sendMessage(tab, 'set_button_appearance', {
            show_search_button_for_selection: shouldShow
        });
    }
    else{
        for(let aTab of Tabs){
            this.sendMessage(aTab, 'set_button_appearance', {
                show_search_button_for_selection: shouldShow
            });
        }
    }
};

/**
 * Request to reset option to all open tabs.
 */
Tooltip.prototype.setOption = function() {
    const option = this.initOption();

    for(let tab of Tabs) {
        this.sendMessage(tab, "set_option", option);
    }
};

/**
 * Check if worker of specified tab id is dead.
 * @param tab
 * @returns {boolean} - true if worker is dead. false if worker is alive.
 */
Tooltip.prototype.isWorkerDead = function (tab){
    let worker = this.getWorkerOfTab(tab);

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
};

/**
 * Attach worker instance to current active tab.
 * @param {Object=} tab
 * @returns {*} - Worker instance.
 */
Tooltip.prototype.attach = function (tab=null){
    if(!tab){
        tab = Tabs.activeTab;
    }

    if(this.isTabAlreadyAttached(tab)){
        this.deleteWorker(tab);
    }

    let worker = tab.attach({
        contentScriptFile: scripts_path
    });

    // Send option values to worker
    worker.port.emit("set_option", JSON.stringify(this.initOption()));

    workers[0].push(tab.id);
    workers[1].push(worker);

    tab.on('close', this.deleteWorker);

    worker.port.on("resized", (data) => {
        const position = JSON.parse(data);
        ["top", "right", "bottom", "left"].forEach((el, i, arr) => {
            this.prefs.set("panel_position_" + el, position[el]);
        });
        ["width", "height"].forEach((el, i, arr) => {
            this.prefs.set("panel_" + el, position[el]);
        });
    });

    worker.port.on("moved", (data) => {
        const position = JSON.parse(data);
        ["top", "right", "bottom", "left"].forEach((el, i, arr) => {
            this.prefs.set("panel_position_" + el, position[el]);
        });
        ["width", "height"].forEach((el, i, arr) => {
            this.prefs.set("panel_" + el, position[el]);
        });
    });

    worker.port.on("search", (data) => {
        const search_keyword = data;
        this.search(data);
    });

    return worker;
};

/**
 * Send message to content script.
 * @param tab
 * @param {string} message - Message name. i.e. open/prepare.
 * @param {Object} data - Object containing data to be processed in content script.
 */
Tooltip.prototype.sendMessage = function (tab, message, data){
    let worker;

    if(!this.isTabAlreadyAttached(tab) || this.isWorkerDead(tab)){
        worker = this.attach();
    }
    else{
        worker = this.getWorkerOfTab(tab);
    }

    worker.port.emit(message, JSON.stringify(data));
};

/**
 * Check if tab is already managed
 * @param tab
 * @returns {boolean} - true if tab is managed. false if not.
 */
Tooltip.prototype.isTabAlreadyAttached = function (tab){
    return workers[0].indexOf(tab.id) > -1;
};

/**
 * Get worker instance of a corresponding tab
 * @param tab
 * @returns {*} - Worker instance
 */
Tooltip.prototype.getWorkerOfTab = function (tab){
    let index = workers[0].indexOf(tab.id);
    if(index < 0){
        return null;
    }
    return workers[1][index];
};

/**
 * Delete worker instance from list variable
 * @param tab
 */
Tooltip.prototype.deleteWorker = function (tab){
    let index = workers[0].indexOf(tab.id);

    if(index != -1){
        // Detach worker
        workers[1][index].detach();

        // Remove the worker from array
        workers[0].splice(index, 1);
        workers[1].splice(index, 1);
    }
};

module.exports = Tooltip;
