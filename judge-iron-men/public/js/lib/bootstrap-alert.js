BootstrapAlert = function() {};

BootstrapAlert.fade = function(){
    $(".alert-center.alert.alert-success, " +
        ".alert-center.alert.alert-warning").delay(4000).fadeOut(500,function(){ $(this).remove();});
};

BootstrapAlert.error = function(message) {
    $('#container-alerts')
        .html('<div class="alert-center alert alert-danger alert-dismissable fade in" role="alert"><a class="close" data-dismiss="alert" aria-label="close">&times;</a>' + message + '</div>');
    // BootstrapAlert.fade();

};

BootstrapAlert.success = function(message) {
    $('#container-alerts')
        .html('<div class="alert-center alert alert-success alert-dismissable fade in" role="alert"><a class="close" data-dismiss="alert" aria-label="close">&times;</a>'+message+'</div>');
    BootstrapAlert.fade();
};

BootstrapAlert.info = function(message) {
    $('#container-alerts')
        .html('<div class="alert-center alert alert-info alert-dismissable fade in" role="alert"><a class="close" data-dismiss="alert" aria-label="close">&times;</a>'+message+'</div>');
    // BootstrapAlert.fade();
};

BootstrapAlert.warning = function(message) {
    $('#container-alerts')
        .html('<div class="alert-center alert alert-warning alert-dismissable fade in" role="alert"><a class="close" data-dismiss="alert" aria-label="close">&times;</a>'+message+'</div>');
    BootstrapAlert.fade();
};
