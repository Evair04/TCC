/* 
* Arquivo com funções de interação com marcadores no OpenStreetMaps
* @author Lucas Steffen
*/

/*
 * Cria um marcador e retorna sua instancia
 * Caso não passado @param pCaminhoIcone cria com ícone padrão
 */
function adicionaMarcador (
	pLat,          // Latitude do marcador
	pLng,          // Longitude do marcador
	pPopup,        // Conteúdo do pop up
	pHint,         // pHint do marcador
	pCaminhoIcone, // Url da imagem do marcador, se vazio utiliza a padrão
	pArrastavel,   // Se true permite arrastar o marcador
	pOpcoes        // Opcões de tamanho do ícone (OSM apenas)
) {
	pOpcoes = pOpcoes || {};

	if (!pCaminhoIcone || '') {
		pCaminhoIcone = "../../Icons/red-dot.png";
	}

	var aMarcador = new L.Marker(L.latLng(pLat, pLng), {
		draggable: valorSeUndefined(pArrastavel, false),
		title:     pHint,
		alt:       pHint,
		icon: new L.icon({
			iconUrl:    pCaminhoIcone,
			iconSize:   pOpcoes.iconSize   || [32, 32],
			iconAnchor: pOpcoes.iconAnchor || [16, 32]
		})
	}).addTo(fMap);

	if (pPopup && pPopup != '') {
		aMarcador.bindPopup(
			pPopup,
			{direction: 'center', permanent: true}
		);
	}

	fMarcadores.push(aMarcador);

	return aMarcador;
}

function adicionaMarcadorPadrao(pLat, pLng, pPopup, pHint, pArrastavel, pOpcoes) {
	return adicionaMarcador(pLat, pLng, pPopup, pHint, undefined, pArrastavel, pOpcoes);
}

function adicionaMarcadorLaranja(pLat, pLng, pPopup, pHint, pArrastavel, pOpcoes) {
	return adicionaMarcador(pLat, pLng, pPopup, pHint, "../../Icons/orange-dot.png", pArrastavel, pOpcoes);
}

function adicionaMarcadorVermelho(pLat, pLng, pPopup, pHint, pArrastavel, pOpcoes) {
	return adicionaMarcador(pLat, pLng, pPopup, pHint, "../../Icons/red-dot.png", pArrastavel, pOpcoes);
}

function adicionaMarcadorVerde(pLat, pLng, pPopup, pHint, pArrastavel, pOpcoes) {
	return adicionaMarcador(pLat, pLng, pPopup, pHint, "../../Icons/green-dot.png", pArrastavel, pOpcoes);
}

function adicionaMarcadorAzul(pLat, pLng, pPopup, pHint, pArrastavel, pOpcoes) {
	return adicionaMarcador(pLat, pLng, pPopup, pHint, "../../Icons/blue-dot.png", pArrastavel, pOpcoes);
}

function adicionaMarcadorRoxo(pLat, pLng, pPopup, pHint, pArrastavel, pOpcoes) {
	return adicionaMarcador(pLat, pLng, pPopup, pHint, "../../Icons/purple-dot.png", pArrastavel, pOpcoes);
}

function adicionaMarcadorAmarelo(pLat, pLng, pPopup, pHint, pArrastavel, pOpcoes) {
	return adicionaMarcador(pLat, pLng, pPopup, pHint, "../../Icons/yellow-dot.png", pArrastavel, pOpcoes);
}

function adicionaMarcadorPontoPreto(pLat, pLng, pPopup, pHint, pArrastavel, pOpcoes) {
	pOpcoes = pOpcoes || {};
	pOpcoes.iconSize   = pOpcoes.iconSize   || [10, 10];
	pOpcoes.iconAnchor = pOpcoes.iconAnchor || [5, 10];

	return adicionaMarcador(pLat, pLng, pPopup, pHint, "../../Icons/PontoPreto.png", pArrastavel, pOpcoes);
}

function adicionaMarcadorPontoBranco(pLat, pLng, pPopup, pHint, pArrastavel, pOpcoes) {
	pOpcoes = pOpcoes || {};
	pOpcoes.iconSize   = pOpcoes.iconSize   || [10, 10];
	pOpcoes.iconAnchor = pOpcoes.iconAnchor || [5, 10];

	return adicionaMarcador(pLat, pLng, pPopup, pHint, "../../Icons/PontoBranco.png", pArrastavel, pOpcoes);
}

function adicionaMarcadorEstatico(pLat, pLng, pPopup, pHint, pArrastavel, pOpcoes) {
	pOpcoes = pOpcoes || {};
	pOpcoes.iconSize   = pOpcoes.iconSize   || [10, 10];
	pOpcoes.iconAnchor = pOpcoes.iconAnchor || [5, 10];

	return adicionaMarcador(pLat, pLng, pPopup, pHint, "../../Icons/PontoStatic.png", pArrastavel, pOpcoes);
}

function adicionaMarcadorRegua(pLat, pLng) {
	return adicionaMarcador(pLat, pLng, '', '', "../../Icons/Regua.png", true, {iconSize: [7, 25], iconAnchor: [3.5, 25]});
}

function adicionaMarcadorCadReferencia(pLat, pLng, pPopup, pHint, pArrastavel, pOpcoes) {
	var aContentText =
		'<div id="bodyContent">' + pPopup + '<br><br>' +
		'<input type="button" value="Cadastrar Referência" onclick="external.CadastraReferencia(' +
		pLat + ',' + pLng + ',\'' + pPopup + '\')"></input>' +
		'</div>'
	;

	return adicionaMarcadorLaranja(pLat, pLng, aContentText, pHint, pArrastavel, pOpcoes);
}

function adicionaMarcadorCaminhao(pLat, pLng, pPlaca, pPopup, pHint) {
	return adicionaMarcador(
		pLat,
		pLng,
		pPopup,
		pPlaca,
		"../../Icons/CaminhaoVerde.png",
		false
	).bindTooltip(
		pPlaca,
		{
			permanent: true,
			direction: 'top',
			className: 'labelCaminhao'
		}
	);
}

/*
 * Cria marcador a parte para ser usado como posicionador de GPS
 */
function adicionaPosicionador(pLat, pLng, pSalvar, pPopup, pHint) {
	removePosicionador();

	fPosicionador = adicionaMarcador(
		pLat,
		pLng,
		pPopup,
		pHint,
		"../../Icons/posicionador-dot.png",
		true,
		{iconSize: [22, 40], iconAnchor: [11, 40]}
	);

	fMarcadores.pop();

	if (pSalvar) {
		salvarPosicionador(pLat, pLng);
	}

	fPosicionador.on('dragstart', function(pEvent) {
		pEvent.target._dragstart_latlng = {
			lat: pEvent.target._latlng.lat,
			lng: pEvent.target._latlng.lng
		}
	});

	// Chama método OnPosicionador do Delphi ao arrastar e soltar o posicionador
	fPosicionador.on('dragend', function(pEvent) {
		if (pEvent.target._latlng.lat > 85.0 || pEvent.target._latlng.lat < -85.0) {
			fPosicionador.setLatLng({
				lat: pEvent.target._dragstart_latlng.lat,
				lng: pEvent.target._dragstart_latlng.lng
			});
		}
		else if (pEvent.target._latlng.lng > 180 || pEvent.target._latlng.lng < -180) {
			fPosicionador.setLatLng({
				lat: pEvent.target._latlng.lat,
				lng: pEvent.target._latlng.lng - (360 * Math.floor(pEvent.target._latlng.lng / 360))
			});
		}

		salvarPosicionador(pEvent.target._latlng.lat, pEvent.target._latlng.lng)
	});
}

function removePosicionador() {
	if (fPosicionador) {
		fMap.removeLayer(fPosicionador)
		fPosicionador = null;
	}
}

function salvarPosicionador(pLat, pLng) {
	if (!pLat || !pLng) {
		if (fPosicionador) {
			pLat = fPosicionador._latlng.lat;
			pLng = fPosicionador._latlng.lng;
		}
	}

	if (pLat && pLng) {
		external.OnPosicionador(pLat, pLng);
	}
}
