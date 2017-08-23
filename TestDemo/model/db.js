const MongoClient = require("mongodb").MongoClient;

function _connection(callback) {
    var DB_CONN_STR = 'mongodb://localhost:27017/qwer';
    MongoClient.connect(DB_CONN_STR, (err, db) => {
        if (err) {
            console.log("连接数据库失败" + err);
            return;
        }
        console.log("数据库连接成功");
        callback(err, db);
    })
}

//插入数据
exports.insertData = function (Cname, json, callback) {
    _connection((err, db) => {
        db.collection(Cname).insertOne(json, (err, result) => {
            callback(err, result);
            db.close();
        })
    })
}
//删除数据
exports.delData = function (Cname, json, callback) {
    _connection((err, db) => {
        db.collection(Cname).deleteMany(
            json,
            function (err, result) {
                callback(err, result)
                db.close();
            }
        )
    })
}
//修改数据
exports.updateData = function (Cname, json1, json2, callback) {
    _connection((err, db) => {
        db.collection(Cname), updateMant(
            json1,
            json2,
            function (err, result) {
                callback(err, result);
                db.close();
            }
        )
    })
}
//查询数据
exports.selectData = function (Cname, callback) {
    _connection((err, db) => {
        db.collection(Cname).find({}).toArray(
            function (err, result) {
                callback(err, result);
                db.close();
            }
        )
    })
}
//查询密码
exports.selectPwd = function (Cname, json, callback) {
    _connection((err, db) => {
        db.collection(Cname).find(json).toArray(
            function (err, result) {
                callback(err, result);
                db.close();
            }
        )
    })
}