$(document).ready(function(){
    // Bootstrap's tab setup
    $("#tabs").tab();
    $(".nav-tabs a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    // Receive all configuration values from addon
    addon.port.on("init-config", function(data){
        const config = JSON.parse(data);
        $.each(config, function(key, value){
            let input = $(`input[name="${key}"]`);

            if(input.length < 1){
                return;
            }

            const type = input.attr("type");
            if(type === "checkbox"){
                input.prop("checked", value);
            }
            else if(type === "radio"){
                input.filter(`[value=${value}]`).prop("checked", true);
            }
            else if(type === "button"){
                // Do nothing, but DON'T remove this statement.
                // This statement exists because any value from addon should not be set.
            }
            else{
                input.val(value);
            }
        });
    });

    // Receive a configuration value from addon
    addon.port.on("set-config", function(data) {
        const config = JSON.parse(data);
        let input = $(`input[name="${config.name}"]`);
        if(input.length < 1){
            return;
        }

        const type = input.attr("type");
        if(type === "checkbox"){
            input.prop( "checked", config.value);
        }
        else if(type === "radio"){
            input.filter(`[value=${config.value}]`).prop("checked", true);
        }
        else{
            input.val(config.value);
        }
    });

        // Send configuration value to addon
    $("input").on("change input", function(e){
        const name = $(this).attr("name");
        let value;

        const type = $(this).attr("type");
        if(type === "checkbox"){
            value = $(this).is(":checked");
        }
        else if(type === "number"){
            value = parseInt($(this).val());
        }
        else{
            value = $(this).val();
        }

        const config = {
            name: name,
            value: value
        };

        addon.port.emit("change-config", JSON.stringify(config));
    });

    // Send configuration value to addon
    $("input[type='button']").on("click", function(){
        const name = $(this).attr("name");
        const config = {
            name: name,
            value: Date.now().toString()
        };

        addon.port.emit("change-config", JSON.stringify(config));
    });
});