/**
 * Classe de roteirização da API Directions do Google Maps (sem limite de pontos).
 * @param idMapa String Elemento HTML id da div em que o mapa sera carregado
 * @author Everton Luiz Ficagna
 */
var Rota = function(idMapa){
    this.divMapa = document.getElementById(idMapa); //Armazena o elemento div onde o mapa � renderizado
    this.mapa = null; //Armazena o objeto google.maps.Map (Mapa)
    this.pontos = []; //Armazena os pontos de parada, origem e destino da rota
    this.coordenadas = []; //Armazena as coordenadas da(s) rota(s)
    this.request = []; //Armazena o objeto request de cada requisição de roteirização
    this.polyline = null; //Armazena o objeto google.maps.Polyline (Traço da rota)
    this.markers = []; //Armazena os markers dos pontos da rota
    this.distancia = null;

    /**
     *  Reinicia o array de posições e a polyline
     *  @return void
     */
    this.resetPolyline = function(){
        if (this.polyline !== null){
            this.coordenadas = [];
            this.polyline.setMap(null);
            this.polyline = null;
        }
    }

    /**
     * Inicializa o mapa na div selecionada pelo usuario
     * @param latLng google.maps.LatLng Coordenada que será o centro do mapa quando o mesmo for renderizado
     * @return void
     */
    this.initMapa = function(latLng){
        var opcoes = {
            zoom: 8,
            gestureHandling: 'greedy',
            navigationControl: true,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL
            },
            center: latLng || new google.maps.LatLng(-15.7794000000, -47.9294000000),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.mapa = new google.maps.Map(this.divMapa, opcoes);
    }

    /**
     * Retorna o ponto na posição zero do array de pontos da rota
     * @return google.maps.LatLng
     */
    this.getPrimeiroPonto = function(){
        return this.pontos[0];
    }

    /**
     * Retorna o último ponto do array de pontos da rota
     * @return google.maps.LatLng
     */
    this.getUltimoPonto = function(){
        var indice = this.pontos.length - 1;
        return this.pontos[indice];
    }

    /**
     * Retorna o ponto na posição selecionada pelo usuário
     * @param indice Number Indice do array requerido
     * @return google.maps.LatLng
     */
    this.getPontoPorIndice = function(indice){
        return this.pontos[indice];
    }

    /**
     * Retorna os pontos intermediários para a roteirização (no máximo 8)
     * @param indice Number Indice de início da captura dos pontos no array de pontos
     * @param waypoints [] Array de pontos intermediários para a roteirização
     * @return Array
     */
    this.getPontosIntermediarios = function(indice, waypoints){
        var count = 0;
        while (count < 8 && (indice < this.pontos.length - 1)){
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
     *  Exclui um ponto do array markers
     *  @param indice Number Indice do marker que deverá ser excluído
     *  @return Boolean
     */
    this.deleteMarker = function(indice){
        var novo = [], x = 0;
        this.markers[indice] = -1;
        while (this.markers[x]){
            if (this.markers[x] != -1){
                novo.push(this.markers[x]);
            }
            x++;
        }
        this.markers = novo;
        return true;
    }

    /**
     *  Exclui um ponto do array pontos
     *  @param indice Number Indice do ponto que deverá ser excluído
     *  @return Boolean
     */
    this.deletePonto = function(indice){
        var novo = [], x = 0;
        this.pontos[indice] = -1;
        while (this.pontos[x]){
            if (this.pontos[x] != -1){
                novo.push(this.pontos[x]);
            }
            x++;
        }
        this.pontos = novo;
        return true;
    }

    /**
     *  Define o evento de clique com o botão direito do mouse nos markers
     *  @return void
     */
    this.setClickMarker = function(){
        var This = this, indice = this.markers.length - 1;
        var marker = this.markers[indice];
        google.maps.event.addListener(marker, 'rightclick', function(){
            var x = 0;
            while (This.markers[x]){
                if (This.markers[x].getPosition().equals(this.getPosition())){
                    if (This.deleteMarker(x) && This.deletePonto(x)){
                        marker.setMap(null);
                    }
                }
                x++;
            }
        });
    }

    /**
     * Empilha um ponto no array de pontos na rota e cria um Marker nas coordenadas recebidas
     * @param latLng google.maps.LatLng Coordenadas do ponto
     * @param This Rota Instancia da classe Rota
     * @return void
     */
    this.addPontoRota = function(latLng, This){
        This.markers.push(
            new google.maps.Marker({
                position: latLng,
                map: This.mapa
            })
        );
        This.setClickMarker();
        This.pontos.push(latLng);
    }

    /**
     * Define o evento 'onclick' do mapa
     * @return void
     */
    this.setClick = function(){
        var This = this;
        google.maps.event.addListener(this.mapa, 'click', function(event){
            This.addPontoRota(event.latLng, This);
        });
    }

    /**
     * Cria o objeto request utilizado na roteirização
     * @param indice Number Indice inicial do array de pontos
     * @return Number
     */
    this.criarRequest = function(indice){
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

    /**
     * Cria o objeto google.maps.Polyline (traço da rota)
     * @return void
     */
    this.criaPolyline = function(){
        this.polyline = new google.maps.Polyline({
            map: this.mapa,
            path: this.coordenadas
        });
    }

    /**
     *  Abre alerts de informações de cada um dos trechos da rota
     *  @param dados JSON
     *  @return void
     */
    this.alertInfoLegs = function(dados){
        var x = 0;
        while (dados.legs[x]){
            alert(
                'Trecho: ' + new Number(x + 1) +
                '\nIn�cio em: ' + dados.legs[x].start_address +
                '\nFim em: ' + dados.legs[x].end_address +
                '\nDist�ncia: ' + dados.legs[x].distance.text
            );
            x++;
        }
    }

    /**
     * Callback da função de roteirização
     * @param result JSON Dados do Google
     * @param status google.maps.DirectionsStatus Estatus da requisição
     * @param indice Number Indice atual de início da roteirização
     * @param This Rota Instância da classe rota
     * @param openInfo Boolean Flag para abrir ou não os alerts de informações da rota
     * @return void
     */
    this.callback = function(result, status, indice, This, openInfo){
        if (status == google.maps.DirectionsStatus.OK){
            var x = 0;
            if (openInfo) This.alertInfoLegs(result.routes[0]);
            while (result.routes[0].overview_path[x]){
                This.coordenadas.push(result.routes[0].overview_path[x]);
                x++;
            }
            if (indice < (This.pontos.length - 1)){
                This.roteirizar(indice, openInfo);
            }else{
                This.criaPolyline();
            }
        }else{
            alert(status);
        }
    }

    /**
     * Método que realiza a requisição de roteirização
     * @param indice Number Indice inicial do array de pontos da rota
     * @param openInfo Boolean Flag para abrir ou não os alerts de informações da rota
     * @return void
     */
    this.roteirizar = function(indice, openInfo){
        if (this.pontos.length <= 2){
            var This = this;
            if (indice == 0){
                openInfo = confirm('Deseja exibir dados dos trechos da rota?');
            }
            var router = new google.maps.DirectionsService();
            if (indice === 0) this.resetPolyline();
            indice = this.criarRequest(indice);
            router.route(this.request, function(result, status){
                This.callback(result, status, indice, This, openInfo);
            });
        }else{
            alert('Para roteirizar, devem haver ao menos dois pontos!');
        }
    }

    /**
     * soma a distancia da rota
     * @param indice Number Indice inicial do array de pontos da rota
     * @return void
     */
    this.calculaDistanciaRota = function(indice){
        this.indice = indice;
        if (this.pontos.length <= 2){
            var This = this;

            var router = new google.maps.DirectionsService();

            indice = this.criarRequestCalculoDistancia(indice);

            router.route(this.request, function(result, status){
                This.callbackCalculoDistancia(result, status, indice, This);
            });
        }
    }
    /**
     * retorna a distancia da ultima rota roteirizada
     * @return Integer
     */
    this.getDistanciaRota = function(){
        return this.distancia;
    }

}