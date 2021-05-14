/* 
* Arquivo de funções de roteirização (Directions Service) utilizadas no mapa
* @author Lucas Steffen
*/

/// Objeto L.Routing.control para roteirização
var fDirectionService = null;

var fPolylinePosicionador = null;

var fPolylinePosicionadorTimeoutHandler = null;

/*
 *  Função para criar a rota no mapa
 *  @param origem Ponto de Origem da rota
 *  @param destino Ponto de destino da rota
 *  @param pontosIntermediarios Pontos de passagem/parada da rota
 */    
function adicionaRota(
	pLats,  // Array de latitudes da rota
	pLngs,  // Array de longitudes da rota
	pSalvar // Se true chama método para salvar rota ao finalizar roteirização
) {
	var aPontosRota = [];

	for (var i = 0; i < pLats.length; ++i) {
		aPontosRota.push(new L.latLng(pLats[i], pLngs[i]));
		aPontosRota[i].fixo = true;
	}

	try {
		fDirectionService = new L.Routing.control({
			serviceUrl: fLinkBaseRoteirizacao,
			routeWhileDragging: true,
			waypoints: aPontosRota,
			//language: 'pt',
			lineOptions: {
				// Linha iguala a do google.maps
				styles: [
					{
						color: '#61A8D9',
						opacity: 0.8,
						weight: 5
					}
				]
			},
			// Substitui a função que cria os marcadores dos waypoints deixando-os invisíveis
			// Se for um marcador de ponto fixo é atribuido true para ele e é camuflado para o 
			// usuario nao mecher, se for um ponto novo arrastado ele cria o marcador conforme a função padrao do createMarker
			createMarker: function(pIndex, pWaypoint) {
				if (pWaypoint.latLng.fixo) {
					var aMarcador = adicionaMarcadorPontoBranco(pWaypoint.latLng.lat, pWaypoint.latLng.lng);
					aMarcador.setOpacity(0);
					return aMarcador;
				 }
				 else {
					return L.marker(
						pWaypoint.latLng,
						{
							draggable: this.draggableWaypoints,
							icon: new L.icon({
								iconUrl:    '../../Icons/PontoBranco.png',
								iconSize:   [10, 10],
								iconAnchor: [5, 10]
							})
						}
					);
				}
			},
		}).addTo(fMap);

		fDirectionService.on('routingerror', function(pEvent) {
			external.RetornaDadosDaRota(
				'',
				'',
				'',
				0,
				'Copyright (c) 2014, Den Norske Turistforening All rights reserved.',
				pEvent.type + ' ' + pEvent.error.message,
				''
			);
		});

		if (pSalvar) {
			fDirectionService.on('routesfound', evRotacionou);
		}
	} catch (e) {
		//
	}
}

/*
 * Evento chamado quando acabar de rotacionar
 * Salva rota primeira vez que executa
*/
function evRotacionou(pEvent) {
	
	// Passa as instruções do evento pois não atualiza imediatamente fDirectionService._routes
	// Demorando alguns milisegundos para que (fDirectionService._routes == pEvent.routes)
	salvarRota(pEvent.routes[0]);
	
	// Faz com que execute comente uma vez após rotacionar
	fDirectionService.off('routesfound', evRotacionou);
}

/*  
 *  Função para adicionar uma polilinha no mapa
 *  @param pCor Cor da polilinha
 *  @param pCoordenadas Pontos em que a polilinha sera traçada
 *  @param pTransparencia Nível de transparência (opacidade) da cor
 *  @param pZoom Indica se sera feito zoom na polilinha 
 *  @param pEditavel Indica se a polilinha sera editavel
 */
function adicionaPolyline(pCor, pCoordenadas, pTransparencia, pZoom, pEditavel) {
	if (pCoordenadas.length <= 0) {
		return;
	}
	if (pCoordenadas.indexOf(";") < 0) {
		alert("Coordenadas Inválidas!");
		return;
	}

	var aLatitudes  = pCoordenadas.substr(0, pCoordenadas.indexOf(";")).split('#13#10');
	var aLongitudes = pCoordenadas.substr(pCoordenadas.indexOf(";")+1).split('#13#10');
	var aPontos = [];

	for (var i = 0; i < aLatitudes.length; ++i) {
		if (aLatitudes[i] && aLongitudes[i]) {
			aPontos.push(new L.LatLng(aLatitudes[i], aLongitudes[i]));
		}
	}

	var aPolyOptions = {
		color:       pCor           || fEstiloPadraoRota.color,
		fillColor:   pCor           || fEstiloPadraoRota.fillColor,
		opacity:     pTransparencia || fEstiloPadraoRota.opacity,
		fillOpacity: 0.5            || fEstiloPadraoRota.fillOpacity,
		weight:      5              || fEstiloPadraoRota.weight
	};
	
	var aPolyline = new L.Polyline(aPontos, aPolyOptions).addTo(fMap);

	if (pZoom) {
		centerZoomPolyline(aPolyline);
	}

	if (pEditavel) {
		aPolyline.enableEdit(fMap);
	}
	else {
		aPolyline.disableEdit(fMap);
	}

	fRotas.push(aPolyline);

	return aPolyline;
}

/*
 * Chama método do Delphi passando as latitudes, longitudes e distância da rota
 * @param pRota rota a ser salva, caso não passe nenhuma então pega de fDirectionService
*/
function salvarRota(pRota) {
	if (!pRota) {
		if (fDirectionService && !fDirectionService._routes) {
			return;
		}

		pRota = fDirectionService._routes[0];
	}

	var aLats = "", aLngs = "", i;
	var aQtdCoordenadas = pRota.coordinates.length;
	var aQtdInstrucoes = pRota.instructions.length;
	var aInstrucoes = '';
	var aDistanciaEntreDoisPontos = 0;
	var aListaDistanciaEntreOsPontos = '';
	
	for (i = 0; i < aQtdCoordenadas; ++i) {
		aLats += pRota.coordinates[i].lat + '#13#10';
		aLngs += pRota.coordinates[i].lng + '#13#10';
	}

	for (i = 0; i < aQtdInstrucoes; ++i) {
		aInstrucoes +=
			fDirectionService._formatter.formatInstruction(pRota.instructions[i], i) + ' ' +
			fDirectionService._formatter.formatDistance(pRota.instructions[i].distance) + '|';
		
		/// percorre todas as instruções e vai somando as distâncias até encontrar um WayPoint (identificado pelo type WaypointReached)
		/// armazena na lista de distâncias e zera a variável para iniciar a contabilização da distância do proximo ponto
		if ((pRota.instructions[i].type == 'WaypointReached') || (i == aQtdInstrucoes-1)) {		
			aListaDistanciaEntreOsPontos += (aDistanciaEntreDoisPontos.toFixed(2))+'|';
			aDistanciaEntreDoisPontos = pRota.instructions[i].distance;
			
		} else {
			aDistanciaEntreDoisPontos += pRota.instructions[i].distance;
		}
	
	
	}
	
	external.RetornaDadosDaRota(
		aLats,
		aLngs,
		aListaDistanciaEntreOsPontos,
		pRota.summary.totalDistance,
		'Copyright (c) 2014, Den Norske Turistforening All rights reserved.',
		'',
		aInstrucoes
	);
}
