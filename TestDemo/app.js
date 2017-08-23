const express = require("express");
const crypto = require("crypto");
const formidable = require("formidable");
const db = require("./model/db");
var app = express();
//使用html模版
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static("./public"));
//
app.get("/login", (req, res, next) => {
    res.render("login");
})
app.get("/register", (req, res, next) => {
    res.render("register.html");
})
//注册用户信息
app.post("/postRegister", (req, res) => {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        var username = fields.username;
        var md5 = crypto.createHash('md5');
        var password = md5.update(fields.password).digest('base64');
        var json = {
            "username": username,
            "password": password
        }
        db.insertData("user", json, (err, result) => {
            if (err) {
                console.log("数据可插入失败" + err);
                return;
            }
            console.log("插入数据成功" + result);
            res.send("1");
        })
        console.log("姓名：" + username + "密码：" + password);
    });
})
//查询用户信息
app.post("/getAll", (req, res) => {
    db.selectData("user", (err, result) => {
        if (err) {
            console.log("查询出错" + err);
            return;
        }
        console.log("查询成功");
        res.send(result);
    })
})
//登录判断
app.post("/postLogin", (req, res) => {
    var flag = false;
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        var username = fields.username;
        var md5 = crypto.createHash('md5');
        var password = md5.update(fields.password).digest('base64');
        console.log("加密后的密码是："+password);
        var json = {
            "username": username
        }
        db.selectData("user", (err, result) => {
            if (err) {
                console.log("查询出错" + err);
                return;
            }
            console.log("查询成功" + result.length);
            for (var i = 0; i < result.length; i++) {
                // console.log(result[i].username == username);
                if (result[i].username == username) {
                    flag = true;
                }
            }
            console.log("前" + flag);
            // res.send(result);
            if (flag) {
                console.log("后" + flag);
                db.selectPwd("user", json, (err, result) => {
                    if (err) {
                        console.log("查询密码失败" + err);
                        res.send("-1");
                        return;
                    }
                    console.log("查询密码成功!!!!!" + result[0].password+"当前的密码是"+password);
                    if (result[0].password == password) {
                        res.send("1");
                    } 
                    else{
                        res.send("-1");
                    }
                })
                flag = false;
            } else {
                res.send("-2");
                flag = false;
            }
        })



    })
})
//端口监听
app.listen(3000, (err) => {
    if (err) {
        console.log("端口被占用");
        return;
    }
    console.log("成功监听");
})