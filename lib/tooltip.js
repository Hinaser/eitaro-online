var Tabs = require("sdk/tabs");
var scripts_path = [
    './jquery-2.2.4.min.js',
    './jquery-ui.min.js',
    './html.css.js',
    './jquery-ui.css.js',
    './tooltip.css.js',
    './tooltip.js',
    './loading.gif.js'
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

Tooltip.prototype.prepare = function(option){
    sendMessage(Tabs.activeTab, 'prepare', {option: option});
};

Tooltip.prototype.show = function(content, option){
    sendMessage(Tabs.activeTab, 'open', {
        html: content,
        option: option
    });
};

function isWorkerDead(tab){
    var worker = getWorkerOfTab(tab);

    if(!worker){
        return true;
    }

    try{
        worker.port.emit('ping', "");
        return false;
    }
    catch(e){
        return true;
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

    return worker;
}

function sendMessage(tab, message, data){
    var worker;

    if(!isTabAlreadyAttached(tab) || isWorkerDead(tab)){
        worker = attach();
    }
    else{
        worker = getWorkerOfTab(tab);
    }

    worker.port.emit(message, JSON.stringify(data));
}

function isTabAlreadyAttached(tab){
    return workers[0].indexOf(tab.id) > -1;
}

function getWorkerOfTab(tab){
    let index = workers[0].indexOf(tab.id);
    if(index < 0){
        return null;
    }
    return workers[1][index];
}

function deleteWorker(tab){
    var index = workers[0].indexOf(tab.id);
    if(index != -1){
        workers[0].splice(index, 1);
        workers[1].splice(index, 1);
    }
}

module.exports = Tooltip;
