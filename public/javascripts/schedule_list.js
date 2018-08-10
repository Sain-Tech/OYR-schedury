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
    var endDate = flatpickr('#end_date');
    var startTime = flatpickr('#time1');
    var endTime = flatpickr('#time2');

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

    // 채원이거 여기부터~~!~!
    $(".close").click(function(){
        $('.ui.longer.modal').modal('hide');
    });

    $("#end_repeat").flatpickr({
        enableTime: false,
        dateFormat: "Y.m.d"
    });
    
    
    var quill = new Quill('#editor-container', {
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
          ]
        },
        placeholder: 'Compose an epic...',
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

