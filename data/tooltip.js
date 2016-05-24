// Configurations
const wrapper_tag_id = 'eitaro-online-wrapper';
const container_tag_id = 'eitaro-online-container';
const content_header_id = 'eitaro-online-header';
const content_tag_id = 'eitaro-online';
const style_id = 'eitaro-online-style';
const close_btn_id = 'close-btn';

// Event handling
self.port.on('ping', function(){});

self.port.on('prepare', function(msg){
    var data = JSON.parse(msg);

    $(`#${style_id}`).remove();

    var wrapper = $(`#${wrapper_tag_id}`);
    if(wrapper.length > 0){
        wrapper.empty();
    }
    else{
        wrapper = $('<div>', {id: wrapper_tag_id});
        wrapper.appendTo('body');
    }

    var container = $('<div>', {id: container_tag_id});

    if(isTextSelected() && data.option.show_near_selection){
        var location_of_selection = getSelectionLocation();
        container.css({
            position: 'absolute',
            top: location_of_selection.top + 20 + window.scrollY,
            left: location_of_selection.left + 20 + window.scrollX,
            border: '1px solid gray',
            borderRadius: 4,
            width: '48px',
            height: '48px',
            zIndex: 100000
        });
    }

    container.append(loading_gif());
    wrapper.append(container);

    container.draggable();
});

self.port.on('open', function(msg){
    var data = JSON.parse(msg);

    initWrapper();

    var wrapper = $('#' + wrapper_tag_id);
    var container = $('#' + container_tag_id);
    var content = $("#" + content_tag_id);

    if(isTextSelected() && data.option.show_near_selection){
        var location_of_selection = getSelectionLocation();
        container.css({
            position: 'absolute',
            top: location_of_selection.top + 20 + window.scrollY,
            left: location_of_selection.left + 20 + window.scrollX
        });
    }

    content.empty();
    content.prepend(data.html);

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
    setStyle(tooltip_css(`#${wrapper_tag_id}`));
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
    initStyle();

    var wrapper = $(`#${wrapper_tag_id}`);
    if(wrapper.length > 0){
        wrapper.empty();
    }
    else{
        wrapper = $('<div>', {id: wrapper_tag_id});
        wrapper.appendTo('body');
    }

    var container = $('<div>', {id: container_tag_id});
    var content = $('<div>', {id: content_tag_id});
    var header = createHeader(container, content);

    container.draggable();
    container.resizable();

    container.on('resize', function(){
        content.height(container.height() - 45);
    });

    content.css({
        overflow: 'auto',
        width: '100%',
        height: '100%'
    });

    header.appendTo(container);
    content.appendTo(container);
    container.appendTo(wrapper);
}

function createHeader(container, content){
    var header = $('<header>', {id: content_header_id});
    var font_setting = $('<input>', {type: 'number', value: '12'});
    //var search_box = $('<input>', {type: 'text', placeholder: '検索したいキーワード'});
    //var search_btn = $('<button>検索</button>');
    var close_btn = $(`<button id="${close_btn_id}">閉じる</button>`);

    header.append("文字の大きさ ");
    header.append(font_setting);
    //header.append(search_box);
    //header.append(search_btn);
    header.append(close_btn);

    font_setting.on("keyup input", function(){
        let font_size = font_setting.val();
        content.css('font-size', `${font_size}px`);
    });

    close_btn.on('click', function(e){
        container.hide();
    });

    return header;
}
