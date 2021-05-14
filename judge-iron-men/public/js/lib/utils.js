/**
 * @desc Função padrão do sistema para realizar envios ajax por POST
 * @param url Caminho do request (sem raiz do endereço)
 * @param data Dados do request (Object)
 * @param successAction Função executada em caso de sucesso (HttpCode 20x)
 * @param errorAction (Função executada em caso de erro (HttpCode 40x)
 * @param hideLoad Flag para ocultar a tela de load
 */
function sendPostRequest(url, data, successAction, errorAction, hideLoad){
    if(!hideLoad) LoadScreen.show();
    $.post(PUBLIC_URL + url, data)
        .done(function (data, textStatus, xhr) {
            if($.isFunction(successAction))
                successAction(data, xhr);
        })
        .fail(function (xhr) {
            switch(xhr.status){
                case 403:
                    bootbox.alert({
                        message: D.ERRO_PERMISSAO,
                        size: "small"
                    });
                    break;
                case 402:
                    bootbox.alert({message: D.ERRO_CONEXAO_BANCO});
                    break;
                case 401:
                    $.redirect(PUBLIC_URL + "index");
                    break;
                case 400:
                    if($.isFunction(errorAction))
                        errorAction(xhr);
                    break;
            }
        })
        .always(function() {
            if(!hideLoad) LoadScreen.hide();
        });
}

function renderColorPicker(seletor, events){
    seletor.each(function (){
        var input = $(this);
        if(!input.hasClass("full-spectrum")){
            input.spectrum({
                color: this.value ? this.value : "#00ff00",
                showInput: true,
                containerClassName: ['form-control'],
                className: "full-spectrum",
                showInitial: true,
                showPalette: true,
                clearButton: true,
                showSelectionPalette: true,
                maxSelectionSize: 10,
                preferredFormat: "hex",
                cancelText: D.CANCELAR
            });

            for(var i in events){
                input.on(i+'.spectrum', events[i]);
            }
        }
    });
}

function redimensionaImagem(image, maxWidth, maxHeight){
    var razao = null;
    var arraySize = [image.width(), image.height()];

    // Converte para caber dentro dos limites de largura
    if (arraySize[0] > maxWidth) {
        razao = arraySize[0] / arraySize[1];
        image.width(maxWidth);
        image.height(parseInt(maxWidth / razao));
    }

    // Converte para caber dentro dos limites da altura
    if(arraySize[1] > maxHeight){
        razao = arraySize[1] / arraySize[0];
        image.height(maxHeight);
        image.width(parseInt(maxHeight / razao));
    }
}

/**
 * @desc Função padrão do sistema para realizar envios ajax por GET
 * @param url Caminho do request (sem raiz do endereço)
 * @param data Dados do request (Object)
 * @param successAction Função executada em caso de sucesso (HttpCode 20x)
 * @param errorAction (Função executada em caso de erro (HttpCode 40x)
 * @param hideLoad Flag para ocultar a tela de load
 */
function sendGetRequest(url, data, successAction, errorAction, hideLoad){
    if(!hideLoad) LoadScreen.show();
    $.get(PUBLIC_URL + url, data)
        .done(function (data, textStatus, xhr) {
            if($.isFunction(successAction))
                successAction(data, xhr);
        })
        .fail(function (xhr) {
            switch(xhr.status){
                case 401:
                    $.redirect(PUBLIC_URL + "index");
                    break;
                case 400:
                    if($.isFunction(errorAction))
                        errorAction(xhr);
                    break;
            }
        })
        .always(function() {
            if(!hideLoad) LoadScreen.hide();
        });
}

/**
 * @desc Remove o modal de onde ele estiver e adicionar no container
 * de modais (para mostrar um modal dentro do outro de forma correta)
 * @param idmodal id do modal que será removido e adicionado
 */
function copiarModalParaContainer(modal) {
    var newModal = modal.clone();
    newModal.uniqueId();

    newModal.appendTo($("<div></div>")
        .attr('id', 'container-' + newModal.attr('id'))
        .appendTo($("#container-modals")))

    return newModal;
}
/**
 * @desc Verifica se um item esta dentro de um array
 * @param needle item para saber se esta dentro do array
 * @param haystack Array
 */
function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++)
        if (haystack[i] == needle)
            return true;
    return false;
}


/**
 * @desc Carrega modals através de requisição ajax
 * @param url Link para o request da view
 * @param idmodal Id da modal que será carregada
 * @param faux Função auxiliar que será executada após o carregamento da modal
 * @param paux Parametro a ser enviado para a função auxiliar
 * @param param Parametro a ser enviado na url
 */
function loadRequestModal(url, idmodal, faux, paux, param){
    LoadScreen.show();

    $("#container-modals").append("<div id='container-"+idmodal+"'></div>");
    $("#container-"+idmodal).
        load(PUBLIC_URL+url+"?modal=1"+(param ? param : ''), function(response, status, xhr) {
            LoadScreen.hide();
            switch(xhr.status){
                case 400:
                    BootstrapAlert.error($.parseJSON(response).erro);
                    break;
                case 401:
                    $.redirect(PUBLIC_URL + "index");
                    break;
                case 402:
                    bootbox.alert({message: D.ERRO_CONEXAO_BANCO});
                    break;
                case 403:
                    bootbox.alert(D.ERRO_PERMISSAO);
                    break;
                case 200:
                    $("#"+idmodal).modal('show')

                    if(jQuery.isFunction(faux)){
                        faux(paux);
                    }

                    fixLabelInputs();
                    break;
            }
        });
}

/**
 * @desc Cria Select2 com requisição de dados ao servidor
 * @param elemento Elemento select do HTML
 * @param url Link para o request dos dados
 * @param orderColumn Coluna que será ordenado os resultados
 * @param orderDir Ordenação dos resultados
 * @param fTemplateResult Função para renderizar os resultados
 * @param fTemplateSelection Função para renderizar o item selecionado
 * @param fFiltroSelecao Função para passar parametros de filtro para consulta
 */
function select2ServerSide(elemento, url, orderColumn, orderDir, fTemplateResult, fTemplateSelection, fFiltroSelecao){

    var limiteSelect = 10;

    return elemento.select2({
        placeholder: D.SELECIONE,
        allowClear: true,
        closeOnSelect: true,
        ajax: {
            url: PUBLIC_URL+url,
            dataType: 'json',
            method: 'POST',
            cache: true,
            delay: 250,
            data: function (params) {
                params.page = params.page || 0;

                var dados = {
                    search: {value: params.term},
                    start: (params.page * limiteSelect),
                    length: limiteSelect,
                    order: [{column: orderColumn, dir: orderDir}]
                };

                if(jQuery.isFunction(fFiltroSelecao)){
                    dados.flags = fFiltroSelecao();
                }

                return dados;
            },
            processResults: function (data, params) {
                params.page = params.page || 0;
                return {
                    results: data.data,
                    pagination: {
                        more: ((params.page * limiteSelect) + limiteSelect) < data.recordsFiltered
                    }
                };
            },
            error: function (xhr, error, thrown) {
                switch(xhr.status){
                    case 401:
                        $.redirect(PUBLIC_URL + "index");
                        break;
                    case 402:
                        bootbox.alert({message: D.ERRO_CONEXAO_BANCO});
                        break;
                    case 403:
                        bootbox.alert(D.ERRO_PERMISSAO);
                        break;
                }
            }
        },

        escapeMarkup: function (markup) { return markup; },

        templateResult: fTemplateResult,
        templateSelection: fTemplateSelection

    });

}

/**
 * Funcao para abrir a tela em fullscreen
 */
function launchFullscreen(element) {
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
}
/**
 * Funcao para fechar a tela em fullscreen
 */
function cancelFullscreen() {
    if(document.cancelFullScreen) {
        document.cancelFullScreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if(document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
}


function genereteSvg(options) {
    var opacity = options.opacity ? options.opacity : 0.8;
    var fillColor = options.fillColor ? options.fillColor :  "#000000";
    var viewBox = options.viewBox ? options.viewBox : "0 0 384 512";
    var path = options.path ? options.path : fontawesome.markers.MAP_MARKER_FILL;
    var dataIcon = options.dataIcon ? options.dataIcon : "map-marker";

    var html =
        '<svg style="opacity: '+ opacity + ';" ' +
            'aria-hidden="true" ' +
            'data-icon="'+ dataIcon +'" ' +
            'role="img" ' +
            'xmlns="http://www.w3.org/2000/svg" ' +
            'viewBox="'+ viewBox +'">' +
                '<path ' +
                    'fill="'+ fillColor + '" ' +
                    'd="'+ path +'">' +
                '</path>' +
        '</svg>';

    return html;
}



/**
 * @desc Inicia tabela padrão para exibição de dados vindos do servidor
 * @param options.iconUrl              String com path do svg
 * @param options.opacity           Float com nivel de opacidade do svg
 * @param options.fillColor         String com cor de preenchimento do svg
 * @param options.viewBox           Caixa de dimensão do svg
 *
 * @param options.color             String com a cor da label
 * @param options.backgroudColor    String com a cor da caixa da label
 * @param options.label             String com a label
 * @param options.labelSize         Int com o tamanho da label (pixels)
 * @param options.labelBoxSize      Int com o tamanho da caixa da label (pixels)
 * @return Div contendo o SVG
 */

function L_ImageIcon(options){

    var iconUrl = options.iconUrl;
    var iconSize = options.iconSize;

    var color = options.color ? options.color :  "#000000";
    var label = options.label ? options.label : "";
    var labelSize = options.labelSize ? options.labelSize : 13;
    var backgroudColor = options.backgroudColor ? options.backgroudColor : "none";
    var labelBoxSize = options.labelBoxSize ? options.labelBoxSize : [0, 0];
    var labelAnchor = options.labelAnchor ? options.labelAnchor : [1, -6];

    var html = '<div class="h-p-50">';

    if(label != "") {

        var tagLabel = '<label class="label-svg p-1 cursor-pointer" style="color:' + color + '; ' +
            'background-color: ' + backgroudColor + ';' +
            'height: ' + labelBoxSize[0] + 'px; ' +
            // 'width: ' + labelBoxSize[1] + 'px;' +
            'text-align: center;' +
            'font-size: '+ labelSize + 'px; !important;">' + label +
            '</label>';

        html += '<div class="label-svg" ' + 'style="' +
            'top: calc(100% + (' + labelAnchor[0] + 'px));' +
            'left: calc(50% + (' + labelAnchor[1] + 'px));"' +
            '>' + tagLabel +
            '</div>';
    }

    html += '<img src="' + iconUrl + '" width="' + iconSize[0] + '" height="' + iconSize[1] +'" />'+
        '</div>';

    return html;
}





/**
 * @desc Inicia tabela padrão para exibição de dados vindos do servidor
 * @param options.path              String com path do svg
 * @param options.opacity           Float com nivel de opacidade do svg
 * @param options.fillColor         String com cor de preenchimento do svg
 * @param options.viewBox           Caixa de dimensão do svg
 *
 * @param options.color             String com a cor da label
 * @param options.backgroudColor    String com a cor da caixa da label
 * @param options.label             String com a label
 * @param options.labelSize         Int com o tamanho da label (pixels)
 * @param options.labelBoxSize      Int com o tamanho da caixa da label (pixels)
 * @return Div contendo o SVG
 */

function L_fontAwesomeIcon(options){

    var opacity = options.opacity ? options.opacity : 0.8;
    var fillColor = options.fillColor ? options.fillColor :  "#000000";
    var viewBox = options.viewBox ? options.viewBox : "0 0 384 512";
    var path = options.path ? options.path : fontawesome.markers.MAP_MARKER_FILL;
    var dataIcon = options.dataIcon ? options.dataIcon : "map-marker";

    var color = options.color ? options.color :  "#000000";
    var label = options.label ? options.label : "";
    var labelSize = options.labelSize ? options.labelSize : 13;
    var backgroudColor = options.backgroudColor ? options.backgroudColor : "none";
    var labelBoxSize = options.labelBoxSize ? options.labelBoxSize : [0, 0];
    var labelAnchor = options.labelAnchor ? options.labelAnchor : [1, -6];

    var html = '<div class="h-p-50">';

    if(label != "") {

        var tagLabel = '<label class="label-svg p-1 cursor-pointer" style="color:' + color + '; ' +
                                'background-color: ' + backgroudColor + ';' +
                                'height: ' + labelBoxSize[0] + 'px; ' +
                                'width: ' + labelBoxSize[1] + 'px;' +
                                'text-align: center;' +
                                'font-size: '+ labelSize + 'px; !important;">' + label +
                       '</label>';

        html += '<div class="label-svg" ' + 'style="' +
                    'top: calc(50% + (' + labelAnchor[0] + 'px));' +
                    'left: calc(50% + (' + labelAnchor[1] + 'px));"' +
                '>' + tagLabel +
                '</div>';
    }

    html += '<svg style="opacity: '+ opacity+ ';" ' +
                'aria-hidden="true" ' +
                'data-icon="'+dataIcon+'" ' +
                'role="img" ' +
                'xmlns="http://www.w3.org/2000/svg" ' +
                'viewBox="'+ viewBox +'">' +
                '<path ' +
                    'fill="'+ fillColor + '" ' +
                    'd="'+ path +'">' +
                '</path>' +
            '</svg>'+
        '</div>';

    return html;
}

/**
 * @desc Inicia tabela padrão para exibição de dados vindos do servidor
 * @param id_tabela     Id do elemento onde será iniciada a tabela
 * @param url           Link para a busca dos dados da tabela
 * @param columns       Colunas da tabela
 * @param nome_tabela   Nome da tabela
 * @param funcaoFlags   Função que será utilizada para filtrar os dados
 * @param buttonsExport Object{xls: default=true, pdf: default=true} botões de exportação do dados da grid
 *
 * @param fixedCollum   Array[[leftCollmsnFixed], [rightCollmsnFixed]], a ordenação será automaticamente removida das
 *                      colunas especificadas. Colunas do tipo detail-control e acoes serão automaticamente configuradas
 *                      (caso haja parametro, este sobrepõem a configuração automática)
 * @param options       Array de opções de inicialização
 * @return DataTables
 */
function TableServerSide(id_tabela, url, columns, nome_tabela, funcaoFlags, buttonsExport, fixedCollum, orderColum, options) {
    buttonsExport = buttonsExport ? buttonsExport : {pdf:true, xls:true};

    var listHeaders = $("h2.cor-1"),
        archiveName = listHeaders[listHeaders.length-1].innerText,
        buttons = [];

    var fixed = {};
    var reorder = {};
    if(fixedCollum){
        fixed = {
            leftColumns: fixedCollum[0],
            rightColumns: fixedCollum[1]
        };
        reorder = {
            fixedColumnsLeft: fixedCollum[0],
            fixedColumnsRight: fixedCollum[1]
        };
    }
    else {
        if(columns[0].class === 'details-control'){
            reorder.fixedColumnsLeft = 1;
        }
        if (columns[columns.length-1].name === "acoes" || columns[columns.length-1].className === "acoes") {
            fixed.leftColumns = 0;
            fixed.rightColumns = 1;
            reorder.fixedColumnsRight = 1;
        }

        if(Object.keys(fixed).length === 0){
            fixed = false;
        }
        if(Object.keys(reorder).length === 0){
            reorder = true;
        }
    }
    var coluna;
    var ordenacao;

    if (orderColum && typeof orderColum === 'object'){
        coluna  =  orderColum.coluna;
        ordenacao  =  orderColum.ordenacao;
    }else if (orderColum){
        coluna = orderColum;
        ordenacao = "desc";
    }else{
        for(var x in columns){
            if(columns[x].orderable !== false){
                coluna = x;
                break;
            }
        }
        ordenacao = "desc";
    }

    var columnsData = null;
    var tabela =  id_tabela.DataTable(Object.assign({}, {
        processing: true,
        order: [[coluna, ordenacao]],
        serverSide: true,
        responsive: true,
        scrollX: true,
        pageLength: columns[0].pagination ? columns[0].pagination : 10,
        lengthMenu: [10, 25, 50, 100, 200, 500, 1000, 2000, 5000],
        dom: "<lfr<t><'col-md-6'i><'col-md-6'p>>",
        fixedColumns: fixed,
        colReorder: reorder,
        buttons: [{
            extend: 'colvis',
            className: 'btn btn-raised btn-default config',
            text: '<i class="fa fa-gear fa-1x"></i>',
            postfixButtons: [
                {
                    className: 'smallSalvar',
                    text: D.SALVAR,
                    action: function (e, dt, node, config) {
                        sendPostRequest("configuracao/setconfgrid", {data: prepareColumns(dt)});
                    }
                },
                {
                    text: D.CANCELAR,
                    className: 'smallCancelar'
                }
            ]
        }].concat(buttons),
        "ajax": {
            "url": PUBLIC_URL + url,
            "type": 'POST',
            "error": function (xhr, error, thrown) {
                if(xhr.status == 401) {
                    $.redirect(PUBLIC_URL + "index");
                }
                if(xhr.readyState == 4) {
                    // BootstrapAlert.warning('Tempo de requisição foi exedido favor atualizar a pagina')
                }
            },

            "data": function (dados) {
                // if(isNaN(dados.length)){     // Isso serviria para trazer todos os dados previamente a exportacao do pdf
                //     dados.length = 999999999;// Mas buga a label de paginação "mostrando 1 até NaN registros"
                //     dados.start = 0;
                // }
                // tabela.draw();
                var x = dados.search.value;
                var y = x.match(/[^A-Za-z0-9 ]/g);

                if(y){
                    dados.search.value = dados.search.value.replace(/\\/g, "\\\\");
                    dados.search.value = dados.search.value.replace(/_/g, "\\_");
                    dados.search.value = dados.search.value.replace(/%/g, "\\%");
                    dados.search.value = dados.search.value.replace(/\*/g, "\\*");
                    dados.search.value = dados.search.value.replace(/\+/g, "\\+");
                    dados.search.value = dados.search.value.replace(/\?/g, "\\?");
                    dados.search.value = dados.search.value.replace(/\|/g, "\\|");
                }

                if(jQuery.isFunction(funcaoFlags)){
                    dados.flags = funcaoFlags();
                }
                return columnsData = dados;
            }
        },

        "columns": columns

    }, options));

    $('.pdf').popover({
        content: D.EXPORTAR_PDF,
        trigger: 'hover',
        placement: "top"
    });
    $('.xls').popover({
        content: D.EXPORTAR_XLS,
        trigger: 'hover',
        placement: "top"
    });
    $('.config').popover({
        content: D.CONFIGURACOES,
        trigger: 'hover',
        placement: "top"
    });

    $('.dt-buttons').click(function () {
        $(".smallSalvar, .smallCancelar").click(function(){
            $(".dt-button-background").trigger("click");
        });
    });

    tabela.on( 'preXhr', function () {
        var requestAtual = tabela.settings()[0].jqXHR;
        if(requestAtual.readyState != 4) {
            requestAtual.abort('Nova requisicao');
        }
    }).on('draw', function () {
        if(typeof InstallTrigger !== 'undefined'){
            $(".DTFC_LeftWrapper").remove();
        }
    });

    //Inputs com a classe "change" disparam evento de reload da grid
    $(".change").change(function () {
        tabela.ajax.reload();
    });
    return tabela;
}


/**
 * @desc Inicia tabela padrão para exibição de dados vindos do servidor
 * @param tabel             A tabela que sera mapeada
 * @param removeFixed       Desconsidera as colunas de acoes e detalhes
 * @param id                id da tabela para setar no configGrid, por padrao sera definido pelo campo "grid" da tabel
 * @return Array de colunas configuradas
 */
function prepareColumns(tabel, removeFixed, id, columns) {
    var cols =          columns ? columns : $(tabel).context[0].aoColumns;
    var name =          id ? id : $(tabel).context[0].sInstance;
    var params =        tabel.ajax.params();
    var paginacao =     null;
    var columns =       [];

    if(typeof params != 'undefined'){
        paginacao = params['data'] ? params['data'].length : params.length;
    }

    for (var x = 0; x < cols.length; x++) {
        columns[x] = {
            'visivel':      cols[x].bVisible,
            'posicao':      cols[x].idx,
            'titulo':       cols[x].sTitle,
            'coluna':       cols[x].data,
            'paginacao':    paginacao,
            'grid':         name,
        }
    }

    if(removeFixed){
        if(columns[columns.length-1].titulo === D.ACOES){
            columns.splice(columns.length-1, 1);
        }
        if(columns[0].titulo === D.DETALHES){
            columns.splice(0, 1);
        }
    }
    return columns;
}

/**
 * @desc Inicia tabela padrão para exibição de dados vindos do servidor
 * @param tabelView         Dados extraidos de $('#suaGrid').jqxGrid('dataview')
 * @return Array de colunas configuradas
 */
function prepareColumnsJqx(tabelView) {
    var cols =          tabelView.grid.columns.records;
    var columns =       [];

    for (var x = 0; x < cols.length; x++) {
        if(cols[x].exportable) {
            columns.push({
                'visivel': !cols[x].hidden,
                'posicao': cols[x].visibleindex,
                'titulo': cols[x].text,
                'coluna': cols[x].datafield
            });
        }
    }

    return columns;
}

function genereteArchiveName() {
    var listHeaders = $("h2.cor-1");
    return listHeaders[0].innerText;
}

function genereteTabelDataExport(tabel) {
    var data = tabel.ajax.params().data;
    data.start = 0;
    data.length = 999999999;
    return data;
}

function ajaxRequestControlByChangeClass(controlElements, elementsClassChange, tabel, datePickerElements){
    controlElements.change(function () {
        if($(this).val()) {
            elementsClassChange.removeClass('block-change');
            if(datePickerElements){
                datePickerElements.removeClass('dp-block-change');
            }

            tabel.ajax.reload();
        }
        else{
            elementsClassChange.addClass('block-change');
            if(datePickerElements){
                datePickerElements.addClass('dp-block-change');
            }
        }
    })
}



function validaDataInicioFim(selectorInicio, selectorFim, objData, tabela, notNull){

    var objInicio = selectorInicio.data('DateTimePicker');
    var dataInicio = objInicio.date();
    var labelInicio = selectorInicio.siblings('label');

    var objFim = selectorFim.data('DateTimePicker');
    var dataFim = objFim.date();
    var labelFim = selectorFim.siblings('label');

    objData.dataInicio = dataInicio ? dataInicio.format('YYYY-MM-DD HH:mm') : null;
    objData.dataFim = dataFim ? dataFim.format('YYYY-MM-DD HH:mm') : null;

    if(!($(selectorInicio).hasClass('dp-block-change')) || !($(selectorFim).hasClass('dp-block-change'))) {

        if((objData.dataInicio && objData.dataFim)|| (!objData.dataInicio && !objData.dataFim && !notNull)) {
            if(!notNull){
                labelInicio.removeClass('required-input');
                labelInicio.removeClass('font-red');
                labelFim.removeClass('required-input');
                labelFim.removeClass('font-red');
            }

            if(tabela) {
                tabela.ajax.reload();
            }
        }
        else if(objData.dataInicio && !objData.dataFim && !notNull){
            labelFim.addClass('required-input');
            BootstrapAlert.warning(D.NECESSARIO_AMBOS_CAMPOS);
        }
        else if(!objData.dataInicio && objData.dataFim && !notNull){
            labelInicio.addClass('required-input');
            BootstrapAlert.warning(D.NECESSARIO_AMBOS_CAMPOS);
        }
    }
}


function validaDataInicioFimNoChange(selectorInicio, selectorFim, objData, tabela, notNull){

    var objInicio = selectorInicio.data('DateTimePicker');
    var dataInicio = objInicio.date();
    var labelInicio = selectorInicio.siblings('label');

    var objFim = selectorFim.data('DateTimePicker');
    var dataFim = objFim.date();
    var labelFim = selectorFim.siblings('label');

    objData.dataInicio = dataInicio ? dataInicio.format('YYYY-MM-DD HH:mm') : null;
    objData.dataFim = dataFim ? dataFim.format('YYYY-MM-DD HH:mm') : null;

    if(!($(selectorInicio).hasClass('dp-block-change')) || !($(selectorFim).hasClass('dp-block-change'))) {

        if((objData.dataInicio && objData.dataFim)|| (!objData.dataInicio && !objData.dataFim && !notNull)) {
            if(!notNull){
                labelInicio.removeClass('required-input');
                labelInicio.removeClass('font-red');
                labelFim.removeClass('required-input');
                labelFim.removeClass('font-red');
            }
        }
        else if(objData.dataInicio && !objData.dataFim && !notNull){
            labelFim.addClass('required-input');
            BootstrapAlert.warning(D.NECESSARIO_AMBOS_CAMPOS);
        }
        else if(!objData.dataInicio && objData.dataFim && !notNull){
            labelInicio.addClass('required-input');
            BootstrapAlert.warning(D.NECESSARIO_AMBOS_CAMPOS);
        }
    }
}


/**
 * @desc Inicia tabela padrão para exibição de dados de relatórios
 * @param id_tabela                 Id do elemento onde será iniciada a tabela
 * @param url                       Link para a busca dos dados da tabela
 * @param columns                   Array com as colunas da tabela
 * @param nome_tabela               Nome da tabela
 * @param funcaoFiltroRelatorio     Função que será utilizada ao filtrar o relatório
 * @param orderColum                Integer que representa a posicao da coluna de ordenação dos dados (default=0)
 *
 * @param fixedCollum               Array[[leftCollmsnFixed], [rightCollmsnFixed]], a ordenação será automaticamente
 *                                  removida das colunas especificadas. Colunas do tipo detail-control e acoes serão
 *                                  automaticamente configuradas (caso haja parametro, este sobrepõem a configuração automática)
 * @return DataTables
 */
function TableServerSideRelatorio(id_tabela, url, columns, nome_tabela, funcaoFiltroRelatorio, orderColum, fixedCollum, dtButttons, options, buttonsExport = false) {
    fixedCollum = typeof fixedCollum !== 'undefined' ? fixedCollum : false;


    var listHeaders = $("h2.cor-1"),
        archiveName = listHeaders[listHeaders.length-1].innerText,
        buttons = [];

    if(buttonsExport){
        if(buttonsExport.xls) {
            buttons.push({
                extend: 'collection',
                autoClose: true,
                className: 'btn btn-raised btn-default xls',
                text: '<i class="fa fa-file-excel-o"></i>',
                postfixButtons: [
                    {
                        className: 'smallSalvar primary',
                        text: D.TODOS,
                        action: function (e, dt, node, config) {
                            columnsData.url = url;
                            columnsData.start = 0;
                            columnsData.length = 999999999;
                            columnsData.name = archiveName;
                            columnsData.config = prepareColumns(dt, true);

                            $.redirect(PUBLIC_URL + "exportar/getfullxls", columnsData);
                        }
                    },
                    {
                        className: 'smallCancelar',
                        text: D.PAGINACAO,
                        action: function (e, dt, node, config) {
                            columnsData.url = url;
                            columnsData.name = archiveName;
                            columnsData.config = prepareColumns(dt, true);
                             $.redirect(PUBLIC_URL + "exportar/getfullxls", columnsData);
                        }
                    }
                ]
            });
        }

        if(buttonsExport.pdf){
            buttons.push({
                extend: 'collection',
                autoClose: true,
                className: 'btn btn-raised btn-default pdf',
                text: '<i class="fas fa-file-pdf"></i>',
                buttons: [
                    {
                        extend: 'pdfHtml5',
                        className: 'smallSalvar btn-prymary',
                        text: D.RETRATO,
                        exportOptions: {
                            columns: [':visible:not(.acoes):not(.detalhes)'],
                            modifier: {page: 'all'}
                        },
                        orientation: 'portrait',
                        pageSize: 'LEGAL',
                        title: archiveName,
                        customize: function (doc) {
                            doc.pageMargins = [10, 10, 10, 10];
                            doc.styles.tableHeader.alignment = 'left';
                            doc.styles.tableHeader.margin = [5, 0, -10, 0];
                            doc.styles.tableBodyOdd.margin = [5, 0, -10, 0];
                            doc.styles.tableBodyEven.margin = [5, 0, -10, 0];
                            doc.content[0].text = archiveName;
                            // doc.content[1].table.widths =
                            //     Array(doc.content[1].table.body[0].length + 1).join('*').split('');
                        }
                    },
                    {
                        extend: 'pdfHtml5',
                        className: 'smallCancelar btn-prymary',
                        text: D.PAISAGEM,
                        exportOptions: {
                            columns: [':visible:not(.acoes):not(.detalhes)'],
                            modifier: {page: 'all'}
                        },
                        orientation: 'landscape',
                        pageSize: 'LEGAL',
                        title: archiveName,
                        customize: function (doc) {
                            doc.pageMargins = [10, 10, 10, 10];
                            doc.styles.tableHeader.alignment = 'left';
                            doc.styles.tableHeader.margin = [5, 0, 5, 0];
                            doc.styles.tableBodyOdd.margin = [5, 0, 5, 0];
                            doc.styles.tableBodyEven.margin = [5, 0, 5, 0];
                            doc.content[0].text = archiveName;
                            // doc.content[1].table.widths =
                            //     Array(doc.content[1].table.body[0].length + 1).join('*').split('');
                        }
                    }
                ]
            });
        }
    }

    var fixed = {};
    var reorder = {};
    if(fixedCollum){
        fixed = {
            leftColumns: fixedCollum[0],
            rightColumns: fixedCollum[1]
        };
        reorder = {
            fixedColumnsLeft: fixedCollum[0],
            fixedColumnsRight: fixedCollum[1]
        };
    }
    else {
        if(columns[0].class === 'details-control'){
            reorder.fixedColumnsLeft = 1;
        }
        if (columns[columns.length-1].name === "acoes" || columns[columns.length-1].className === "acoes") {
            fixed.leftColumns = false;
            fixed.rightColumns = 1;
            reorder.fixedColumnsLeft = false;
            reorder.fixedColumnsRight = 1;
        }

        if(Object.keys(fixed).length === 0){
            fixed = false;
        }
        if(Object.keys(reorder).length === 0){
            reorder = true;
        }
    }

    var coluna;
    var ordenacao;

    if (orderColum && typeof orderColum === 'object'){
        coluna  =  orderColum.coluna;
        ordenacao  =  orderColum.ordenacao;
    }else if (orderColum){
        coluna = orderColum;
        ordenacao = "desc";
    }else{
        coluna = 0;
        ordenacao = "desc";
    }

    if(dtButttons){
        for(var i in dtButttons){
            var newButton = dtButttons[i].properties;
            buttons.push(newButton);
        }
    }

    var columnsData = null;
    var tabela = id_tabela.DataTable(Object.assign({}, {
        processing: true,
        order: [coluna, ordenacao],
        serverSide: true,
        responsive: true,
        searching: false,
        deferLoading: 0,
        scrollX: true,
        pageLength: columns[0].pagination ? columns[0].pagination : 10,
        lengthMenu: [10, 25, 50, 100, 200, 500, 1000, 2000, 5000],
        dom: "<Blr<t><'col-md-6'i><'col-md-6'p>>",
        fixedColumns: fixed,
        colReorder: reorder,
        buttons: [{
            extend: 'colvis',
            className: 'btn btn-raised btn-default config',
            text: '<i class="fa fa-gear fa-1x"></i>',
            postfixButtons: [{
                className: 'smallSalvar',
                text: D.SALVAR,
                action: function (e, dt, node, config) {
                    sendPostRequest("configuracao/setconfgrid", {data: prepareColumns(dt)});
                }
            },
                {
                    text: D.CANCELAR,
                    className: 'smallCancelar'
                }]

        }].concat(buttons),
        ajax: {
            "url": PUBLIC_URL + url,
            "type": 'POST',
            "error": function (xhr, error, thrown) {
                if (xhr.status == 401) {
                    $.redirect(PUBLIC_URL + "index");
                }
            },
            "data": function (dados) {
                var dadosFiltro = funcaoFiltroRelatorio();

                $.each(dadosFiltro, function (i, elemento) {

                    if(typeof elemento === 'string')
                    {
                        var y = elemento.match(/[^A-Za-z0-9 ]/g);

                        if(y){
                            elemento = elemento.replace(/\\/g, "\\\\");
                            elemento = elemento.replace(/_/g, "\\_");
                            elemento = elemento.replace(/%/g, "\\%");
                            elemento = elemento.replace(/\*/g, "\\*");
                            elemento = elemento.replace(/\+/g, "\\+");
                            elemento = elemento.replace(/\?/g, "\\?");
                            elemento = elemento.replace(/\|/g, "\\|");

                            dadosFiltro[i] = elemento;
                        }
                    }
                });
                // if(jQuery.isFunction(funcaoFlags)){
                    dados.flags = dadosFiltro;
                // }
                columnsData = dados;
                return {
                    'data': dados,
                    'dataFiltro' : dadosFiltro
                };
            }
        },
        columns: columns
    }, options));

    if(dtButttons){
        for(var i in dtButttons){
            if(dtButttons[i].isPopover){
                $(dtButttons[i].isPopover.selector).popover(dtButttons[i].isPopover.properties);

                for(var j in dtButttons[i].isPopover.events){
                    $(dtButttons[i].isPopover.selector).on(dtButttons[i].isPopover.events[j].event,
                        dtButttons[i].isPopover.events[j].callback
                    );
                }
            }
        }
    }
    $('.pdf').popover({
        content: D.EXPORTAR_PDF,
        trigger: 'hover',
        placement: "top"
    });
    $('.xls').popover({
        content: D.EXPORTAR_XLS,
        trigger: 'hover',
        placement: "top"
    });

    $('.config').popover({
        content: D.CONFIGURACOES,
        trigger: 'hover',
        placement: "top"
    });
    $('.dt-buttons').click(function () {
        $(".smallSalvar, .smallCancelar").click(function(){
            $(".dt-button-background").trigger("click");
        });
    });

    tabela.on( 'preXhr', function () {
        var requestAtual = tabela.settings()[0].jqXHR;
        if(requestAtual && requestAtual.readyState != 4) {
            requestAtual.abort('Nova requisicao');
        }
    });
    //Inputs com a classe "change" disparam evento de reload da grid
    $(".change").change(function () {
        if(!$(this).hasClass('block-change')) {
            tabela.ajax.reload();
        }
    });

    tabela.on('init.dt', function () {
        setTimeout(function () {
            $(".DTFC_LeftWrapper").remove();
        }, 300);
    });

    return tabela;
}

function enviaForm(url, form, faux, paux, flag) {

    sendPostRequest(
        url +"?modal=1"+(flag ? flag : ''),
        form.serialize(),
        function(data, xhr){
            $('.form-group').find('ul').remove();
            if(data.msg){
                BootstrapAlert.success(data.msg);
            }

            if(jQuery.isFunction(faux)){
                faux(paux, data);
            }
        },
        function(xhr){
            var erros = $.parseJSON(xhr.responseText);
            $('.form-group').find('ul').remove();
            if (erros.erroForm) {
                $.each(erros.erroForm, function (key, value) {
                    var html = '<ul>';
                    $.each(value, function (k, v) {
                        html += '<li>' + v + '</li>';
                    });
                    html += '</ul>';
                    $("input[name = " + key + "]").after(html);

                    $("select[name = " + key + "]").next().after(html);

                    $("textarea[name = " + key + "]").next().after(html);
                })
            }
            if(erros.erro){
                BootstrapAlert.error(erros.erro);
            }
        }
    );
}
function dataAtualFormatada(){
    var data = new Date();
    var dia = data.getDate();
    if (dia.toString().length == 1)
        dia = "0"+dia;
    var mes = data.getMonth()+1;
    if (mes.toString().length == 1)
        mes = "0"+mes;
    var ano = data.getFullYear();
    return ano+"-"+mes+"-"+dia;
}
//Dialogo padrão de confirmação de deleção
function DialogConfirmaDelete(action) {

    bootbox.confirm({
        message: D.CONFIRMA_ACAO.replace("%s", D.REMOVER),
        size: "small",
        buttons: {
            'cancel': {
                label: D.CANCELAR,
                className: 'btn-info '
            },
            'confirm': {
                label: D.REMOVER,
                className: 'btn-danger'
            }
        },
        callback: action

    });
}
//Dialogo padrão de confirmação de Inativacao
function DialogConfirmaInativa(action) {

    bootbox.confirm({
        message: D.CONFIRMA_ACAO.replace("%s", D.INATIVAR),
        size: "small",
        buttons: {
            'cancel': {
                label: D.CANCELAR,
                className: 'btn-info '
            },
            'confirm': {
                label: D.INATIVAR,
                className: 'btn-danger'
            }
        },
        callback: action

    });
}

//Dialogo padrão de confirmação de duplicacao
function DialogConfirmaDuplica(action) {

    bootbox.confirm({
        message: D.CONFIRMA_ACAO.replace("%s", D.DUPLICAR),
        size: "small",
        buttons: {
            'cancel': {
                label: D.CANCELAR,
                className: 'btn-info '
            },
            'confirm': {
                label: D.DUPLICAR,
                className: 'btn-danger'
            }
        },
        callback: action
    });
}

//Função padrão de deleção de dados por ajax
function DialogConfirmaDeleteAjax(url, id, action) {

    DialogConfirmaDelete(function(result){
        if(result){
            sendPostRequest(
                url,
                {id: id},
                action,
                function(xhr){
                    var erros = $.parseJSON(xhr.responseText);
                    BootstrapAlert.error(erros.erro);
                }
            );
        }
    })
}


//Dialogo padrão de confirmação de duplicacao
function DialogConfirmaAcao(label, action, confirmButtonLabel, cancelButtonLabel) {
    cancelButtonLabel ? cancelButtonLabel : D.CANCELAR;
    confirmButtonLabel ? confirmButtonLabel : label;

    bootbox.confirm({
        message: D.CONFIRMA_ACAO.replace("%s", label.toLowerCase()),
        size: "small",
        buttons: {
            'cancel': {
                label: cancelButtonLabel,
                className: 'btn-info '
            },
            'confirm': {
                label: confirmButtonLabel,
                className: 'btn-danger'
            }
        },
        callback: action
    });
}

//Função padrão de Inativação de dados por ajax
function DialogConfirmaAcaoAjax(label, url, data, action) {

    DialogConfirmaAcao(label, function(result){
        if(result){
            sendPostRequest(
                url,
                data,
                action,
                function(xhr){
                    var erros = $.parseJSON(xhr.responseText);
                    BootstrapAlert.error(erros.erro);
                }
            );
        }
    })
}









//Função padrão de Inativação de dados por ajax
function DialogConfirmaInativaAjax(url, id, action) {

    DialogConfirmaInativa(function(result){
        if(result){
            sendPostRequest(
                url,
                {id: id},
                action,
                function(xhr){
                    var erros = $.parseJSON(xhr.responseText);
                    BootstrapAlert.error(erros.erro);
                }
            );
        }
    })
}//Função padrão de Inativação de dados por ajax
function DialogConfirmaDuplicaAjax(url, id, action) {

    DialogConfirmaDuplica(function(result){
        if(result){
            sendPostRequest(
                url,
                {id: id},
                action,
                function(xhr){
                    var erros = $.parseJSON(xhr.responseText);
                    BootstrapAlert.error(erros.erro);
                }
            );
        }
    })
}

//cria  arrays do Poligono
function montaArrayPoligono(newShape) {

    var polyPathGidis = [];

    if (TIPO_BASE_MAPA == 'osm') {
        var path = newShape.getLatLngs()[0];
        for (var i = 0; i < path.length; i++) {
            var coordenada = path[i];
            polyPathGidis.push({
                latitude: coordenada.lat,
                longitude: coordenada.lng
            });

        }

    }else {
        var polyPath = newShape.getPath();
        for (var i = 0; i < polyPath.length; i++) {
            polyPathGidis.push({
                latitude: polyPath.getAt(i).lat(),
                longitude: polyPath.getAt(i).lng()
            });
        }
    }

    return polyPathGidis;
}


function fixLabelInputs(){

    //Remove classe "is-empty" de campos que estejam preenchidos
    $('input[type=text][value!=""].form-control')
        .parent('.form-group.label-floating.is-empty').removeClass('is-empty');

    $('input[type=password][value!=""].form-control')
        .parent('.form-group.label-floating.is-empty').removeClass('is-empty');

    $('input[type=number][value!=""].form-control')
        .parent('.form-group.label-floating.is-empty').removeClass('is-empty');

    $('input[type=email][value!=""].form-control')
        .parent('.form-group.label-floating.is-empty').removeClass('is-empty');

    //Remove classe "is-empty" de textareas que estejam preenchidos
    $('textarea.form-control').each(function(){
        if($(this).val()){
            $(this).parent('.form-group.label-floating.is-empty').removeClass('is-empty');
        }
    });
}

function setMaskTelefone(selector){

    var masks = ['(00) 0000-00000', '(00) 00000-0000'];

    var options =  {
        onKeyPress: function(telefone, e, field, options) {

            var telefoneNumeros = telefone.replace( /\D+/g, '');

            var mask = (telefoneNumeros.length > 10) ? masks[1] : masks[0];
            $(selector).mask(mask, options);
        }};

    var valorInserido = $(selector).val().replace( /\D+/g, '');
    var maskInserido = (valorInserido.length > 10) ? masks[1] : masks[0];
    $(selector).mask(maskInserido, options);

}

function dateDiff(dataFinal, dataInicial){
    dataFinal = new Date(dataFinal);
    dataInicial = new Date(dataInicial);
    return parseInt((dataFinal - dataInicial)/1000/60/60/24);
}

function maxLengthCheck(object) {
    if (object.value.length > object.maxLength)
        object.value = object.value.slice(0, object.maxLength)
}

function getDistanciaEntreDoisPontosEmKm(lat1,lon1,lat2,lon2) {

    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    var R = 6371; // Raio da terra em KM
    var dLat = deg2rad(lat2-lat1);
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distância em Km
    return d;
}

function geraMapaOSM(idMapa, propriedades, contextMenu, satelital){
    contextMenu = typeof contextMenu === 'undefined' ? true : contextMenu;

    var osmAttribution = 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributor ';
        // mbAttr = osmAttribution + ' Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        // mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+API_KEY_MAPBOX;

    // var streetLayer = L.tileLayer(/*URL_MAPA_OSM ? URL_MAPA_OSM :*/ 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: osmAttribution}),
    //     satelitalLayer = L.tileLayer(mbUrl, {id: 'mapbox.satellite', attribution: mbAttr, maxZoom: 20});

    // Configuração para aplicar layers do gmaps no leaflet (lyrs{m}:street, {s}:satelital, {t}: terrain, {s,h}:hibrido)
    var streetLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        attribution: osmAttribution + 'Imagery © <a href="https://www.google.com/">Google</a>',
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    var satelitalLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        attribution: osmAttribution +'Imagery © <a href="https://www.google.com/">Google</a>',
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    }); // Certeza que não usa API_KEY do gmaps para adicionar o tileLayer

    var layers = {};
    layers[D.MAPA] = streetLayer;
    layers[D.SATELITE] = satelitalLayer;

    var propriedadesFixas = {
        zoomControl: true,
        layers: [streetLayer],
        contextmenu: contextMenu,
        contextmenuWidth: 120,
        contextmenuItems: [
            {
                text: 'Google Maps',
                icon: PUBLIC_URL + 'img/mapa_icon.png',
                callback: function(e) {
                    window.open('https://www.google.com.br/maps/search/' + e.latlng.lat + ',' + e.latlng.lng)
                }
            },
            {
                text: 'Street View',
                icon: PUBLIC_URL + 'img/street-view.png',
                callback: function(e) {
                    window.open("https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + e.latlng.lat + ',' + e.latlng.lng);
                }
            }
        ]
    };

    if(propriedades){
        for(var key in propriedades) {
            propriedadesFixas[key] = propriedades[key];
        }
    }

    var mapa = L.map(idMapa, propriedadesFixas);

    if(satelital) {
        L.control.layers(layers).addTo(mapa);
    }

    return mapa;
}


function sendFormByAjax(url, data, funcao, parametros) {
    $.ajax({
        url: PUBLIC_URL + url,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST'
    }).
    fail(function (xhr, status) {
        LoadScreen.hide();
        if(xhr.status == 401){
            bootbox.alert({
                message: D.ERRO_SESSAO,
                size: "small",
                callback: function () {
                    window.location.href = PUBLIC_URL+'logout';
                }
            });
        }
        else if(xhr.status == 403){
            bootbox.alert({
                message: D.ERRO_PERMISSAO,
                size: "small",
                callback: function () {
                    window.location.href = PUBLIC_URL + 'logout';
                }
            });
        }
        else if(xhr.status == 400){
            var erros = $.parseJSON(xhr.responseText);
            $('.form-group').find('ul').remove();
            if (erros.erroForm) {
                var firstElement = true;
                $.each(erros.erroForm, function (key, value) {
                    var html = '<ul>';
                    $.each(value, function (k, v) {
                        html += '<li>' + v + '</li>';
                    });
                    $("input[name = " + key + "]").after(html+'</ul>');

                    firstElement ? $("input[name = " + key + "]").focus() : false;
                    firstElement = false
                });
            }
            if(erros.erro){
                BootstrapAlert.error(erros.erro);
            }
        }
    }).
    success(function (xhr) {
        if(xhr.msg){
            BootstrapAlert.success(xhr.msg);
        }
        if(jQuery.isFunction(funcao)){
            funcao(parametros);
        }
    });
}

function geraUrlsRoteirizacao(latlongs) {
    var coordenadas = [];

    var cLoop = 0;
    var nLoops = latlongs.length;

    for (var i = 0; i < nLoops; i+=19) {
        var auxCor = [];
        for(var j = 0; j < 20 && i+j < nLoops; j++){
            auxCor[j] = latlongs[i+j][1] + ',' + latlongs[i+j][0];
        }

        coordenadas[cLoop] = auxCor.join(';');
        cLoop++;
    }

    var urls = [];
    for (var x in coordenadas){
        if(TIPO_BASE_MAPA == 'osm'){
            urls[x] = URL_ROTAS + '/driving/' + coordenadas[x] + '?geometries=polyline&overview=full&steps=true';
        }
    }

    return urls;
}

function roteirazaCoordendas(latlongs) {
    urls =  geraUrlsRoteirizacao(latlongs);

    return $.when.apply($, urls.map(function (url) {
        return $.get(url).then(function (retorno) {
            return  L.Polyline.fromEncoded(retorno.routes[0].geometry).getLatLngs();
        });
    })).
    then(function () {
        var coordenadas = Array.prototype.slice.call(arguments); // Converte o arguments para um array comum de dados
        var reindex = [];

        for(var x in coordenadas){
            reindex = reindex.concat(coordenadas[x]);
        }

        return reindex;
    });
}
function fullScreenSemLayout() {
    $('.conteudo').hide();
    $('.container-rodape').hide();
    openFullscreen();
}

function removefullScreenComLayout() {
    $('.conteudo').show();
    $('.container-rodape').show();
    closeFullscreen();
}

/* View in fullscreen */
function openFullscreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}
/**
 * Transforma tempo em segundos em intervalor de dias, horas, minutos e segundos
 *
 * @version 1.0
 * @param Int $tempo tempo em segundos
 * @return String
 */
function getIntervaloTempo(tempo) {
    if (tempo > 0) {
        var dias = Math.floor((tempo / 86400));
        var horas = Math.floor(((tempo - (dias * 86400)) / 3600));
        var mins = Math.floor(((tempo - (dias * 86400) - (horas * 3600)) / 60));
        var segs = Math.floor((tempo - (dias * 86400) - (horas * 3600) - (mins * 60)));
        return dias + 'd ' + horas + 'h ' + mins + 'm ' + segs + 's ';
    }
    return '0d 0h 0m 0s ';
}
//TODO: Corrigir bug de horas acima de 24 e abaixo de 30
/**
 * não permite  horas acima de 30, minutos e segundos
 *
 * @version 1.0
 * @param Int $tempo tempo em segundos
 * @return String
 */
function getFormatoDataHoras(id) {
    id.mask('00/00/0000 H0:M0:S0', {
        translation: {
            'H': {
                pattern: /[0-2]/
            },
            'M': {
                pattern: /[0-5]/
            },
            'S': {
                pattern: /[0-5]/
            }
        }
    });
}