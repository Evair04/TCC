/**
 * Classe básica para o serviço de geolocalização do Google maps
 */
var GeoLocalizador = function(){
    this.geoCoder = new google.maps.Geocoder();
    this.geoCoderRequest = null;

    this.getDescricaoLocal = function(latLng){
        this.geoCoderRequest = {
            location: latLng
        };
        this.localizar();
    }

    this.getLatLngLocal = function(descricaoLocal){
        this.geoCoderRequest = {
            address: descricaoLocal
        };
        this.localizar();
    }

    this.callback = function(results, status){
        if (status == google.maps.GeocoderStatus.OK){
            alert(results[0].formatted_address);
        }
    }

    this.localizar = function(){
        try{
            this.geoCoder.geocode(this.geoCoderRequest, this.callback);
        }catch (err){
            alert(err.message);
        }
    }
}