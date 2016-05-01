window.onload = function () {
    var content = document.getElementById("content");
    addon.port.on("set", function (data) {
        content.innerHTML = data;
    });
}
