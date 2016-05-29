const tooltip_css = function(wrapper_id) {
    return `
${wrapper_id} {
    font-size: 12px;
}

${wrapper_id} > div {
    position: absolute;
    z-index: 1000000;
    background-color: rgba(255,255,255,1);
    border: 2px solid gray;
    border-radius: 4px;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    padding: 15px 12px 12px 15px;
    width: auto;
    height: auto;
    display: inline-block;
    overflow: hidden;
}

${wrapper_id} header {
    margin: -15px -12px 5px -15px;
    padding: 0 5px 0 5px;
    border-bottom: 2px solid gray;
    font-family: cursive;
    position: relative;
    min-width: 160px;
    background-color: gainsboro;
    border-radius: 4px 4px 0 0;
    height: 26px;
}

${wrapper_id} header input {
    border: 1px solid #DDD;
    border-radius: 4px;
}

${wrapper_id} header input[type="number"] {
    width: 37px;
    padding: 5px;
}

${wrapper_id} header input[type="text"] {
    width: 150px;
    padding: 5px;
}

${wrapper_id} header span.title {
    position: relative;
    top: 5px;
}

${wrapper_id} header button {
    height: 26px;
    width: 26px;
    padding-top: 2px;
    padding-left: 2px;
}

${wrapper_id} header svg {
    width: 20px;
    height: 20px;
}

${wrapper_id} header button#eitaro-online-setting-btn {
    position: absolute;
    right: 30px;
}

${wrapper_id} header button#eitaro-online-setting-btn:hover {
    cursor: pointer;
    background-color: #999;
    border: 1px solid: #222;
}

${wrapper_id} header button#eitaro-online-close-btn {
    position: absolute;
    right: 0px;
}

${wrapper_id} header button#eitaro-online-close-btn:hover {
    cursor: pointer;
    background-color: #999;
    border: 1px solid: #222;
}

${wrapper_id} header svg#remove-button path {
    fill: #777;
}

${wrapper_id} header button#eitaro-online-close-btn:hover svg#remove-button path {
    background-color: rgba(33,33,33,0.8);
}

${wrapper_id} header input[type="number"] + input[type="text"] {
    margin-left: 10px;
}

${wrapper_id} header input[type="text"] + button {
    margin-left: 10px;
}

/* CSS styles for jQuery UI Resizable to expand resize draggable edge */
// handle on the bottom
${wrapper_id} .ui-resizable-s {
    height: 10px;
}

// handle on the right
${wrapper_id} .ui-resizable-e {
    width: 10px;
}

// handle icon (corner)
${wrapper_id} .ui-resizable-se {
    width: 10px;
    height: 10px;
}
`;
};
