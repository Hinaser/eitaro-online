window.onload = function () {
    addon.port.emit("get");
    addon.port.on("set", function (data) {
        // Clear current DOM
        var content = document.getElementById("content");
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        content.innerHTML = data;
    });
    addon.port.on("set-history", function (data) {
        // Clear current DOM
        var content = document.getElementById("content");
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        var object = JSON.parse(data);
        var showFirstData = object.showFirstData;
        var records = object.data;
        var histories = "";
        records.forEach(function (element, index, array) {
            if (index == 0 && showFirstData) {
                histories += "<div id='" + index + "' class='history'><div class='title'><a class='word' data-hidden='no' data-href='" + index + "'>" + element.word + "</a></div><div class='data'>" + element.result + "</div></div>";
            }
            else {
                histories += "<div id='" + index + "' class='history'><div class='title'><a class='word' data-hidden='yes' data-href='" + index + "'>" + element.word + "</a></div><div class='data hidden'>" + element.result + "</div></div>";
            }
        });
        content.innerHTML = histories;

        var onClick = function (e) {
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
            div[i].addEventListener("click", onClick);
        }
    });
}
