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

    // $('.ui.accordion').accordion({
    //     selector: {
    //         trigger: '.title .icon'
    //         }
    //     });

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
    $("#end_repeat").flatpickr({
        enableTime: false,
        dateFormat: "Y.m.d"
    });
});

    // 채원이거 여기부터~~!~!