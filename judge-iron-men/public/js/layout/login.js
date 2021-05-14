$(document).ready( function(){
    $.material.init();
    $.material.ripples();

    if($("#fimSessao").val()){
        bootbox.alert({
            message: D.ERRO_SESSAO,
            size: "small"
        }).on('hidden.bs.modal', function() {
            $("#usua_login").focus();
        });
    }else{
        $("#usua_senha").focus();
        $("#usua_login").focus();
    }

    $("#esqueceu_senha").click(function () {

        $.get(PUBLIC_URL + 'login/esqueceusenha', {login: $("#usua_login").val()})
            .done(function (data, textStatus, xhr) {
                if (xhr.status === 201){
                    BootstrapAlert.info(data.msg)
                }
            })
            .fail(function (xhr, data) {
                switch(xhr.status){
                    case 400:
                        var erros = $.parseJSON(xhr.responseText);
                        BootstrapAlert.error(erros.error);
                        break;
                }
            })
    })
});