$(document).ready(function() {
    var columnsResumoFrota =  [
        {
            "title": D.DETALHES,
            "ordering": false,
            "defaultContent": "",
            "render":
                function (data, type, row, meta) {
                    return  '<a class="btn btn-xs detalhe" data-toggle="tooltip" title ='+D.EXPANDIR+'>'+
                        '<i class="fa fa-plus-circle" aria-hidden="true"></i>' +
                        '</a>';
                }
        },
        {
            "title": 'Posição',
            "name":"posicao",
            "data": "posicao",
            "orderable": false
        },
        {
            "title": 'Identificador',
            "name":"identificador",
            "data": "identificador",
            "orderable": false
        },
        {
            "title": 'Tempo Total',
            "name":"tempoTotal",
            "data":"tempoTotal",
            "orderable": false
        }
    ];

    var tabelaResumoFrota = TableServerSide(
        $('#tabelaResumoFrota'),
        "resumofrota/getjsondataresumo",
        columnsResumoFrota,
        'tabelaResumoFrota',
        null,
        null,
        null,
        null,
        {
            fixedColumns: false // Necessário para mostrar o subgrid dos terminais secundários
        }
    );

    var markersTerminaisSecundarios = [];



    tabelaResumoFrota.on('click', '.detalhe', function() {
        var row = tabelaResumoFrota.row($(this).closest('tr'));
        var data = row.data();

        if (row.child.isShown()) {
            row.child.hide();
            $(this).find("i")
                .removeClass("fa-minus-circle")
                .addClass("fa-plus-circle");
        } else {
            var tableDetalhe = $('<table class="display nowrap table" style="width: 100%;"></table>');
            row.child(tableDetalhe).show();
            $(this).find("i")
                .removeClass("fa-plus-circle")
                .addClass("fa-minus-circle");

            sendPostRequest('resumofrota/getjsondatavoltas', {identificador: data.identificador}, function(response) {
                console.log(response);
                var tabelaDetalhe = tableDetalhe.DataTable({
                    columns: [
                        {
                            "title": 'Hr. Inicio',
                            "name":"tempoInicial",
                            "data":"tempoInicial",
                        },
                        {
                            "title": 'Hr. Fim',
                            "name":"tempoFinal",
                            "data":"tempoFinal",
                        },
                        {
                            "title": 'Tempo Total',
                            "name":"tempoTotal",
                            "data":"tempoTotal",
                        },
                        {
                            "title": 'Pista',
                            "name":"pista",
                            "data":"pista",
                        }
                    ],
                    order: [[ 3, "asc" ]],
                    data: response,
                    paging: false,
                    dom: "<<'col-md-6'p>>",
                });

            });
        }
    });

});
