window.onload = function () {
    /*
     * Messaging between addon main script
     */
    // Send get message to main script first
    addon.port.emit("get");

    // Listen 'set' message from main script.
    // When the message comes, set the html data directly into sidebar.
    addon.port.on("set", function (data) {
        // Clear current DOM
        var content = document.getElementById("content");
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        content.innerHTML = data;
    });

    // Listen 'set-history' message from main script.
    // When it comes, parse the data and construct search history list to display.
    addon.port.on("set-history", function (data) {
        // Clear current DOM
        var content = document.getElementById("content");
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        // Setup display html
        var object = JSON.parse(data);
        var showFirstData = object.showFirstData;
        var records = object.data;
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
        }
        var div = document.getElementsByClassName('title');
        for (var i = 0; i < div.length; i++) {
            div[i].addEventListener("click", onClick_title);
        }

        // Setup onclick event for delete button.
        // When the button is clicked, send message to main script that the clicked word should be deleted from indexeddb.
        var onClick_delete = function (e) {
            e.stopPropagation();
            var word = this.dataset.word;

            if (!confirm(word + ' を本当に削除してよろしいですか？')) {
                return;
            }

            addon.port.emit("delete", word);
        }
        var delete_btn = document.getElementsByClassName('remove-item');
        for (var i = 0; i < delete_btn.length; i++) {
            delete_btn[i].addEventListener("click", onClick_delete);
        }
    });
}

