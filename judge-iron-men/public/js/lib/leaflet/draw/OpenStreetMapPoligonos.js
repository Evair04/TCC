var fClicadoPoligonoNovo = false;
/// Ferramenta para desenhar polígono
var fFerramentaPoligono;
/// Poligono selecionado para edição
var fPoligonoSelecionado;
/// Poligono recem criado
var fPoligonoNovo;
/// Estilo padrão dos polígonos
var fEstiloPadraoPoligono = {
    weight: 2,
    color: 'black',
    fillColor: 'gray',
    fillOpacity: 0.5,
    opacity: 0.8
}
/// Lista de Polígonos
var fPoligonos = [];
function adicionaPoligono(
        pontos,
        editavel, // Se true ao clicar em cima destaca as arestas e permite arrastar o polígono
        mapa,
        cor
        ) {

    if (cor != false) {
        var aPolygonOptions = {
            weight: 2,
            color: cor,
            fillColor: cor,
            fillOpacity: 0.5,
            opacity: 0.8
        }
    } else {
        var aPolygonOptions = {
            weight: 2,
            color: 'black',
            fillColor: 'gray',
            fillOpacity: 0.5,
            opacity: 0.8
        }
    }
    var poligono = new L.Polygon(pontos, aPolygonOptions);
    poligono.addTo(mapa);
    if (editavel == 'S') {
        poligono.enableEdit();
        centerZoomPoligonoOSM(poligono, mapa);

    }

    fPoligonos.push(poligono);


    return poligono;
}

function centerZoomPoligonoOSM(poligono, mapa) {
    mapa.fitBounds(poligono.getBounds());
}
function criaFerramentaPoligono(mapa,idBtnDestroy) {

    var aPolygonOptions = fEstiloPadraoPoligono;


    fFerramentaPoligono = new L.Draw.Polygon(mapa, {shapeOptions: aPolygonOptions});
    fFerramentaPoligono.enable();

    mapa.on('click', evClickMapaEdicaoPoligono);

    mapa.on('draw:created', function (e) {
        if (e.layerType == 'polygon') {
            destroiFerramentaPoligono(mapa);

            fPoligonoNovo = e.layer;

            fPoligonoNovo.addTo(mapa);
            fPoligonos.push(fPoligonoNovo);

            fPoligonoNovo.on('click', function () {
                fClicadoPoligonoNovo = true;
                setPoligonoSelecionado(fPoligonoNovo);
            });

            setPoligonoSelecionado(fPoligonoNovo);
            idBtnDestroy.prop("disabled", false);
        }
    });
}

function destroiFerramentaPoligono(mapa) {
    mapa.off('click', evClickMapaEdicaoPoligono);

    if (fFerramentaPoligono) {
        fFerramentaPoligono.disable();
    }

    fFerramentaPoligono = null;
}

function limpaPoligonoSelecionado() {
    if (fPoligonoSelecionado) {
        fPoligonoSelecionado.disableEdit();
        fPoligonoSelecionado = null;
    }
}

function setPoligonoSelecionado(poligono) {
    limpaPoligonoSelecionado();
    fPoligonoSelecionado = poligono;
    fPoligonoSelecionado.enableEdit();
}

function salvarPoligono() {
    var lats = [], lngs = [];
    polyPathGidis = new Array();


    for (var i = 0; i < fPoligonoNovo.getLatLngs()[0].length; ++i) {
        var coordenada = fPoligonoNovo.getLatLngs()[0][i];
        polyPathGidis.push({
            latitude: coordenada.lat,
            longitude: coordenada.lng
        });

    }

    return polyPathGidis;
}

function evClickMapaEdicaoPoligono(pEvent) {
    if (!fClicadoPoligonoNovo) {
        limpaPoligonoSelecionado();
    }

    fClicadoPoligonoNovo = false;
}
function removePoligonosOSM(mapa) {

    limpaPoligonoSelecionado();
    if (fPoligonoNovo) {
        mapa.removeLayer(fPoligonoNovo);
        fPoligonoNovo = null;
    }
    while (fPoligonos.length > 0) {
        mapa.removeLayer(fPoligonos.pop());
    }
    criaFerramentaPoligono(mapa)
}