/* 
* Arquivo com funções de interação com tela de cadastro de rota por posição
* @author Lucas Steffen
*/

/// Flag indicando se deve ser adicionado marcador ao clicar
var fMarcarPontoRotaPorHistorico = false;
/// Marcador adicionado para cadastrar ponto
var fMarcadorPontoRotaPorHistorico = null;

/*
 * Função que define se é possível marcar um ponto no mapa
 */
function marcarPontoRotaPorHistorico() {
	fMarcarPontoRotaPorHistorico = true;
}

/*
 *Função que mapeia a Rota
 */
function adicionaPolylineRotaPorHistorico(
	pLats,    // Array de latitudes  da rota
	pLngs,    // Array de longitudes da rota
	pPonLats, // Array de latitudes  a adicionar marcador
	pPonLngs  // Array de longitudes a adicionar marcador
) {
	pPonLats = pPonLats || [];
	pPonLngs = pPonLngs || [];

	var aCoordenadas = [];
	var i = 0;
	
	while (i < pLats.length) {
		aCoordenadas[i] = new L.LatLng(pLats[i], pLngs[i]);
		i++;
	}
	
	i = 0;
	// Marca no Mapa os Pontos
	while (i < pPonLats.length) {
		adicionaMarcadorPadrao(pPonLats[i], pPonLngs[i]);
		i++;
	}

	var aRota = new L.polyline(aCoordenadas, fEstiloPadraoRota);
	aRota.addTo(fMap);
	fRotas.push(aRota);
	centerZoomPolyline(aRota);

	adicionaMarcadorPadrao(pLats[0],    pLngs[0],    '', 'Origem');
	adicionaMarcadorPadrao(pLats.pop(), pLngs.pop(), '', 'Destino');

	// Escuta click no mapa adicionado marcador
	// apenas se marcarPontoRotaPorHistorico fora chamado previamente
	fMap.on('click', function(pEvent) {
		if (fMarcarPontoRotaPorHistorico) {
			fMarcarPontoRotaPorHistorico   = false;
			fMarcadorPontoRotaPorHistorico = adicionaMarcadorPadrao(pEvent.latlng.lat, pEvent.latlng.lng);

			salvaPontoRotaPorHistorico();
		}
	});
}

/*
 *Chama método do Delphi passando latitude e longitude do marcador adicionado
 */
function salvaPontoRotaPorHistorico() {
	if (fMarcadorPontoRotaPorHistorico) {
		external.RetornaDadosPontoRotaPorHistorico(
			fMarcadorPontoRotaPorHistorico.getLatLng().lat,
			fMarcadorPontoRotaPorHistorico.getLatLng().lng
		);
	}
	else {
		external.RetornaDadosPontoRotaPorHistorico(0, 0);
	}
}
