const tooltip_css = function(wrapper_id, container_id, suggest_container_id) {
    return `
${wrapper_id} {
    font-size: 12px;
    font-family: sans-serif;
}

${wrapper_id} > ${container_id} {
    position: absolute;
    z-index: 1000000;
    background-color: rgba(255,255,255,1);
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    padding: 15px 12px 12px 15px;
    width: auto;
    height: auto;
    display: inline-block;
    overflow: hidden;
}

${wrapper_id} > ${suggest_container_id} {
    border: 1px solid blue;
    background-color: #4d90fe;
    border-radius: 3px;
    width: 100px;
    height: 25px;
}

${wrapper_id} > ${suggest_container_id} .triangle {
    position: absolute;
    top: -6px;
    left: 15px;
    width: 0;
    height: 0;
    border-bottom: 6px solid #4d90fe;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
}

${wrapper_id} > ${suggest_container_id} button {
    display: none; /* This will turn to be "block" after button is incorporated into DOM. This prevents css style of parent page to be applied for an very short time. */
    background-color: transparent;
    color: white;
    border: none;
    box-shadow: none;
    border-radius: 3px;
    width: 100%;
    height: 100%;
}

${wrapper_id} > ${suggest_container_id}:hover .triangle {
    border-bottom: 6px solid rgb(89,150,255);
}

${wrapper_id} > ${suggest_container_id}:hover button  {
    background-color: rgb(89,150,255);
}

${wrapper_id} header {
    margin: -15px -12px 5px -15px;
    padding: 0 5px 0 5px;
    border-bottom: 1px solid #d8d8d8;
    font-family: cursive;
    position: relative;
    min-width: 160px;
    background-color: #f6f6f6;
    border-radius: 4px 4px 0 0;
    height: 26px;
}

${wrapper_id} header {
    cursor: move;
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

${wrapper_id} header span.title:hover {
    cursor: move;
}

${wrapper_id} header button {
    height: 26px;
    width: 26px;
    padding-top: 2px;
    padding-left: 2px;
    box-sizing: border-box;
    background-color: transparent;
    border: none;
    box-shadow: none;
}

${wrapper_id} header svg {
    width: 20px;
    height: 20px;
}

${wrapper_id} header button#eitaro-online-setting-btn {
    display: inline-block;
    float: right;
}

${wrapper_id} header button#eitaro-online-setting-btn:hover {
    background-color: #66eeff;
    border: 1px solid #00aaff;
    cursor: pointer;
}

${wrapper_id} header button#eitaro-online-close-btn {
    display: inline-block;
    float: right;
}

${wrapper_id} header button#eitaro-online-close-btn:hover {
    background-color: #66eeff;
    border: 1px solid #00aaff;
    cursor: pointer;
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
`;
};
