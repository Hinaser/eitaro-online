// Setting for panel
var panel_url = "./panel.html";
// This `panel_content` holds html text to display on panel.
var panel_content = "";
var panel_position = null;

// Panel to display lookup result
var panel = require("sdk/panel").Panel({
    contentURL: panel_url
});

var Panel = function(direction){
    this.set_panel_position(direction);

    panel.on("show", function(){
        panel.port.emit("set", panel_content);
    });
}

Panel.prototype.show = function(html_text){
    panel_content = html_text;
    // Show panel
    panel.show({
        position: panel_position
    });
}

// Preference setup
Panel.prototype.set_panel_position = function (direction){
    switch(direction){
        case "left":
            panel_position = {
                left: 10,
                top: 0,
                bottom: 10
            };
            break;
        case "top":
            panel_position = {
                left: 10,
                top: 0,
                right: 10
            };
            break;
        case "right":
            panel_position = {
                top: 0,
                bottom: 10,
                right: 10
            };
            break;
        case "bottom":
            panel_position = {
                left: 10,
                bottom: 10,
                right: 10
            };
            break;
        default:
            panel_position = null;
            break;
    }
};

module.exports = Panel;
