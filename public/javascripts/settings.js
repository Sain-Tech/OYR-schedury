function changeMenu(x){
   
        var y=document.getElementsByClassName("active item")[0];

        y.className="item";
        x.className="active item";


        var d= y.id+"Des"; //active item
        var des=x.id+"Des"; //item
        if(d!=des){
            document.getElementById(des).style.display='block';
            document.getElementById(d).style.display='none';
        }
}

var checkCurr;
var checkNew;
var checkErrMsg = null;

function saveSettings() {
    if(checkNew != undefined) {
        if(checkCurr == undefined) {
            alert('잠시 후에 다시 시도해 주세요.')
            return;
        }
        else if(!checkCurr) {
            alert('현재 비밀번호를 확인해 주세요.');
            return;
        }
        else if(!checkNew) {
            alert(checkErrMsg);
            return;
        }
    }

    var xhr = new XMLHttpRequest();
        xhr.open('POST', '/saveSettings', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                document.location.replace('/');
            }
        }
        xhr.send(JSON.stringify({
            startDateOpt: $('#dropdown_startdate').dropdown('get value'),
            displayOpt: $('#dropdown_displaymonth').dropdown('get value'),
            changedPW: checkCurr && checkNew ? document.getElementById('input_passwd_changed').value : undefined
        }));
}

var timeout;

function checkPassword() {
    var passwordCurrent = document.getElementById('input_passwd_current').value;
    var passwordChanged = document.getElementById('input_passwd_changed').value;
    var passwordConfirm = document.getElementById('input_passwd_confirm').value;

    var regPw = new RegExp("^(?=.*?[a-z])(?=.*?[0-9]).{6,}$");

    if(passwordCurrent == '' && passwordChanged == '' && passwordConfirm == '') {
        checkCurr = undefined;
        checkNew = undefined;
    }
    else {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            var xhr = new XMLHttpRequest();
                xhr.open('POST', '/checkcurrpwd', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onreadystatechange = function() {
                    if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                        if(xhr.responseText == 'true') {
                            checkCurr = true;
                        }
                        else {
                            checkCurr = false;
                        }
                    }
                }
                xhr.send(JSON.stringify({
                    currpwd : passwordCurrent
                }));
        }, 100);
    
        if(passwordCurrent == passwordChanged) {
            checkNew = false;
            checkErrMsg = '현재와 다른 비밀번호를 입력해 주세요.';
        }
        else if(!regPw.test(passwordChanged) || passwordChanged != passwordConfirm) {
            checkNew = false;
            checkErrMsg = '입력을 확인해 주세요.';
        }
        else {
            checkNew = true;
        }

        if(checkNew) {
        }
    }
}

$('#적용').click(function() {
    $('.ui.longer.modal').modal('show');
    saveSettings();
});

$('.ui.selection.dropdown').dropdown();

