function myFunction(x) {
    $('.sidebar').sidebar({
        dimPage: false,
        transition: 'push',
        exclusive: false,
        closable: false
        });
    $('.pusher').addClass('noanim');
    if (x.matches) {
        $('#side_menu').removeClass('push');
        $('.sidebar').sidebar('hide');
        $('.button-menu').css({display: 'inline'});
        var timer = setInterval(function() {
            $('.button-menu').css({
                transition: 'opacity .2s',
                opacity: '1',
                'pointer-events': 'all'
            });
            clearInterval(timer); 
        }, 100);
    } else {
        $('#side_menu').addClass('noanim');
        $('#side_menu').removeClass('overlay');
        $('.sidebar').sidebar('show');
        $('.button-menu').css({
            display: 'none',
            opacity: '0',
            'pointer-events': 'none'
        });
    }
}

function onMenu() {
    $('.pusher').removeClass('noanim');
    $('#side_menu').removeClass('noanim');
    $('.sidebar').sidebar({
        dimPage: false,
        transition: 'overlay',
        exclusive: false,
        closable: true
        })
    .sidebar('toggle');
}

function menuToggle(x){
    var y=document.getElementsByClassName("item active")[0];
    y.className="item";

    document.getElementById(x).className="item active";
}

var x = window.matchMedia("only screen and (max-width: 800px)");
myFunction(x);
x.addListener(myFunction);