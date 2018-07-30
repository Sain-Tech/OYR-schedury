var express = require('express');
var session = require('express-session');
var mysql = require('sync-mysql');
var dbinfo = require('../database.js');
var pbkfd2Password = require('pbkdf2-password');
var hasher = pbkfd2Password();
var multer = require('multer');
var upload = multer({ dest: 'uploads/profile/'})
var router = express.Router();

//connectDB.query("CREATE DATABASE IF NOT EXISTS userInfo CHARACTER SET utf8 COLLATE utf8_general_ci;");

router.use(session({
    secret: '1!2@3#4$5%',
    resave: false,
    saveUninitialized: true
}));

var connectDB = new mysql(dbinfo.getDBInfo());
var result = null;

/* GET home page. */
router.get('/', function(req, res) {
  connectDB.query("CREATE TABLE IF NOT EXISTS USERS(userId CHAR(30), userPw TEXT, pwSalt TEXT, userEmail TEXT, profileImageDir TEXT, PRIMARY KEY(userId)) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
  console.log('테이블 생성됨');
  if(req.session.userId) {
    res.redirect('/result/'+req.session.userId);
  }
  else {
    res.render('loginmain', { title: '로그인'});
  }
});

router.get('/result/:id', function(req, res) {
  if(!req.session.userId) {
    res.send('<script type="text/javascript">alert("권한이 없습니다. 다시 로그인 해주세요."); history.back();</script>');
  }
  else if(req.session.userId != req.params.id) {
    res.send('<script type="text/javascript">alert("권한이 없는 사용자입니다."); history.back();</script>');
  }
  else {
    res.render('result', {
      title: req.session.userId,
      uid: result[0].userId,
      uemail: result[0].userEmail,
      uprofimg: result[0].profileImageDir
    });
  }
});

router.get('/result', function(req, res) {
  if(!req.session.userId) {
    res.send('<script type="text/javascript">alert("권한이 없습니다. 다시 로그인 해주세요."); history.back();</script>');
  }
  else {
    res.redirect('/result/'+req.session.userId);
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
    result = connectDB.query("SELECT * FROM USERS WHERE userId='"+id+"';");
    if(result.length < 1) {
      res.send('<script type="text/javascript">alert("존재하지 않는 사용자입니다."); history.back();</script>');
    }
    else {
      hasher({password:pw, salt:connectDB.query("SELECT pwSalt FROM USERS WHERE userId='"+id+"';")[0].pwSalt}, function(err, pass, salt, hash) {
        if(hash === connectDB.query("SELECT userPw FROM USERS WHERE userId='"+id+"';")[0].userPw) {
          req.session.userId = id;
          res.redirect('/result/'+req.session.userId);
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
    var sql = "INSERT INTO USERS VALUES('"+id+"', '"+hash+"', '"+salt+"', '"+email+"', '"+profimgfile+"');"
    connectDB.query(sql);
    console.log('데이터 입력됨');
    res.send('<script type="text/javascript">alert("승인되었습니다. 로그인 해주세요."); location.replace("/");</script>');
  });
});

router.get('/checkid/:id', function(req, res) {
  var result = connectDB.query("SELECT userId FROM USERS WHERE userId='"+req.params.id+"';");
  var flag = false;

  if(result.length > 0) {
    flag = true;
  }
  else {
    flag = false;
  }

  res.send(flag);
});

router.get('/checkemail/:email', function(req, res) {
  var result = connectDB.query("SELECT userId FROM USERS WHERE userEmail='"+req.params.email+"';");
  var flag = false;

  if(result.length > 0) {
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

router.get('/schedule', function(req, res) {
  res.render('schedule', { title: 'Main' });
});

module.exports = router;
