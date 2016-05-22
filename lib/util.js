var { Cc, Ci } = require("chrome");
var parser = Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser);

var messages = {
    // Search keyword is not hit anything or either service_url or service_selector is misconfigured.
    search_not_hit: "検索キーワードがヒットしなかったようです。"
    , parse_error: "サービスセレクタの設定が誤っている可能性があります。"
    // Please enter or select a file name to be saved.
    , select_filename_to_save: "保存先のファイル名を入力・選択してください"
};

/**
 * Romove extra spaces
 * @param {string} word - string which may or may not contain space characters.
 * @returns {string} - string which continuous 
 */
var trim_space = function (word) {
    return word.replace(/\s+/g, ' ').trim();
};

/**
 * Sanitize html text
 * @param {string} html_text - Html as string being sanitized
 * @returns {string} - Sanitized html as string
 */
var sanitizeHtml = function (html_text) {
    var document = parser.parseFromString(html_text, "text/html");
    // Sanitize html text here by using the function provided by mozilla
    // https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion#Safely_Using_Remote_HTML
    var html_flagment = parseHTML(document, html_text, true, null, false);

    var div = document.createElement('div');
    div.appendChild(html_flagment);
    return div.innerHTML;
};

/**
 * Analyze search result html text and return as html document
 * @param {string} html_as_string - String like '<html><head><meta ...></html>'
 * @param {string} selector - HTML5 selector string like '#someid > .someclass > p'
 * @param {string} deselector - Kind of selector. If elements are selected by this 'deselector', remove those element from the element specified by selector.
 * @throws will throw an Error when document.querySelector(<user_defined_selector>) fails
 * @throws will throw an Error when result by document.querySelector(<user_defined_selector>) is empty
 * @returns {string}
 */
var parseSearchResult = function (html_as_string, selector, deselector){
    var content_to_return = null;
    var document = parser.parseFromString(html_as_string, "text/html");

    try {
        content_to_return = document.querySelector(selector);
    } catch(e) {
        console.error(e);
        throw new Error(messages.parse_error);
    }

    // Remove child nodes which jeopardizes page content.
    try {
        if(!/^\s*$/.test(deselector)){
            let node_list = document.querySelectorAll(selector + " " + deselector);
            let node_array = Array.from(node_list); // Converts nodeList into Array of nodes
            node_array.forEach(function(ele){
                ele.parentNode.removeChild(ele);
            });
        }
    }
    catch(e){
        // Failure in deselecting is not a problem. So never throws Error here.
        console.error(e);
    }

    if(!content_to_return){
        console.log('Content is empty after it is parsed.');
        throw new Error(messages.search_not_hit);
    }

    return sanitizeHtml(content_to_return.innerHTML);
};

/**
 * Export search result history data without readable format into a file
 * @param db - Instance of database defined in lib/db.js.
 */
var exportDumpToFile = function (db){
    const nsIFilePicker = Ci.nsIFilePicker;
    var fp = Cc["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(require('sdk/window/utils').getMostRecentBrowserWindow().content, messages.select_filename_to_save, nsIFilePicker.modeSave);
    fp.appendFilter("JSON(JavaScript Object Notation) file", "*.json");
    fp.defaultExtension = "json";
    var res = fp.show();
    if(res != nsIFilePicker.returnCancel){
        var theFile = fp.file;
        var fileIO = require("sdk/io/file");
        db.getAll("dtime", "prev", function(item){
            var TextWriter = fileIO.open(theFile.path, "w");
            if (!TextWriter.closed) {
                TextWriter.write(JSON.stringify(item));
                TextWriter.close();
            }
        });
    }
};

/**
 * Export search result history data with readable format into a file
 * @param db - Instance of database defined in lib/db.js.
 */
var exportFormattedDataToFile = function (db){
    const nsIFilePicker = Ci.nsIFilePicker;
    var fp = Cc["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(require('sdk/window/utils').getMostRecentBrowserWindow().content, messages.select_filename_to_save, nsIFilePicker.modeSave);
    fp.appendFilters(nsIFilePicker.filterHTML);
    fp.defaultExtension = "html";
    var res = fp.show();
    if(res != nsIFilePicker.returnCancel){
        var theFile = fp.file;
        var fileIO = require("sdk/io/file");
        db.getAll("dtime", "prev", function(item){
            var TextWriter = fileIO.open(theFile.path, "w");
            if (!TextWriter.closed) {
                var text_to_write = "<html>\n" +
                    "<head>\n" +
                    "<meta charset='utf-8'>\n" +
                    "<style type='text/css'>\n" +
                    "  table {\n" +
                    "    font-size: 12px;\n" +
                    "    border-collapse: collapse;\n" +
                    "  }\n" +
                    "  \n" +
                    "  td {\n" +
                    "    padding: 2px;\n" +
                    "    border: 1px solid #777;\n" +
                    "  }\n" +
                    "  td.date {\n" +
                    "    display: none;\n" +
                    "  }\n" +
                    "  tbody td.word {\n" +
                    "    font-size: 18px;\n" +
                    "  }\n" +
                    "</style>\n" +
                    "<script>\n" +
                    "  var data = " + JSON.stringify(item) + ";\n" +
                    "  window.onload = function () {\n" +
                    "    var tr_inner_template = '<td class=\"date\">{0}</td><td class=\"word\">{1}</td><td class=\"result\">{2}</td>';\n" +
                    "    var tbody = document.getElementById('table-body');\n" +
                    "    for(var i=0;i<data.length;i++) {\n" +
                    "      var tr = document.createElement('tr');\n" +
                    "      td = tr_inner_template.replace('{0}', data[i].dtime).replace('{1}', data[i].word).replace('{2}', data[i].result);\n" +
                    "      tr.innerHTML = td;\n" +
                    "      tbody.appendChild(tr);\n" +
                    "    }\n" +
                    "  }\n" +
                    "</script>\n" +
                    "</head>\n" +
                    "<body>\n" +
                    "  <table>\n" +
                    "    <thead>\n" +
                    "      <tr>\n" +
                    "        <td class='date'>Date</td>\n" +
                    "        <td class='word'>Word</td>\n" +
                    "        <td class='result'>Result</td>\n" +
                    "      </tr>\n" +
                    "    </thead>\n" +
                    "    <tbody id='table-body'>\n" +
                    "    </tbody>\n" +
                    "  </table>\n" +
                    "</body>\n" +
                    "</html>\n";
                TextWriter.write(text_to_write);
                TextWriter.close();
            }
        });
    }
};

/*
 * The code below is a copy from this page.
 * https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion#Safely_Using_Remote_HTML
 */
/**
 * Safely parse an HTML fragment, removing any executable
 * JavaScript, and return a document fragment.
 *
 * @param {Document} doc The document in which to create the
 *     returned DOM tree.
 * @param {string} html The HTML fragment to parse.
 * @param {boolean} allowStyle If true, allow <style> nodes and
 *     style attributes in the parsed fragment. Gecko 14+ only.
 * @param {nsIURI} baseURI The base URI relative to which resource
 *     URLs should be processed. Note that this will not work for
 *     XML fragments.
 * @param {boolean} isXML If true, parse the fragment as XML.
 */
function parseHTML(doc, html, allowStyle, baseURI, isXML) {
    let PARSER_UTILS = "@mozilla.org/parserutils;1";

    // User the newer nsIParserUtils on versions that support it.
    if (PARSER_UTILS in Cc) {
        let parser = Cc[PARSER_UTILS]
            .getService(Ci.nsIParserUtils);
        if ("parseFragment" in parser)
            return parser.parseFragment(html, allowStyle ? parser.SanitizerAllowStyle : 0,
                !!isXML, baseURI, doc.documentElement);
    }

    return Cc["@mozilla.org/feed-unescapehtml;1"]
        .getService(Ci.nsIScriptableUnescapeHTML)
        .parseFragment(html, !!isXML, baseURI, doc.documentElement);
}

module.exports.trim_space = trim_space;
module.exports.sanitizeHtml = sanitizeHtml;
module.exports.parseSearchResult = parseSearchResult;
module.exports.exportDumpToFile = exportDumpToFile;
module.exports.exportFormattedDataToFile = exportFormattedDataToFile;
