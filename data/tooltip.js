// Configurations
const wrapper_tag_id = 'eitaro-online-wrapper';
const content_tag_id = 'eitaro-online';
const style_id = 'eitaro-online-style';

const tooltip_default_style = {
    top: 20,
    offsetY: 30,
    left: 20,
    offsetX: 30,
    zIndex: 100,
    bgColor: 'rgba(255,255,255,0.8)',
    border: '2px solid red',
    padding: 15,
    borderRadius: 6,
    width: 'auto',
    height: 'auto'
};

const css_style_for_seletion_tooltip = function(option){
    var setting = $.extend({}, tooltip_default_style, option);

    return {
        position: 'absolute',
        top: setting.top + window.scrollY + setting.offsetY,
        left: setting.left + window.scrollX + setting.offsetX,
        zIndex: setting.zIndex,
        backgroundColor: setting.bgColor,
        border: setting.border,
        padding: setting.padding,
        borderRadius: setting.borderRadius,
        width: setting.width,
        height: setting.height
    };
};

// Event handling
self.port.on('open', function(msg){
    var data = JSON.parse(msg);

    if(!document.getElementById(wrapper_tag_id)){
        initWrapper();
    }

    var wrapper = $('#' + wrapper_tag_id);
    var container = $('#' + content_tag_id);

    if(isTextSelected() && data.option.show_near_selection){
        var location_of_selection = getSelectionLocation();
        container.css(css_style_for_seletion_tooltip({
            top: location_of_selection.top,
            left: location_of_selection.left
        }));
    }

    container.html(data.html);
    container.show();
});

function getSelectionLocation(){
    var selection = window.getSelection();
    var oRange = selection.getRangeAt(0);
    return oRange.getBoundingClientRect();
}

function isTextSelected(){
    var selection = window.getSelection();
    return !selection.isCollapsed;
}

function initStyle(){
    let reset_style_to_default = `
    #${wrapper_tag_id} {
        all: initial;
    }
    #${wrapper_tag_id} * {
        all: unset;
    }
    `;

    setStyle(reset_style_to_default);
    setStyle(firefox_default_css(`#${wrapper_tag_id}`));
    setStyle(jquery_ui_css(`#${wrapper_tag_id}`));
}

function setStyle(style){
    let style_tag = $(`#${style_id}`);
    if(style_tag.length < 1){
        style_tag = $("<style>", {id: style_id, rel: 'stylesheet', type: 'text/css'});
        style_tag.appendTo("head");
    }

    style = "\n" + style;

    style_tag.append(style);
}

function initWrapper(){
    initStyle(wrapper);

    var wrapper = $('<div>', {id: wrapper_tag_id});
    var container = $('<div>', {id: content_tag_id});

    container.appendTo(wrapper);
    wrapper.appendTo('body');

    $(document).on('mouseup', function(e){
        if(!container.is(e.target) && container.has(e.target).length === 0){
            if(container.is(":visible")){
                container.hide();
            }
        }
    });

    container.draggable();
    container.resizable();
}
