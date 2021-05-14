/**
 *  Inicializa o mapa principal com o centro em Brasília
 *  @return void
 */
var markerClusterFixo = ''
var markerClusterAgr = ''
var markerClusterTerc = ''

var initGoogleMaps = function () {
    var latlng = new google.maps.LatLng(-15.7794000000, -47.9294000000);
    var myOptions = {
        zoom: 4,
        navigationControl: true,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        },
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        }
    };
    YAHOO.TrafegusPhp.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    google.maps.event.addListener(YAHOO.TrafegusPhp.map, 'idle', function () {
        google.maps.event.trigger(YAHOO.TrafegusPhp.map, 'resize');
    });
    google.maps.event.addListener(YAHOO.TrafegusPhp.map, 'click', medirDistanciasRapidas);
    var controlDiv = document.createElement('DIV');
    controlDiv.index = 1;
    YAHOO.TrafegusPhp.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
    controlDiv.style.padding = '5px';
    var controlUI = document.createElement('DIV');
    controlUI.style.backgroundColor = 'transparent';
    controlUI.title = 'Vínculo do veículo';
    controlDiv.appendChild(controlUI);
    var controlText = document.createElement('DIV');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '11px';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.style.paddingBottom = '10px';
    controlText.innerHTML = '<b>Veículos</b><br />' +
            '<div style="height: 10px;margin-top:5px;"><img style="float:left;" src="' + BASE_URL + '/public/img/caminhaoVerde25.png" /><span style="margin-left:10px;float:left;"> Fixo</span></div><br />' +
            '<div style="height: 10px;"><img style="float:left;" src="' + BASE_URL + '/public/img/caminhaoAmarelo25.png" /><span style="margin-left:10px;float:left;"> Agregado</span></div><br />' +
            '<div style="height: 10px;"><img style="float:left;" src="' + BASE_URL + '/public/img/caminhaoVermelho25.png" /><span style="margin-left:10px;float:left;"> Terceiro</span></div><br />';
    controlUI.appendChild(controlText);
}


/**
 * Reúne os veículos da página atual da grid resumo em um array de Markers
 * e plota os mesmos no mapa com suas respectivas configurações
 * @param JSON veiculos Json da grid resumo
 * @return void
 */
var criaVeiculosMapa = function (veiculos) {

var veiculosFixo = new Array();
var veiculosAgr = new Array();
var veiculosTerc = new Array();

//YAHOO.TrafegusPhp.map.clearOverlays();

    if (markerClusterFixo != '') {
//        var mkf = markerClusterFixo.getTotalMarkers()
//        console.log(mkf)
        markerClusterFixo.clearMarkers()
    }
    if (markerClusterAgr != '') {
//        var mka = markerClusterAgr.getTotalMarkers()
//        console.log(mka)
        markerClusterAgr.clearMarkers()
    }
    if (markerClusterTerc != '') {

        markerClusterTerc.clearMarkers()
    }
    var veiculo, x = 0;
    if (YAHOO.TrafegusPhp.PolylinePosicaoVeiculo) {
        YAHOO.TrafegusPhp.PolylinePosicaoVeiculo.setMap(null);
    }
    if (!YAHOO.TrafegusPhp.veiculosMapa) {
        YAHOO.TrafegusPhp.veiculosMapa = new Array();
    } else {
        while (YAHOO.TrafegusPhp.veiculosMapa[x]) {
            YAHOO.TrafegusPhp.veiculosMapa[x].setMap(null);
            x++;
        }
        x = 0;
    }

    if (!veiculos)
        return;

    if (!veiculos[x]) {
        return;
    }
    while (veiculos[x] && veiculos[x].veic_placa) {
//        veiculo = new google.maps.Marker();
        veiculo = setOpcoesMarkerVeiculo(veiculos[x]);
        YAHOO.TrafegusPhp.veiculosMapa.push(veiculo);
        if (veiculos[x].vinculo == '1')
            veiculosFixo.push(veiculo);
        if (veiculos[x].vinculo == '2')
            veiculosAgr.push(veiculo);
        if (veiculos[x].vinculo == '3' || veiculos[x].vinculo == null)
            veiculosTerc.push(veiculo);

        x++;
    }
    if (navigator.userAgent.toString().indexOf('MSIE') != -1) {
        setTimeout('setGetZoomMapa()', 5000);
    }

    var Success = function (response) {

        if (response.responseText == 'S') {
            markerClusterFixo = new MarkerClusterer(YAHOO.TrafegusPhp.map, veiculosFixo, {gridSize: 80, styles: [
                    {height: 56, url: BASE_URL + '/public/img/cluster/green.png', width: 56},
                    {height: 56, url: BASE_URL + '/public/img/cluster/green.png', width: 56},
                    {height: 56, url: BASE_URL + '/public/img/cluster/green.png', width: 56},
                    {height: 56, url: BASE_URL + '/public/img/cluster/green.png', width: 56},
                    {height: 56, url: BASE_URL + '/public/img/cluster/green.png', width: 56}
                ]});
            markerClusterAgr = new MarkerClusterer(YAHOO.TrafegusPhp.map, veiculosAgr, {gridSize: 80, styles: [
                    {height: 56, url: BASE_URL + '/public/img/cluster/yellow.png', width: 56},
                    {height: 56, url: BASE_URL + '/public/img/cluster/yellow.png', width: 56},
                    {height: 56, url: BASE_URL + '/public/img/cluster/yellow.png', width: 56},
                    {height: 56, url: BASE_URL + '/public/img/cluster/yellow.png', width: 56},
                    {height: 56, url: BASE_URL + '/public/img/cluster/yellow.png', width: 56}
                ]});
            markerClusterTerc = new MarkerClusterer(YAHOO.TrafegusPhp.map, veiculosTerc, {gridSize: 80, styles: [
                    {height: 56, url: BASE_URL + '/public/img/cluster/red.png', width: 56},
                    {height: 56, url: BASE_URL + '/public/img/cluster/red.png', width: 56},
                    {height: 56, url: BASE_URL + '/public/img/cluster/red.png', width: 56},
                    {height: 56, url: BASE_URL + '/public/img/cluster/red.png', width: 56},
                    {height: 56, url: BASE_URL + '/public/img/cluster/red.png', width: 56}
                ]});



        }
    }
    var Failure = function (response) {

    }
    var callback =
            {
                success: Success,
                failure: Failure
            };
    YAHOO.util.Connect.asyncRequest('GET', BASE_URL + "/index/getgrupamento/?tipo=entrada", callback);



//    var markerClusterAgr = new MarkerClusterer(YAHOO.TrafegusPhp.map, veiculosAgr, veiculosAgrOptions);
//    var markerClusterTerc = new MarkerClusterer(YAHOO.TrafegusPhp.map, veiculosTerc, veiculosTercOptions);
//
//
//BASE_URL + '/public/img/cluster/green.png
//BASE_URL + '/public/img/cluster/red.png
//BASE_URL + '/public/img/cluster/yellow.png
}

/**
 *  Seta a posição, o ícone, a sombra(placa), o z-index e o mapa do veículo
 *  @param google.maps.Marker veiculo Marker do veiculo
 *  @param JSON latLngs Dados do veículo
 *  @return void
 */
var setOpcoesMarkerVeiculo = function (latLngs) {

//    console.log(latLngs)
    var veiculo = new MarkerWithLabel({
        position: new google.maps.LatLng(latLngs.upos_latitude, latLngs.upos_longitude),
        draggable: false,
        labelContent: "" + latLngs.veic_placa,
        labelAnchor: new google.maps.Point(25, 0),
        labelClass: "label-placa-veic", // the CSS class for the label
        labelInBackground: false,
        icon: BASE_URL + getImagem(latLngs.vinculo),
        title: latLngs.veic_placa,
        dados: latLngs

    });
    veiculo.addListener('click', function (evt) {
        infowindow.open(YAHOO.TrafegusPhp.map, veiculo);
    });

//    veiculo.setPosition(new google.maps.LatLng(latLngs.upos_latitude, latLngs.upos_longitude));
//    veiculo.setOptions(
//            {
//                title: latLngs.veic_placa,
//                icon: {
//                    url: BASE_URL + '/main/criaimagemplaca?placa=' + latLngs.veic_placa + '&vinculo=' + latLngs.vinculo,
//                    anchor: new google.maps.Point(21, 16)
//                }
//            }
//    );
    var infowindow = new google.maps.InfoWindow({
        content: '<div style="overflow: hidden;"><font style="font-size: 12px;">' +
                '<b>PLACA:</b> ' + latLngs.veic_placa +
                '<br/><b>MOTORISTA:</b> ' + (latLngs.nome_motorista ? latLngs.nome_motorista : '') +
                '<br/><b>FROTA:</b> ' + (latLngs.veic_frota ? latLngs.veic_frota : '') +
                '<br/><b>POSIÇÃO:</b> ' + latLngs.upos_descricao_sistema +
                '<br/><b>DATA E HORA:</b> ' + latLngs.upos_data_comp_bordo +
                '</font></div>'
    });

    google.maps.event.addListener(veiculo, 'click', function () {
        infowindow.open(YAHOO.TrafegusPhp.map, veiculo);
    });
//
    veiculo.setZIndex(1000);
    veiculo.setMap(YAHOO.TrafegusPhp.map);
    return veiculo;
}

/**
 * pega imagem do veiculo conforme codigo
 * @param {type} codigo
 * @returns {String}
 */
var getImagem = function (codigo) {
    var img = '/public/img/caminhaoVermelho25.png';
    if (codigo == 1)
        var img = '/public/img/caminhaoVerde25.png';
    if (codigo == 3)
        var img = '/public/img/caminhaoVermelho25.png';
    if (codigo == 2)
        var img = '/public/img/caminhaoAmarelo25.png';
    return img;
}

/**
 *  Seta o zoom e o centro para o veículo selecionado da grid resumo
 *  @param Double lat Latitude
 *  @param Double lng Longitude
 *  @return void
 */
var caminhaoNoMapa = function (lat, lng) {
    YAHOO.TrafegusPhp.map.setCenter(new google.maps.LatLng(lat, lng));
    YAHOO.TrafegusPhp.map.setZoom(16);
}


/**
 * Inicializa o onclick no botão de slide das grids inferiores do layout (FUNÇÂO NÃO ESTÁ MAIS SENDO UTILIZADO)
 * para que quando clicado, altere o zoom do mapa
 * @return void
 */
var setAdapterMap = function () {
    var divs = document.getElementsByTagName('div');
    var x = 0;

    while (divs[x]) {
        if (divs[x].className == 'collapse') {
            divs[x].onclick = function () {
                YAHOO.TrafegusPhp.map.setZoom(YAHOO.TrafegusPhp.map.getZoom() + 1);
                YAHOO.TrafegusPhp.map.setZoom(YAHOO.TrafegusPhp.map.getZoom() - 1);
            }
            break;
        }
        x++;
    }
}

/**
 * Muda o zoom do mapa principal para prevenir o não carregamento de algumas
 * divs do mapa
 * @return void
 */
var setGetZoomMapa = function () {
    YAHOO.TrafegusPhp.map.setZoom(YAHOO.TrafegusPhp.map.getZoom() + 1);
    YAHOO.TrafegusPhp.map.setZoom(YAHOO.TrafegusPhp.map.getZoom() - 1);
}

/**
 *  Chama os métodos que criam/deletam os markers das distâncias rápidas
 *  @param event event Evento de clique no mapa principal
 *  @return void
 */
var medirDistanciasRapidas = function (event) {
    if (!YAHOO.TrafegusPhp.medidorDistancias) {
        return;
    }
    if (YAHOO.TrafegusPhp.origemDistanciasRapidas && YAHOO.TrafegusPhp.destinoDistanciasRapidas) {
        deleteDistanciaRapida();
    }
    if (!YAHOO.TrafegusPhp.origemDistanciasRapidas && !YAHOO.TrafegusPhp.destinoDistanciasRapidas) {
        addOrigemDistanciasRapidas(event);
    } else if (YAHOO.TrafegusPhp.origemDistanciasRapidas && !YAHOO.TrafegusPhp.destinoDistanciasRapidas) {
        addDestinoDistanciasRapidas(event);
        calculaDistanciasRapidas();
    }
}

/**
 *  Adiciona o ponto de origem das distâncias rápidas
 *  @param event event Evento de clique no mapa principal
 *  @return void
 */
var addOrigemDistanciasRapidas = function (event) {
    YAHOO.TrafegusPhp.origemDistanciasRapidas = new google.maps.Marker({
        position: event.latLng,
        map: YAHOO.TrafegusPhp.map,
        icon: BASE_URL + '/public/img/marker_orange.png'
    });
}

/**
 *  Adiciona o ponto de destino das distâncias rápidas
 *  @param event event Evento de clique no mapa principal
 *  @return void
 */
var addDestinoDistanciasRapidas = function (event) {
    YAHOO.TrafegusPhp.destinoDistanciasRapidas = new google.maps.Marker({
        position: event.latLng,
        map: YAHOO.TrafegusPhp.map,
        icon: BASE_URL + '/public/img/marker_orange.png'
    });
}

var calculaDistanciasRapidas = function () {
    var latRefeO = new Number(YAHOO.TrafegusPhp.origemDistanciasRapidas.getPosition().lat());
    var lngRefeO = new Number(YAHOO.TrafegusPhp.origemDistanciasRapidas.getPosition().lng());
    var latRefeD = new Number(YAHOO.TrafegusPhp.destinoDistanciasRapidas.getPosition().lat());
    var lngRefeD = new Number(YAHOO.TrafegusPhp.destinoDistanciasRapidas.getPosition().lng());

    var distancia = DistanciaEntreDoisPontos(latRefeO, lngRefeO, latRefeD, lngRefeD)

    var posicaoMarcador;
    if (latRefeO > latRefeD) {
        posicaoMarcador = new google.maps.LatLng(new Number(((latRefeO - latRefeD) / 2) + latRefeD), new Number(((lngRefeO - lngRefeD) / 2) + lngRefeD));
    } else {
        posicaoMarcador = new google.maps.LatLng(new Number(((latRefeD - latRefeO) / 2) + latRefeO), new Number(((lngRefeD - lngRefeO) / 2) + lngRefeO));
    }
    createPolyLineDistanciasRapidas(distancia, posicaoMarcador);
}

/**
 *  Cria a polyline e o marker de informações das distâncias rápidas
 *  @param Float distancia Distância entre um ponto e outro
 *  @param google.maps.LatLng markerPosition Posição do marker de informações
 *  @return void
 */
var createPolyLineDistanciasRapidas = function (distancia, markerPosition) {

    var path = [];
    path[0] = YAHOO.TrafegusPhp.origemDistanciasRapidas.getPosition();
    path[1] = YAHOO.TrafegusPhp.destinoDistanciasRapidas.getPosition();
    //console.log(path);
    YAHOO.TrafegusPhp.polyLineDistanciasRapidas = new google.maps.Polyline({
        map: YAHOO.TrafegusPhp.map,
        path: path,
        strokeOpacity: 0.6,
        strokeColor: 'red'
    });
    YAHOO.TrafegusPhp.informacoesDistanciasRapidas = new google.maps.Marker({
        map: YAHOO.TrafegusPhp.map,
        position: markerPosition,
        icon: BASE_URL + '/public/img/marker_black.png'
    });
    createInfoWindowDistanciasRapidas(distancia, markerPosition);
    setTimeout('YAHOO.TrafegusPhp.infowindowDistanciasRapidas.open(YAHOO.TrafegusPhp.map)', 100);
    google.maps.event.addListener(YAHOO.TrafegusPhp.informacoesDistanciasRapidas, 'click', function () {
        if (YAHOO.TrafegusPhp.infowindowDistanciasRapidas) {
            YAHOO.TrafegusPhp.infowindowDistanciasRapidas.close();
        }
        YAHOO.TrafegusPhp.infowindowDistanciasRapidas.open(YAHOO.TrafegusPhp.map);
    });
}

/**
 *  Cria a InfoWindow da distância dos dois markers das distâncias rápidas
 *  @param Float distancia Distância dos dois markers
 *  @param google.maps.LatLng markerPosition Posição da InfoWindow
 *  @return void
 */
var createInfoWindowDistanciasRapidas = function (distancia, markerPosition) {
    if (YAHOO.TrafegusPhp.infowindowDistanciasRapidas) {
        YAHOO.TrafegusPhp.infowindowDistanciasRapidas.close();
    }
    YAHOO.TrafegusPhp.infowindowDistanciasRapidas = new google.maps.InfoWindow({
        content: '<div style="overflow: hidden;"><b>Distância:</b> ' + distancia + ' km</div>',
        position: markerPosition
    });
}

/**
 * Apaga do mapa os markers e a polyline da funcionalidade distâncias rápidas
 * @return void
 */
var deleteDistanciaRapida = function () {
    if (YAHOO.TrafegusPhp.origemDistanciasRapidas) {
        YAHOO.TrafegusPhp.origemDistanciasRapidas.setMap(null);
    }
    YAHOO.TrafegusPhp.origemDistanciasRapidas = false;
    if (YAHOO.TrafegusPhp.destinoDistanciasRapidas) {
        YAHOO.TrafegusPhp.destinoDistanciasRapidas.setMap(null);
    }
    YAHOO.TrafegusPhp.destinoDistanciasRapidas = false;
    if (YAHOO.TrafegusPhp.polyLineDistanciasRapidas) {
        YAHOO.TrafegusPhp.polyLineDistanciasRapidas.setMap(null);
    }
    if (YAHOO.TrafegusPhp.informacoesDistanciasRapidas) {
        YAHOO.TrafegusPhp.informacoesDistanciasRapidas.setMap(null);
    }
    if (YAHOO.TrafegusPhp.infowindowDistanciasRapidas) {
        YAHOO.TrafegusPhp.infowindowDistanciasRapidas.close();
    }
    YAHOO.TrafegusPhp.infowindowDistanciasRapidas = false;
}

/**
 * busca a distancia entre 2 pontos
 * @param google.maps.LatLng {origem} latitude e longitude da origem
 * @param google.maps.LatLng {destino} latitude e longitude do destino
 * @param function {handler} função que manuseia o resultado
 */
var getDistanciaEntreOrigemDestino = function (origem, destino, waypoints, handler) {
    var request;
    var directionsWS;

    directionsWS = new google.maps.DirectionsService();

    request = {
        origin: origem,
        destination: destino,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsWS.route(request, function (response, status) {

        handler(response, status);

    });
}
