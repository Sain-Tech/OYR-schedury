var BackgroundClass = Quill.import('attributors/class/background');
var ColorClass = Quill.import('attributors/class/color');
var SizeStyle = Quill.import('attributors/style/size');
Quill.register(BackgroundClass, true);
//Quill.register(ColorClass, true);
Quill.register(SizeStyle, true);
var quill = new Quill('#editor-container', {
    modules: {
        toolbar:'#toolbar-container' ,
        imageResize: {
            displaySize: true
            },
        //imageDrop: true
    },
    placeholder: '오늘의 일기를 작성해주세요',
    theme: 'snow'  // or 'bubble'
    });

    $(".ql-toolbar").find('button').attr('tabindex', '-1');
    $(".ql-toolbar").find('span').attr('tabindex', '-1');
    

var isFileSelectorOpened = false;
var isFileSelected = false;

var imgcnt;
imgcnt = 0;

console.log('this is test');

var toolbar = quill.getModule('toolbar');
toolbar.addHandler('image', imageHandler);

$(document).ready(function () {
    $('.ql-image').click(function () {
        console.log('file selector is opened.');
        isFileSelectorOpened = true;
    });

    $('.ql-editor').focusin(function () {
        if (isFileSelectorOpened) {
            isFileSelected = false;
            console.log('file selector is closed.');
            var timer = setInterval(function () {
                if (!isFileSelected) {
                    $('#select_file_' + imgcnt).remove();
                }
                clearInterval(timer);
            }, 500);
            isFileSelectorOpened = false;
        }
    });

    $('.ql-editor').bind("DOMSubtreeModified",function(){

        var timer = setInterval(function() {

            var flag = false;
    
            for(var i = 0; i < $('.input-img-uploader').length; i++) {
                if($('#imgId_'+i).length == 0) {
                    $('#select_file_'+i).remove();
                    flag = true;
                }
            }
    
            if(flag) {
                if(imgcnt > 0) {
                    $('#imgId_'+i).attr('id', 'imgId_'+(i-1));
                    $('#select_file_'+i).attr('id', 'select_file_'+(i-1)).attr('name', 'diaryimg'+(i-1));
                    imgcnt--;
                }
                flag = false;
            }
    
            clearInterval(timer);
        }, 250);
    });
});

function imageHandler() {
    //var value = prompt('What is the image URL');

    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.setAttribute('id', 'select_file_' + imgcnt);
    input.setAttribute('class', 'input-img-uploader');
    input.setAttribute('name', 'diaryimg' + imgcnt);

    $('#uploader_img_diary').append(input);

    $('#select_file_' + imgcnt).trigger('click');

    var upload = document.getElementById('select_file_' + imgcnt);

    var quillEx = this.quill;
    var value = 'nullstate';

    upload.onchange = function (e) {
        e.preventDefault();

        var file = upload.files[0],
            reader = new FileReader();

        reader.onload = function (event) {
            value = event.target.result;

            range = quillEx.getSelection();
            //console.log(value);
            quillEx.insertEmbed(range.index, 'image', value, Quill.sources.USER);

            console.log(imgcnt);

            for(var i = 0; i < $('.ql-editor>p>img').length; i++) {
                if($('.ql-editor>p>img').eq(i).attr('id') == undefined) {
                    $('.ql-editor>p>img').eq(i).attr('id', 'imgId_' + imgcnt).attr('class', 'ql-uploaded');
                }
            }

            //console.log($('.ql-editor>p>img').attr('id'));

            imgcnt++;
        };
        isFileSelected = true;
        reader.readAsDataURL(file);
        return false;
    };
}

function editorOK() {

    var imageFields = [];
    //make image file fields
    for (var i = 0; i < $('.input-img-uploader').length; i++) {
        console.log('counts');
        var imageObject = {};
        imageObject['name'] = 'diaryimg' + i;
        imageObject['maxCount'] = 1;
        imageFields.push(imageObject);
    }

    console.log(imageFields);

    var datas = $('.ql-editor').html().replace(/   /g, '&nbsp;&nbsp;');
    datas = datas.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    datas = datas.replace(/\'/g, '&#39;');
    datas = datas.replace(/\\/g, String.fromCharCode(92, 92));

    for (var i = 0; i < $('.ql-editor>p>img').filter($('.ql-uploaded')).length; i++) {
        var imgdt = $('.ql-editor>p>img').filter($('.ql-uploaded')).eq(i).attr('src');
        var imgid = $('.ql-editor>p>img').filter($('.ql-uploaded')).eq(i).attr('id');
        imgid = parseInt(imgid.substring(6, imgid.length));
        console.log(imgdt.substring(imgdt.length - 10, imgdt.length) + 's id is: ' + imgid);
        datas = datas.replace(imgdt, '<%= images[' + imgid + '] %>');
    }

    console.log(datas);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/actionUpload_contents', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            console.log(xhr.responseText);

            //document.actionUploadDiaryImg.submit();
            var idx = $(this).parent().parent().index();
            var frm = document.getElementById('uploader_img_diary');
            frm.method = 'POST';
            frm.enctype = 'multipart/form-data';
        
            var formData = new FormData(frm);
            $.ajax({
                type: "POST",
                url: '/actionUpload_images',
                data:formData,
                async:false,
                cache:false,
                contentType:false,
                processData:false,
                success: onSuccess,
                error: onError
            });  
        }
    }
    var selDate = $('#modal_content>#left_cont>#fakeDate').html();
    var selectWeather= $('.text>.ui.image.default_weather').attr('src');
    var selectEmotion= $('.text>.ui.image.default_emotion').attr('src');
    
    var title = $('#title').val();
    var today=new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var time=  h + ":" + m + ":" + s;

    xhr.send(JSON.stringify({
        date: selDate,
        emotion: selectWeather,
        weather: selectEmotion,
        valuetitle: title,
        value: datas,
        imagefile: imageFields,
        time:time
        //새변수(서버):원래여기 있던거(client)
    }));
}

function onSuccess(json, status) {
    onTest(json);
}

function onError() {
    alert('error!');
}