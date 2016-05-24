var Tabs = require("sdk/tabs");
var scripts_path = [
    './jquery-2.2.4.min.js',
    './jquery-ui.min.js',
    './html.css.js',
    './jquery-ui.css.js',
    './tooltip.css.js',
    './tooltip.js'
];
var workers= [[],[]];

var Tooltip = function(){

};

Tooltip.prototype.init = function(){
    Tabs.on("ready", function(tab){
        if(isTabAlreadyAttached(tab)){
            deleteWorker(tab);
        }
    });
};

Tooltip.prototype.show = function(content, option){
    var tab = Tabs.activeTab;

    if(!isTabAlreadyAttached(tab)){
        attach();
    }

    var worker = getWorkerOfTab(tab);

    var msg = {};
    msg.html = content;
    msg.option = option;

    try{
        worker.port.emit('open', JSON.stringify(msg));
    }
    catch(e){ // Rescue a case that worker is unloaded.
        attach();
        worker = getWorkerOfTab(tab)
        worker.port.emit('open', JSON.stringify(msg));
    }
};

function attach(){
    var tab = Tabs.activeTab;

    if(isTabAlreadyAttached(tab)){
        deleteWorker(tab);
    }

    var worker = tab.attach({
        contentScriptFile: scripts_path
    });

    workers[0].push(tab.id);
    workers[1].push(worker);

    tab.on('close', deleteWorker);
}

function isTabAlreadyAttached(tab){
    return workers[0].indexOf(tab.id) > -1;
}

function getWorkerOfTab(tab){
    return workers[1][workers[0].indexOf(tab.id)];
}

function deleteWorker(tab){
    var index = workers[0].indexOf(tab.id);
    if(index != -1){
        workers[0].splice(index, 1);
        workers[1].splice(index, 1);
    }
}

module.exports = Tooltip;
