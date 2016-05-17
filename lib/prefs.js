var { Cc, Ci } = require("chrome");
var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);
var prefs = require('sdk/simple-prefs');
var Util = require('lib/util');

var Prefs = function(){
    this.frame = null;
    this.frame_url = "";
    this.panel = null;
    this.db = null;
};

Prefs.prototype.init = function(frame, frame_url, panel, db){
    if( ! (frame && frame_url && panel && db) ){
        throw new Error('Insufficient parameter');
    }

    this.frame = frame;
    this.frame_url = frame_url;
    this.panel = panel;
    this.db = db;

    prefs.on("preservehistory", function(){
        prefs.prefs["displaytarget"] = "sidebar";
    }.bind(this));

    prefs.on("panelposition", function(){
        this.panel.set_panel_position(prefs.prefs["panelposition"]);
        prefs.prefs["displaytarget"] = "panel";
    }.bind(this));

    prefs.on("alwaysopennewtab", function(){
        prefs.prefs["displaytarget"] = "tab";
    }.bind(this));

    prefs.on("servicename", function(){
        var msg = {};
        msg.type = "update-placeholder";
        msg.data = prefs.prefs["servicename"] + "で検索";;
        this.frame.postMessage(JSON.stringify(msg), this.frame_url);
    }.bind(this));

    prefs.on("serviceurl", function(){
    }.bind(this));

    prefs.on("serviceselector", function(){
    }.bind(this));

    // Modification of default setting from v0.0.1. after v0.0.1, ... > li:first will not work.
    if(prefs.prefs['serviceselector'] == '#resultsList > ul > li:first'){
        prefs.prefs['serviceselector'] = '#resultsList > ul > li:first-child';
    }

    prefs.on("clearresult", function(){
        if (prompts.confirm(null, "警告", "全ての履歴が削除され、元に戻せませんがよろしいですか？")) {
            this.db.clear();
        }
    }.bind(this));

    prefs.on("export", function(){
        Util.exportFormattedDataToFile(this.db);
    }.bind(this));

    prefs.on("dump", function(){
        Util.exportDumpToFile(this.db);
    }.bind(this));
};

Prefs.prototype.get = function(name){
    return prefs.prefs[name];
};

module.exports = Prefs;