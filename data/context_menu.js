// I once tried to get the value of `service_name` from index.js somehow, 
// but there seem to be no way for script in main.js to post message to
// this content-script.
var service_name = "英太郎 ONLINE"; // I want to set data from main.js, but I couldn't find the method so hard code the value here...

self.on("context", function () {
    var selection = window.getSelection().toString();
    if (!!selection) {
        if (selection.length > 15) {
            selection = selection.substr(0, 15);
            selection += "..."
        }
        return service_name + " で \"" + selection + "\" を検索";
    }
});

self.on("click", function () {
    var msg = {};
    msg.type = "search";
    msg.data = window.getSelection().toString();
    self.postMessage(JSON.stringify(msg));
});
