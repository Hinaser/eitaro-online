window.onload = function () {
    /*
     * Initialization
     */
    var ref_addon_script = null;
    var input_field = document.getElementById('search-box');
    var history_btn = document.getElementById('history');

    /*
     * Messaging process
     */

    window.addEventListener("message", function (e) {
        if (ref_addon_script == null) {
            ref_addon_script = e.source;
        }

        var inMsg = JSON.parse(e.data);

        switch (inMsg.type) {
            case "focus":
                input_field.focus();
                break;
            case "update-placeholder":
                input_field.setAttribute("placeholder", inMsg.data);
                break;
            case "hide_history_button":
                history_btn.className += ' hide'; // Add class 'hide'
                break;
            case "show_history_button":
                history_btn.className = history_btn.className.replace( /(?:^|\s)hide(?!\S)/g , '');  // Remove class 'hide'
                break;
            default:
                break;
        }
    }, false);

    /*
     * Utility for Debug
     */
    function debug_content_script(data) {
        if (ref_addon_script == null) {
            return;
        }

        var msg = {};
        msg.type = "debug";
        msg.value = data;
        ref_addon_script.postMessage(JSON.stringify(msg), "*");
    }

    /*
     * Main content script
     */
    input_field.addEventListener('keydown', function(e) {
        if (e.which != 13) {
            return false;
        }
        msg = {};
        msg.type = "search";
        msg.value = input_field.value;
        window.parent.postMessage(JSON.stringify(msg), "*");
    });
    input_field.addEventListener('focus', function (e) {
        this.select();
    });

    var config_button = document.getElementById('config');
    config_button.addEventListener('mousedown', function (e) {
        this.className += " " + "pressing";
    });
    config_button.addEventListener('mouseup', function (e) {
        this.className = "";
        msg = {};
        msg.type = "config";
        msg.value = null;
        window.parent.postMessage(JSON.stringify(msg), "*");
    });

    var history_button = document.getElementById('history');
    history_button.addEventListener('mousedown', function (e) {
        this.className += " " + "pressing";
    });
    history_button.addEventListener('mouseup', function (e) {
        this.className = "";
        msg = {};
        msg.type = "history";
        msg.value = null;
        window.parent.postMessage(JSON.stringify(msg), "*");
    });
};
