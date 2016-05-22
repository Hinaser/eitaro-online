// Configurations
const wrapper_tag_id = 'eitaro-online-wrapper';
const content_tag_id = 'eitaro-online';
//const resizer_id = 'eitaro-panel-resizer';
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

function sanitizeStyle(){
    var style = $('<style>');
    style.append( "#" + wrapper_tag_id + "{all:initial} #" + wrapper_tag_id + " *{all:unset}");
    style.append(firefox_default_css(wrapper_tag_id));
    style.appendTo("head");
}

function initWrapper(){
    sanitizeStyle(wrapper);

    var wrapper = $('<div>', {id: wrapper_tag_id});
    var container = $('<div>', {id: content_tag_id});
    //var resizer = $('<div>', {id: resizer_id});

    //resizer.appendTo(container);
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
    //container.resizable({handleSelector: resizer});
}
