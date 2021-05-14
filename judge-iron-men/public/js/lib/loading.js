LoadScreen = function() {};

LoadScreen.count = 0;

LoadScreen.show = function(){
    LoadScreen.count++;
    if(LoadScreen.count > 0){
        // $('#wrapper').addClass("blurred");
        $('#mainLoadingScreen').show();
    }
};

LoadScreen.hide = function() {
    LoadScreen.count--;
    if(LoadScreen.count === 0){
        // $('#wrapper').removeClass("blurred");
        $('#mainLoadingScreen').hide();
    }

};