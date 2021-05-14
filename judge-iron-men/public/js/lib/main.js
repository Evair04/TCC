/**
 * @desc Arquivo padrao bootstrap
 */
(function () {
    var $confirm;

    $confirm = null;

    $(function () {
        var $createDestroy, $window, sectionTop;
        $window = $(window);
        sectionTop = $(".top").outerHeight() + 20;
        $createDestroy = $("#switch-create-destroy");
        hljs.initHighlightingOnLoad();
        $("a[href*=\"#\"]").on("click", function (event) {
            var $target;
            event.preventDefault();
            $target = $($(this).attr("href").slice("#"));
            if ($target.length) {
                return $window.scrollTop($target.offset().top - sectionTop);
            }
        });
        $('.checkSwitch').not("[data-switch-no-init]").bootstrapSwitch();
        $("[data-switch-get]").on("click", function () {
            var type;
            type = $(this).data("switch-get");
            return alert($("#switch-" + type).bootstrapSwitch(type));
        });
        $("[data-switch-set]").on("click", function () {
            var type;
            type = $(this).data("switch-set");
            return $("#switch-" + type).bootstrapSwitch(type, $(this).data("switch-value"));
        });
        $("[data-switch-toggle]").on("click", function () {
            var type;
            type = $(this).data("switch-toggle");
            return $("#switch-" + type).bootstrapSwitch("toggle" + type.charAt(0).toUpperCase() + type.slice(1));
        });
        $("[data-switch-set-value]").on("input", function (event) {
            var type, value;
            event.preventDefault();
            type = $(this).data("switch-set-value");
            value = $.trim($(this).val());
            if ($(this).data("value") === value) {
                return;
            }
            return $("#switch-" + type).bootstrapSwitch(type, value);
        });
        $("[data-switch-create-destroy]").on("click", function () {
            var isSwitch;
            isSwitch = $createDestroy.data("bootstrap-switch");
            $createDestroy.bootstrapSwitch((isSwitch ? "destroy" : null));
            return $(this).button((isSwitch ? "reset" : "destroy"));
        });
        return $confirm = $("#confirm").bootstrapSwitch({
            size: "mini",
            onSwitchChange: function (event, state) {
                event.preventDefault();
                return console.log(state, event.isDefaultPrevented());
            }
        });
    });

}).call(this);


$('option').mouseover(function (e) {
//    alert('yeah!');
    var tar = $(e.target);
    if (tar.is('option')) {

    }

})

function escondemostraDiv(id) {
    var val4 = 1
    if (id == '#ModalEstatus') {

//        if ($('#pmco_veic_em_viagem')[0].checked == true && $('#pmco_veic_sem_viagem')[0].checked == true) {
        if ($('#pmco_cor_em_viagem').val() == $('#pmco_cor_sem_viagem').val()) {
            val4 = 2;
        }
//        }
//        if ($('#pmco_veic_em_viagem')[0].checked == true && $('#pmco_veic_com_sm')[0].checked == true) {
        if ($('#pmco_cor_em_viagem').val() == $('#pmco_cor_com_sm').val()) {
            val4 = 2;
        }
//        }
//        if ($('#pmco_veic_sem_viagem')[0].checked == true && $('#pmco_veic_com_sm')[0].checked == true) {
        if ($('#pmco_cor_sem_viagem').val() == $('#pmco_cor_com_sm').val()) {
            val4 = 2;
        }
//        }
    }
    if (val4 == 1) {
        if ($(id).css('display') == 'block') {
            $(id).css('display', 'none');
        } else if ($(id).css('display') == 'none') {
            $(id).css('display', 'block');            
        }
    } else {
        BootstrapAlert.warning('Status não podem possuir cores iguais!');
        // BootstrapDialog.show({
        //     title: 'Informação',
        //     type: 'type-warning',
        //     message: 'Status não podem possuir cores iguais!',
        //     buttons: [{
        //             label: 'Fechar',
        //             action: function (dialogItself) {
        //                 dialogItself.close();
        //             }}]
        //
        // });
    }


}


function trocacor(id) {

    if ($(id).val() == 1)
        $(id).css('background-color', 'green');
    else if ($(id).val() == 2)
        $(id).css('background-color', 'yellow');
    else if ($(id).val() == 3)
        $(id).css('background-color', 'red');
}