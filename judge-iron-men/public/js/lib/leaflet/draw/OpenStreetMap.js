/// Objeto do mapa
var fMap;
/// Indica se o mapa esta carregado
var fMapaCarregado = false;
/// Objeto com os dados da regua (2 marcadores, polyline, label com a distância)
var fRegua;
/// Lista de Marcadores
var fMarcadores = [];
/// Lista de Círculos
var fCirculos = [];
/// Lista de Polígonos
var fPoligonos = [];
/// Lista de Rotas
var fRotas = [];
/// Lista de popups
var fInfoWindows = [];
/// Marcador separado, para mover pelo mapa como um GPS, em tempo real
var fPosicionador;
/// Ferramenta de zoom ao arrastar
var fFerramentaZoom;
/// Ferramenta para desenhar polígono
var fFerramentaPoligono;
/// Poligono selecionado para edição
var fPoligonoSelecionado;
/// Poligono recem criado
var fPoligonoNovo;
/// Estilo padrão dos círculos
var fEstiloPadraoCirculo = {
	weight: 2,
	color: 'black',
	fillColor: 'gray',
	fillOpacity: 0.5,
	opacity: 0.8
};
/// Estilo padrão dos polígonos
var fEstiloPadraoPoligono = {
	weight: 2,
	color: 'black',
	fillColor: 'gray',
	fillOpacity: 0.5,
	opacity: 0.8
}

/// Estilo padrão das rotas
var fEstiloPadraoRota = {
	weight: 5,
	color: 'blue',
	fillColor: 'black',
	fillOpacity: 0.5,
	opacity: 0.7
}

function inicializaMapa() {
	fMap = L.map('map-canvas', {editable: true, drawControl: false}).setView([-18, -52], 5);
	fMapaCarregado = false;

	var tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: "Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>.",
		maxZoom: 18
	});

	tileLayer.addTo(fMap);

	fMap.on('click', evClickRegua);
	tileLayer.on('load', function() {
		if (!fMapaCarregado) {
			fMapaCarregado = true;

			external.SetMapaCarregado(fMapaCarregado);
		}
	});
}

var divMapCanvas;
window.onresize = function() {
	divMapCanvas = divMapCanvas || document.getElementById('map-canvas');

	divMapCanvas.width  = window.outerWidth;
	divMapCanvas.height = window.outerHeight;                
}

function limpaMapa() {
	removeMarcadores();
	removeCirculos();
	removePoligonos();
	removeRotas();
	// removeInfoWindows(); TO-DO
	destroiRegua();
	destroiFerramentaZoom();
}

function removeMarcadores() {
	if (fPosicionador) {
		fMap.removeLayer(fPosicionador);
	}

	if (fMarcadorPontoRotaPorHistorico) {
		fMap.removeLayer(fMarcadorPontoRotaPorHistorico);
	}

	while (fMarcadores.length > 0) {
		fMap.removeLayer(fMarcadores.pop());
	}
}

function removeCirculos() {
	while (fCirculos.length > 0) {
		fMap.removeLayer(fCirculos.pop());
	}
}

function removePoligonos() {
	limpaPoligonoSelecionado();
	if (fPoligonoNovo) {
		fMap.removeLayer(fPoligonoNovo);
		fPoligonoNovo = null;
	}
	while (fPoligonos.length > 0) {
		fMap.removeLayer(fPoligonos.pop());
	}
        
}

function removeRotas() {
	while (fRotas.length > 0) {
		fMap.removeLayer(fRotas.pop());
	}
}

function evClickRegua(event) {
	// O objeto fRegua apenas tem valor caso ele for selecionado, senão null
	if (fRegua) {
		aPosicaoClick = event.latlng;

		if (fRegua.marcadorA && fRegua.marcadorB) {
			destroiRegua();
			criaRegua();
		}

		if (!fRegua.marcadorA) {
			fRegua.marcadorA = adicionaMarcadorRegua(aPosicaoClick.lat, aPosicaoClick.lng);
		}
		else if (!fRegua.marcadorB) {
			fRegua.marcadorB = adicionaMarcadorRegua(aPosicaoClick.lat, aPosicaoClick.lng);
			fRegua.marcadorA.on('drag', calculaDistanciaRegua);
			fRegua.marcadorB.on('drag', calculaDistanciaRegua);
			calculaDistanciaRegua();
		}
	}
}

function criaRegua() {
	fRegua = {
		marcadorA: null, /// início da regua
		marcadorB: null, /// final da regua
		poly: null, /// polyline entre os dois pontos
		distancia: 0.0, /// distancia entre os dois pontos
		label: null /// label que mostrará a distância
	}
}

function destroiRegua() {
	if (fRegua) {
		if (fRegua.marcadorA) {
			fMap.removeLayer(fRegua.marcadorA);
		}
		if (fRegua.marcadorB) {
			fMap.removeLayer(fRegua.marcadorB);
		}
		if (fRegua.poly) {
			fMap.removeLayer(fRegua.poly);
		}
		if (fRegua.label) {
			fMap.removeLayer(fRegua.label);
		}
	}

	fRegua = null;
}

/*  
*  Função para calcular a distância da régua e desenhar a polyline
*/
function calculaDistanciaRegua() {
	/// se ja tem uma regua no mapa, destrói para criar outra
	if (fRegua.poly) {
		fMap.removeLayer(fRegua.poly);
	}

	/// cria uma polyline para identificar a régua
	fRegua.poly = new L.Polyline(
		[
			[fRegua.marcadorA._latlng.lat, fRegua.marcadorA._latlng.lng],
			[fRegua.marcadorB._latlng.lat, fRegua.marcadorB._latlng.lng]
		],
		{
			color: '#FF0000',
			opacity: 0.80,
			weight: 4
		}
	);

	fRegua.poly.addTo(fMap);

	if (fRegua.label) {
		fMap.removeLayer(fRegua.label);
	}

	var aDistancia = distanciaEntreDoisPontos(
		fRegua.marcadorA._latlng.lat,
		fRegua.marcadorA._latlng.lng,
		fRegua.marcadorB._latlng.lat,
		fRegua.marcadorB._latlng.lng
	);

	aDistancia /= 1000; /// transforma para km
	aDistancia = aDistancia.toFixed(3);

	var aLatLngIntermediario = new L.latLng(
		(fRegua.marcadorA._latlng.lat + fRegua.marcadorB._latlng.lat) / 2,
		(fRegua.marcadorA._latlng.lng + fRegua.marcadorB._latlng.lng) / 2
	);

	fRegua.label = adicionaMarcador(
		(fRegua.marcadorA._latlng.lat + fRegua.marcadorB._latlng.lat) / 2,
		(fRegua.marcadorA._latlng.lng + fRegua.marcadorB._latlng.lng) / 2
	);

	fRegua.label.setOpacity(0);
	fRegua.label.addTo(fMap);
	fRegua.label.bindTooltip(
		aDistancia + ' Km',
		{permanent: true, className: 'labelRegua', direction: 'center'}
	).openTooltip();
}

function criaFerramentaZoom() {
	destroiFerramentaZoom();

	fFerramentaZoom = L.control.zoomBox({
		modal: true,  // If false (default), it deactivates after each use.  
		// If true, zoomBox control stays active until you click on the control to deactivate.
		// position: "topleft",
		// className: "customClass"  // Class to use to provide icon instead of Font Awesome
		// title: "My custom title" // a custom title
	});
	fMap.addControl(fFerramentaZoom);
}

function destroiFerramentaZoom() {
	if (fFerramentaZoom) {
		fFerramentaZoom.deactivate();
		fMap.removeControl(fFerramentaZoom);
		fFerramentaZoom = null;
	}
}

function buscaLocalidade(local) {
	destroiFerramentaZoom();
	//ONDE TINHA O SEGUINTE LINK:
	//,//nominatim.openstreetmap.org/search?format=json&q='
	//FOI ALTERADO PARA O QUE VEM DO BANCO DE DADOS
	//YAHOO.TrafegusPhp.urlMapaNominatim

	$.get(YAHOO.TrafegusPhp.urlMapaNominatim +'&q=' + local, function(data) {
		if (data.length > 0) {
			for (var i = data.length-1; i >= 0; --i) {
				adicionaMarcadorCadReferencia(
					data[i].lat,
					data[i].lon,
					data[i].display_name // endereço
				);
			}

			centerZoomMarcadores();
		}
		else {
			alert('Local não encontrado!');
		}
 });
}

function centerZoomMarcadores() {
	if (fMarcadores.length > 0) {
		fMap.fitBounds(L.featureGroup(fMarcadores).getBounds());
	}
}

function centerZoomPolyline(polyline) {
	fMap.fitBounds(polyline.getBounds());
}

function centerZoomPoligono(poligono) {
	fMap.fitBounds(poligono.getBounds());
}
