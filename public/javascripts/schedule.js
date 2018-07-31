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

        $(function(){ 
            $(this).swipe({ 
                swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                    if( direction == "left" ) { 
                        $('.sidebar').sidebar('hide');
                        threshold:256;
                    }else if( direction == "right" ) { 
                        $('.pusher').removeClass('noanim');
                        $('#side_menu').removeClass('noanim');
                        $('.sidebar').sidebar({
                            dimPage: false,
                            transition: 'overlay',
                            exclusive: false,
                            closable: true
                            })
                        .sidebar('show');
                        threshold:256;
                    } 
                }, 
            }); 
        });
    } else {
        $('#side_menu').addClass('noanim');
        $('#side_menu').removeClass('overlay');
        $('.sidebar').sidebar('show');
        $('.button-menu').css({
            display: 'none',
            opacity: '0',
            'pointer-events': 'none'
        });

        $(function(){ 
            $(this).swipe({ 
                swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                    if( direction == "left" ) { 
                        // Overrided method
                        threshold:9999;
                    }else if( direction == "right" ) { 
                        // Overrided method
                        threshold:9999;
                    } 
                }, 
            }); 
        });
    }
    sidebarFlag = false;
}

var sidebarFlag = false;

function onMenu() {
    if($('.sidebar').sidebar('is hidden')) {
        sidebarFlag = false;
    }
    else {
        sidebarFlag = true;
    }

    if(!sidebarFlag) {
        $('.pusher').removeClass('noanim');
        $('#side_menu').removeClass('noanim');
        $('.sidebar').sidebar({
            dimPage: false,
            transition: 'overlay',
            exclusive: false,
            closable: true
            })
        .sidebar('toggle');
        sidebarFlag = true;
    }
    else {
        $('.sidebar').sidebar('hide');
        sidebarFlag = false;
    }
}

function menuToggle(x){
    var y=document.getElementsByClassName("item active")[0];
    y.className="item";

    document.getElementById(x).className="item active";
}

$(document).ready(function(){
    var uNickname = $('.nickname');
    var changedName = '';
    var uMessage = $('.user-message');
    var changedMessage = '';

    uNickname.blur(function(){
        console.log('nickname blured');
        changedName = $(this).val();
        uNickname.val(changedName);
    });
    uMessage.blur(function(){
        changedMessage = $(this).val(); // changedMessage를 서버에 보내서 상태메시지의 변경된 내용 저장
        uMessage.val(changedMessage);
    });

    $('.profile-image').click(function() {
        $('.profpic-modal').modal('show');
    });

    $('.user-profile').click(function() {
        console.log('hi');
        $('#info_card').attr({'style': 'display: block !important'});
        $('.card-back').attr({'style': 'display: block !important'});
    });

    $('.card-back').click(function() {
        $('#info_card').attr({'style': 'display: none !important'});
        $('.card-back').attr({'style': 'display: none !important'});
    });
});

var x = window.matchMedia("only screen and (max-width: 800px)");
myFunction(x);
x.addListener(myFunction);