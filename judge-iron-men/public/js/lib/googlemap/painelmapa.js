/**
 * NADA DESTE ARQUIVO ESTA SENDO USADO
 * painel com mapa para operações em geral
 */
var painelMapa;
var mapaOperacoes;

var initPainelMapa = function(){
    painelMapa = new YAHOO.widget.Panel("painelMapa",
    {
        modal               : true,
        draggable           : true,
        fixedcenter         : true,
        dragOnly            : true,
        visible             : false,
        autofillheight      : "body",
        constraintoviewport : true,
        width               : '1000px',
        effect              : {
            effect:YAHOO.widget.ContainerEffect.FADE,
            duration:0.30
        }
    });
        
    painelMapa = addElementosPainelMapa(painelMapa);
    
    painelMapa.render("source");
    painelMapa.show();
    
    initMapaOperacoes();
    
}

/**
 * adiciona os elementos no painel como este painel não possui um controller
 * @param YAHOO.widget.Panel {painel} o painel
 * @return YAHOO.widget.Panel
 */
var addElementosPainelMapa = function(painel){
    painel.setHeader("Mapa");
    
    var divMapa = document.createElement("div");
    divMapa.id = "mapaOperacoes";
    divMapa.style.height = "550px";
    divMapa.style.position = "relative";
    YAHOO.util.Dom.addClass(divMapa, "bd")
    
    painel.body = divMapa;
    
    var btClose = document.createElement("button");
    btClose.id = "closePainelMapa";
    btClose.innerHTML = "Fechar";
    YAHOO.util.Dom.addClass(btClose, "bottons")
    
    var btImprimir = document.createElement("button")
    btImprimir.id = "imprimirPainelMapa";
    btImprimir.innerHTML = "Imprimir";
    YAHOO.util.Dom.addClass(btImprimir, "bottons")
    
    painel.appendToFooter(btClose);
    painel.appendToFooter(btImprimir);
    
    painel.subscribe('hide', function(){
        painel.destroy();
        removeElemento('painelMapa');
    });
    
    var close = function(){
        painel.hide();
    };
    
    evt.on("closePainelMapa", "click", close);
    
    return painel;
}

/**
 * inicializa o mapa na div "mapaOperacoes"
 */
var initMapaOperacoes = function(){
    var latlng = new google.maps.LatLng(-15.7794000000, -47.9294000000);
    
    var options = {
      zoom: 4,
      gestureHandling: 'greedy',
      navigationControl: true,
      navigationControlOptions: {style: google.maps.NavigationControlStyle.ZOOM_PAN},
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    mapaOperacoes = new google.maps.Map(get("mapaOperacoes"), options);
}