$(document).ready(function(){
    $('#newsched_button').click(function(){
        $('#left_cont').hide();
        $('#left_cont2').css('cssText','display : block !important');
    });

    $("#start_date").flatpickr({
        enableTime: false,
        dateFormat: "Y-m-d"
    });
    $("#end_date").flatpickr({
        enableTime: false,
        dateFormat: "Y-m-d"
    });
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
    
    var startDate = flatpickr('#start_date');
    var endDate = flatpickr('#end_date');

    startDate.set("onChange", function(d){
        console.log(d);
        endDate.set("minDate", d);
    });
    endDate.set("onChange", function(d){
        startDate.set("maxDate", d);
    });

    // var check_in = flatpickr("#check_in_date", { minDate: new Date() });
    // var check_out = flatpickr("#check_out_date", { minDate: new Date() });

    // check_in.set("onChange", function(d) {
    //     check_out.set("minDate", d.fp_incr(1)); //increment by one day
    // });
    // check_out.set("onChange", function(d) {
    //     check_in.set("maxDate", d);
    // });

    // 채원이거 여기부터~~!~!
    $(".close").click(function(){
        $('.ui.longer.modal').modal('hide');
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

