var div = document.createElement('div');
div.className = '';
div.id = 'id_error';
div.innerHTML = "";
document.getElementById('id').appendChild(div);

var div = document.createElement('div');
div.className = '';
div.id = 'email_error';
div.innerHTML = "";
document.getElementById('email').appendChild(div);

var idOk = false;
var passOk = false;
var emailOk = false;
//6666666
function checkId() {
    var id = document.getElementById('id_input').value;
    var regId = new RegExp("^(?=.*?[a-z]).{3,}$");

    $('#id').removeAttr('data-tooltip').removeAttr('data-position');
    $('#pass').removeAttr('data-tooltip').removeAttr('data-position');

    $('#id').removeAttr('right labeled');
    $('#id_error').removeAttr('class', '');
    $('#id_error').html('');

    if(id == '') {
        $('#id').attr('data-tooltip', '아이디는 문자 3자 이상 포함해서 입력하세요.').attr('data-position', 'bottom left');
        document.getElementById('id').setAttribute('class', 'ui left icon fluid input');
        document.getElementById('id_ico').setAttribute('class', 'user icon');
        document.getElementById('id_input').setAttribute('class', 'input-orange');
        idOk = false;
    }
    else if(regId.test(id)) {
        document.getElementById('id').setAttribute('class', 'ui left icon fluid input confirm');
        document.getElementById('id_ico').setAttribute('class', 'check circle icon');
        idOk = true;
    }
    else {
        document.getElementById('id').setAttribute('class', 'ui left icon fluid input error');
        document.getElementById('id_ico').setAttribute('class', 'times circle icon');
        document.getElementById('id_input').removeAttribute('class');
        idOk = false;
    }
}

var timeout = null;

function checkIdAlready() {
    if (timeout !== null) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
        var id = document.getElementById('id_input').value;
        if(id != '') {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(xhttp.responseText);
                    if(xhttp.responseText == 'false') {

                    }
                    else {
                        document.getElementById('id').setAttribute('class', 'ui left icon right labeled fluid input error');
                        document.getElementById('id_ico').setAttribute('class', 'times circle icon');
                        document.getElementById('id_input').removeAttribute('class');
                        
                        $('#id_error').attr('class', 'ui basic label');
                        $('#id_error').html('사용하실 수 없는 아이디 입니다.');

                        idOk = false;
                    }
                }
            };
            
            xhttp.open("GET", "/checkid/"+id, true);
            xhttp.send();
        }
    }, 250);
}

function checkEmailAlready() {
    if (timeout !== null) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
        var email = document.getElementById('email_input').value;
        if(email != '') {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(xhttp.responseText);
                    if(xhttp.responseText == 'false') {

                    }
                    else {
                        document.getElementById('email').setAttribute('class', 'ui left icon right labeled fluid input error');
                        document.getElementById('email_ico').setAttribute('class', 'times circle icon');
                        document.getElementById('email_input').removeAttribute('class');
                        
                        $('#email_error').attr('class', 'ui basic label');
                        $('#email_error').html('사용하실 수 없는 이메일 입니다.');

                        emailOk = false;
                    }
                }
            };
            
            xhttp.open("GET", "/checkemail/"+email, true);
            xhttp.send();
        }
    }, 250);
}

function checkPassword() {
    /* pass, pass2, pass_input, pass2_input, pass_ico, pass2_ico */
    var passwordOrigin = document.getElementById('pass_input').value;
    var passwordConfirm = document.getElementById('pass2_input').value;

    var regPw = new RegExp("^(?=.*?[a-z])(?=.*?[0-9]).{6,}$");

    $('#id').removeAttr('data-tooltip').removeAttr('data-position');
    $('#pass').removeAttr('data-tooltip').removeAttr('data-position');

    if(passwordOrigin == '') {
        $('#pass').attr('data-tooltip', '비밀번호는 문자, 숫자 조합 6자리 이상 만들어주세요.').attr('data-position', 'bottom left');
        document.getElementById('pass').setAttribute('class', 'ui left icon fluid input');
        document.getElementById('pass_ico').setAttribute('class', 'key icon');
        document.getElementById('pass_input').setAttribute('class', 'input-orange');

        passOk = false;
    }
    else if(regPw.test(passwordOrigin) && document.activeElement === document.getElementById('pass_input')) {
        document.getElementById('pass').setAttribute('class', 'ui left icon fluid input confirm');
        document.getElementById('pass_ico').setAttribute('class', 'check circle icon');

        passOk = false;
    }
    else if(document.activeElement === document.getElementById('pass_input')) {
        document.getElementById('pass').setAttribute('class', 'ui left icon fluid input error');
        document.getElementById('pass_ico').setAttribute('class', 'times circle icon');
        document.getElementById('pass_input').removeAttribute('class');

        passOk = false;
    }

    if(passwordConfirm == '') {
        document.getElementById('pass2').setAttribute('class', 'ui right icon fluid input');
        document.getElementById('pass2_ico').setAttribute('class', 'icon');
        document.getElementById('pass2_input').setAttribute('class', 'input-orange');

        passOk = false;
    }
    else if(passwordOrigin === passwordConfirm) {
        document.getElementById('pass2').setAttribute('class', 'ui left icon fluid input confirm');
        document.getElementById('pass2_ico').setAttribute('class', 'check circle icon');

        passOk = false;
    }
    else {
        document.getElementById('pass2').setAttribute('class', 'ui left icon fluid input error');
        document.getElementById('pass2_ico').setAttribute('class', 'times circle icon');
        document.getElementById('pass2_input').removeAttribute('class');

        passOk = false;
    }
}

function checkEmail() {
    var email = document.getElementById('email_input').value;

    var regEmail = new RegExp("^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$");

    $('#id').removeAttr('data-tooltip').removeAttr('data-position');
    $('#pass').removeAttr('data-tooltip').removeAttr('data-position');

    $('#email').removeAttr('right labeled');
    $('#email_error').removeAttr('class', '');
    $('#email_error').html('');

    if(email == '') {
        document.getElementById('email').setAttribute('class', 'ui left icon fluid input');
        document.getElementById('email_ico').setAttribute('class', 'envelope icon');
        document.getElementById('email_input').setAttribute('class', 'input-orange');

        emailOk = false;
    }
    else if(regEmail.test(email)) {
        document.getElementById('email').setAttribute('class', 'ui left icon fluid input confirm');
        document.getElementById('email_ico').setAttribute('class', 'check circle icon');

        emailOk = true;
    }
    else {
        document.getElementById('email').setAttribute('class', 'ui left icon fluid input error');
        document.getElementById('email_ico').setAttribute('class', 'times circle icon');
        document.getElementById('email_input').removeAttribute('class');

        emailOk = false;
    }
}

function checkFocus(element, icon) {
    document.getElementById(element).setAttribute('class', icon + ' icon');

    $('#id').attr('data-tooltip', '아이디는 문자 포함 숫자 조합으로 입력하세요.').attr('data-position', 'bottom left');
    $('#pass').attr('data-tooltip', '비밀번호는 문자, 숫자 조합 6자리 이상 만들어주세요.').attr('data-position', 'bottom left');

    if(element == 'pass2_ico') {
        var passwordOrigin = document.getElementById('pass_input').value;
        var passwordConfirm = document.getElementById('pass2_input').value;

        if(passwordConfirm == '') {
            document.getElementById('pass2').setAttribute('class', 'ui right icon fluid input');
            document.getElementById('pass2_ico').setAttribute('class', 'icon');
            document.getElementById('pass2_input').setAttribute('class', 'input-orange');
        }
        else if(passwordOrigin === passwordConfirm) {
            document.getElementById('pass2').setAttribute('class', 'ui left icon fluid input confirm');
            document.getElementById('pass2_ico').setAttribute('class', 'check circle icon');
        }
        else {
            document.getElementById('pass2').setAttribute('class', 'ui left icon fluid input error');
            document.getElementById('pass2_ico').setAttribute('class', 'times circle icon');
            document.getElementById('pass2_input').removeAttribute('class');
        }
    }
}

function inputOnFocus(arg) {
    if(arg == 1) {
        $('#id').removeAttr('data-tooltip').removeAttr('data-position');
        $('#pass').attr('data-tooltip', '비밀번호는 문자, 숫자 조합 6자리 이상 만들어주세요.').attr('data-position', 'bottom left');
    }
    else if(arg == 0) {
        $('#pass').removeAttr('data-tooltip').removeAttr('data-position');
        $('#id').attr('data-tooltip', '아이디는 문자 포함 숫자 조합으로 입력하세요.').attr('data-position', 'bottom left');
    }
    else {
        $('#id').removeAttr('data-tooltip').removeAttr('data-position');
        $('#pass').removeAttr('data-tooltip').removeAttr('data-position');
    }
}

function checkFinal() {
    var passwordOrigin = document.getElementById('pass_input').value;
    var passwordConfirm = document.getElementById('pass2_input').value;

    var regPw = new RegExp("^(?=.*?[a-z])(?=.*?[0-9]).{6,}$");

    if(regPw.test(passwordOrigin) && passwordOrigin === passwordConfirm) {
        passOk = true;
    }
}

function requestSignup() {
    checkFinal();

    if(idOk && passOk && emailOk) {
        document.formsignup.submit();
    }
    else {
        prev(document.getElementById('next_page'),document.getElementById('page'));
        if(!idOk) {
            $("html, body").animate({ scrollTop: $("#id_input").offset().top });
            $('#id_input').focus();
        }
        else if(!passOk) {
            $("html, body").animate({ scrollTop: $("#pass_input").offset().top });
            $('#pass_input').focus();
        }
        else if(!emailOk) {
            $("html, body").animate({ scrollTop: $("#email_input").offset().top });
            $('#email_input').focus();
        }
    }
}

var img = document.getElementById('profile_image');
var upload = document.getElementById('select_file');

img.style.backgroundImage = 'url(images/profile_default.png)';

upload.onchange = function (e) {
    e.preventDefault();

    var file = upload.files[0],
    reader = new FileReader();
    
    reader.onload = function (event) {
        img.style.backgroundImage = 'url('+event.target.result+')';

        if (img.width > 128) {
            img.width = 128;
        }
    };
    reader.readAsDataURL(file);
    return false;
};

function nextPage(next, prev) {
    checkFinal();
    if(idOk && passOk && emailOk) {
        next.style = 'visibility: visible; opacity: 1;';
        prev.style = 'visibility: hidden; opacity: 0;';
        $('.ui.segment').addClass('segment-width');
    }
    else {
        prevPage(document.getElementById('next_page'),document.getElementById('page'));
        if(!idOk) {
            $("html, body").animate({ scrollTop: $("#id_input").offset().top });
            $('#id_input').focus();
        }
        else if(!passOk) {
            $("html, body").animate({ scrollTop: $("#pass_input").offset().top });
            $('#pass_input').focus();
        }
        else if(!emailOk) {
            $("html, body").animate({ scrollTop: $("#email_input").offset().top });
            $('#email_input').focus();
        }
    }
}

function prevPage(next, prev) {
    next.style = 'visibility: hidden; opacity: 0;';
    prev.style = 'visibility: visible; opacity: 1;';
    $('.ui.segment').removeClass('segment-width');
}