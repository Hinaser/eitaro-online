window.onload = function () {
    // Show loading gif once sidebar is opened.
    prepare();

    addon.port.on("prepare", function () {
        prepare();
    });

    addon.port.on("clear", function(){
        clearContents();
    })

    // Listen 'set' message from main script.
    // When the message arrives, set the html data in the message to sidebar.
    addon.port.on("set", function (json) {
        let data = JSON.parse(json);

        clearContents();

        if(data.type == 'single'){
            setSingle(data);
        }
        else if(data.type == 'history'){
            setHistory(data);
        }
        else if(data.type == 'error'){
            setError(data);
        }
    });

    // Send get message to main script when sidebar is ready
    addon.port.emit("get");
};

window.onunload = function(){
    clearContents();
};

/**
 * Clear current DOM
 */
function clearContents(){
    let content = document.getElementById("content");
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
}

/**
 * Show loading gif image until data to display arrives.
 */
function prepare(){
    let content = document.getElementById("content");
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    let img = document.createElement('img');
    img.setAttribute('src', './loader.gif');
    content.appendChild(img);
}

/**
 * Set error message to sidebar
 * @param {Object} data - Object which contains html text data to display.
 */
function setError(data){
    var content = document.getElementById("content");
    content.innerHTML = data.single_data;
}

/**
 * Set single search result to sidebar
 * @param {Object} data - Object which contains html text data to display.
 */
function setSingle(data){
    var content = document.getElementById("content");
    content.innerHTML = data.single_data;
}

/**
 * Set search history data to sidebar
 * @param {Object} data - Object which contains html text data to display.
 */
function setHistory(data){
    var content = document.getElementById("content");
    // Setup display html
    var showFirstData = data.option.show_first_data;
    var records = data.history_data;
    var histories = "";
    records.forEach(function (element, index, array) {
        if (index == 0 && showFirstData) {
            histories += "<div id='" + index + "' class='history'><div class='title'><a class='word' data-hidden='no' data-href='" + index + "'>" + element.word + "</a><a class='remove-item' data-word='" + element.word + "'>削除</a></div><div class='data'>" + element.result + "</div></div>";
        }
        else {
            histories += "<div id='" + index + "' class='history'><div class='title'><a class='word' data-hidden='yes' data-href='" + index + "'>" + element.word + "</a><a class='remove-item' data-word='" + element.word + "'>削除</a></div><div class='data hidden'>" + element.result + "</div></div>";
        }
    });
    content.innerHTML = histories;

    // Setup Onclick event on div.title
    // If wherever inside the div is clicked, then expand/hide search result area.
    var onClick_title = function (e) {
        var href = this.childNodes[0].dataset.href;
        var children = document.getElementById(href).childNodes;

        if (this.childNodes[0].dataset.hidden == 'yes') {
            children[1].className = 'data';
            this.childNodes[0].dataset.hidden = 'no';
        }
        else {
            children[1].className = 'data hidden';
            this.childNodes[0].dataset.hidden = 'yes';
        }
    };
    var div = document.getElementsByClassName('title');
    for (let i = 0; i < div.length; i++) {
        div[i].addEventListener("click", onClick_title);
    }

    // Setup onclick event for delete button.
    // When the button is clicked, send message to main script that the clicked word should be deleted from indexeddb.
    var onClick_delete = function (e) {
        e.stopPropagation();
        var word = this.dataset.word;

        if (!confirm(word + ' を本当に削除してよろしいですか？')) { // 'Are you sure to delete ' + word
            return;
        }

        addon.port.emit("delete", word);
    };
    var delete_btn = document.getElementsByClassName('remove-item');
    for (let i = 0; i < delete_btn.length; i++) {
        delete_btn[i].addEventListener("click", onClick_delete);
    }
}