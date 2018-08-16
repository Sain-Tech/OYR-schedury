$(document).ready(function(){
    $('#newsched_button').click(function(){
        $('#left_cont').hide();
        $('#left_cont2').css('cssText','display : block !important');
    });

    $("#start_date").flatpickr({
        mode: 'range',
        enableTime: false,
        dateFormat: "Y.m.d"
    });
    // $("#end_date").flatpickr({
    //     enableTime: false,
    //     dateFormat: "Y.m.d"
    // });
    $('#time1').flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K"
    });
    $('#time2').flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K"
    });

    $('#all_day').click(function(){
        if($('#all_day').is(':checked')){
            $('#time1').css('display', 'none');
            $('#time2').css('display', 'none');
        } else {
            $('#time1').css('display', 'block');
            $('#time2').css('display', 'block');
        }
    });
    
    // var startDate = flatpickr('#start_date');
    // var endDate = flatpickr('#end_date');
    // var startTime = flatpickr('#time1');
    // var endTime = flatpickr('#time2');

    // flatpickr("#start_date", {
    //     enableTime: false,
    //     dateFormat: "Y.m.d",
    //     onChange: function(dateObj, dateStr) {
    //         //console.log(dateObj);
    //         //console.log(dateStr);
    //         endDate = flatpickr("#end_date", { minDate: dateStr, dateFormat: "Y.m.d", });
    //         // endDate.set('minDate', dateStr);
    //     }
    // });
    // flatpickr("#end_date", {
    //     enableTime: false,
    //     dateFormat: "Y.m.d",
    //     onChange: function(dateObj, dateStr) {
    //         startDate = flatpickr("#start_date", { maxDate: dateStr, dateFormat: "Y.m.d", });
    //     }
    // });

    // flatpickr('#time1', {
    //     enableTime: true,
    //     noCalendar: true,
    //     dateFormat: "h:i K",
    //     onChange: function(timeObj, timeStr) {
    //         console.log(timeStr);

    //     }
    // });

    $('.ui.accordion').accordion({
        selector: {
            trigger: '.title .icon'
            }
        });

    $('.ui.selection.dropdown').dropdown();

    $('#repeat_dropdown').dropdown();
    $('#repeat_details').hide();
    $('#repeat_details2').hide();

    $('#p_repeat').change(function(){
        var pRepeat=$('#p_repeat').val();
        $('#repeating_period').html(pRepeat+'마다');

        console.log(pRepeat);

        if(pRepeat == 0){
            $('#repeat_details').hide();
            $('#repeat_details2').hide();
        } else {
            $('#repeat_details').show();
            $('#repeat_details2').show();

            if(pRepeat == 1) {
                $('#repeating_period').html('일마다');
            } else if (pRepeat == 2) {
                $('#repeating_period').html('주마다');
            } else if (pRepeat ==3 ) {
                $('#repeating_period').html('개월마다');
            } else {
                $('#repeating_period').html('년마다');
            }
        }
    });

    // 채원이거 여기부터~~!~!
    $(".close").click(function(){
        $('.ui.longer.modal').modal('hide');
    });

    $("#end_repeat").flatpickr({
        enableTime: false,
        dateFormat: "Y.m.d"
    });
    
    var BackgroundClass = Quill.import('attributors/class/background');
    var ColorClass = Quill.import('attributors/class/color');
    var SizeStyle = Quill.import('attributors/style/size');
    Quill.register(BackgroundClass, true);
    Quill.register(ColorClass, true);
    Quill.register(SizeStyle, true);
    var quill = new Quill('#editor-container', {
        modules: {
            toolbar:'#toolbar-container' ,
            imageResize: {
                displaySize: true
              },
            imageDrop: true
        },
        placeholder: '오늘의 일기를 작성해주세요',
        theme: 'snow'  // or 'bubble'
      });
      

    $('#취소').click(function(){
        $('#new_diary_hnc').attr({'style':'display: block !important'});
        $('#write_diary').attr({'style':'display: none !important'});
    });

    $('#new_diary_content').click(function(){
        $('#new_diary_hnc').attr({'style':'display: none !important'});
        $('#write_diary').attr({'style':'display: block !important'});
    });
    
});

