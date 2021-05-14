$(document).ready(function () {

    //http://fezvrasta.github.io/bootstrap-material-design
    $.material.init();
    $.material.ripples();

    // Inicializa alterações de Comportamento do RenderStepView para o modo de monitor
    var steps = $('.steps');
    var screenWidth = $('.formulario-interno');
    steps.hide();
    screenWidth.toggleClass('col-md-10');
    screenWidth.toggleClass('col-md-12');
    $("#monitor-menu-button").click(function () {
        $(this).children().toggleClass('fas fa-bars');
        $(this).children().toggleClass('fas fa-times');
        screenWidth.toggleClass('col-md-10');
        screenWidth.toggleClass('col-md-12');
        steps.toggle('hide');
    });

    $("#monitor-btn-full-screen").click(function () {
        if (!document.fullscreenElement &&    // alternative standard method
            !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    });


    $('body').click(function (e) {

        var target = $(e.target);

        if (target.parent().data('toggle') !== 'popover'
            && target.data('toggle') !== 'popover'
            && !target.hasClass('editable-click')
            && target.parents('.popover.in').length === 0) {

            var popovers = $('.popover');

            if(popovers.css('zIndex') > target.zIndex()){
                popovers.popover('hide');
            }
        }
    });

    $("form").submit(function() {
        LoadScreen.show();
    });

    $('a[href]:not([href^="#"])').click(function() {
        LoadScreen.show();
    });



    //Aplica Localidade a biblioteca de alertas
    bootbox.setLocale(LANGUAGE);

    //Corrige bug de multiplas modals abertas
    $(document).on('show.bs.modal', '.modal', function () {
        var zIndex = 110 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);

    }).on('hidden.bs.modal', '.modal', function () {
        $('.modal:visible').length && $(document.body).addClass('modal-open');
    });

    //Definição de padrões do Datatables
    $.extend( true, $.fn.dataTable.defaults, {
        "language": {
            "sEmptyTable": D.NENHUM_REGISTRO_ENCONTRADO,
            "sInfo": D.MOSTRANDO_REGISTROS,
            "sInfoEmpty": D.MOSTRANDO_ZERO_REGISTROS,
            "sInfoFiltered": D.MOSTRANDO_FILTRADOS,
            "sInfoPostFix": "",
            "sInfoThousands": ".",
            "sLengthMenu": D.RESULTADOS_PAGINA,
            "sLoadingRecords": D.CARREGANDO,
            "sProcessing": D.PROCESSANDO,
            "sZeroRecords": D.MOSTRANDO_ZERO_REGISTROS,
            "sSearch": D.PESQUISAR,
            "oPaginate": {
                "sNext": D.PROXIMO,
                "sPrevious": D.ANTERIOR,
                "sFirst": D.PRIMEIRO,
                "sLast": D.ULTIMO
            },
            "oAria": {
                "sSortAscending": D.ORDENA_ASC,
                "sSortDescending": D.ORDENA_DESC
            }
        }
    });

    //Definição de padrões da biblioteca de datas
    moment.locale(LANGUAGE);


    //Definição de padrões de configuração do X-Editable
    $.fn.editable.defaults.emptytext = '';
    $.fn.editable.defaults.container = '#container-popovers';

    //Definição de padrões de configuração do Popover
    $.fn.popover.Constructor.DEFAULTS.container = '#container-popovers';

    //Definição de padrões de configuração do Select2
    $.fn.select2.defaults.set('language', LANGUAGE);
    $.fn.select2.defaults.set('placeholder', D.SELECIONE);
    $.fn.select2.defaults.set('width', '100%');
    $.fn.select2.defaults.set('dropdownParent', $('#container-select2'));

    //Correção do tab do select2
    var select2_open;
    // open select2 dropdown on focus
    // $(document).on('focus', '.select2-selection--single', function(e) {
    //     select2_open = $(this).parent().parent().siblings('select');
    //     if(!select2_open.is(':disabled'))
    //         select2_open.select2('open');
    // });

    // fix for ie11
    if (/rv:11.0/i.test(navigator.userAgent)) {
        $(document).on('blur', '.select2-search__field', function (e) {
            if(!select2_open.is(':disabled'))
                select2_open.select2('close');
        });
    }


    //Sobrescrever função de foco da modal do Bootstrap para corrigir erro de foco no select2
    $.fn.modal.Constructor.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.bs.modal') // guard against infinite focus loop
            .on('focusin.bs.modal', $.proxy(function (e) {
                if (this.$element[0] !== e.target && !this.$element.has(e.target).length && !$(e.target).closest('.select2-dropdown').length) {
                    this.$element.trigger('focus')
                }
            }, this))
    };

    // $.fn.editable.defaults.emptyclass = '';
    $.fn.editableform.buttons =
        '<button type="submit" class="btn btn-raised btn-default btn-sm editable-submit">'+
        '<i class="fa fa-fw fa-check"></i>'+
        '</button>'+
        '<button type="button" class="btn btn-raised btn-sm editable-cancel">'+
        '<i class="fa fa-fw fa-times"></i>'+
        '</button>';

    //Ajusta as labels dos inputs que iniciam já preenchidos
    fixLabelInputs();

    //Esconde as mensagens do sistema que são iniciadas ao carregar a página
    BootstrapAlert.fade();

    function controlBtnLupa(){
        var btnLupa = $('a.btn-lupa');

        if(btnLupa.length > 0){
            for(i=0; i < btnLupa.length; i++){
                $(btnLupa[i]).removeClass('m-t-40');

                if($(btnLupa[i]).prop('href') == 'undefined' || $(btnLupa[i]).prop('href') == ''){
                    $(btnLupa[i]).prop('href', "#");
                }
            }
        }
    }
});


