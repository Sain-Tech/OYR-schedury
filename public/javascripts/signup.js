function checkId() {
    var id = document.getElementById('id_input').value;
    var regId = new RegExp("^(?=.*?[a-z])(?=.*?[0-9]).{1,}$");

    if(id == '') {
        document.getElementById('id').setAttribute('class', 'ui left icon fluid input');
        document.getElementById('id_ico').setAttribute('class', 'user icon');
        document.getElementById('id_input').setAttribute('class', 'input-orange');
    }
    else if(regId.test(id)) {
        document.getElementById('id').setAttribute('class', 'ui left icon fluid input confirm');
        document.getElementById('id_ico').setAttribute('class', 'check circle icon');
    }
    else {
        document.getElementById('id').setAttribute('class', 'ui left icon fluid input error');
        document.getElementById('id_ico').setAttribute('class', 'times circle icon');
        document.getElementById('id_input').removeAttribute('class');
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
                        
                        var div = docuemnt.createElement('div');
                        
                    }
                }
            };
            
            xhttp.open("GET", "/checkid/"+id, true);
            xhttp.send();
        }
    }, 500);
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
                        document.getElementById('email').setAttribute('class', 'ui left icon fluid input error');
                        document.getElementById('email_ico').setAttribute('class', 'times circle icon');
                        document.getElementById('email_input').removeAttribute('class');
                    }
                }
            };
            
            xhttp.open("GET", "/checkemail/"+email, true);
            xhttp.send();
        }
    }, 500);
}

function checkPassword() {
    /* pass, pass2, pass_input, pass2_input, pass_ico, pass2_ico */
    var passwordOrigin = document.getElementById('pass_input').value;
    var passwordConfirm = document.getElementById('pass2_input').value;

    var regPw = new RegExp("^(?=.*?[a-z])(?=.*?[0-9]).{6,}$");

    if(passwordOrigin == '') {
        document.getElementById('pass').setAttribute('class', 'ui left icon fluid input');
        document.getElementById('pass_ico').setAttribute('class', 'key icon');
        document.getElementById('pass_input').setAttribute('class', 'input-orange');
    }
    else if(regPw.test(passwordOrigin) && document.activeElement === document.getElementById('pass_input')) {
        document.getElementById('pass').setAttribute('class', 'ui left icon fluid input confirm');
        document.getElementById('pass_ico').setAttribute('class', 'check circle icon');
    }
    else if(document.activeElement === document.getElementById('pass_input')) {
        document.getElementById('pass').setAttribute('class', 'ui left icon fluid input error');
        document.getElementById('pass_ico').setAttribute('class', 'times circle icon');
        document.getElementById('pass_input').removeAttribute('class');
    }

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

function checkEmail() {
    var email = document.getElementById('email_input').value;

    var regEmail = new RegExp("^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$");

    if(email == '') {
        document.getElementById('email').setAttribute('class', 'ui left icon fluid input');
        document.getElementById('email_ico').setAttribute('class', 'envelope icon');
        document.getElementById('email_input').setAttribute('class', 'input-orange');
    }
    else if(regEmail.test(email)) {
        document.getElementById('email').setAttribute('class', 'ui left icon fluid input confirm');
        document.getElementById('email_ico').setAttribute('class', 'check circle icon');
    }
    else {
        document.getElementById('email').setAttribute('class', 'ui left icon fluid input error');
        document.getElementById('email_ico').setAttribute('class', 'times circle icon');
        document.getElementById('email_input').removeAttribute('class');
    }
}

function checkFocus(element, icon) {
    document.getElementById(element).setAttribute('class', icon + ' icon');

    if(element == 'id_ico') {
        $('#id').attr('data-tooltip', '아이디는 문자 포함 숫자 조합으로 입력하세요.').attr('data-position', 'bottom left');
    }

    else if(element == 'pass_ico') {
        $('#pass').attr('data-tooltip', '비밀번호는 문자, 숫자 조합 6자리 이상 만들어주세요.').attr('data-position', 'bottom left');
    }

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