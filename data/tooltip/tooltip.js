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

// Minimum width/height of tooltip
let min_width = 150;
let min_height = 150;

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
 */
Tooltip.prototype.initialize = function (){
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
    let header = this.createHeader(container, content);

    container.draggable({
        handle: "header",
        stop: function(event, ui){
            ["top", "right", "bottom", "left"].forEach(function(el, i, arr){
                if(parseInt(container.css(el)) < 0){
                    container.css(el, "0");
                }
            });

            const currentPosition = {
                top: parseInt(container.css("top")),
                right: parseInt(container.css("right")),
                bottom: parseInt(container.css("bottom")),
                left: parseInt(container.css("left"))
            };
            sendMessage("moved", currentPosition);
        }
    });
    container.resizable({
        handles: "n, e, s, w",
        stop: function(event, ui){
            const window_height = $(window).height();
            const is_fixed_panel_too_tall = (container.css("position") === "fixed" && container.height() > window_height);
            if(is_fixed_panel_too_tall){
                container.height($(window).height());
            }

            content.height(container.height() - 20);
            content.width(container.width());

            const currentPanelSize = {
                width: content.width(),
                height: content.height()
            };
            sendMessage("resized", currentPanelSize);
        }
    });

    content.css({
        overflow: "auto",
        width: "100%",
        height: "100%"
    });

    header.appendTo(container);
    content.appendTo(container);
    container.appendTo(wrapper);
};

/**
 * Create tooltip header html element. (This may have `config button` or `close button` or like these elements).
 * @param {jQuery} container - jQuery instance of a div of direct descendant of tooltip's wrapper element.
 * @param {jQuery} content - Direct descendant of `container`, which holds the tooltip main html content..
 * @returns {jQuery} - jQuery instance of tooltip header.
 */
Tooltip.prototype.createHeader = function (container, content){
    const that = this;
    let header = $("<header>", {id: content_header_id});
    //let search_box = $("<input>", {type: "text", placeholder: "検索したいキーワード"});
    //let search_btn = $("<button>検索</button>");
    let setting_btn = $(`<button id="${setting_btn_id}">${setting_button()}</button>`);
    let close_btn = $(`<button id="${close_btn_id}">${remove_button()}</button>`);

    //header.append(search_box);
    //header.append(search_btn);
    header.append("<span class='title'>英太郎ONLINE</span>");
    header.append(setting_btn);
    header.append(close_btn);

    close_btn.on("click", function(e){
        container.hide();
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
    let style;

    if(isTextSelected() && option.show_near_selection){
        let location_of_selection = getSelectionLocation();
        style = {
            position: "absolute",
            top: location_of_selection.top + 20 + window.scrollY,
            left: location_of_selection.left + 20 + window.scrollX
        };
    }
    else{
        style = {
            position: "fixed"
        };

        if(!option.position || option.position == "center"){
            style["top"] = $(window).height() / 2 - container.height() / 2;
            style["left"] = $(window).width() / 2 - container.width() / 2;
        }
        else if(typeof(option.position) === "string"){
            switch(option.position){
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
        else if(typeof(option.position) === "object"){
            ["top", "right", "bottom", "left", "width", "height"].forEach(function(el, i, arr){
                if(el === "width"){
                    if(option.position[el] >= min_width) {
                        style[el] = option.position[el] + "px";
                    }
                    else{
                        style[el] = min_width + "px";
                    }
                }
                else if(el === "height"){
                    if(option.position[el] >= min_height) {
                        style[el] = option.position[el] + "px";
                    }
                    else{
                        style[el] = min_height + "px";
                    }
                }
                else{
                    if(option.position[el] >= 0) {
                        style[el] = option.position[el] + "px";
                    }
                }
            });
            console.log(style);
            console.log(option);
        }
    }

    if(isPrepare){
        let additional_style = {
            border: "1px solid gray",
            borderRadius: 4,
            width: "48px",
            height: "48px",
            zIndex: 100000,
            backgroundColor: "rgba(255,255,255,0.9)"
        };

        if(!(isTextSelected() && option.show_near_selection)){
            additional_style["top"] = ($(window).height() / 2 - 24) + "px";
            additional_style["left"] = ($(window).width() / 2 - 24) + "px";
        }

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

    container.draggable();
};

/**
 * Open up tooltip with search result
 * @param {string} html - Search result html.
 * @param {Object} option - Indicating where to set tooltip in window.
 * @property {boolean} show_near_selection - Whether tooltip should appear near the text selection.
 * @property {string} position - "top-left", "bottom-right" and like so on.
 */
Tooltip.prototype.open = function(html, option){
    this.initialize();

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

    this.setPosition(container, option, false);

    // Trim content width/height if they are over their maximum values.
    trimContent(content, isTextSelected() && option.show_near_selection);

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
    const max_content_width_per_window = 0.7;
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
