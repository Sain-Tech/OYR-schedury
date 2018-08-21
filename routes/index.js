var express = require('express');
var session = require('express-session');
var mysql = require('sync-mysql');
var dbinfo = require('../database.js');
var pbkfd2Password = require('pbkdf2-password');
var hasher = pbkfd2Password();
var multer = require('multer');
var upload = multer({ dest: 'uploads/profile/'})
var uploadDiaryImg = multer({ dest: 'uploads/diary/'})
var router = express.Router();

//connectDB.query("CREATE DATABASE IF NOT EXISTS userInfo CHARACTER SET utf8 COLLATE utf8_general_ci;");

router.use(session({
    secret: '1!2@3#4$5%',
    resave: false,
    saveUninitialized: true
}));

var connectDB = new mysql(dbinfo.getDBInfo());
var resultUser = null;
var resultSchedule = null;
var resultDiary = null;

/* GET home page. */
router.get('/', function(req, res) {
  connectDB.query("CREATE TABLE IF NOT EXISTS USERS(userId CHAR(30), userPw TEXT, pwSalt TEXT, userEmail TEXT, profileImageDir TEXT, userNickName TEXT, userMessage TEXT, PRIMARY KEY(userId)) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
  console.log('테이블 생성됨');
  if(req.session.userId) {
    res.redirect('/schedule/'+req.session.userId);
  }
  else {
    res.render('loginmain', { title: '로그인'});
  }
});

router.get('/schedule/:id', function(req, res) {
  if(!req.session.userId) {
    res.send('<script type="text/javascript">alert("권한이 없습니다. 다시 로그인 해주세요."); history.back();</script>');
  }
  else if(req.session.userId != req.params.id) {
    res.send('<script type="text/javascript">alert("권한이 없는 사용자입니다."); history.back();</script>');
  }
  else {
    res.render('schedule', {
      title: req.session.userId,
      uid: resultUser[0].userId,
      uemail: resultUser[0].userEmail,
      uprofimg: resultUser[0].profileImageDir,
      unickname: resultUser[0].userNickName,
      umessage: resultUser[0].userMessage
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

router.get('/schedule/settings', function(req, res) {
  res.render('settings', { title: 'Settings' });
  
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
  
  if(schedDate == ''){
    var startDate = '1970-01-01';
    var endDate = '1970-01-01';
  } else {
    var startDate = schedDate.substring(0, 10);
    var endDate = schedDate.substring(14, 24);
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
  
  if(allDay == undefined){
    allDay = 0;
  } else {
    allDay = 1;
  }
  if(periodOfRepeat == ''){
    periodOfRepeat = 0;
  }
  if(periodOfRepeat == 0){
    var repeatBoolean = 0;
  } else {
    var repeatBoolean = 1;
  }

  connectDB.query("CREATE TABLE IF NOT EXISTS SCHEDULE(`index` INT NOT NULL AUTO_INCREMENT, userId CHAR(30), scheduleName TEXT, startDate DATE, endDate DATE, startTime TIME, endTime TIME, allDay BOOLEAN, repeatOrNot BOOLEAN, numRepeat INT, periodOfRepeat INT, endRepeatDate DATE, PRIMARY KEY(`index`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;");

  var addSchedule = "INSERT INTO SCHEDULE(userId, scheduleName, startDate, endDate, startTime, endTime, allDay, repeatOrNot, numRepeat, periodOfRepeat, endRepeatDate)";
  addSchedule = addSchedule + "VALUES('"+userID+"', '"+schedName+"', '"+startDate+"', '"+endDate+"', '"+startTime+"', '"+endTime+"', '"+allDay+"', '"+repeatBoolean+"', '"+numberRepeat+"', '"+periodOfRepeat+"', '"+endRepeat+"');";
  connectDB.query(addSchedule);

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
  var weather=req.body.weather;

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
      imageDirsRaw = tmp;
    }
    else {
      var tmp = req.files[i][0].path;
      imageDirsRaw += ',' + tmp;
    }
    cnt++;
  }
 
  //DIARY 테이블에 이미지 경로를 'undefined'에서 imageDirsRaw로 변경(UPDATE 이용), WHERE 조건으로 사용자 아이디와 날짜 비교
  connectDB.query("UPDATE DIARY SET images='"+imageDirsRaw+"' WHERE id='"+req.session.userId+"' AND date='"+indate+"';");
  
  resultDiary = connectDB.query("SELECT * FROM DIARY WHERE diary='"+quillContents+"';")[0];
  
  var imageDirRaw = resultDiary.images;
  var conts = resultDiary.diary;
  
  console.log(imageDirRaw); //undefined

  var imagesDir = new Array();

  imagesDir = imageDirRaw.split(','); //error

  console.log(imagesDir);
  
  res.send({
    contents: conts,
    images: imagesDir
  });
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

  console.log(startDate);
  console.log(endDate);

  if(!checkPeriod) {
    resultSchedule = connectDB.query(`
      SELECT * FROM SCHEDULE
      WHERE userId='`+req.session.userId+`'
      AND startDate <= '`+startDate+`'
      AND endDate >= '`+startDate+`'
    `);
    console.log(' only ' + endDate);
  }
  else {
    resultSchedule = connectDB.query("SELECT * FROM SCHEDULE WHERE userId='"+req.session.userId+"' AND startDate BETWEEN '"+startDate+"' AND '"+endDate+"';");
    console.log(startDate + ' to ' + endDate);
  }
  res.send(resultSchedule);
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

module.exports = router;
