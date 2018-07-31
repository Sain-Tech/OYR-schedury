var today = new Date();//오늘 날짜//내 컴퓨터 로컬을 기준으로 today에 Date 객체를 넣어줌
var date = new Date();//today의 Date를 세어주는 역할

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
    tbCalendarYM.innerHTML = `<span><h3>` + (today.getMonth() + 1) + `</h3></span>` + today.getFullYear();

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

    // 1일이 시작되는 칸을 맞추어 줌 - 월요일 시작
    for (i=0; i < (arg == 0 ? (doMonth.getDay() || 7 - 6) : (arg == 1 ? doMonth.getDay() : (doMonth.getDay() || 7 - 1))); i++) {
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

        console.log('test: ' + cnt);

        /* 토요일 시작 */
        if(arg == 0) {
            if (cnt % 7 == 1) {/*토요일 계산*/
                //1주일이 7일 이므로 토요일 구하기
                //월화수목금토일을 7로 나눴을때 나머지가 1이면 cnt가 1번째에 위치함을 의미한다
                cell.innerHTML = "<font color=skyblue>" + i
                //1번째의 cell에만 색칠
            }

            if (cnt % 7 == 2) {/*일요일 계산*/
                //1주일이 7일 이므로 일요일 구하기
                //월화수목금토일을 7로 나눴을때 나머지가 2이면 cnt가 2번째에 위치함을 의미한다
                cell.innerHTML = "<font color=#F79DC2>" + i
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
                cell.innerHTML = "<font color=#F79DC2>" + i
                //1번째의 cell에만 색칠
            }

            if (cnt % 7 == 0){/* 1주일이 7일 이므로 토요일 구하기*/
                //월화수목금토일을 7로 나눴을때 나머지가 0이면 cnt가 7번째에 위치함을 의미한다
                cell.innerHTML = "<font color=skyblue>" + i
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
                cell.innerHTML = "<font color=skyblue>" + i
                //1번째의 cell에만 색칠
            }

            if (cnt % 7 == 0){/* 1주일이 7일 이므로 일요일 구하기*/
                //월화수목금토일을 7로 나눴을때 나머지가 0이면 cnt가 7번째에 위치함을 의미한다
                cell.innerHTML = "<font color=#F79DC2>" + i
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
            cell.bgColor = "#F9A11B";//셀의 배경색을 노랑으로 
        }
    }

    var lastFillCnt = 7 - (cnt % 7);
    var firstFillCnt = (arg == 0 ? (doMonth.getDay() || 7 - 6) : (arg == 1 ? doMonth.getDay() : (doMonth.getDay() || 7 - 1)));

    console.log(firstFillCnt);

    firstFillCnt2 = firstFillCnt;

    for(var i = 0; i < lastFillCnt; i++) {
        cell = row.insertCell();//열 한칸한칸 계속 만들어주는 역할
        cell.innerHTML = "<font color=#bdbdbd>" + (i + 1);
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