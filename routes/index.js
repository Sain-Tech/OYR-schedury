var express = require('express');
var session = require('express-session');
var mysql = require('sync-mysql');
var dbinfo = require('../database.js');
var pbkfd2Password = require('pbkdf2-password');
var hasher = pbkfd2Password();
var multer = require('multer');
var upload = multer({ dest: 'uploads/profile/'});
var uploadDiaryImg = multer({ dest: 'uploads/diary/'});
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var gcal = require('google-calendar');
var router = express.Router();

//connectDB.query("CREATE DATABASE IF NOT EXISTS userInfo CHARACTER SET utf8 COLLATE utf8_general_ci;");

router.use(session({
    secret: '1!2@3#4$5%',
    resave: false,
    saveUninitialized: true
}));

router.use(passport.initialize());

var googleId;
var gcalAccessUri;

var connectDB = new mysql(dbinfo.getDBInfo());
var resultUser = null;
var resultSchedule = null;
var resultDiary = null;
var resultSettings = null;

passport.use(new GoogleStrategy({
  clientID: '530520426576-li1h90ql8r1biju1t22i1uqpa7lrqoca.apps.googleusercontent.com',
  clientSecret: 'YKcF8wRsSZzFGcS6OUDNA2_c',
  callbackURL: "http://schedury.cf:3000/auth/google/callback",
  scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar.readonly'] 
},
function(accessToken, refreshToken, profile, done) {
  profile.accessToken = accessToken;
  googleId = profile.emails[0].value;
  console.log(googleId);
  return done(null, profile);
}));

router.get('/auth/google', passport.authenticate('google', { session: false }));

var toastAlert = 0;
var toastTitle = '';
var toastMsg = '';

router.post('/load_diary',function(req,res,next){
  var today_compare=req.body.date;
  var content=connectDB.query("SELECT * FROM DIARY WHERE id ='"+req.session.userId+"',date='"+today_compare+"';")[0];
  var diary_title=req.body.title;
  var diary_diary=req.body.diary;

  if(content){
    $('old_diary_hnc').attr({'style':'display:block !important'});
    $('new_diary_hnc').attr({'style':'display:none !important'});
  }else{
    $('old_diary_hnc').attr({'style':'display:none !important'});
    $('new_diary_hnc').attr({'style':'display:block !important'});
  };
  res.send({
    load_title : diary_title,
    load_diary : diary_diary
  });
});


router.get('/auth/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/auth/google/canceled' }),
  function(req, res) { 
    req.session.access_token = req.user.accessToken;
    console.log(req.session.access_token);
    gcalAccessUri = 'https://www.googleapis.com/calendar/v3/calendars/'+googleId+'/events?access_token='+req.session.access_token;
    if(gCalSyncFlag == true) {
      toastAlert = 1;
      toastTitle = '구글 캘린더';
      toastMsg = '동기화가 설정되었습니다.';
      connectDB.query("UPDATE SETTINGS SET gCalSync=1 WHERE userId='"+resultUser[0].userId+"'");
      res.redirect('/schedule/app:settings');
      gCalSyncFlag = false;
    }
    else {
      res.redirect('/');
    }
  });

router.post('/auth/getUriWithAccessToken', function(req, res){
    res.send(gcalAccessUri);
});

router.get('/auth/google/canceled', function(req, res){
  res.send(`
  <script>
    alert('사용자가 권한 허용을 취소했습니다.');
    document.location.replace('/');
  </script>
  `);
});

/* GET home page. */
router.get('/', function(req, res) {
  connectDB.query("CREATE TABLE IF NOT EXISTS USERS(userId CHAR(30), userPw TEXT, pwSalt TEXT, userEmail TEXT, profileImageDir TEXT, userNickName TEXT, userMessage TEXT, PRIMARY KEY(userId)) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
  connectDB.query("CREATE TABLE IF NOT EXISTS SCHEDULE(`index` INT NOT NULL AUTO_INCREMENT, userId CHAR(30), scheduleName TEXT, startDate DATE, endDate DATE, startTime TIME, endTime TIME, allDay BOOLEAN, repeatOrNot BOOLEAN, numRepeat INT, periodOfRepeat INT, endRepeatDate DATE, place TEXT, isImportant BOOLEAN, icoImageDir TEXT, PRIMARY KEY(`index`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
  console.log('테이블 생성됨');
  if(req.session.userId) {
    res.redirect('/schedule/'+req.session.userId);
  }
  else {
    res.render('loginmain', { title: '로그인'});
  }
});

var gCalSyncFlag = false;

router.get('/schedule/:id', function(req, res) {
  const schedIconFolder = './public/images/schedule';
  const fs = require('fs');
  var schedIcons=[];

  fs.readdirSync(schedIconFolder).forEach(file => {
    schedIcons.push(file);
  });

  if(!req.session.userId) {
    res.send('<script type="text/javascript">alert("권한이 없습니다. 다시 로그인 해주세요."); document.location.replace(`/`);</script>');
  }
  else if(req.params.id == 'app:settings') {
    //환경설정 테이블 만듦
    var createSetting = "CREATE TABLE IF NOT EXISTS SETTINGS(userId char(30), startDateOpt int, displayOpt int, gCalSync int, nCalSync int, PRIMARY KEY(userId)) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    connectDB.query(createSetting);

    //현재 사용자로 환경설정 값들 조회하기
    resultSettings = connectDB.query("SELECT * FROM SETTINGS WHERE userId='"+resultUser[0].userId+"'");
    
    //환경설정 테이블에 현재 로그인한 사용자가 없다면 생성
    if(resultSettings.length < 1) {
      connectDB.query("INSERT INTO SETTINGS VALUES('"+resultUser[0].userId+"', "+1+", "+0+", "+0+", "+0+")");
      //생성 후 재 조회
      resultSettings = connectDB.query("SELECT * FROM SETTINGS WHERE userId='"+resultUser[0].userId+"'");
    }
    res.render('settings', { title: 'Settings', startDateOpt: resultSettings[0].startDateOpt, displayOpt: resultSettings[0].displayOpt, gCalSync: resultSettings[0].gCalSync, nCalSync: resultSettings[0].nCalSync, toastAlert: toastAlert, toastTitle: toastTitle, toastMsg: toastMsg});
    toastAlert = 0;
    toastTitle = '';
    toastMsg = '';
  }
  else if(req.params.id == 'app:googleSync') {
    gCalSyncFlag = true;
    res.redirect('/auth/google');
  }
  else if(req.params.id == 'app:googleUnsync') {
    connectDB.query("UPDATE SETTINGS SET gCalSync=0 WHERE userId='"+resultUser[0].userId+"'");
    toastAlert = 1;
    toastTitle = '구글 캘린더';
    toastMsg = '동기화가 해제되었습니다.';
    res.redirect('/schedule/app:settings')
  }
  else if(req.session.userId != req.params.id) {
    res.send('<script type="text/javascript">alert("권한이 없는 사용자입니다."); history.back();</script>');
  }
  else {
    var createSetting = "CREATE TABLE IF NOT EXISTS SETTINGS(userId char(30), startDateOpt int, displayOpt int, gCalSync int, nCalSync int, PRIMARY KEY(userId)) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    connectDB.query(createSetting);

    //현재 사용자로 환경설정 값들 조회하기
    resultSettings = connectDB.query("SELECT * FROM SETTINGS WHERE userId='"+resultUser[0].userId+"'");
    
    //환경설정 테이블에 현재 로그인한 사용자가 없다면 생성
    if(resultSettings.length < 1) {
      connectDB.query("INSERT INTO SETTINGS VALUES('"+resultUser[0].userId+"', "+1+", "+0+", "+0+", "+0+")");
      //생성 후 재 조회
      resultSettings = connectDB.query("SELECT * FROM SETTINGS WHERE userId='"+resultUser[0].userId+"'");
    }

    res.render('schedule', {
      title: req.session.userId + '님의 Schedury',
      uid: resultUser[0].userId,
      uemail: resultUser[0].userEmail,
      uprofimg: resultUser[0].profileImageDir,
      unickname: resultUser[0].userNickName,
      umessage: resultUser[0].userMessage,
      scheduleIcons: schedIcons,
      startDateOpt: resultSettings[0].startDateOpt,
      displayOpt: resultSettings[0].displayOpt,
      gCalSync: resultSettings[0].gCalSync,
      nCalSync: resultSettings[0].nCalSync
    });
  }
});

router.get('/schedule', function(req, res) {
  if(!req.session.userId) {
    res.send('<script type="text/javascript">alert("권한이 없습니다. 다시 로그인 해주세요."); history.back();</script>');
  }
  else {
    res.redirect('/schedule/'+req.session.userId);
  }
});

router.get('/logout', function(req, res) {
  delete req.session.userId;
  res.redirect('/');
});

router.post('/signin', function(req, res) {
  var id = req.body.id;
  var pw = req.body.passwd;
  
  if(id == '' || pw == '') {
    res.send('<script type="text/javascript">alert("아이디와 비밀번호를 입력해주세요."); history.back();</script>');
  }
  else {
    resultUser = connectDB.query("SELECT * FROM USERS WHERE userId='"+id+"';");
    if(resultUser.length < 1) {
      res.send('<script type="text/javascript">alert("존재하지 않는 사용자입니다."); history.back();</script>');
    }
    else {
      hasher({password:pw, salt:connectDB.query("SELECT pwSalt FROM USERS WHERE userId='"+id+"';")[0].pwSalt}, function(err, pass, salt, hash) {
        if(hash === connectDB.query("SELECT userPw FROM USERS WHERE userId='"+id+"';")[0].userPw) {
          req.session.userId = id;
          res.redirect('/schedule/'+req.session.userId);
        }
        else {
          res.send('<script type="text/javascript">alert("비밀번호가 잘못되었습니다."); history.back();</script>');
        }
      });
    }
  }
});

router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Sign up', dbIdAlreadyCheck: req.session.flagAlreadyId});
  
});

router.post('/signup', upload.single('profimg'), function(req, res) {
  var id = req.body.id;
  var pw = req.body.passwd;
  var email = req.body.email; 
  var nickname = req.body.nickname; 
  var intro = req.body.intro;

  if(req.file != undefined)
    var profimgfile = '../' + req.file.path;
  else
    var profimgfile = '../images/profile_default.png';

  console.log(req.file);

  // if(id == '' || pw == '' || pwconfm == '' || email == '') {
  //   res.send('<script type="text/javascript">alert("모든 정보를 입력해주세요."); history.back();</script>');
  // }
  // else if(connectDB.query("SELECT * FROM USERS WHERE userId='"+id+"';").length > 0) {
  //   res.send('<script type="text/javascript">alert("사용할 수 없는 아이디입니다."); history.back();</script>');
  // }
  // else if(pw != pwconfm) {
  //   res.send('<script type="text/javascript">alert("비밀번호 입력을 확인해주세요."); history.back();</script>');
  // }
  hasher({password:pw}, function(err, pass, salt, hash) {
    var sql = "INSERT INTO USERS VALUES('"+id+"', '"+hash+"', '"+salt+"', '"+email+"', '"+profimgfile+"', '"+nickname+"', '"+intro+"');"
    connectDB.query(sql);
    console.log('데이터 입력됨');
    res.send('<script type="text/javascript">alert("승인되었습니다. 로그인 해주세요."); location.replace("/");</script>');
  });
});

router.get('/checkid/:id', function(req, res) {
  var resultUser = connectDB.query("SELECT userId FROM USERS WHERE userId='"+req.params.id+"';");
  var flag = false;

  if(resultUser.length > 0) {
    flag = true;
  }
  else {
    flag = false;
  }

  res.send(flag);
});

router.get('/checkemail/:email', function(req, res) {
  var resultUser = connectDB.query("SELECT userId FROM USERS WHERE userEmail='"+req.params.email+"';");
  var flag = false;

  if(resultUser.length > 0) {
    flag = true;
  }
  else {
    flag = false;
  }

  res.send(flag);
});

router.get('/sidebar', function(req,res){
  res.render('sidebar');
});

// router.get('/schedule', function(req, res) {
//   res.render('schedule', { title: 'Main' });
// });

router.get('/list', function(req, res){
  res.render('schedule_list');
});

router.post('/new_schedule', function(req, res){
  var userID = req.session.userId;         //사용자 아이디 : CHAR(30) - 사용자 테이블과 조인(외래키)
                                    //일정 고유번호(인덱스) : INDEX - 기본키
  var schedName=req.body.nameSched; // 일정 이름 : TEXT
  var schedDate=req.body.dateSched; // 시작일 종료일 : DATE
  var startTime=req.body.startTime; // 시작 시간: TIME   [null]
  var endTime=req.body.endTime; // 종료 시간: TIME       [null]
  var allDay=req.body.allDay; // 종일 체크 여부 : BOOLEAN
                              // 반복 여부 : BOOLEAN
  var periodOfRepeat=req.body.repeat; // 초기값: 일정 반복 단위(일, 주, 월, 년) : INT           [null]
  var numberRepeat=req.body.numberPeriod; //얼마마다 반복할건지 : INT   [null]
  var endRepeat=req.body.endRepeat; // 반복 일정 종료일 : DATE          [null]
  var place=req.body.place; //장소
  var isImportant=req.body.important; // 중요 여부 : BOOLEAN
  var icoImageDir=req.body.iconImage; // 일정 아이콘 경로: TEXT

  var isMod = req.body.isMod;
  var idx = req.body.idx;

  if(isMod == undefined || isMod == null) {
    isMod = 0;
  }

  console.log('name: ' + schedName, 'date: ' + schedDate, 'starttime: ' + startTime, 'endtime: ' + endTime, 'allday: ' + allDay, 'place: ' + place, 'isImportant: ' + isImportant, 'icon:' + icoImageDir);
  
  if(schedDate == ''){
    var startDate = '1970-01-01';
    var endDate = '1970-01-01';
  } else {
    var startDate = schedDate.substring(0, 10);
    var endDate = schedDate.substring(14, 24);
    if(endDate === undefined || endDate === null || endDate == '') {
      endDate = startDate;
    }
  }
  if(endRepeat == ''){
    endRepeat = '1970-01-01';
  }

  var ampm1 = startTime.substring(startTime.length-2, startTime.length);
  var ampm2 = endTime.substring(endTime.length-2, endTime.length);
  var hour1 = startTime.substring(0, startTime.length-6); // '11:00 PM' 에서 '11'
  var hour2 = endTime.substring(0, endTime.length-6); // '1:23 PM' 에서 '1'
  var min1 = startTime.substring(startTime.length-6, startTime.length-3); // '12:00 PM' 에서 ':00'
  var min2 = endTime.substring(endTime.length-6, endTime.length-3); // '1:20 AM' 에서 ':20'
  if(ampm1 == 'PM'){
    if(hour1 != '12'){
      hour1 *= 1; // 문자열을 숫자형으로 변환
      hour1 += 12;
      hour1 += "";} // 문자열로 다시 변환
  }
  if((ampm1 == 'AM') && (hour1 =='12')){
    hour1 *= 1;
    hour1 += 12;
    hour1 += "";
  }
  if(ampm2 == 'PM'){
    if(hour2 != '12'){
      hour2 *= 1;
      hour2 += 12;
      hour2 += "";}
  }
  if((ampm2 == 'AM') && (hour2 =='12')){
    hour2 *= 1;
    hour2 -= 12;
    hour2 += "";
  }
  startTime = hour1 + min1;
  endTime = hour2 + min2;
  
  if(allDay == undefined || allDay == ''){
    allDay = 0;
  } else {
    allDay = 1;
    startTime = '00:00';
    endTime = '23:59';
  }

  if(place == undefined || place == null) {
    place = '';
  }

  if(isImportant == undefined || isImportant == '')
    isImportant = 0;
  else
    isImportant = 1;

  if(periodOfRepeat == ''){
    periodOfRepeat = 0;
  }
  if(periodOfRepeat == 0){
    var repeatBoolean = 0;
  } else {
    var repeatBoolean = 1;
  }

  connectDB.query("CREATE TABLE IF NOT EXISTS SCHEDULE(`index` INT NOT NULL AUTO_INCREMENT, userId CHAR(30), scheduleName TEXT, startDate DATE, endDate DATE, startTime TIME, endTime TIME, allDay BOOLEAN, repeatOrNot BOOLEAN, numRepeat INT, periodOfRepeat INT, endRepeatDate DATE, place TEXT, isImportant BOOLEAN, icoImageDir TEXT, PRIMARY KEY(`index`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;");

  if(isMod) {
    console.log('modifying schedule...')
    var modSchedule = "UPDATE SCHEDULE SET scheduleName='"+schedName+"', startDate='"+startDate+"', endDate='"+endDate+"', startTime='"+startTime+"', endTime='"+endTime+"', allDay="+allDay+", place='"+place+"', isImportant="+isImportant+", icoImageDir='"+icoImageDir+"' WHERE SCHEDULE.index="+idx+";";
    connectDB.query(modSchedule);
  }
  else {
    var addSchedule = "INSERT INTO SCHEDULE(userId, scheduleName, startDate, endDate, startTime, endTime, allDay, place, isImportant, icoImageDir)";
    addSchedule = addSchedule + "VALUES('"+userID+"', '"+schedName+"', '"+startDate+"', '"+endDate+"', '"+startTime+"', '"+endTime+"', '"+allDay+"', '"+place+"', '"+isImportant+"', '"+icoImageDir+"');";
    console.log(addSchedule);
    connectDB.query(addSchedule);
  }

  res.send(true);
});

router.post('/delete_schedule', function(req, res){
  var idx = req.body.idx;
  connectDB.query("DELETE FROM SCHEDULE WHERE SCHEDULE.index="+idx+";");
  res.send(true);
});

router.get('/new_schedule', function(req, res){
  res.render('schedule_list');
});


router.get('/schedule/diary', function(req, res){
  res.render('schedule_diary',{ title:'Schedule_diary'});
});

var quillContents;
var imagefiles = [];

var indate = null;

router.post('/actionUpload_contents', function(req, res) {
  quillContents = req.body.value;

  
  for(var i = 0; i < req.body.imagefile.length; i++) {
    imagefiles.push(req.body.imagefile[i]);
  }
  

  connectDB.query("CREATE TABLE IF NOT EXISTS DIARY (`index` int(11) AUTO_INCREMENT, `id` char(30), `date` date, `title` text, `diary` longtext, `weather` text, `emotion` text, `time` time, `images` mediumtext, PRIMARY KEY(`index`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
  console.log('DIARY 테이블 생성됨');
  //다이어리 테이블 생성(이름: DIARY)

  var title=req.body.valuetitle;
  indate=req.body.date;
  var time=req.body.time;
  var emotion=req.body.emotion;
  var weather=req.body.weather; //quill-uqloader.js 200번째줄

  quillContents = req.body.value; //일기 내용


  connectDB.query("INSERT INTO DIARY(id, date, title, diary, weather, emotion, time, images) VALUES('"+req.session.userId+"','"+indate+"','"+title+"','"+quillContents+"','"+weather+"','"+emotion+"','"+time+"','undefined')");

  //DIARY 테이블에 이미지 경로를 제외한 데이터 추가(INSERT 이용), 이미지 경로는 우선 'undefined'로 추가 

  //connectDB.query("INSERT INTO IMAGETEST VALUES('"+quillContents+"', 'undefined');");

  res.send('request finished');
});

router.post('/actionUpload_images', uploadDiaryImg.fields(imagefiles), function(req, res, next) {

  var imageDirsRaw;
  var cnt = 0;

  for(var i in req.files) {
    console.log(req.files[i][0].path);
    if(cnt == 0) {
      var tmp = req.files[i][0].path;
      var teee= "../" + tmp;
      imageDirsRaw = teee;
    }
    else {
      var tmp = req.files[i][0].path;
      var teee= ",../" + tmp;
      imageDirsRaw += teee;
    }
    cnt++;
  }
 
  //DIARY 테이블에 이미지 경로를 'undefined'에서 imageDirsRaw로 변경(UPDATE 이용), WHERE 조건으로 사용자 아이디와 날짜 비교
  connectDB.query("UPDATE DIARY SET images='"+imageDirsRaw+"' WHERE id='"+req.session.userId+"' AND date='"+indate+"';");
  
  resultDiary = connectDB.query("SELECT * FROM DIARY WHERE id='"+req.session.userId+"' AND date='"+indate+"'AND diary='"+quillContents+"';")[0];

  console.log(resultDiary);
  
  var imageDirRaw = resultDiary.images;
  var conts = resultDiary.diary;

  var imagesDir = new Array();
  
  res.send(resultDiary);
});

router.post('/deletediary', function(req, res) {
  connectDB.query("DELETE FROM DIARY WHERE id='"+req.session.userId+"' AND date='"+req.body.date+"';");
  res.send(true);
});

router.get('/diarypreview', function(req, res) {
  resultDiary = connectDB.query("SELECT * FROM IMAGETEST WHERE CONTENTS='"+quillContents+"';")[0];
  var imageDirRaw = resultDiary.DIARYIMAGES;
  var conts = resultDiary.CONTENTS;
  console.log(imageDirRaw);
  var imagesDir = new Array();
  imagesDir = imageDirRaw.split(',');
  console.log(imagesDir);

  res.render('diary_preview', {
    contents: conts,
    images: imagesDir
  });
});

router.post('/getschedules', function(req, res) {

  var startDate = req.body.mStartDate;
  var endDate = req.body.mEndDate;
  var checkPeriod = req.body.mBoolPeriod;
  var idIndex = req.body.index;

  if(idIndex !== undefined || idIndex != null) {
    console.log(true, idIndex);
    resultSchedule = connectDB.query("SELECT * FROM SCHEDULE WHERE userId='"+req.session.userId+"' AND SCHEDULE.index="+parseInt(idIndex)+";");
    res.send(resultSchedule);

    return;
  }

  if(!checkPeriod) {
    resultSchedule = connectDB.query(`
      SELECT * FROM SCHEDULE
      WHERE userId='`+req.session.userId+`'
      AND startDate <= '`+startDate+`'
      AND endDate >= '`+startDate+`'
    `);
  }
  else {
    resultSchedule = connectDB.query("SELECT * FROM SCHEDULE WHERE userId='"+req.session.userId+"' AND startDate BETWEEN '"+startDate+"' AND '"+endDate+"';");
    console.log(startDate + ' to ' + endDate);
  }
  res.send(resultSchedule);
});

//채원
router.post('/getdiarys', function(req, res) {
  var ID = req.session.userId;
  resultDiary=connectDB.query(`
  SELECT * FROM DIARY
  WHERE id='`+ID+`'
  AND date >= '`+req.body.startDate+`'
  AND date <= '`+req.body.endDate+`'
  ORDER BY date DESC
  `);
  console.log(req.body.startDate, req.body.endDate, resultDiary);

  res.send(resultDiary);
});

router.post('/change_profile_img', upload.single('profileImage'), function(req, res){
  console.log(req.file.path);
  if(req.file != undefined){
    var profileImageF = '../' + req.file.path;
  } else {
    var profileImageF = '../images/profile_default.png';
  }
  
  connectDB.query("UPDATE USERS SET profileImageDir='"+profileImageF+"' WHERE userId='"+req.session.userId+"'");
  res.send(profileImageF);

});

router.post('/getprofimagedir', function(req, res) {
  res.send(connectDB.query("SELECT profileImageDir FROM USERS WHERE userId='"+req.session.userId+"'")[0].profileImageDir);
});

router.post('/set_default_profile', function(req, res) {
  var defProfImage = '../images/profile_default.png';
  connectDB.query("UPDATE USERS SET profileImageDir='"+defProfImage+"' WHERE userId='"+req.session.userId+"'");
  console.log('default prof updated!');
  res.send(defProfImage);
});

router.post('/edit_userinfo', function(req, res){
  var changedName = req.body.nickname;
  var changedMessage = req.body.mess;

  if((changedName != undefined)&&(changedMessage != undefined)){
    connectDB.query("UPDATE USERS SET userNickName='"+changedName+"', userMessage='"+changedMessage+"' WHERE userId='"+req.session.userId+"'");
  }
  
  res.send((connectDB.query("SELECT userNickName, userMessage FROM USERS WHERE userId='"+req.session.userId+"'")[0]));
});

router.post('/getAppSettings', function(req, res) {
  res.send(connectDB.query("SELECT * FROM SETTINGS WHERE userId='"+req.session.userId+"'")[0]);
});

router.post('/saveSettings', function(req, res) {
  var startDateOpt = req.body.startDateOpt;
  var displayOpt = req.body.displayOpt;
  var changedPW = req.body.changedPW;

  connectDB.query("UPDATE SETTINGS SET startDateOpt="+startDateOpt+", displayOpt="+displayOpt+" WHERE userId='"+resultUser[0].userId+"'");
  resultSettings = connectDB.query("SELECT * FROM SETTINGS WHERE userId='"+resultUser[0].userId+"'");

  if(changedPW != undefined) {
    hasher({password:changedPW}, function(err, pass, salt, hash) {
      //Change password
      connectDB.query("UPDATE USERS SET userPw='"+hash+"', pwSalt='"+salt+"' WHERE userId='"+req.session.userId+"'");
      
      //Update current userinfo from DB.
      resultUser = connectDB.query("SELECT * FROM USERS WHERE userId='"+req.session.userId+"';");
      res.redirect('/');
    });
  }
  else
    res.redirect('/');
});

router.post('/checkcurrpwd', function(req, res) {
  hasher({password:req.body.currpwd, salt:resultUser[0].pwSalt}, function(err, pass, salt, hash) {
    if(hash === resultUser[0].userPw) {
      res.send(true);
    }
    else {
      res.send(false);
    }
  });
});

module.exports = router;
