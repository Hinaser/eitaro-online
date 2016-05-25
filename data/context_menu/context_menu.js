// I once tried to get the value of `service_name` from main.js somehow,
// but there seem to be no way for script in main.js to post message to
// this content-script.
var service_name = "英太郎 ONLINE"; // I want to set data from main.js, but I couldn't find the method so hard code the value here...

// When right click menu opens with text selection, add a menu item on context menu
self.on("context", function () {
    let selection = window.getSelection().toString();
    if (!!selection) {
        if (selection.length > 15) {
            selection = selection.substr(0, 15);
            selection += "..."
        }
        return service_name + " で \"" + selection + "\" を検索";
    }
});

// When context menu item is clicked, notify it to main addon script with selected search keyword.
self.on("click", function () {
    let msg = {
        type: "search",
        data: window.getSelection().toString()
    };
    
    self.postMessage(JSON.stringify(msg));
});
