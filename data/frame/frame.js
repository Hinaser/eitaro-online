/**
 * Defining behaviour of a frame on Firefox Browser's toolbar
 * @file Manages frame on browser's toolbar.
 * DependsOn jQuery.
 */

/**
 * Representation of a frame on Firefox Browser's toolbar.
 * @constructor
 */
const Frame = function() {
    this.addOn = null;
    this.inputField = null;
    this.historyButton = null;
};

/**
 * Send data to addon script to show the content of data.
 * @param {*} data - Any variable which can be passed to JSON.stringify.
 */
Frame.prototype.debug = function(data) {
    if (!this.addOn) {
        return;
    }

    let msg = {
        type: "debug",
        value: data
    };

    this.addOn.postMessage(JSON.stringify(msg), "*");
};

/**
 * Initialize components binding to a frame
 */
Frame.prototype.initialize = function() {
    this.initInputBox();
    this.initConfigButton();
    this.initHistoryButton();
};

/**
 * Initialize text input box.
 * Pressing enter key in this input field will send message to addon with search keyword string already input here.
 * When input box receives focus request from addon (by pressing Ctrl+L for example),
 * then input textbox will select all text already existing in input field.
 */
Frame.prototype.initInputBox = function() {
    this.inputField = $("#search-box");

    let that = this;

    this.inputField.on("keydown", function(e) {
        if (e.which != 13) { // If a key is not ENTER, do nothing.
            return;
        }

        msg = {
            type: "search",
            value: that.inputField.val()
        };
        // Send search keyword in input field to addon.
        window.parent.postMessage(JSON.stringify(msg), "*");
    });

    // Make text selection when focus event, which is emitted by addon, arrives.
    this.inputField.on('focus', function (e) {
        this.select();
    });
};

/**
 * Initialize configuration button on a frame.
 * When mouse is hovering on the button, change style of the button.
 * When the button is pressed, then notify it to addon who will open configuration window.
 */
Frame.prototype.initConfigButton = function() {
    this.configButton = $("#config");

    this.configButton.on("mousedown", function (e) {
        $(this).addClass("pressing");
    });

    this.configButton.on("mouseup", function (e) {
        $(this).removeClass("pressing");
        msg = {
            type: "config",
            value: null
        };
        window.parent.postMessage(JSON.stringify(msg), "*");
    });
};

/**
 * Initialize history button on a frame.
 * When mouse is hovering on the button, change style of the button.
 * When the button is pressed, then notify it to addon who will open search history window.
 */
Frame.prototype.initHistoryButton = function() {
    this.historyButton = $("#history");

    this.historyButton.on("mousedown", function (e) {
        $(this).addClass("pressing");
    });

    this.historyButton.on("mouseup", function (e) {
        $(this).removeClass("pressing");
        msg = {
            type: "history",
            value: null
        };
        window.parent.postMessage(JSON.stringify(msg), "*");
    });
};

/**
 * Routes message coming from addon script.
 * @param e - event object
 * @property e.source        - Reference to addon instance
 * @property {string} e.data - Data sent from addon.
 * @property e.origin        - Variable to identify frames if multiple browser windows are opening.
 */
Frame.prototype.onMessage = function(e) {
    if (!this.addOn) {
        this.addOn = e.source;
    }

    let message = JSON.parse(e.data);

    switch (message.type) {
        case "focus":
            this.inputField.focus();
            break;
        case "update-placeholder":
            this.inputField.attr("placeholder", message.data);
            break;
        case "hide_history_button":
            this.historyButton.addClass("hide");
            break;
        case "show_history_button":
            this.historyButton.removeClass("hide");
            break;
        default:
            break;
    }
};



const frame = new Frame();

$(document).ready(function(){
    frame.initialize();
    window.addEventListener("message", frame.onMessage.bind(frame));
});
