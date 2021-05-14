/* 
* Arquivo com funções de interação com círculos no OpenStreetMaps
* @author Lucas Steffen
*/

/*
 * Cria cículo, centraliza-o no mapa e retorna sua instância
 */
function adicionaCirculo(
	pLat,           // Float com a latitude  do centro do circulo
	pLng,           // Float com a longitude do centro do circulo
	pRaio,          // Raio do círculo
	pCor,           // Cor do círculo
	pTransparencia, // Nível de transparência
	pZoom,          // Parâmetro booleano para indicar se deve aplicar o zoom no circulo
	pEditavel,      // Flag indicando se deve ser possível arastar e alterar raio do círculo 	
	pPopup          // Popup ao ser clicado no círculo
) {
	var aOpcoes = mergeOpcoes({
		corFundo: pCor,
		corBorda: pCor,
		opacidadeFundo: pTransparencia
	}, fEstiloPadraoCirculo);

	var aCirculo = new L.Circle(
		new L.latLng(pLat, pLng),
		parseInt(pRaio),
		aOpcoes
	);

	aCirculo.addTo(fMap);
	fCirculos.push(aCirculo);
	
	if (pZoom) {
		fMap.fitBounds(aCirculo.getBounds());
	}

	if (valorSeUndefined(pEditavel, false)) {
		aCirculo.enableEdit();
	}

	if (pPopup && pPopup != '') {
		aCirculo.bindPopup(String(pPopup));
	}

	return aCirculo;
}
