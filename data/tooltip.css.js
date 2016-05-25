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
    margin-top: -10px;
    margin-bottom: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid gray;
    font-family: cursive;
    position: relative;
    min-width: 160px;
}

${wrapper_id} input {
    border: 1px solid #DDD;
    border-radius: 4px;
}

${wrapper_id} input[type="number"] {
    width: 37px;
    padding: 5px;
}

${wrapper_id} input[type="text"] {
    width: 150px;
    padding: 5px;
}

${wrapper_id} button {
    line-height: 20px;
    border: 1px solid gray;
    border-radius: 4px;
    background-color: rgb(204,204,204);
    color: rgb(85,85,85);
}

${wrapper_id} button#close-btn {
    border: 1px solid orange;
    border-radius: 4px;
    background-color: red;
    color: white;
    position: absolute;
    top: 2px;
    right: 0px;
    line-height: 20px;
}

${wrapper_id} button#close-btn:hover {
    background-color: orange;
    cursor: pointer;
}

${wrapper_id} input[type="number"] + input[type="text"] {
    margin-left: 10px;
}

${wrapper_id} input[type="text"] + button {
    margin-left: 10px;
}
`;
};
