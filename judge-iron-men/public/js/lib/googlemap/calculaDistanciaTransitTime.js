/**
 * Classe de roteirização da API Directions do Google Maps (sem limite de pontos).
 * usada no transit time apenas para roteirização das viagens, calculos de atraso 
 * e distancias
 */
var CalculaDistanciaTransitTime = function () {
    this.pontos = []; //Armazena os pontos de parada, origem e destino da rota
    this.coordenadas = []; //Armazena as coordenadas da(s) rota(s)
    this.request = []; //Armazena o objeto request de cada requisição de roteirização
    this.router = new google.maps.DirectionsService();
    /**
     * Retorna o ponto na posição zero do array de pontos da rota
     * @return google.maps.LatLng
     */
    this.getPrimeiroPonto = function () {
        return this.pontos[0];
    }

    /**
     * Retorna o ultimo ponto do array de pontos da rota
     * @return google.maps.LatLng
     */
    this.getUltimoPonto = function () {
        var indice = this.pontos.length - 1;
        return this.pontos[indice];
    }

    /**
     * Retorna o ponto na posição selecionada pelo usuário
     * @param indice Number Indice do array requerido
     * @return google.maps.LatLng 
     */
    this.getPontoPorIndice = function (indice) {
        return this.pontos[indice];
    }

    /**
     * Retorna os pontos intermediarios para a roteirização (no maximo 8)
     * @param indice Number Indice de inicio da captura dos pontos no array de pontos
     * @param waypoints [] Array de pontos intermedi�rios para a roteirização
     * @return Array
     */
    this.getPontosIntermediarios = function (indice, waypoints) {
        var count = 0;
        while (count < 8 && (indice < this.pontos.length - 1)) {
            waypoints.push({
                location: this.getPontoPorIndice(indice),
                stopover: true
            });
            count++;
            indice++;
        }
        return indice;
    }

    /**
     *  Exclui um ponto do array pontos
     *  @param indice Number Indice do ponto que devera ser excluido
     *  @return Boolean
     */
    this.deletePonto = function (indice) {
        var novo = [], x = 0;
        this.pontos[indice] = -1;
        while (this.pontos[x]) {
            if (this.pontos[x] != -1) {
                novo.push(this.pontos[x]);
            }
            x++;
        }
        this.pontos = novo;
        return true;
    }

    /**
     * Empilha um ponto no array de pontos na rota
     * @param latLng google.maps.LatLng Coordenadas do ponto
     * @param This Rota Instancia da classe
     * @return void
     */
    this.addPontoRota = function (latLng, This) {
        This.pontos.push(latLng);
    }


    /**
     * soma a distancia da rota
     * @param indice Number Indice inicial do array de pontos da rota
     * @param indicegrid Number  indice da grid do transit time
     * @param indicelocal Number indice do ultimo local da viagem roteirisado
     * @return void
     */
    this.calculaDistanciaTransitTime = function (indice, indicegrid, This, indicelocal) {
        if (This.pontos.length >= 2) {

            indice = This.criarRequestCalculoDistancia(indice);

            this.router.route(This.request, function (result, status) {
                This.callbackCalculoDistancia(result, status, indice, This, indicegrid, indicelocal);
            });
        }
    }
    /**
     * retorna a distancia da ultima rota roteirizada
     * @return Integer
     */
    this.getDistanciaRota = function () {
        return this.distancia;
    }

    /**
     * Callback da função de calcula distancia rota
     * @param result JSON Dados do Google
     * @param status google.maps.DirectionsStatus Estatus da requisição
     * @param indice Number Indice atual de inicio da roteirização
     * @param This Rota Instância da classe rota
     * @param indicegrid Number o indice da viagem a qual possui a distancia percorrida
     * @param indicelocal Number o indice do ultimo local roteirisado
     * @return void
     */
    this.callbackCalculoDistancia = function (result, status, indice, This, indicegrid, indicelocal) {
        if (status == google.maps.DirectionsStatus.OK) {

            indicelocal = This.addDistanciaTempoPonto(result.routes[0].legs, indicegrid, indicelocal);

            if (indice < (This.pontos.length - 1)) {

                //indicelocal = This.addDistanciaTempoPonto(result.routes[0].legs,indicegrid,indicelocal);
                This.calculaDistanciaTransitTime(indice, indicegrid, This, indicelocal);

            } else {
                resetTTEmViagem--;
                /*indicelocal = This.addDistanciaTempoPonto(result.routes[0].legs,indicegrid,indicelocal);
                 This.somaDistanciaPercorrida(indicegrid);
                 This.calculaDistanciaRestante(indicegrid);
                 This.calculaPrevisaoAtrasoViagem(indicegrid);
                 This.calculaPrevisoesChegadaLocais(indicegrid);*/
                salvaDadosTransitTimeRpon(indicegrid);
                //criaGraficoTransitTime(indicegrid);
            }
           // if(resetTTEmViagem == 0)initGridTransitTimeEmViagem();
        }else{
            
            if(status == "OVER_QUERY_LIMIT"){
                setTimeout(function(){
                    This.router.route(This.request, function(result, status){
                        This.callbackCalculoDistancia(result, status, indice, This, indicegrid, indicelocal);
                    });
                }, 1000)
            }
        }
    }

    /**
     * calcula as previsões de chegada nos locais da viagem assim como estatus do local
     * @param Integer {indiceviagem} posição da viagem no DataSource  a viagem dos pontos que seram calculados
     * @return void 
     */
    /*this.calculaPrevisoesChegadaLocais = function(indiceviagem){
     var p;
     var pos;
     var arr;
     var horas;
     var chegada;
     var previsao;
     var isNull = YAHOO.lang.isNull;
     var vm = new Number(YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indiceviagem].getData("media_velocidade"));
     var locais = YAHOO.lang.JSON.parse(YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indiceviagem].getData("locais"));
     
     locais[0].previsao_chegada = YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indiceviagem].getData("viag_data_inicio");
     
     for(pos in locais){
     
     p = new Number(pos)+1;
     
     if(locais.length > p){
     
     if(locais[p].previsao == "NAO"){
     arr = toArrayStringData(locais[pos].previsao_chegada);
     
     if(locais[p].length > 2){
     
     previsao = new Date(new Number(arr.ano), new Number(arr.mes)-1, new Number(arr.dia), new Number(arr.hor), new Number(arr.min), new Number(arr.seg)+new Number(locais[pos].rpon_tempo_proximo_ponto), 0);
     
     locais[p].previsao_chegada = toStringObjetoDate(previsao);
     
     } else {
     //calcula o tempo em horas para percorrer a distancia restante com a velocidade media
     horas = new Number(YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indiceviagem]._oData.distancia_restante)/vm;
     
     previsao = new Date(new Number(arr.ano), new Number(arr.mes)-1, new Number(arr.dia), new Number(arr.hor)+new Number(horas), new Number(arr.min), new Number(arr.seg)+new Number(locais[pos].rpon_tempo_proximo_ponto), 0);
     
     locais[p].previsao_chegada = toStringObjetoDate(previsao);
     
     }
     }
     }
     
     if(!isNull(locais[pos].vlev_data)){
     
     arr = toArrayStringData(locais[pos].vlev_data);
     chegada = new Date(new Number(arr.ano), new Number(arr.mes)-1, new Number(arr.dia), new Number(arr.hor), new Number(arr.min), new Number(arr.seg), 0);
     
     arr = toArrayStringData(locais[pos].previsao_chegada);
     previsao = new Date(new Number(arr.ano), new Number(arr.mes)-1, new Number(arr.dia), new Number(arr.hor), new Number(arr.min), new Number(arr.seg), 0);
     
     if(chegada > previsao){
     locais[pos].estatus_atraso = "ATRASADO";
     } else {
     locais[pos].estatus_atraso = "SEM ATRASO";
     }
     
     } else {
     locais[pos].estatus_atraso = "NÃO ENTREGUE";
     }
     }
     
     YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indiceviagem]._oData.locais = YAHOO.lang.JSON.stringify(locais);
     }*/
    /**
     * soma a distancia percorrida da viagem caso algum local ja tenha uma data 
     * de chegada se não roteiriza do ponto de origem até o ponto da ultima 
     * posição
     * @param indicegrid Number indice no DataSource da grid
     */
    /*this.somaDistanciaPercorrida = function(indicegrid){
     var dist = 0;
     var cont = 0;
     var pos;
     var isNull = YAHOO.lang.isNull;
     var locais = YAHOO.lang.JSON.parse(YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid].getData("locais"));
     
     if(locais.length > 2){
     for(pos = 0; pos < locais.length; pos++){
     if(!isNull(locais[pos].vlev_data))cont = pos;
     }
     
     for(pos = 0; pos < cont; pos++){
     dist += (isNull(locais[pos].rpon_distancia_proximo_ponto)) ? 0 : locais[pos].rpon_distancia_proximo_ponto;
     }
     } else {
     dist = locais[0].rpon_distancia_proximo_ponto;
     }
     
     YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.distancia_percorrida = new Number(dist)/1000;
     }*/
    /**
     * adiciona a distancia e o tempo ao ponto da rota;
     * @param legs google.maps.DirectionsLeg dados dos pontos da rota
     * @param indiceviagem Number numero no datasource da viagem
     * @param indicelocal Number do ultimo local roteirisado
     * @return Number 
     */
    this.addDistanciaTempoPonto = function (legs, indiceviagem, indicelocal) {

        var locais = YAHOO.lang.JSON.parse(YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indiceviagem].getData("locais"));

        for (var pos in legs) {

            locais[indicelocal].rpon_distancia_proximo_ponto = legs[pos].distance.value;
            locais[indicelocal].rpon_tempo_proximo_ponto = legs[pos].duration.value;
            indicelocal++;
        }

        YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indiceviagem]._oData.locais = YAHOO.lang.JSON.stringify(locais);

        return indicelocal;
    }

    /**
     * após todos os pontos estarem roteirisados é calculado a distancia percorrida
     * @param indicegrid Number indice da viagem no dataSource da grid
     */
    /*this.calculaDistanciaRestante = function(indicegrid){
     var viag = new Number(YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.viag_distancia);
     var dist = new Number(YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.distancia_percorrida);
     
     YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.distancia_restante = viag - dist;
     
     }*/

    /**
     * calcula a previsão de atraso da viagem
     * @param indicegrid
     */
    /*this.calculaPrevisaoAtrasoViagem = function(indicegrid){
     var atraso, previsao, fim, diff;
     var isString= YAHOO.lang.isString;
     var arr = toArrayStringData(YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.data_ultima_posicao);
     var dataFimReal = new Date(new Number(arr.ano), new Number(arr.mes)-1, new Number(arr.dia), new Number(arr.hor), new Number(arr.min), new Number(arr.seg), 0);
     
     if(!isString(YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.viag_data_fim)){
     
     atraso  = (YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.distancia_restante) / YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.media_velocidade;
     
     arr = toArrayStringData(YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.viag_previsao_fim)
     previsao = new Date(new Number(arr.ano), new Number(arr.mes)-1, new Number(arr.dia), new Number(arr.hor), new Number(arr.min), new Number(arr.seg), 0);
     
     if(dataFimReal > previsao){
     atraso = new Number(atraso.toFixed(0));
     fim = toStringObjetoDate(dataFimReal);
     } else {
     atraso = 0;
     fim = YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.viag_previsao_fim;
     }
     
     YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.horas_atraso_real = atraso+" horas";        
     YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.fim_real = fim;
     } else {
     
     arr = toArrayStringData(YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.viag_data_fim);
     fim = new Date(new Number(arr.ano), new Number(arr.mes)-1, new Number(arr.dia), new Number(arr.hor), new Number(arr.min), new Number(arr.seg), 0);
     
     arr = toArrayStringData(YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.viag_previsao_fim);
     previsao = new Date(new Number(arr.ano), new Number(arr.mes)-1, new Number(arr.dia), new Number(arr.hor), new Number(arr.min), new Number(arr.seg), 0);
     
     if(fim > previsao){
     diff = diferencaHoras(fim,previsao);
     YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.horas_atraso_real = diff.toFixed(0)+" horas";
     YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.estatus_atraso = "ATRASADO";
     } else {
     YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.horas_atraso_real = 0+" horas";
     YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.estatus_atraso = "<center>-</center>";
     }
     
     YAHOO.TrafegusPhp.tableTransitTimeEmViagem.getRecordSet()._records[indicegrid]._oData.fim_real = "<center>-</center>";
     }
     }*/

    /**
     * Cria o objeto request utilizado no calculo da distância
     * @param indice Number Indice inicial do array de pontos
     * @return Number
     */
    this.criarRequestCalculoDistancia = function (indice) {

        var origem = this.getPontoPorIndice(indice);
        var waypoints = [];

        indice = this.getPontosIntermediarios(++indice, waypoints);

        var destino = this.getPontoPorIndice(indice);

        this.request = {
            origin: origem,
            destination: destino,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING
        };

        return indice;
    }
}