// Load SDK Library
const sdk_panel = require("sdk/panel");
const panel_url = "./configpanel/panel.html";

// Panel to display lookup result
const panel = sdk_panel.Panel({
    contentURL: panel_url
});

/**
 * Panel for configure addon
 * @constructor
 */
const Panel = function(){
    this.prefs = null;
};

/**
 * Setup process for messages between content script
 * @param prefs
 * @throws - Throws error if prefs argument is empty
 */
Panel.prototype.init = function(prefs){
    if(!prefs){
        throw new Error("prefs must be set");
    }
    this.prefs = prefs;

    panel.port.on("change-config", (data) => {
        const config = JSON.parse(data);
        this.prefs.set(config.name, config.value);
    });

    panel.on("show", () => {
        this.initPrefs();
    });
};

/**
 * Show panel on current tab.
 */
Panel.prototype.show = function(){
    panel.show({
        width: 768,
        height: 512
    });
};

/**
 * Send preference values to panel content script.
 */
Panel.prototype.initPrefs = function(){
    panel.port.emit("init-config", JSON.stringify(this.prefs.getAll()));
};

/**
 * Send a config name/value to panel content script
 * @param {string} name - Name of preference
 * @param {*} value - Value of preference
 */
Panel.prototype.setPref = function(name, value){
    const config = {
        name: name,
        value: value
    };

    panel.port.emit("set-config", JSON.stringify(config));
};


module.exports = Panel;
