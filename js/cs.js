$(function() {
    $('#loaderImage').hide();

    var params = {
        // Request parameters
        "visualFeatures": "Categories,Description,Color",
        "details": "",
        "language": "en",
    };

    var extensiones = new Array('jpg', 'jpeg', 'png');

    $('#get-info').click(function(){
        var mi_url = $('#url_imagen').val();
ext = mi_url.substr(mi_url.lastIndexOf('.') + 1);
        console.log(ext);
        if(  extensiones.indexOf(ext) != -1 ){
            $('#loaderImage').show();


            $.ajax({
                // NOTE: You must use the same location in your REST call as you used to obtain your subscription keys.
                //   For example, if you obtained your subscription keys from westus, replace "westcentralus" in the
                //   URL below with "westus".
                url: "https://westeurope.api.cognitive.microsoft.com/vision/v1.0/analyze?" + $.param(params),

                beforeSend: function(xhrObj){
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type","application/json");

                    // NOTE: Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "5e1bd1ad922346999851df3fe222e721");
                },

                type: "POST",

                // Request body
                data: '{"url": "'+mi_url+'"}',
            })

            .done(function(data) {

                $('#loaderImage').hide();


                // Show formatted JSON on webpage.
            //    $('#responseTextArea').val(JSON.stringify(data, null, 2));
                console.log(JSON.stringify(data, null, 2));
                if(data!= null){
                    var tags="";
                    data.description.tags.forEach(function(tag){
                        tags+="#" +tag + " ";
                    });
                    var description = data.description.captions[0].text;
                    var precision = data.description.captions[0].confidence;

                    var colors ="";
                    data.color.dominantColors.forEach(function(color){
                        colors+= color + " ";
                    });
                    console.log(tags + " \n"+ description + "\n" + precision + "\n" + colors );

                    $('#tags').html('<h4>Tags</h4>'+tags);
                    $('#description').html('<h4>Descripción</h4>'+description);
                    $('#precision').html('<h4>Precisión</h4>'+precision);
                    $('#colors').html('<h4>Colores</h4>'+colors);

                }


            })

            .fail(function(jqXHR, textStatus, errorThrown) {
                $('#loaderImage').hide();

                // Display error message.
                var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
                alert(errorString);
            });

        } else {
            alert("No has introducido una url de imagen válida.");
        }


    });


});
