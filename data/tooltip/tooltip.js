/**
 * Defining behaviour of a tooltip on Firefox Browser
 * @file Manages tooltip on browser.
 * DependsOn jQuery.
 */

// Variable declarations/initializations
const wrapper_tag_id = "eitaro-online-wrapper";
const container_tag_id = "eitaro-online-container";
const content_header_id = "eitaro-online-header";
const content_tag_id = "eitaro-online";
const style_id = "eitaro-online-style";
const fontsize_input_id = "eitaro-online-font-size-input";
const setting_btn_id = "eitaro-online-setting-btn";
const close_btn_id = "eitaro-online-close-btn";
const suggest_btn_id = "eitaro-online-suggest-btn";

// Minimum width/height of tooltip
let min_width = 150;
let min_height = 100;

// Size of resizing edge of tooltip 
let resize_edge_size = "15px";

/**
 * Tooltip representation on Firefox Browser.
 * @constructor
 */
const Tooltip = function(){
    this.fontSize = "12px";
};

/**
 * Initialize css style for tooltip. This is needed because style of html on tooltip can be affected by
 * original web page's stylesheet.
 * Here, reset all style on html on tooltip to browser's default and apply addon's custom stylesheet.
 */
Tooltip.prototype.initStyle = function (){
    $(`#${style_id}`).remove();

    let reset_style_to_default = `
    #${wrapper_tag_id} {
        all: initial;
    }
    #${wrapper_tag_id} * {
        all: unset;
    }
    `;

    this.setStyle(reset_style_to_default);
    this.setStyle(firefox_default_css(`#${wrapper_tag_id}`));
    this.setStyle(jquery_ui_css(`#${wrapper_tag_id}`));
    this.setStyle(tooltip_css(`#${wrapper_tag_id}`));
};

/**
 * Add css text to addon's style tag. The style to be added always has precedence over website's style.
 * @param {string} style - CSS text to be added.
 */
Tooltip.prototype.setStyle = function (style){
    let style_tag = $(`#${style_id}`);
    if(style_tag.length < 1){
        style_tag = $("<style>", {id: style_id, rel: "stylesheet", type: "text/css"});
        style_tag.appendTo("head");
    }

    style = "\n" + style;

    style_tag.append(style);
};

/**
 * Intialize a element which wraps tooltip html content.
 * The wrapper element will be added to the tail of website's body element.
 * @param {Object} option
 */
Tooltip.prototype.initialize = function (option){
    this.initStyle();

    let wrapper = $(`#${wrapper_tag_id}`);
    if(wrapper.length > 0){
        wrapper.empty();
    }
    else{
        wrapper = $("<div>", {id: wrapper_tag_id});
        wrapper.appendTo("body");
    }

    let container = $("<div>", {id: container_tag_id});
    let content = $("<div>", {id: content_tag_id});
    let header = this.createHeader(container, content, option);

    container.draggable({
        handle: "header",
        stop: function(event, ui){
            // When position:absolute, do not remember panel position since it is relative to document, not window.
            if(container.css("position") !== "fixed"){
                return;
            }

            // Prevent container header to be out of window
            ["top", "right", "bottom", "left"].forEach(function(el, i, arr){
                if(parseInt(container.css(el)) < 0){
                    container.css(el, "0px");
                }
            });

            // Prevent container header to be too bottom where header cannot be draggable.
            if(parseInt(container.css("top")) >= ($(window).height() - 30 - min_height)){
                container.css("top", ($(window).height() - 30 - min_height) + "px");
            }

            // Prevent container header to be off to right edge of window where header cannot be draggable.
            if(parseInt(container.css("left")) >= ($(window).width() - min_width)){
                container.css("left", ($(window).width() - min_width) + "px");
            }

            const currentRect = {
                top: parseInt(container.css("top")) || 0, // When container.css("top") is `auto`, then parseInt(container.css("top")) will be null. I want to set 0 instead of null here.
                right: parseInt(container.css("right")) || 0,
                bottom: parseInt(container.css("bottom")) || 0,
                left: parseInt(container.css("left")) || 0,
                width: container.width(),
                height: container.height()
            };
            sendMessage("moved", currentRect);
        }
    });
    container.resizable({
        handles: "n, e, s, w, se",
        stop: function(event, ui){
            const window_height = $(window).height();
            const is_fixed_panel_too_tall = (container.css("position") === "fixed" && container.height() > window_height);
            if(is_fixed_panel_too_tall){
                container.height($(window).height());
            }

            if(container.height() < min_height){
                container.height(min_height);
            }

            const window_width = $(window).width();
            const is_fixed_panel_too_wide = (container.css("position") === "fixed" && container.width() > window_width);
            if(is_fixed_panel_too_wide){
                container.width($(window).width());
            }

            if(container.width() < min_width){
                container.width(min_width);
            }

            // TODO Is this necessary?
            //content.height(container.height() - 30);
            //content.width(container.width());

            const currentRect = {
                top: parseInt(container.css("top")),
                right: parseInt(container.css("right")),
                bottom: parseInt(container.css("bottom")),
                left: parseInt(container.css("left")),
                width: container.width(),
                height: container.height()
            };
            sendMessage("resized", currentRect);
        }
    });

    content.css({
        overflow: "auto",
        width: "100%",
        height: "calc(100% - 11px)"
    });

    header.appendTo(container);
    content.appendTo(container);
    container.appendTo(wrapper);
};

/**
 * Create tooltip header html element. (This may have `config button` or `close button` or like these elements).
 * @param {jQuery} container - jQuery instance of a div of direct descendant of tooltip's wrapper element.
 * @param {jQuery} content - Direct descendant of `container`, which holds the tooltip main html content..
 * @param {Object} option - Optional settings
 * @returns {jQuery} - jQuery instance of tooltip header.
 */
Tooltip.prototype.createHeader = function (container, content, option){
    const that = this;

    let header = $("<header>", {id: content_header_id});
    header.append("<span class='title'>英太郎ONLINE</span>");

    //let search_box = $("<input>", {type: "text", placeholder: "検索したいキーワード"});
    //let search_btn = $("<button>検索</button>");
    //header.append(search_box);
    //header.append(search_btn);

    if(option && !option.hide_show_remove_button){
        let close_btn = $(`<button id="${close_btn_id}">${remove_button()}</button>`);
        header.append(close_btn);

        close_btn.on("click", function(e){
            container.hide();
        });
    }

    let setting_btn = $(`<button id="${setting_btn_id}">${setting_button()}</button>`);
    header.append(setting_btn);

    setting_btn.on("click", function(e){
        alert("すいません、まだここの処理作ってません。。");
    });

    return header;
};

/**
 * Set tooltip element position on web page in a context of user configuration/environment.
 * @param {jQuery} container - jQuery instance of a div of direct descendant of tooltip's wrapper element.
 * @param {Object}option - Contains configuration to specify tooltip's position on a web page, which may derive from addon's preference page.
 * @property {boolean} show_near_selection - Whether tooltip should appear near the text selection.
 * @property {string} position - "top-left", "bottom-right" and like so on.
 * @param {boolean=false} isPrepare - Indicates whether position being set is for loading animation.
 */
Tooltip.prototype.setPosition = function (container, option, isPrepare=false){
    let style = {};

    if(isTextSelected() && option.show_near_selection){
        const location_of_selection = getSelectionLocation();
        style["position"] = "absolute";
        style["top"] = location_of_selection.bottom + 10 + window.scrollY;
        style["left"] = location_of_selection.left + 10 + window.scrollX;
    }
    else {
        style["position"] = "fixed";

        /**
         * set position/width/height according to position string
         * like 'top-left', 'bottom-right', 'top-right', 'bottom-left'.
         */
        const set_position_by_location_string = function () {
            if (!option.position || option.position === "center") {
                style["top"] = $(window).height() / 2 - container.height() / 2;
                style["left"] = $(window).width() / 2 - container.width() / 2;
            }
            else {
                switch (option.position) {
                    case "top-left":
                        style["top"] = 0;
                        style["left"] = 0;
                        break;
                    case "top-right":
                        style["top"] = 0;
                        style["right"] = 0;
                        break;
                    case "bottom-left":
                        style["bottom"] = 0;
                        style["left"] = 0;
                        break;
                    case "bottom-right":
                        style["bottom"] = 0;
                        style["right"] = 0;
                        break;
                }
            }
        };

        if (option.use_last_position && option.last_position) {
            // Ignore right/bottom position value since its intervene with width/height.
            ["top", /*"right", "bottom",*/ "left"].forEach(function (el, i, arr) {
                if (option.last_position[el] >= 0) {
                    style[el] = option.last_position[el] + "px";
                }
            });

            if ((!style["top"] && !style["bottom"]) || (!style["right"] && !style["left"])) {
                set_position_by_location_string();
            }
        }
        else {
            set_position_by_location_string();
        }
    }
        
    // As to preparing panel, always show it on center
    if(isPrepare){
        let additional_style = {
            border: "1px solid #d8d8d8",
            borderRadius: 4,
            zIndex: 100000,
            backgroundColor: "#f6f6f6"
        };

        if(!(isTextSelected() && option.show_near_selection)){
            additional_style["top"] = ($(window).height() / 2 - 24) + "px";
            additional_style["left"] = ($(window).width() / 2 - 24) + "px";
        }

        $.extend(style, additional_style);
    }

    // Correct position if it is off the window
    // Prevent container header to be too bottom where header cannot be draggable.
    if(style["position"] === "fixed"){
        ["top", "right", "bottom", "left"].forEach(function(el, i, arr){
            if(parseInt(style[el]) < 0){
                style[el] = "0px";
            }
        });

        if(parseInt(style["top"]) >= ($(window).height() - 30 - min_height)){
            style["top"] = ($(window).height() - 30 - min_height) + "px";
        }
        // Prevent container header to be off to right edge of window where header cannot be draggable.
        if(parseInt(style["left"]) >= ($(window).width() - min_width)){
            style["left"] = ($(window).width() - min_width) + "px";
        }
    }

    container.css(style);
};

/**
 * Set tooltip element width on web page in a context of user configuration/environment.
 * @param {jQuery} container - jQuery instance of a div of direct descendant of tooltip's wrapper element.
 * @param {Object}option - Contains configuration to specify tooltip's position on a web page, which may derive from addon's preference page.
 * @property {boolean} show_near_selection - Whether tooltip should appear near the text selection.
 * @property {Object} last_size - Contains width/height in each of last_size.width, last_size.height
 * @param {boolean=false} isPrepare - Indicates whether position being set is for loading animation.
 */
Tooltip.prototype.setSize = function (container, option, isPrepare=false){
    let style = {};

    const isSelectionAutoSizingEnabled = isTextSelected() && option.show_near_selection && option.auto_sizing_panel_for_selection;
    if(option.use_last_size && option.last_size && !isSelectionAutoSizingEnabled){
        // Set previous width
        let window_width = $(window).width();
        if (min_width <= option.last_size["width"] && option.last_size["width"] <= window_width) {
            style["width"] = option.last_size["width"] + "px";
        }
        else if (option.last_size["width"] > window_width) {
            style["width"] = window_width + "px";
        }
        else {
            style["width"] = min_width + "px";
        }

        // Set previous height
        let window_height = $(window).height();
        if (min_height <= option.last_size["height"] && option.last_size["height"] <= window_height) {
            style["height"] = option.last_size["height"] + "px";
        }
        else if (option.last_size["height"] > window_height) {
            style["height"] = window_height + "px";
        }
        else {
            style["height"] = min_height + "px";
        }
    }

    // As to preparing panel, always show it on center
    if(isPrepare){
        let additional_style = {
            width: "48px",
            height: "48px"
        };

        $.extend(style, additional_style);
    }

    container.css(style);
};

/**
 * Show loading animation on tooltip.
 * Loading will be end when actual search result html data arrives from addon.
 * @param {Object} option - Indicating where to set tooltip in window.
 * @property {boolean} show_near_selection - Whether tooltip should appear near the text selection.
 * @property {string} position - "top-left", "bottom-right" and like so on.
 */
Tooltip.prototype.prepare = function(option){
    $(`#${style_id}`).remove();

    let wrapper = $(`#${wrapper_tag_id}`);
    if(wrapper.length > 0){
        wrapper.empty();
    }
    else{
        wrapper = $("<div>", {id: wrapper_tag_id});
        wrapper.appendTo("body");
    }

    let container = $("<div>", {id: container_tag_id});

    container.append(loading_gif());
    wrapper.append(container);

    this.setPosition(container, option, true);
    this.setSize(container, option, true);

    container.draggable();
};

/**
 * Show button for user to choose whether search should be done.
 * @param {string} search_keyword - text to be searched
 */
Tooltip.prototype.suggest = function(search_keyword){
    $(`#${style_id}`).remove();

    let wrapper = $(`#${wrapper_tag_id}`);
    if(wrapper.length > 0){
        wrapper.empty();
    }
    else{
        wrapper = $("<div>", {id: wrapper_tag_id});
        wrapper.appendTo("body");
    }

    let container = $("<div>", {id: container_tag_id});
    let button = $(`<button>英太郎で検索: ${search_keyword}</button>`, {id: suggest_btn_id});

    container.append(button);
    wrapper.append(container);

    // Set style and position of button
    const location_of_selection = getSelectionLocation();
    let container_style = {}, button_style = {};
    container_style["position"] = "absolute";
    container_style["top"] = location_of_selection.bottom + 10 + window.scrollY;
    container_style["left"] = location_of_selection.left + 10 + window.scrollX;
    container_style["z-index"] = 10000;
    container_style["border"] = "none";
    button_style["cursor"] = "pointer";
    container.css(container_style);
    button.css(button_style);

    // When button is clicked, execute search
    button.on('mouseup', function(e){
        container.hide();
        self.port.emit("search",  search_keyword);
    });

    // When outside of button is clicked, hide container
    $(document).on('mouseup', function(e){
        if(button.length > 0 && !button.is(e.target) && button.has(e.target).length === 0){
            button.remove();
            container.hide();
        }
    });
};

/**
 * Open up tooltip with search result
 * @param {string} html - Search result html.
 * @param {Object} option - Indicating where to set tooltip in window.
 * @property {boolean} show_near_selection - Whether tooltip should appear near the text selection.
 * @property {string} position - "top-left", "bottom-right" and like so on.
 */
Tooltip.prototype.open = function(html, option){
    this.initialize(option);

    let wrapper = $("#" + wrapper_tag_id);
    let container = $("#" + container_tag_id);
    let content = $("#" + content_tag_id);

    content.empty();

    if(option.fontSize){
        this.fontSize = option.fontSize + "px";
        content.css("font-size", this.fontSize);
        $(`#${fontsize_input_id}`).val(parseInt(this.fontSize));
    }

    // NOTE FOR injecting dynamic html text to tooltip content.
    //
    // Dynamic html text is injected to tooltip html just the line below.
    // I already take action to remove security risks for malicious script to be injected with those dynamic html.
    //
    // A html text to be injected always arrives from addon script via `open` message.
    // This `open` message arrives from a method `Tooltip#show` in `lib/tooltip.js`.
    // Every time before the message is sent from `lib/tooltip.js`, the dynamic html to be injected is sanitized and cleaned up.
    //
    // For additional sanitizing process, please see lib/tooltip.js.
    content.prepend(html);

    // Set panel position with regarding to user configuration
    this.setPosition(container, option, false);

    // Set panel size with regarding to user configuration
    this.setSize(container, option, false);

    // Trim content width/height if they are over their maximum values.
    trimContent(content, isTextSelected() && option.show_near_selection);

    // Set dismissible if user configures to do so
    if(option.dismiss_when_outside_clicked){
        $(document).on('mouseup', function(e){
            if(!container.is(e.target) && container.has(e.target).length === 0){
                if(container.is(":visible")){
                    container.hide();
                }
            }
        });
    }

    // Increase edge size which user can grab to resize
    wrapper.find(".ui-resizable-n").css("height", "10px"); // Top edge size is set here because if large value is set, dragging will not work.
    wrapper.find(".ui-resizable-s").css("height", resize_edge_size);
    wrapper.find(".ui-resizable-e").css("width", resize_edge_size);
    wrapper.find(".ui-resizable-w").css("width", resize_edge_size);
    wrapper.find(".ui-resizable-se").css({height: resize_edge_size, width: resize_edge_size});

    content.scrollTop(0);
    container.show();
};

/**
 * Set font size of content on tooltip
 * @param {string} size - font size like "12px"
 */
Tooltip.prototype.setFontSize = function(size){
    this.fontSize = size;

    let content = $(`#${content_tag_id}`);
    if(content.length > 0){
        content.css("font-size", this.fontSize);
        $(`#${fontsize_input_id}`).val(parseInt(this.fontSize));
    }
};

/**
 * Get the exact location of selection of a text.
 * @returns {ClientRect}
 */
function getSelectionLocation(){
    let selection = window.getSelection();
    let oRange = selection.getRangeAt(0);
    return oRange.getBoundingClientRect();
}

/**
 * Get text selected in window
 * @returns {string}
 */
function getSelectedText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

/**
 * Returns whether text selection exists.
 * @returns {boolean}
 */
function isTextSelected(){
    let selection = window.getSelection();
    return !selection.isCollapsed;
}

/**
 * Check if content's height/width exceeds max limit.
 * If exceeding, set height/width back to its maximum limit size.
 * @param {jQuery} content - jQuery object which has search result content
 * @param {boolean} useSelectionPosition - If panel position is being set to near text selection
 */
function trimContent(content, useSelectionPosition) {
    // Check if height exceeds max height.
    // If exceeding, set the height back to max limit
    const window_height = $(window).height();
    const content_height = content.height();
    if(content.height() > window_height){
        if(useSelectionPosition){
            let location_of_selection = getSelectionLocation();
            if(location_of_selection.top + 20 + content_height > window_height){
                content.height(window_height - (location_of_selection.top + 20) - 50);
            }
        }
        else {
            content.height(window_height - 50);
        }
    }

    // Check width as well
    const max_content_width_per_window = 1.0;
    const window_width = $(window).width();
    const content_width = content.width();
    if(content.width() > window_width * max_content_width_per_window){
        content.width(window_width * max_content_width_per_window);
    }
}

/**
 * Send message to addon script
 * @param {string} type - type of message
 * @param {*} data - data to be sent to addon
 */
function sendMessage(type, data){
    self.port.emit(type, JSON.stringify(data));
}


// Instantiate Tooltip instance
let tooltip = new Tooltip();

// "ping" event may be emitted to confirm whether tooltip worker is alive.
self.port.on("ping", function(){});

// This `prepare` message will enhance responsiveness.
// It takes seconds before search completes. This `prepare` fill a boring waiting time with loading animation.
// If this preparation is not defined, addon user won't know whether search request itself is not invoked or
// searching takes time.
self.port.on("prepare", function(msg){
    let data = JSON.parse(msg);
    let option = data.option;

    tooltip.prepare(option);
});

// When `open` message arrive from addon, immediately show up tooltip with search result html.
self.port.on("open", function(msg){
    let data = JSON.parse(msg);

    tooltip.open(data.html, data.option);
});

// Set font size request by addon
self.port.on("set_font_size", function(msg){
    let fontSize = JSON.parse(msg).size + "px";

    tooltip.setFontSize(fontSize);
});

// Process for immediate search for selection
$(document).ready(function(){
    //
    // Just after text is selected, popup search button near selection.
    //
    $(document).on("mouseup", function(e){
        if
        (
            // When text selection is not made, do nothing.
            !isTextSelected()
            // When event is raised by clicking suggest button, do nothing
            || $(`#${suggest_btn_id}`).is(e.target)
            // When panel is clicked, do nothing
            || $(`#${wrapper_tag_id}`).has(e.target).length > 0
        ){ return; }

        tooltip.suggest(getSelectedText());
    });
});