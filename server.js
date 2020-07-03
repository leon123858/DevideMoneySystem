// JavaScript source code
//set
'use strict';
//引入liberary
var http = require('http');
var MongoClient = require('mongodb').MongoClient;

//connect to mongoDB
var uri = "mongodb+srv://leon1234858:8ntscpal@cluster0.gyixj.gcp.mongodb.net/?retryWrites=true&w=majority";
console.log(uri);
//connect test
MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    console.log("It's test start");
    db.close();
    console.log("It's test end");
});
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function ishavetoken(obj, code, find, insert, output, res) {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var revalue;
        var table = db.db("devidemoney").collection("token");
        var findThing = { token: code };
        table.find(findThing, { projection: { _id: 0, token: 1 } }).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result[0] != undefined) {
                console.log(result[0].token); //直接呼叫特定回傳值
                revalue = true;
            }
            else revalue = false;
            console.log(revalue); //直接呼叫特定回傳值
            db.close();
            if (revalue) {
                code = String(getRandomInt(10)) + String(getRandomInt(10)) + String(getRandomInt(10)) + String(getRandomInt(10));
                find(obj, code, ishavetoken, inserttoken, outputToken,res);
            } else {
                insert(obj, code, output, res);
            }
        });
    });
}
function inserttoken(obj, code, output,res) {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var table = db.db("devidemoney").collection("token");
        var objIn = { token: code };
        table.insertOne(objIn, function (err, res) { // insertMany 是插入多個用的
            if (err) throw err;
            console.log("insert success");
            db.close();
        });
        output(obj, code, res);
    });
}
function outputToken(obj, code, res) {
    obj.token = code;
    var json = JSON.stringify(obj);
    res.end(json);
}
function isasktoken(obj, code, output, res) {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var revalue;
        var table = db.db("devidemoney").collection("token");
        var findThing = { token: code };
        table.find(findThing, { projection: { _id: 0, token: 1 } }).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result[0] != undefined) {
                console.log(result[0].token); //直接呼叫特定回傳值
                revalue = true;
            }
            else revalue = false;
            console.log(revalue); //直接呼叫特定回傳值
            db.close();
            if (revalue) {
                output(obj, "true", res);
            } else {
                output(obj, "false", res);
            }
        });
    });
}
function insertrecord(obj, parameter, output, res) {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var table = db.db("devidemoney").collection("record");
        var objIn = { token: parameter[0], gender: parameter[1], name: parameter[2], price: parameter[3], thing: parameter[4], type: parameter[5]};
        table.insertOne(objIn, function (err, res) { // insertMany 是插入多個用的
            if (err) throw err;
            console.log("insert success");
            db.close();
        });
        output(obj, "success", res);
    });
}
function findrecord(parameter, res) {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var table = db.db("devidemoney").collection("record");
        var findThing = { token: parameter[0] };
        table.find(findThing, { projection: { _id: 0, token: 1, gender: 1,name:1,price:1,thing:1,type:1 } }).toArray(function (err, result) {
            if (err) throw err;
            var relist = [];
            if (result != null) {
                for (var i = 0; i < result.length; i++)
                    relist[i] = result[i];
            }
            console.log(relist);
            //console.log(relist[1].value); //直接呼叫特定回傳值
            var json = JSON.stringify(relist);
            res.end(json);
            db.close();
        });
    });
}
function deleteall(obj,parameter, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        console.log("It's delete start");
        var table1 = db.db("devidemoney").collection("token");
        var table2 = db.db("devidemoney").collection("record");
        var whereStr = { token: parameter[0] };
        table1.deleteMany(whereStr, function (err, res) { // insertMany 是插入多個用的
            if (err) throw err;
            console.log("It's delete 1 end");
        });
        table2.deleteMany(whereStr, function (err, res) { // insertMany 是插入多個用的
            if (err) throw err;
            console.log("It's delete 2 end");
        });
        obj.token = "DeleteSuccess";
        var json = JSON.stringify(obj);
        res.end(json);
    });
}
http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHeader(200, {
        'Content-Type': 'text/html;charset=utf-8'
    });
    var obj = {};
    var list = req.url.split('?');
    var pathname = list[0];
    var parameter = [];
    if (list.length > 1) {
        var paraList = list[1].split('&');
        for (var i = 0; i < paraList.length; i++) {
            if (paraList[i] == '') break;
            parameter[i] = paraList[i].split('=')[1];
        }
        for (var i = 0; i < parameter.length; i++) {
            console.log(parameter[i]);
        }
    }
    if (pathname == '/') {
        obj.say = 'thanks for connect';
        var json = JSON.stringify(obj);
        res.end(json);
    }
    else if (pathname == '/newtoken') {
        var new_code = String(getRandomInt(10)) + String(getRandomInt(10)) + String(getRandomInt(10)) + String(getRandomInt(10));
        new_code = "4917";
        ishavetoken(obj, new_code, ishavetoken, inserttoken, outputToken, res);
    }
    else if (pathname == '/asktoken') {
        if (parameter.length > 0)
            isasktoken(obj, parameter[0], outputToken, res);
        else
            outputToken(obj, "NoParameter", res);
    }
    else if (pathname == '/insert') {
        if (parameter.length > 5)
            insertrecord(obj, parameter, outputToken, res);
        else
            outputToken(obj, "NoParameter", res);
    }
    else if (pathname == '/find') {
        if (parameter.length > 0)
            findrecord(parameter, res);
        else
            outputToken(obj, "NoParameter", res);
    }
    else if (pathname == '/delete') {
        if (parameter.length > 0)
            deleteall(obj, parameter, res);
        else
            outputToken(obj, "NoParameter", res);
    }
}).listen(process.env.PORT || 8080, () => {
    console.log('started web process');
});