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
    } else {
        $('#side_menu').addClass('noanim');
        $('#side_menu').removeClass('overlay');
        $('.sidebar').sidebar('show');
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

var x = window.matchMedia("only screen and (max-width: 800px)");
myFunction(x);
x.addListener(myFunction);