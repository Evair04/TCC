/* 
* Arquivo de funções para o simulador Onixsat
* @author Lucas Steffen
*/

/*
 * Remove a polyline do posicionador (simulador OnixSat)
*/
function removePolylinePosicionador() {
	if (fPolylinePosicionador) {
		fMap.removeLayer(fPolylinePosicionador);
		fPolylinePosicionador = null;
	}
}

/*
 * Cria uma polyline opcionalmene editável para simular rota
*/
function adicionaPolylinePosicionador(pCoordenadas, pEditavel) {
	removePolylinePosicionador();
	removeMarcadores();
	removeCirculos();

	fPolylinePosicionador = adicionaPolyline('#628DB6', pCoordenadas, 1, true, pEditavel);

	fPolylinePosicionador.on('click', function(e) {
		var aCoordenadas = fPolylinePosicionador.getLatLngs();
		var aMenorDistancia = null;
		var aIndice = 0;

		for (var i = aCoordenadas.length-1; i > 0 ; --i) {
			var aLatLng = aCoordenadas[i];
			var aDistancia = distanciaEntreDoisPontos(e.latlng.lat, e.latlng.lng, aLatLng.lat, aLatLng.lng);

			if (aMenorDistancia === null || aDistancia < aMenorDistancia) {
				aMenorDistancia = aDistancia;
				aIndice = i;
			}
		}

		var aMarcador = adicionaMarcadorPontoPreto(
			e.latlng.lat,
			e.latlng.lng,
			'Índice: ' + String(aIndice) + ' - ' + String(aCoordenadas.length-1) + '<br>Concluído: ' +
			String(((100.0 * aIndice) / aCoordenadas.length-1).toFixed(2)) + '%'
		);

		aMarcador.openPopup();

		aMarcador.on('popupclose', function() {
			fMap.removeLayer(aMarcador);
		});
	});
}

/*
 * Cria uma polyline ligando os pontos conforme clicks no mapa
*/
function criaFerramentaPolylinePosicionador() {
	removePolylinePosicionador();

	fPolylinePosicionador = adicionaPolyline('#628DB6', ";", 1, false, true);	

	fMap.on('click', fPolylinePosicionadorClickHandler);

	fPolylinePosicionador.once('click', function() {
		fMap.off('click', fPolylinePosicionadorClickHandler);
  	fPolylinePosicionador.disableEdit(fMap);
  });
}

/*
 * Destroi a ferramente criada em criaFerramentaPolylinePosicionador()
*/
function destroiFerramentaPolylinePosicionador() {
	cancelaPolilynePosicionador();

	fMap.off('click', fPolylinePosicionadorClickHandler);

	if (fPolylinePosicionador) {
		fMap.removeLayer(fPolylinePosicionador);
		fPolylinePosicionador = null;
	}
}

/*
 * Inicia recursão para percorrer rota,
 * iniciando por @pInd, a cada @pMiliSegundos milissegundos pulando posições
 * conforme @pPasso
*/
function disparaPosicionadorNaPolyline(pInd, pMiliSegundos, pPasso) {
	cancelaPolilynePosicionador();
	posicionadorPolylineRecursivo(pInd, pMiliSegundos, pPasso);
}

/*
 * Desativa timout da simulação da rota
*/
function cancelaPolilynePosicionador() {
	if (fPolylinePosicionadorTimeoutHandler) {
		clearTimeout(fPolylinePosicionadorTimeoutHandler);
		fPolylinePosicionadorTimeoutHandler = null;
	}
}

/*
 * Move o posicionador na rota e dispara método do Delphi com as coordenadas
 * chamando-se recursivamente até o fim da rota
*/
function posicionadorPolylineRecursivo(pInd, pMiliSegundos, pPasso) {
	if (fPolylinePosicionador) {
		var aPath = fPolylinePosicionador.getLatLngs();

		if (pInd < aPath.length || pPasso > 1) {
			if (pInd >= aPath.length && pPasso > 1) {
				pInd   = aPath.length-1;
				pPasso = 1;
			}

			var aHint =
				'Índice: ' + String(pInd) + ' - ' + String(aPath.length-1) + '<br>' +
				'Concluído: ' + String(((100.0 * pInd) / aPath.length).toFixed(2)) + '%<br>' +
				'Restando: ' + String((((aPath.length-1 - pInd) / pPasso) * ((pMiliSegundos / 1000.0) /60.0)).toFixed(2)) + 'min'
			;

			var aPos = aPath[pInd];
			var aPos = randomGeo(aPos.lat, aPos.lng, 100.0);

			adicionaPosicionador(
				aPos.lat,
				aPos.lng,
				true,
				aHint,
				aHint
			);

			fPosicionador.openPopup();

			fPolylinePosicionadorTimeoutHandler = setTimeout(function() {
				posicionadorPolylineRecursivo(pInd + pPasso, pMiliSegundos, pPasso);
			}, pMiliSegundos);
		}
	}
}

/*
 * Gambia ao clicar no mapa para adicionar linha a polyline
 * para que mantenha a edição habilitada
*/
var fPolylinePosicionadorClickHandler = function(pEvent) {
	fPolylinePosicionador.addLatLng([pEvent.latlng.lat, pEvent.latlng.lng]);
	fPolylinePosicionador.disableEdit(fMap);
	fPolylinePosicionador.enableEdit(fMap);
}
