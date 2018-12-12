var today = new Date();//오늘 날짜//내 컴퓨터 로컬을 기준으로 today에 Date 객체를 넣어줌
var date = new Date();//today의 Date를 세어주는 역할
var click_date=$('#modal_content>#left_cont>#fake_date').html();
function prevCalendar(arg) {//이전 달
    // 이전 달을 today에 값을 저장하고 달력에 today를 넣어줌
    //today.getFullYear() 현재 년도//today.getMonth() 월  //today.getDate() 일 
    //getMonth()는 현재 달을 받아 오므로 이전달을 출력하려면 -1을 해줘야함
    today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    buildCalendar(arg); //달력 cell 만들어 출력
    var tbCalendar = document.getElementById("calendar_body");
    tbCalendar.deleteRow(0);
    tbCalendar.deleteRow(0);

    doFillFirstCnt();
}

function nextCalendar(arg) {//다음 달
    // 다음 달을 today에 값을 저장하고 달력에 today 넣어줌
    //today.getFullYear() 현재 년도//today.getMonth() 월  //today.getDate() 일 
    //getMonth()는 현재 달을 받아 오므로 다음달을 출력하려면 +1을 해줘야함
    today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    buildCalendar(arg);//달력 cell 만들어 출력
    var tbCalendar = document.getElementById("calendar_body");
    tbCalendar.deleteRow(0);
    tbCalendar.deleteRow(0);

    doFillFirstCnt();
}

function changeSearchDateSelf(arg) {
    var year = $('#search_year').val();
    var month = $('#search_month').val();
    var day = $('#search_day').val();
   
    var lastDate = new Date(year, month, 0);

    if(arg == 1) {
        if(day > lastDate.getDate()) {
            $('#search_day').val(lastDate.getDate());
        }
        if(month > 12) {
            $('#search_year').val(parseInt(year) + 1);
            $('#search_month').val(1);
        }
        else if(month < 1) {
            $('#search_year').val(parseInt(year) - 1);
            $('#search_month').val(12);
        }
    }

    else if(arg == 2) {
        if(day > lastDate.getDate()) {
            $('#search_month').val(parseInt(month) + 1);
            $('#search_day').val(1);

            if(parseInt(month) + 1 > 12) {
                $('#search_year').val(parseInt(year) + 1);
                $('#search_month').val(1);
            }
        }
    
        else if(day < 1) {
            $('#search_month').val(parseInt(month) - 1);
            $('#search_day').val(lastDate.getDate());

            if(parseInt(month) - 1 < 1) {
                $('#search_year').val(parseInt(year) - 1);
                $('#search_month').val(12);
            }
        }
    }

    // if(day > lastDate.getDate()) {
    //     console.log("over day");
    //     $('#search_month').val((parseInt(month) + 1) + '');
    //     $('#search_day').val('1');
    // }

    // else if(day < 1) {
    //     console.log("under day");
    //     $('#search_month').val((parseInt(month) - 1) + '');
    // }

    // if(month > 12) {
    //     console.log("over month");
    //     $('#search_year').val((parseInt(year) + 1) + '');
    //     $('#search_month').val('1');
    // }

    // else if(month < 1) {
    //     console.log("under month");
    //     $('#search_year').val((parseInt(year) - 1) + '');
    //     $('#search_month').val('12');
    // }
}

function getDateForSearch() {
    $('#search_year').attr('value', new Date().getFullYear());
    $('#search_month').attr('value', new Date().getMonth() + 1);
    $('#search_day').attr('value', new Date().getDate());
}

function buildCalendar(arg){//현재 달 달력 만들기
    startDate = arg;

    var doMonth = new Date(today.getFullYear(),today.getMonth(),1);
    //이번 달의 첫째 날,
    //new를 쓰는 이유 : new를 쓰면 이번달의 로컬 월을 정확하게 받아온다.     
    //new를 쓰지 않았을때 이번달을 받아오려면 +1을 해줘야한다. 
    //왜냐면 getMonth()는 0~11을 반환하기 때문
    var lastDate = new Date(today.getFullYear(),today.getMonth()+1,0);
    //이번 달의 마지막 날
    //new를 써주면 정확한 월을 가져옴, getMonth()+1을 해주면 다음달로 넘어가는데
    //day를 1부터 시작하는게 아니라 0부터 시작하기 때문에 
    //대로 된 다음달 시작일(1일)은 못가져오고 1 전인 0, 즉 전달 마지막일 을 가져오게 된다
    var tbCalendarHeader = document.getElementById("calendar_header");
    var tbCalendar = document.getElementById("calendar_body");
    //날짜를 찍을 테이블 변수 만듬, 일 까지 다 찍힘
    var tbCalendarYM = document.getElementById("tbCalendarYM");
    //테이블에 정확한 날짜 찍는 변수
    //innerHTML : js 언어를 HTML의 권장 표준 언어로 바꾼다
    //new를 찍지 않아서 month는 +1을 더해줘야 한다. 
    tbCalendarYM.innerHTML = `<span><h3>` + (today.getMonth() + 1) + `</h3></span>` + `<div>` + today.getFullYear() + `</div>`;

    if (arg == 0) {
        tbCalendarHeader.innerHTML = `
            <tr align="center">
                <th>토</th>
                <th>일</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
            </tr>
        `;
    }
    else if (arg == 1) {
        tbCalendarHeader.innerHTML = `
            <tr align="center">
                <th>일</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
                <th>토</th>
            </tr>
        `;
    }
    else if (arg == 2) {
        tbCalendarHeader.innerHTML = `
            <tr align="center">
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
                <th>토</th>
                <th>일</th>
            </tr>
        `;
    }

    /*while은 이번달이 끝나면 다음달로 넘겨주는 역할*/
    while (tbCalendar.rows.length > 2) {
        //열을 지워줌
        //기본 열 크기는 body 부분에서 2로 고정되어 있다.
        tbCalendar.deleteRow(tbCalendar.rows.length-1);
        //테이블의 tr 갯수 만큼의 열 묶음은 -1칸 해줘야지 
        //30일 이후로 담을달에 순서대로 열이 계속 이어진다.
    }

    var row = null;
    row = tbCalendar.insertRow();
    //테이블에 새로운 열 삽입//즉, 초기화
    var cnt = 0;// count, 셀의 갯수를 세어주는 역할

    // 1일이 시작되는 칸을 맞추어 줌
    for (i=0; i < getFirstDayPosition(doMonth.getDay(), arg); i++) {
        /*이번달의 day만큼 돌림*/
        cell = row.insertCell();//열 한칸한칸 계속 만들어주는 역할
        cnt = cnt + 1;//열의 갯수를 계속 다음으로 위치하게 해주는 역할
    }

    /*달력 출력*/
    for (i=1; i<=lastDate.getDate(); i++) { 
        //1일부터 마지막 일까지 돌림
        cell = row.insertCell();//열 한칸한칸 계속 만들어주는 역할
        cell.innerHTML = i;//셀을 1부터 마지막 day까지 HTML 문법에 넣어줌
        cnt = cnt + 1;//열의 갯수를 계속 다음으로 위치하게 해주는 역할
        cell.setAttribute('id', 'c_'+today.getFullYear()+'_'+pad((today.getMonth()+1), 2)+'_'+pad(i, 2));
        cell.setAttribute('onclick', 'calendarDayOnClick('+today.getFullYear()+', '+(today.getMonth()+1)+', '+i+')');

        /* 토요일 시작 */
        if(arg == 0) {
            if (cnt % 7 == 1) {/*토요일 계산*/
                //1주일이 7일 이므로 토요일 구하기
                //월화수목금토일을 7로 나눴을때 나머지가 1이면 cnt가 1번째에 위치함을 의미한다
                cell.innerHTML = "<font color=#2599DF>" + i
                //1번째의 cell에만 색칠
            }

            if (cnt % 7 == 2) {/*일요일 계산*/
                //1주일이 7일 이므로 일요일 구하기
                //월화수목금토일을 7로 나눴을때 나머지가 2이면 cnt가 2번째에 위치함을 의미한다
                cell.innerHTML = "<font color=#E0387D>" + i
                //1번째의 cell에만 색칠
            }

            if (cnt % 7 == 0){/*일요일 계산*/
                row = tbCalendar.insertRow();
                //금요일 다음에 올 셀을 추가
            }
        }

        /* 일요일 시작 */
        else if(arg == 1) {
            if (cnt % 7 == 1) {/*일요일 계산*/
                //1주일이 7일 이므로 일요일 구하기
                //월화수목금토일을 7로 나눴을때 나머지가 1이면 cnt가 1번째에 위치함을 의미한다
                cell.innerHTML = "<font color=#E0387D>" + i
                //1번째의 cell에만 색칠
            }

            if (cnt % 7 == 0){/* 1주일이 7일 이므로 토요일 구하기*/
                //월화수목금토일을 7로 나눴을때 나머지가 0이면 cnt가 7번째에 위치함을 의미한다
                cell.innerHTML = "<font color=#2599DF>" + i
                //7번째의 cell에만 색칠
                row = tbCalendar.insertRow();
                //토요일 다음에 올 셀을 추가
            }
        }

        /* 월요일 시작 */
        else if (arg == 2) {
            if (cnt % 7 == 6) {/*토요일 계산*/
                //1주일이 7일 이므로 토요일 구하기
                //월화수목금토일을 6로 나눴을때 나머지가 1이면 cnt가 6번째에 위치함을 의미한다
                cell.innerHTML = "<font color=#2599DF>" + i
                //1번째의 cell에만 색칠
            }

            if (cnt % 7 == 0){/* 1주일이 7일 이므로 일요일 구하기*/
                //월화수목금토일을 7로 나눴을때 나머지가 0이면 cnt가 7번째에 위치함을 의미한다
                cell.innerHTML = "<font color=#E0387D>" + i
                //7번째의 cell에만 색칠
                row = tbCalendar.insertRow();
                //일요일 다음에 올 셀을 추가
            }
        }

        /*오늘의 날짜에 노란색 칠하기*/
        if (today.getFullYear() == date.getFullYear()
            && today.getMonth() == date.getMonth()
            && i == date.getDate()) {
            //달력에 있는 년,달과 내 컴퓨터의 로컬 년,달이 같고, 일이 오늘의 일과 같으면
            cell.bgColor = "#FDC23E";//셀의 배경색을 노랑으로 
        }
    }

    var lastFillCnt = 7 - (cnt % 7);
    var firstFillCnt = getFirstDayPosition(doMonth.getDay(), arg);

    firstFillCnt2 = firstFillCnt;

    for(var i = 0; i < lastFillCnt; i++) {
        cell = row.insertCell();//열 한칸한칸 계속 만들어주는 역할
        cell.innerHTML = "<font color=#bdbdbd>" + (i + 1);
        cell.setAttribute('id', 'c_'+today.getFullYear()+'_'+pad((today.getMonth()+2), 2)+'_'+pad((i+1), 2));
        cell.setAttribute('onclick', 'calendarDayOnClick('+today.getFullYear()+', '+(today.getMonth()+2)+', '+(i+1)+')');
    }

    doFillFirstCnt();
}

var firstFillCnt2;

function doFillFirstCnt() {
    var tbCalendar = document.getElementById("calendar_body");
    var lastDate = new Date(today.getFullYear(),today.getMonth(),0);

    for(var i = 0; i < firstFillCnt2; i++) {
        var x = tbCalendar.rows[0].cells;
        x[i].innerHTML = "<font color=#bdbdbd>" + (lastDate.getDate() - ((firstFillCnt2 - 1) - i));
        x[i].setAttribute('id', 'c_'+today.getFullYear()+'_'+pad(today.getMonth(), 2)+'_'+pad((lastDate.getDate() - ((firstFillCnt2 - 1) - i)), 2));
        x[i].setAttribute('onclick', 'calendarDayOnClick('+today.getFullYear()+', '+today.getMonth()+', '+(lastDate.getDate() - ((firstFillCnt2 - 1) - i))+')');
    }
}

function calendarNavToggle(arg) {
    if(arg == 0) {
        $('.calendar-navi-back').css({display:'block'});
        $('.calendar-navi-div').css({display:'block'});
    }
    else if(arg == 1) {
        $('.calendar-navi-back').css({display:'none'});
        $('.calendar-navi-div').css({display:'none'});
    }
}

var startDate = 0;

$('#modal_content>#left_cont').append(`<div id="fakeDate" style="width:0; height:0; display:none"></div>`);

async function viewSched(schedid) {
    console.log(schedid);
    //var index = parseInt(schedid.substring())
    var datas = await schedDataWithId(parseInt(schedid));
    datas = datas[0];
    console.log(datas);

    //ui 작업
    $('#submit-form').hide();
    $('#cancel_newsched').before('<input class="ui button yellow nanumsquare" id="modif_sched" type="button" value="수정" onclick="modifySched(1, '+schedid+')">')
    .before('<input class="ui button nanumsquare" id="delete_sched" type="button" value="삭제" onclick="deleteSched('+schedid+')">');

    $('#left_cont').hide();
    $('#left_cont2').css('cssText','display : block !important');
    var fdate = $('#fakeDate').html();
    var year = fdate.substring(0, 4);
    var month = fdate.substring(5, 7);
    var day = fdate.substring(8, 10);

    $('#input_sched_name').val(datas.scheduleName);
    $('#start_date').val(datas.startDate == datas.endDate ? datas.startDate.substring(0, 10) : datas.startDate.substring(0, 10) + ' to ' + datas.endDate.substring(0, 10));
    
    if(datas.allDay == 1) {
        $('#all_day').prop('checked', datas.allDay == 1 ? true : false);
        $('#time1').css('display', 'none');
        $('#time2').css('display', 'none');
    }
    else {
        $('#time1').val(datas.startTime.substring(0, 2) + ':' +datas.startTime.substring(3, 5) + (parseInt(datas.startTime.substring(0, 2)) < 12 ? 'AM':'PM'));
        $('#time2').val(datas.endTime.substring(0, 2) + ':' +datas.endTime.substring(3, 5) + (parseInt(datas.endTime.substring(0, 2)) < 12 ? 'AM':'PM'));
        $('#time1').css('display', 'block');
        $('#time2').css('display', 'block');
    }

    $('#important_schedule').prop('checked', datas.isImportant == 1 ? true : false);
    $('#selected_schedicon').attr('src', (datas.icoImageDir == 'null' || datas.icoImageDir == undefined)? '/images/043-calendar.png' : datas.icoImageDir);

    if(datas.repeatOrNot == 1) {
        $('#repeat_dropdown').dropdown('set selected', datas.periodOfRepeat);
        $('#number_of_repeat').val(datas.numRepeat);
        $('#end_repeat').val(datas.endRepeatDate.substring(0, 10));
    }

    //데이터베이스 일정 테이블에 장소 항목 필요함!!!
}

function modifySched(isMod, idx) {
    if(confirm('수정하시겠습니까?')) {
        var xhr = new XMLHttpRequest();
            xhr.open('POST', '/new_schedule', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function() {
                if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                    console.log("right!");
                    $('#left_cont2').hide();
                    $('#left_cont').css('cssText','display : block !important');
                    var fdate = $('#fakeDate').html();
                    updateSchedules(fdate);
                    dateDecorator();
                    initSchedForm();
                }
            }

            xhr.send(JSON.stringify({
                nameSched: $('#input_sched_name').val(), //일정 이름
                dateSched: $('#start_date').val(), //날짜
                startTime: $('#time1').val(), //(종일 아닐 시) 시작 시간
                endTime: $('#time2').val(), //종일 아닐 시 종료 시간
                allDay: ($('#all_day').prop('checked') == true ? 'on' : ''), //종일 [0 , 1]
                repeat: $('#p_repeat').val(), //반복 단위(없음, 일, 주, 월, 년) [0 , 1 , 2 , 3 , 4]
                numberPeriod: $('#number_of_repeat').val(), //반복 값
                endRepeat: $('#end_repeat').val(), //반복 종료 날짜
                place: $('#loc_sched').val(),
                important: ($('#important_schedule').prop('checked') == true ? 'on' : ''), //중요 [0 , 1]
                iconImage: new_src, //일정 이미지 경로
                isMod: isMod,
                idx: idx
            }));
    }
    else;
}

function deleteSched(idx) {
    if(confirm('정말로 이 일정을 삭제하시겠습니까?')) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/delete_schedule', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                console.log('delete complete!');
                $('#left_cont2').hide();
                $('#left_cont').css('cssText','display : block !important');
                var fdate = $('#fakeDate').html();
                var year = parseInt(fdate.substring(0, 4));
                var month = parseInt(fdate.substring(5, 7));
                var day = parseInt(fdate.substring(8, 10));
                updateSchedules(fdate);
                dateDecorator();
                initSchedForm();
            }
        }

        xhr.send(JSON.stringify({
            idx: idx
        }));
    }
    else;
}

async function updateSchedules(currentDate) {
    $('#sched_table>tbody').html(`<div class="ui active inverted dimmer">
    <div class="ui text loader">Loading</div>
  </div>
`);

    var scheduleDatas = await getScheduleDatas(currentDate, currentDate, false);
    console.log(scheduleDatas);
    var html = ``;
    for(var i = 0; i < scheduleDatas.length; i++) {
       html += `<tr id=`+scheduleDatas[i].index+` onclick='viewSched(this.id)'>
                    <td class="schedule-time">`+scheduleDatas[i].startTime.substring(0, 5)+`
                    <br> ~<br>`+scheduleDatas[i].endTime.substring(0, 5)+`</td>
                    <td>`+scheduleDatas[i].scheduleName+` <br></td>
                    <td>`+(scheduleDatas[i].icoImageDir=='null'?"":"<img src="+scheduleDatas[i].icoImageDir+" height=24px>")+`</td>
                </tr>`;
    }

    $('#sched_table>tbody').html(html);
}

function checkDiaryDateDiff(wantdate) {
    var fdate = $('#fakeDate').html();

    if(fdate === undefined || fdate === null || fdate === '') {
        fdate = wantdate;
    }

    var now = new Date();
    var cDate = new Date(fdate);
    now.setHours(00);
    now.setMinutes(00);
    now.setSeconds(00);
    now.setMilliseconds(00);
    cDate.setHours(00);
    cDate.setMinutes(00);
    cDate.setSeconds(00);
    cDate.setMilliseconds(00);

    var diff = (cDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    console.log(diff);

    return diff;
}

async function updateDiary(currentDate) {
    $("#mod_right_content>#diary_hnc").html('')
    $('#diary_hnc').attr({'style':''});

    $('#new_diary_hnc').attr({'style':'display: block !important'});
    $('#write_diary').attr({'style':'display: none !important'});

    $("#mod_right_content").append(`<div class="ui active inverted dimmer">
    <div class="ui text loader">Loading</div>
  </div>
`)

    var diff = checkDiaryDateDiff(currentDate);

    var diaryDatas = await getDiaryDatas(currentDate, currentDate, 1);
    console.log(diaryDatas[0]);

    if(diaryDatas.length > 0)
        renderDiary(diaryDatas[0]);
    else {
        if(diff < 0) {
            $('#diary_hnc').attr({'style':'display: block !important'});
            $('#new_diary_hnc').attr({'style':'display: none !important'});
            $('#write_diary').attr({'style':'display: none !important'});

            $('#diary_hnc').html(
                `<h3 style="padding: 52px;
                margin-left: -26px;
                line-height: 1.5em;
                text-align: center;">날짜가 지나서 작성하실 수 없습니다..<br>하루에 하나씩, 일기를 쓰는 습관을 길러보도록 해요..!</h3>`
            );
        }
        else if(diff > 0) {
            $('#diary_hnc').attr({'style':'display: block !important'});
            $('#new_diary_hnc').attr({'style':'display: none !important'});
            $('#write_diary').attr({'style':'display: none !important'});

            $('#diary_hnc').html(
                `<h3 style="padding: 52px;
                margin-left: -26px;
                line-height: 1.5em;
                text-align: center;">아직은 작성이 불가합니다..!</h3>`
            );
        }
    }

    $("#mod_right_content>.ui.active.inverted.dimmer").remove();
}

async function calendarDayOnClick(year, month, day) {
    //alert('Your choice: '+year+'년 '+month+'월 '+day+'일 ');
    today = new Date(year, month-1, day);

    $('.ui.longer.modal').modal('show');
    $('#modal_content>#left_cont>#fakeDate').html(+year+`-`+pad(month, 2)+`-`+pad(day, 2));
    $('#modal_header_diary').html(month+'월 '+day+'일 '+getDayNameOfWeek(today.getDay())+'요일');
    $('#modal_header_diary2').html(month+'월 '+day+'일 '+getDayNameOfWeek(today.getDay())+'요일');

    var currentDate = pad(year, 4)+'-'+pad(month, 2)+'-'+pad(day, 2);
    updateSchedules(currentDate);
    updateDiary(currentDate);
}

function cvIdtoDate(ids) {
    var mYear = ids.substring(2, 6);
    var mMonth = ids.substring(7, 9);
    var mDate = ids.substring(10, 12);

    return mYear+'-'+mMonth+'-'+mDate;
}

function cvDatetoId(datas) {
    return 'c_'+datas.replace(/-/g, '_');
}

function cvRawDatetoId(rawDatas) {
    return cvDatetoId(pad(rawDatas.getFullYear(), 4)+'-'+pad(rawDatas.getMonth()+1, 2)+'-'+pad(rawDatas.getDate(), 2));
}

function emptyCalendar() {
    $('#calendar_body').html('');
}

async function dateDecorator(appSettings) {
    toastr.options = {
        closeButton: false,
        progressBar: false,
        positionClass: "toast-bottom-right",
        preventOpenDuplicates: true,
        preventDuplicates: true,
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut',
        timeOut: 3000
      };
      toastr.info('일정 동기화 중...', '알림');

    $('.calendar-this>#view_calendar').append(`<div class="ui active inverted dimmer">
    <div class="ui text loader">Loading</div>
  </div>
`);

    $('td>').remove('div');

    var scheduleDatas = await getScheduleDatas('def', 'def', true); //메인페이지에서 스케쥴 불러오기

    if(scheduleDatas.length > 1) {
        scheduleDatas.sort(function(a, b) {
            return a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0;
        });
    }

    console.log(scheduleDatas);
    console.error("don't bother me anymore!!")

    for(var i = 0; i < scheduleDatas.length; i++) {
        var currentStartDate = scheduleDatas[i].startDate.substring(0, 10);
        var currentEndDate = scheduleDatas[i].endDate.substring(0, 10);

        var start = new Date(currentStartDate);
        var end = new Date(currentEndDate);
        var loop = new Date(start);

        var cnt = 0;
        console.log(scheduleDatas[i].index+' 인덱스 일정에 대한 내용을 등록하는 위치 입니다.');
        var divcount = 0;
        while(loop <= end) {
            
            if(cnt > 0) {
                //다음거 출력할 때 처음날짜 셀에 있는 div 개수를 알아내서 다음거 출력시 div 위치를 잡아준다.
                if(cnt >= 1) {
                    var tmpdate = new Date(loop);
                    tmpdate.setDate(tmpdate.getDate() - 1);
                    //console.log(tmpdate);
                
                    divcount = $('#view_calendar>tbody>tr>#'+cvRawDatetoId(tmpdate)+'>div').length - $('#view_calendar>tbody>tr>#'+cvRawDatetoId(loop)+'>div').length;
                    console.log(divcount);
                }
                if(getFirstDayPosition(loop.getDay(), startDate) != 0) {
                    for(var j = 0; j < divcount-1; j++) {
                        $('#view_calendar>tbody>tr>#'+cvRawDatetoId(loop)).append(`<div class='deco-schedule-empty'></div>`);
                    }
                    $('#view_calendar>tbody>tr>#'+cvRawDatetoId(loop)).append(`<div class='schdId`+i+`'><div class='deco-schedule-name continuous'></div></div>`);
                }
                else{
                    divcount = 0;
                    $('#view_calendar>tbody>tr>#'+cvRawDatetoId(loop)).append(`<div class='schdId`+i+`'><div class='deco-schedule-name'><p>`+scheduleDatas[i].scheduleName+`</p></div></div>`);
                }   
            }
            else if(cnt < 1) {
                $('#view_calendar>tbody>tr>#'+cvRawDatetoId(loop)).append(`<div class='schdId`+i+`'><div class='deco-schedule-name startend'><p>`+scheduleDatas[i].scheduleName+`</p></div></div>`);
            }

            if(loop + '' == end + '') {
                $('#view_calendar>tbody>tr>#'+cvRawDatetoId(end)+'>.schdId'+i+'>.deco-schedule-name.continuous').addClass('end');
            }

            var newDate = loop.setDate(loop.getDate() + 1);
            loop = new Date(newDate);
            cnt++;
        }

        if(scheduleDatas[i].isImportant) {
            $('.schdId'+i+'>div').addClass('important');
        }

        if(scheduleDatas[i].allDay) {
            $('.schdId'+i+'>.startend').addClass('full');
        }

        console.log(i+'인덱스 등록 끝!!');
    }

    if(appSettings == 1) {
        var gCalDatas = await getGoogleCalDatas('def', 'def', true);
        gCalDatas = gCalDatas.items;

        console.log('before sort: ');
        console.log(gCalDatas[5].summary);

        if(gCalDatas.length > 1) {
            gCalDatas.sort(function(a, b) {
                return a.start.dateTime != undefined ? (a.start.dateTime < b.start.dateTime ? -1 : a.start.dateTime > b.start.dateTime ? 1 : 0) : (a.start.date < b.start.date ? -1 : a.start.date > b.start.date ? 1 : 0);
            });
        }
        console.log('after sort: ');
        console.log(gCalDatas[5].summary);

        for(var i = 0; i < gCalDatas.length; i++) {
            console.log(gCalDatas[i].start.dateTime);
            if(gCalDatas[i].start.dateTime == undefined) {
                var currentStartDate = gCalDatas[i].start.date.substring(0, 10);
            }
            else {
                var currentStartDate = gCalDatas[i].start.dateTime.substring(0, 10);
            }

            if(gCalDatas[i].end.dateTime == undefined) {
                var currentEndDate = gCalDatas[i].end.date.substring(0, 10);
                var tmp = new Date(currentEndDate);
                var newDate = tmp.setDate(tmp.getDate() - 1);
                tmp = new Date(newDate);
                currentEndDate = pad(tmp.getFullYear(), 4)+'-'+pad(tmp.getMonth()+1, 2)+'-'+pad(tmp.getDate(), 2);
            }
            else {
                var currentEndDate = gCalDatas[i].end.dateTime.substring(0, 10);
            }

            var start = new Date(currentStartDate);
            var end = new Date(currentEndDate);
            var loop = new Date(start);

            var cnt = 0;
            console.log(gCalDatas[i].id+' 인덱스 일정에 대한 내용을 등록하는 위치 입니다.');
            var divcount = 0;
            while(loop <= end) {
                
                if(cnt > 0) {
                    //다음거 출력할 때 처음날짜 셀에 있는 div 개수를 알아내서 다음거 출력시 div 위치를 잡아준다.
                    if(cnt >= 1) {
                        var tmpdate = new Date(loop);
                        tmpdate.setDate(tmpdate.getDate() - 1);
                        //console.log(tmpdate);
                    
                        divcount = $('#view_calendar>tbody>tr>#'+cvRawDatetoId(tmpdate)+'>div').length - $('#view_calendar>tbody>tr>#'+cvRawDatetoId(loop)+'>div').length;
                        console.log(divcount);
                    }
                    if(getFirstDayPosition(loop.getDay(), startDate) != 0) {
                        for(var j = 0; j < divcount-1; j++) {
                            $('#view_calendar>tbody>tr>#'+cvRawDatetoId(loop)).append(`<div class='deco-schedule-empty'></div>`);
                        }
                        $('#view_calendar>tbody>tr>#'+cvRawDatetoId(loop)).append(`<div class='schdId`+i+`'><div class='deco-schedule-name continuous gcal'></div></div>`);
                    }
                    else{
                        divcount = 0;
                        $('#view_calendar>tbody>tr>#'+cvRawDatetoId(loop)).append(`<div class='schdId`+i+`'><div class='deco-schedule-name gcal'><p>`+(gCalDatas[i].summary==undefined?'제목없음':gCalDatas[i].summary)+`</p></div></div>`);
                    }   
                }
                else if(cnt < 1) {
                    $('#view_calendar>tbody>tr>#'+cvRawDatetoId(loop)).append(`<div class='schdId`+i+`'><div class='deco-schedule-name startend gcal'><p>`+(gCalDatas[i].summary==undefined?'제목없음':gCalDatas[i].summary)+`</p></div></div>`);
                }

                if(loop + '' == end + '') {
                    $('#view_calendar>tbody>tr>#'+cvRawDatetoId(end)+'>.schdId'+i+'>.deco-schedule-name.continuous').addClass('end');
                }

                var newDate = loop.setDate(loop.getDate() + 1);
                loop = new Date(newDate);
                cnt++;
            }

            console.log(i+'인덱스 등록 끝!!');
        }
    }

    for(var a = 0; a < $('#view_calendar>tbody>tr>td').length; a++) {
        var emptyDivs = $('#view_calendar>tbody>tr>td').eq(a);
        emptyDivs = emptyDivs.children().filter('.deco-schedule-empty').length;
        console.log('androidandroid '+ emptyDivs);
    }


    $('.calendar-this>#view_calendar>.ui.active.inverted.dimmer').remove();
    toastr.clear();
    toastr.options = {
        closeButton: false,
        progressBar: false,
        positionClass: "toast-bottom-right",
        preventOpenDuplicates: true,
        preventDuplicates: true,
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut',
        timeOut: 3000
      };
      toastr.success('동기화 완료!', '알림');
}

function getScheduleDatas(start, end, arg) {
    return new Promise(function(resolve, reject) {
        var sStartDate;
        var sEndDate;

        if(start == 'def' || end == 'def') {
            sStartDate = '1970-01-01';
            sEndDate = '9999-12-31';
            arg = true;
        }
        else {
            sStartDate = start;
            sEndDate = end;
        }
    
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/getschedules', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                ///console.log(JSON.parse(xhr.responseText));
                if(xhr.responseText != undefined) {
                    resolve(JSON.parse(xhr.responseText));
                }
                else {
                    reject(Error('error'));
                }
            }
        }
    
        xhr.send(JSON.stringify({
            mStartDate: sStartDate,
            mEndDate: sEndDate,
            mBoolPeriod: arg
        }));
    });
}

function schedDataWithId(index) {
    return new Promise(function(resolve, reject) {
        // if(start == 'def' || end == 'def') {
        //     sStartDate = '1970-01-01';
        //     sEndDate = '9999-12-31';
        //     arg = true;
        // }
        // else {
        //     sStartDate = start;
        //     sEndDate = end;
        // }
    
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/getschedules', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                ///console.log(JSON.parse(xhr.responseText));
                if(xhr.responseText != undefined) {
                    resolve(JSON.parse(xhr.responseText));
                }
                else {
                    reject(Error('error'));
                }
            }
        }
    
        xhr.send(JSON.stringify({
            index: index
        }));
    });
}

function getGoogleCalDatas(start, end, arg) {
    $.toast('<h4>알림!</h4> 2초간 알려드립니다.', {
        duration: 2000,
        type: 'info'
      });
    return new Promise(function(resolve, reject) {
        var gStartDate;
        var gEndDate;

        if(start == 'def' || end == 'def') {
            gStartDate = '1970-01-01';
            gEndDate = '9999-12-31';
            arg = true;
        }
        else {
            gStartDate = start;
            gEndDate = end;
        }

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            //console.log(xhttp.responseText);
            if(xhttp.responseText == '') {
                document.location.href='/auth/google';
            }
            else {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if(this.readyState == 4 && this.status == 200) {
                        var googleCalendarDatas = JSON.parse(xhr.responseText);
                        console.log(googleCalendarDatas);
                        resolve(googleCalendarDatas);
                    }
                    else if(this.status == 401) {
                        document.location.href='/auth/google';
                    }
                }
                xhr.open('GET', xhttp.responseText, true);
                xhr.send();
            }
        }
        else {
            //document.location.href='/auth/google';
        }
    };
        xhttp.open('POST', '/auth/getUriWithAccessToken', true);
        xhttp.send();
    });
}

function getDiaryDatas(start, end, arg){
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/getdiarys', true); //데이터 베이스에서 가져옴
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if(this.readyState == XMLHttpRequest.DONE && this.status == 200) { //this 가 xhr 이다
                if(xhr.responseText != undefined) { //undefined 가 아니면, 결과값이 있으면
                    resolve(JSON.parse(xhr.responseText));
                    // document.getElementById("demo").innerHTML = this.responseText;
                }
                else {
                    reject(Error('error'));
                }
            }
        }
        console.log(start,end);
        xhr.send(JSON.stringify({
            startDate: (arg==1?start:start),
            endDate: (arg==1?end:start)
        }));
    });
}

async function delDiarySubFunc(fdate) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/deletediary', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            if(xhr.responseText == 'true') {
                updateDiary(fdate);
            }
        }
    }

    xhr.send(JSON.stringify({
        date: fdate
    }));
}

async function delDiary() {
    var fdate = $('#fakeDate').html();

    if(checkDiaryDateDiff() >= 0) {
        if(confirm('정말로 이 일기를 지우시겠습니까?')) {
            delDiarySubFunc(fdate);
        }
    }
    else {
        if(confirm('정말로 이 일기를 지우시겠습니까?\n날짜가 지났으므로 지운 후에는 재작성이 불가능합니다!')) {
            delDiarySubFunc(fdate);
        }
    }
}

async function setDiarySummary() {
    var year = $("#tbCalendarYM>div").html();
    var month = $("#tbCalendarYM>span>h3").html();
    var tmp = new Date(year, month, 0);
    var startDate = year + '-' + month + '-' + 1;
    var endDate = tmp.getFullYear() + '-' + (tmp.getMonth() + 1) + '-' + tmp.getDate();
    
    var diarySummary = await getDiaryDatas(startDate, endDate, 1);
    console.log(diarySummary);

    for(var i = 0; i < diarySummary.length; i++) {
        var title = diarySummary[i]['title'];
        var contents = diarySummary[i]['diary'];
        var imgArr = new Array();
        imgArr = diarySummary[i]['images'].split(',');
        var wDate = diarySummary[i]['date'];
        var wTime = diarySummary[i]['time'];

        if(imgArr[0] == undefined || imgArr[0] == 'undefined')
            imgArr[0] = '../images/img_not_loaded.png';
        if(imgArr[1] == undefined || imgArr[1] == '')
            imgArr[1] = '../images/img_not_loaded.png';
        if(imgArr[2] == undefined || imgArr[2] == '')
            imgArr[2] = '../images/img_not_loaded.png';

        var currentDate = new Date();
        var diaryDate = new Date(wDate);
        diaryDate.setHours(wTime.substring(0, 2));
        diaryDate.setMinutes(wTime.substring(3, 5));
        diaryDate.setSeconds(wTime.substring(6, 8));

        console.log(diaryDate, currentDate);

        var html = `<div class="article-element" onclick="calendarDayOnClick(`+parseInt(wDate.substring(0, 4))+`, `+parseInt(wDate.substring(5, 7))+`, `+parseInt(wDate.substring(8, 10))+`)">
            <div class="article-title">
            <h1 class="ui header">`+title+`</h1>
            <h4 class="ui header">`+dateTimePrintEngine(currentDate, diaryDate)+`</h4>
            </div>
            <div class="ui two column stackable grid">
            <div class="eleven wide column">
                <div class="content">
                <span id=a_span_`+i+`>
                    `+contents+`
                </span>
                </div>
            </div>

            <div class="five wide column">
                <div class="content-image">
                <img class="ui tiny circular image first" style="background-image: url('`+imgArr[0]+`')";>
                <img class="ui tiny circular image second" style="background-image: url('`+imgArr[1]+`')";>
                <img class="ui tiny circular image third" style="background-image: url('`+imgArr[2]+`')";>
                </div>
            </div>
            </div>
        </div>`;

        if(i != diarySummary.length - 1)
            html += `<!-- divider -->
            <div class="divider-article-element"></div>`;

        $('#diary_summary').append(html);

        $('#a_span_'+i).html(document.getElementById('a_span_'+i).textContent);
    
    }

}

function getFirstDayPosition(doMonthGetDay, argStartDateOpt) {
    if(argStartDateOpt == 2) {
        if(doMonthGetDay == 0)
            return 6;
        else if(doMonthGetDay == 1)
            return 0;
        else if(doMonthGetDay == 2)
            return 1;
        else if(doMonthGetDay == 3)
            return 2;
        else if(doMonthGetDay == 4)
            return 3;
        else if(doMonthGetDay == 5)
            return 4;
        else if(doMonthGetDay == 6)
            return 5;
    }
    else if(argStartDateOpt == 1) {
        if(doMonthGetDay == 0)
            return 0;
        else if(doMonthGetDay == 1)
            return 1;
        else if(doMonthGetDay == 2)
            return 2;
        else if(doMonthGetDay == 3)
            return 3;
        else if(doMonthGetDay == 4)
            return 4;
        else if(doMonthGetDay == 5)
            return 5;
        else if(doMonthGetDay == 6)
            return 6;
    }
    else if(argStartDateOpt == 0) {
        if(doMonthGetDay == 0)
            return 1;
        else if(doMonthGetDay == 1)
            return 2;
        else if(doMonthGetDay == 2)
            return 3;
        else if(doMonthGetDay == 3)
            return 4;
        else if(doMonthGetDay == 4)
            return 5;
        else if(doMonthGetDay == 5)
            return 6;
        else if(doMonthGetDay == 6)
            return 0;
    }
}

function getDayNameOfWeek(dayArg) {
    if(dayArg == 0)
        return '일';
    else if(dayArg == 1)
        return '월';
    else if(dayArg == 2)
        return '화';
    else if(dayArg == 3)
        return '수';
    else if(dayArg == 4)
        return '목';
    else if(dayArg == 5)
        return '금';
    else if(dayArg == 6)
        return '토';
}

$(document).ready(function() {
    $.toast.config.align = 'right';
    $.toast.config.width = 400;
});

function pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function dateTimePrintEngine(current, writed) {
    var elapsed = (current.getTime() - writed.getTime())/1000;
    console.log(elapsed);

    if(elapsed < 0)
        return '미리 작성 됨';
    else if(elapsed < 60.0 && elapsed >= 0)
        return '방금 전';
    else if(elapsed >= 60 && elapsed < 60 * 60)
        return Math.floor((elapsed / 60)) + '분 전';
    else if(elapsed >= 60 * 60 && elapsed < 60 * 60 * 24)
        return Math.floor((elapsed / (60 * 60))) + '시간 전';
    else if(elapsed >= 60 * 60 * 24 && elapsed < 60 * 60 * 24 * 7)
        return Math.floor((elapsed / (60 * 60 * 24))) + '일 전';
    else {
        if(current.getFullYear() == writed.getFullYear())
            return (writed.getMonth() + 1) + '월 ' + writed.getDate() + '일';
        else
            return writed.getFullYear() + '년 ' + (writed.getMonth() + 1) + '월 ' + writed.getDate() + '일';
    }
}