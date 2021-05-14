$(document).ready(function () {

    var layoutPerfil = $.parseJSON($('#quadrosPerfil').val());
    console.log(layoutPerfil)
    var gridStack = $('#gridLayout').gridstack({
        acceptWidgets: false,
        alwaysShowResizeHandle: false,
        animate: false,
        ddPlugin: false,
        disableDrag: true,
        disableResize: true
    });


    function getHtmlQuadro(){
        return  '<div class="grid-stack-item bg-branco">' +
            '<div class="grid-stack-item-content">' +
            '<div class="grid-stack-body"></div>' +
            '</div>' +
            '</div>';
    }

    // gridStack.data('gridstack').batchUpdate();
    for(var i=0; i < layoutPerfil.length; i++){

        var widget = gridStack.data('gridstack').addWidget(
            getHtmlQuadro(),
            layoutPerfil[i].x,
            layoutPerfil[i].y,
            layoutPerfil[i].width,
            layoutPerfil[i].height
        );

        widget.data('nome', layoutPerfil[i].nome);
        widget.data('id', layoutPerfil[i].id);
        widget.data('acao', layoutPerfil[i].acao);
        widget.data('tipo', layoutPerfil[i].tipo);
        widget.data('cmsi', layoutPerfil[i].cmsi);
        widget.data('opad', layoutPerfil[i].opad);
        //console.log(widget.data('acao'));
        widget.find(".grid-stack-body").load(PUBLIC_URL+widget.data('acao')+"?modal=2", function(response, status, xhr) {
            switch(xhr.status){
                case 403:
                    bootbox.alert({message: D.ERRO_PERMISSAO, size: "small"});
                    break;
            }
        });

    }
    // gridStack.data('gridstack').commit();

});





