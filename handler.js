/*
handler模块. 
处理每一个路由.
*/

const path = require("path");
const fs = require("fs");
const querystring = require("querystring");
const config = require("./config.js");


//这个方法用来处理首页.
module.exports.index = (req, res) => {

    readData(res, news => {
        //json数组读取出来了.
        //模板渲染.
        //读取index.html的内容。再用_渲染 再返回.
        res.render(path.join(__dirname, "views", "index.html"), { news });
    });
}

//处理submit请求
module.exports.submit = (req, res) => {
    res.render(path.join(__dirname, "views", "submit.html"));
}

//处理新闻详情
module.exports.item = (req, res) => {
    const id = req.query.id;
    //2.数组中查找这个id
    readData(res, news => {
        for (let index in news) {
            if (news[index].id == id) {
                res.render(path.join(__dirname, "views", "details.html"), { item: news[index] });
                break;//
            }
        }
    })

}

//处理表单提交.
module.exports.add = (req, res) => {
    //表单提交
    //1. 接收post提交过来的数据.
    const array = [];
    //data事件， 每接收到post过来的1小部分数据就触发1次.
    req.on("data", chunk => array.push(chunk));
    req.on("end", () => {
        //1.先把多个小buffer合并
        const buffer = Buffer.concat(array);
        let body = buffer.toString();
        //title=xx&url=xx&text=xxx
        //{title:xx,url:xx}
        body = querystring.parse(body);
        //准备把这个对象写入到json文件中.
        //先把json数组读出来 然后往这个数组中新增1个对象。然后再写入.
        readData(res, news => {
            body.id = news[news.length - 1].id + 1;
            news.push(body);
            //写入数组.
            writeData(res, news, () => {
                res.writeHead(302, "Found", {
                    Location: "/index"
                });
                res.end();
            });
            //写入成功之后，让浏览器跳转.

        })

    })

}

module.exports.static = (req, res) => {
    // /public/images/fbb.jpg
    res.render(path.join(__dirname, req.url));
}

module.exports.notFound = (req, res) => {
    res.sendError(404,"Not Found");
}

//读取json文件的方法.
const readData = (res, callback) => {

    //readFile是1个异步的方法.
    //
    fs.readFile(config.data, "utf-8", (err, data) => {
        let news = null;
        if (err && err.code == "ENOENT") {
            //没有这个json文件.
            news = [];
        } else if (err) { //有错误，但是不是文件不存在
            resError(res, 500, "Internal Server Error");
        } else {
            //?读取成功 有数据.
            news = JSON.parse(data);
        }
        //代码执行到这里。 news的值要么是 []  要么是从文件中读取出来的数组.
        //只有这个地方news才会有值.
        //让调用者传入一段代码到这个地方来处理news
        callback(news);
    });


}

const writeData = (res, news, callback) => {
    fs.writeFile(config.data, JSON.stringify(news), "utf-8", err => {
        if (err) {
            //写入文件的时候发生错误了.
            resError(res, 500, "Internal Server Error");
        } else {
            //写入成功.
            callback();
        }
    });
}