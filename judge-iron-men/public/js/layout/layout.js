$(document).ready(function () {

    //http://fezvrasta.github.io/bootstrap-material-design
    $.material.init();
    $.material.ripples();

    // Definicao global  para os dataTables do  numero de botoes na bara inferior
    $.fn.DataTable.ext.pager.numbers_length = 5;

    var menuAberto = false;
    var menuMovendo = false;
    var menuBtnClicado = false;
    var menuNivel = 0;
    var i = 0;

    /*
    * Menu:
    *  http://multi-level-push-menu.make.rs/
    */
    $('#menu-itens').show().multilevelpushmenu({
        collapsed: !menuAberto,
        menuWidth: '338px',
        mode: 'cover',
        preventItemClick: false,
        preventGroupItemClick: false,
        backText: 'Voltar',
        fullCollapse: true,
        onCollapseMenuStart: function(){
            menuNivel--;
            menuMovendo = true;
            if(!menuBtnClicado && !menuNivel){
                $("#menu-button").toggleClass('open');
                menuAberto = !menuAberto;
            }

            menuBtnClicado = false;
        },
        onCollapseMenuEnd: function(){
            menuMovendo = false;
            menuBtnClicado = false;
        },
        onExpandMenuStart: function(){
            menuNivel++;
            menuMovendo = true;
            menuBtnClicado = false;
        },
        onExpandMenuEnd: function(){
            menuMovendo = false;
            menuBtnClicado = false;
        }
    });

    $('#menu_btn_back').click(function () {window.history.back();});

    $('#menu_btn_config_grup_map').click(function () {
        var box =  bootbox.confirm({
            message:"<div class='col-md-12 form-group m-t-menos-15'>" +
                "            <div class='input-group'>" +
                "                <label class='control-label required-input' for='configuracao_grupo'>"+D.AGRUPAR_VEICULO_MAPA+"</label>" +
                "                <select class='select-2 configuracao_grupo' id='configuracao_grupo' >" +
                "                <option value='S'>"+D.SIM.toUpperCase()+"</option>" +
                "                <option value='N'>"+D.NAO.toUpperCase()+"</option>" +
                "                </select>" +
                "            </div>" +
                "        </div>",
            buttons: {
                'confirm': {
                    label: 'Confirmar',
                    className: 'btn-info '
                },
                'cancel': {
                    label: 'Fechar',
                    className: 'btn-danger'
                }
            },
            size: 'small',
            callback: function(result) {
                if (result) {
                    sendPostRequest(
                        'configuracao/setagrupamentomapa',
                        {
                            configuracao_grupo: $("#configuracao_grupo").val()
                        },
                        function (dados, xhr) {
                            if(dados.response){
                                location.href = PUBLIC_URL + 'index';
                            }
                        }
                    );
                }
            }
        });
        box.init(function(){
            sendGetRequest(
                'configuracao/getagrupamentomapa',null,
                function (dados, xhr) {
                    if (dados.config) {
                        $('.configuracao_grupo').val(dados.config).trigger('change');
                    }else{
                        $('.configuracao_grupo').val('N').trigger('change');
                    }
                }
            );
            $('.configuracao_grupo').select2()
        });

    });

    $('#item_monitctrfrotapadrao').click(function () {
        $(this).removeAttr("href");
        setTimeout(function () {
            $('#mainLoadingScreen').hide();
        }, 250);
        menuBtnClick();

        window.open(PUBLIC_URL + "perfilmonitorcontrolefrota/monitorpadrao", '_blank');
    });

    $('#item_monitlogpadrao').click(function () {
        $(this).removeAttr("href");
        setTimeout(function () {
            $('#mainLoadingScreen').hide();
        }, 250);
        menuBtnClick();

        window.open(PUBLIC_URL + "monitorlogistico", '_blank');
    });


    var menuBtnClick = function(){
        if(!menuMovendo){
            menuBtnClicado = true;
            $("#menu-button").toggleClass('open');
            $('#menu-itens').multilevelpushmenu(menuAberto ? 'collapse' : 'expand');
            menuAberto = !menuAberto;
        }
    };

    $("#menu-button").click(menuBtnClick);

    $('body').click(function (e) {

        target = $(e.target);

        if( menuAberto &&
            !e.isTrigger &&
            target.parents('#menu-itens').length === 0 &&
            target.id !== "menu-button"){

            menuBtnClick();
        }

        if (target.parent().data('toggle') !== 'popover' && target.data('toggle') !== 'popover' &&
            !target.hasClass('editable-click') && target.parents('.popover.in').length === 0 && !target.hasClass('alert')
        ) {

            popovers = $('.popover');

            if((popovers.css('zIndex') > target.zIndex()) && !popovers.children().children().hasClass('element-required-popover')){
                popovers.popover('hide');
            }
        }
    });



    function controlLabelRequired(){

        setTimeout(function () {
            $("form :input[type!='file']").blur(function (e) {
                var input = $(e.target);
                var label = input.siblings('label');

                if(!input.val()){
                    if(label.hasClass('required-input')) {
                        if (label.length > 0) {
                            label.addClass('font-red');
                        }
                    }
                }
            }).
            keypress(function (e) {
                var input = $(e.target);
                var label = input.siblings('label');

                if(input.attr('type') != 'number'){
                    if(label.length > 0){
                        label.removeClass('font-red');
                    }
                }
                else if(input.attr('type') == 'number' && (e.which > 47 && e.which < 58)){
                    if(label.length > 0){
                        label.removeClass('font-red');
                    }
                }
            });


            $("form select").on('select2:closing', function (e) {
                var select = $(e.target);
                var label = select.siblings('label');

                if(!select.val()){
                    if(label.length > 0){
                        if(label.hasClass('required-input')){
                            label.addClass('font-red');
                        }
                    }
                }
            }).
            on('select2:select', function (e) {
                var select = $(e.target);
                var label = select.siblings('label');

                if(select.val()){
                    if(label.length > 0){
                        if(label.hasClass('required-input')){
                            label.removeClass('font-red');
                        }
                    }
                }
            });
        }, 200);
    }

    function controlTitle(modalAtivo){
        var elements = $("[title]:not(.no_popover_title)");

        if(modalAtivo){
            var modal = $(".modal:visible");
            modal = $(modal[modal.length-1]);
            elements = $(modal).find("[title]:not(.no_popover_title)")
        }

        for (i = 0; i < elements.length; i++) {
            var title = elements[i].title;
            var placement = 'top';

            if($(elements[i]).hasClass('bottom-title')){
                placement = 'bottom';
            }
            else if($(elements[i]).hasClass('left-title')){
                placement = 'left';
            }
            else if($(elements[i]).hasClass('right-title')){
                placement = 'right';
            }

            if(!$(elements[i]).parents('td').length && !$(elements[i]).hasClass('select2-selection__rendered') &&
                !$(elements[i]).hasClass('select2-selection__choice') && !$(elements[i]).hasClass('pull-right') &&
                !$(elements[i]).children().hasClass('fa-plus')
            ) {
                $(elements[i]).removeAttr('title');

                if(!$(elements[i]).hasClass('pull-right') && !$(elements[i]).children().hasClass('fa-plus')) {
                    $(elements[i]).addClass('popover_title').popover({
                        content: title,
                        trigger: 'hover',
                        placement: placement
                    });
                }
            }
        }
    }

    function controlTabFormElements(modalAtivo) {
        var form = null;
        if(modalAtivo){
            var modal = $(".modal:visible");
            modal = $(modal[modal.length-1]);
            form = $(modal).find("form");

            // Faz o controle de foco durante a troca de navs dos forms em modal
            $(modal[modal.length-1]).find(".nav-tabs li").click(function () {
                controlFocus(true, true);
            });
            // Faz o controle de foco durante a troca de steps dos forms wizards em modal
            $(modal[modal.length-1]).find(".steps-wizard li").click(function () {
                controlFocus(true, true);
            });
        }else{
            form = $("form");
            // Faz o controle de foco durante a troca de navs do form
            $(".nav-tabs li").click(function () {
                controlFocus(false, true);
            });
            // Faz o controle de foco durante a troca de steps do form-wizard
            $(".steps-wizard li").click(function () {
                controlFocus(false, true);
            });
        }

        var tabPanes = form.find(".tab-pane");

        for(var i=0; i< tabPanes.length; i++){
            $(tabPanes[i]).find("input, textarea, a").last().on("keydown", function (e) {
                if(e.which == 9 && !e.shiftKey){
                    e.preventDefault();
                }
            })
        }
    }

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

    function controlFocus(modalAtivo, onNavigate){
        setTimeout(function () {
            var form = null;
            var searchField = null;
            if(modalAtivo){
                var modal = $(".modal:visible");
                modal = $(modal[modal.length-1]);
                form = $(modal).find("form:not(.formulario-interno)");
                searchField = $(modal).find('div.dataTables_filter input');
            }else{
                form = $("form:not(.formulario-interno)");
                searchField = $('div.dataTables_filter input');
            }
            // Inicializa as variaveis  com o form globalmente
            var formElements = form[0] ? form[0] : []; //Pega todos os elementos do form
            var requiredElements = form.find('ul').siblings('input[type!=hidden], select.select-2, textarea'); //Pega todos os elementos com erro do form

            // Controle de foco  especifico para a tab-pane ativa, ocorre durante as trocas de nav / step
            if($(form).find(".tab-pane.active").length && onNavigate){
                form = form.find(".tab-pane.active");
                formElements = form.find("input[type!=hidden], select.select-2, textarea");
                requiredElements = form.find('ul').siblings('input[type!=hidden], select.select-2, textarea');
                searchField = form.find('div.dataTables_filter input');
            }


            var label = null;
            if(requiredElements.length > 0){
                label = $(requiredElements[0]).siblings('label');
                //Pega a tab-pane a qual o primeiro elemento com erro pertence e seta o foco na nav / step equivalente
                var tabPaneSet = $(requiredElements[0]).parents('.tab-pane');
                if(!tabPaneSet.hasClass('active')){
                    var id = tabPaneSet.prop('id');
                    $("[href='#"+id+"']").trigger('click');
                }

                requiredElements[0].focus();
                // Realiza o offset do focus() nos input
                // $('html, body').animate({
                //     scrollTop: $(label[0]).offset().top-100
                // }, 100);
            }
            else if(formElements.length > 0){
                var length = formElements.length;

                for (var i = 0; i < length; i++) {
                    var elemento = $(formElements[i]);
                    if(!elemento.prop('readonly') && !elemento.attr('readonly') && !elemento.prop('disable') &&
                        !elemento.prop('disabled') && !elemento.is(':hidden') && !elemento.hasClass('no-focus'))
                    {
                        elemento.focus();
                        label = elemento.siblings('label');

                        if(!elemento.is(':checkbox') && !elemento.is('[type=search]')) {


                            // Realiza o offset do focus() nos input
                            // $('html, body').animate({
                            //     scrollTop: $(label[0]).offset().top - 100
                            // }, 100);
                        }
                        i = length;
                    }
                }
            }else if(searchField.length > 0){
                searchField[searchField.length-1].focus()
            }
        }, 150);
    }

    function controlFocusPopover(){
        var form = null;
        var formElements = [];
        var requiredElements = [];
        var container = $("#container-popovers").children();

        if($(container[container.length-1]).find('.popover-content').children().length){
            form = $(container[container.length-1]).find('.popover-content').children();
            formElements = form.find("input[type!=hidden], select.select-2, textarea");
            requiredElements = form.find('ul').siblings('input[type!=hidden], select.select-2, textarea');
        }

        var label = null;
        if(requiredElements.length > 0){
            requiredElements[0].focus();
            label = $(requiredElements[0]).siblings('label');

            // Realiza o offset do focus() nos input
            $('html, body').animate({
                scrollTop: $(label[0]).offset().top-100
            }, 100);
        }
        else if(formElements.length > 0){
            var length = formElements.length;

            for (var i = 0; i < length; i++) {
                var elemento = $(formElements[i]);
                if(!elemento.prop('readonly') && !elemento.attr('readonly') && !elemento.prop('disable') &&
                    !elemento.prop('disabled') && !elemento.is(':hidden') && !elemento.hasClass('no-focus'))
                {
                    elemento.focus();
                    label = elemento.siblings('label');

                    if(!elemento.is(':checkbox') && !elemento.is('[type=search]')) {
                        // Realiza o offset do focus() nos input
                        $('html, body').animate({
                            scrollTop: $(label[0]).offset().top - 70
                        }, 0);
                    }
                    i = length;
                }
            }
        }
    }

    function controlSelectOpening(){
        $("form select").on("select2:opening", function (e) {
            if($(this).attr('readonly') || $(this).prop('readonly') || $(this).is(':hidden')){
                e.preventDefault();
            }
        });
    }

    function controlScrollFocus() {
        setTimeout(function () {
            $("form input[type!=hidden], select.select-2, textarea").focus(function (e) {
                if(!$(this).attr('readonly') && !$(this).is(':checkbox') && !$(this).prop('readonly') && !$(this).is(':hidden') && !$(this).is('[type=search]')){
                    $('html, body').animate({
                        scrollTop: $(this).offset().top-100
                    }, 100);
                }
            });
        }, 150)
    }

    var idUltimoPopover = '';
    function closePopover(e){
        if(!$(e.target).hasClass('popover-title')){
            var container = $("#container-popovers").children();

            for(var i=0; i < container.length; i++){
                // Verifica se o popover contem conteudo ou é apenas texto
                if($(container[i]).find('.popover-content').children().length){
                    // Busca o elemento equivalente na DOM para o id do popover
                    var targetPopover = $("[aria-describedby='"+container[i].id+"']");
                    $(container[i]).popover('hide');
                    // Fecha o popover antes de abrir caso seja diferente do ultimo popover alvo
                    if((targetPopover.attr('id') != $(e.target).context.id) && (idUltimoPopover != $(e.target).context.id)){
                        idUltimoPopover = '';
                        $(e.target).popover('hide');
                        if($(e.target).children().hasClass('fa-plus')) {
                            setTimeout(function () {
                                $(e.target).trigger('click')
                            }, 200);
                        }
                    }else {
                        idUltimoPopover = $(e.target).context.id;
                    }
                }
            }
        }
    }

    $(window).bind('load', function(e){
        controlFocus();
        controlScrollFocus()
        controlTitle();
        controlBtnLupa();
        controlSelectOpening();
        controlLabelRequired();
        controlTabFormElements();
    });

    $("form").submit(function() {
        LoadScreen.show();
    });

    $('a[href]:not([href^="#"])').click(function() {
        LoadScreen.show();
    });



    //Aplica Localidade a biblioteca de alertas
    bootbox.setLocale(LANGUAGE);

    var elementCalledModal = [];
    //Corrige bug de multiplas modals abertas
    $(document).on('show.bs.modal', '.modal', function (e) {
        var zIndex = 110 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    }).on('shown.bs.modal', '.modal', function (e) {
        controlFocus(true); // Controle de qual elemento receberá o foco após load do modal
        controlTitle(true);
        controlBtnLupa();
        controlSelectOpening();
        controlLabelRequired();
        controlTabFormElements(true);
        // Empilha a lista de elementos que invocaram as modais (unicamente para setar foco no elemento anterior ao load da modal)
        elementCalledModal.push(target.hasClass('fa') || target.hasClass('fas') || target.hasClass('far') ? target.offsetParent() : target);
    }).on('hidden.bs.modal', '.modal', function (e) {
        $('.modal:visible').length && $(document.body).addClass('modal-open');
        $("#container-modals").children().last().remove(); // Destroy as modais geradas no conteiner

        // Desempilha a lista de elementos que invocaram as modais e seta o foco no elemento desempilhado
        setTimeout(function () {
            var element = elementCalledModal.pop();
            element.focus();
        }, 300);
    }).on('show.bs.popover', function (e) {
        closePopover(e);
    }).
    on('shown.bs.popover', function () {
        controlBtnLupa();
        controlFocusPopover();
        controlLabelRequired();
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
    $(document).on('focus', '.select2-selection--single', function(e) {
        select2_open = $(this).parent().parent().siblings('select');
        if(!select2_open.is(':disabled'))
            select2_open.select2('open');
    });

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


    //OCORRENCIAS

    //PEGA O TOTAL DE OCORRENCIAS
    function getTotalOcorrencias() {
        // sendGetRequest("ocorrencias/gettotal", null,
        //     function (data) {
        //         $("#total_ocorrencias").html('');
        //         $("#total_ocorrencias").html('<i class="fa fa-bell"><span class="fonte-roboto-regular">'+data.total+'</span></i>')
        //     },null,true
        // );
    }
    getTotalOcorrencias();

    //ATUALIZA AS OCORRENCIAS NO MENU
    function updateMenuOcorrencias() {
        sendGetRequest("ocorrencias/getdados", null,
            function (data) {
                if (data){
                    var html2 = '';
                    for(var x = 0 ; x < data.length; x++) {
                        html2 = html2 +
                            '<div class="item item-menu item-menu-ocorrencia" id="'+data[x].ocor_codigo+'">' +
                            '<a>' +
                            '<span class=" pull-left"><i class="fa fa-exclamation fa-2x text-warning"></i></span>' +
                            '<span class="cursor-pointer">' + data[x].ocor_observacao + '  <br><small class=" cursor-pointer text-muted">' + data[x].ocor_tipo_evento + ', '+data[x].evento_data+'</small></span>' +
                            '</a>' +
                            '</div>'
                    }
                    var html = '<li><p class="bg-primary">'+D.OCORRENCIAS+' <a href="'+PUBLIC_URL+'ocorrencias" class="fonte-roboto-bold pull-right btn-xs">Veja todas as ocorrências</a></p></li>' +
                        '<li class="drop-conteudo nicescroll">' +
                        html2+
                        '</li>' ;

                }
                $('#menu_ocorrencias').html(html);
                $(".item-menu-ocorrencia").click(function () {
                    var id = this.id;
                    DialogConfirmaAcaoAjax(D.LER_OCORRENCIA, "ocorrencias/ler", {
                            id: id
                        },
                        function(xhr){
                            BootstrapAlert.success(xhr.msg);
                            updateMenuOcorrencias();
                            getTotalOcorrencias()
                        }
                    );
                });
            }
        );
    }

    //NÃO CONFORMIDADES
    function getTotalNaoConformidades() {
        // sendGetRequest("naoconformidade/gettotal", null,
        //     function (data) {
        //         $("#total_nao_conformidades").html('');
        //         $("#total_nao_conformidades").html('<i class="fa fa-envelope"><span class="fonte-roboto-regular">'+data.total+'</span></i>')
        //     },null,true
        // );
    }
    getTotalNaoConformidades();

    //ATUALIZA AS NÃO CONFORMIDADES NO MENU
    function updateMenuNaoConformidades() {

        sendGetRequest("naoconformidade/getdados", null,
            function (data) {
                if (data){
                    var htmlN2 = '';
                    for(var y = 0 ; y < data.length; y++) {
                        htmlN2 = htmlN2 +
                            '<div class="item item-menu item-menu-nao-conformidade" id="'+data[y].ornc_codigo+'">' +
                            '<a>' +
                            '<span class=" pull-left"><i class="fa fa-exclamation fa-2x text-warning"></i></span>' +
                            '<span class="cursor-pointer">' + data[y].ocor_observacao + '  <br><small class=" cursor-pointer text-muted">' + data[y].tnco_descricao + ', '+data[y].ornc_data_cadastro+'</small></span>' +
                            '</a>' +
                            '</div>'
                    }
                    var htmlN = '<li><p class="bg-primary">'+D.NAO_CONFORMIDADES+' <a href="'+PUBLIC_URL+'naoconformidade" class="fonte-roboto-bold pull-right btn-xs">Veja todas as não conformidades</a></p></li>' +
                        '<li class="drop-conteudo nicescroll">' +
                        htmlN2+
                        '</li>' ;

                }
                $('#menu_nao_conformidades').html(htmlN);

                $(".item-menu-nao-conformidade").click(function () {
                    var id = this.id;
                    DialogConfirmaAcaoAjax(D.LER_NAO_CONFORMIDADE, "naoconformidade/ler", {
                            id: id
                        },
                        function(xhr){
                            BootstrapAlert.success(xhr.msg);
                            updateMenuNaoConformidades();
                            getTotalNaoConformidades()
                        }
                    );
                });
            }
        );
    }

    //PEGA AS INFORMAÇÕES DAS OCORRENCIAS
    $("#total_nao_conformidades").click(function () {
        updateMenuNaoConformidades();
    });

    //PEGA AS INFORMAÇÕES DAS OCORRENCIAS
    $("#total_ocorrencias").click(function () {
        updateMenuOcorrencias();
    });

    //Impede que feche o dropdown quando clica no seu menu
    $('.menu-nao-conformidades').click(function(e) {
        e.stopPropagation();
    });

    //Impede que feche o dropdown quando clica no seu menu
    $('.menu-ocorrencias').click(function(e) {
        e.stopPropagation();
    });
});