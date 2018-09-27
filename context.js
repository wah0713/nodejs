/*
Context模块:
  用于扩展res和req对象.
  这个模块需要用到res和req。

*/
const fs = require("fs");
const _ = require("underscore");
const mime = require("mime");
const path = require("path");
const url = require("url");


module.exports = (req, res) => {
    //1. 将req.url转换为小写 这样就可以实现 大小写不区分 在服务器端我们只需要处理小写.
    req.url = req.url.toLowerCase();
    //2. req.method 是可以得到浏览器请求服务器的方式 get/post
    //   为了能够大小写都能处理 统一转换成小写.
    req.method = req.method.toLowerCase();
    //为res对象封装render方法: 读取文件并响应给浏览器.
    //读取文件 直接响应或者渲染后再响应
    // tplData 渲染数据 如果没值： 直接响应
    //         如果有值  渲染后再响应
    res.render = (fileName, tplData) => {
        fs.readFile(fileName, (err, data) => {
            if (err && err.code == "ENOENT") {
                res.sendError( 404, "Not Found");
                //resError(res, 404, "Not Found");
            } else if (err) {
                res.sendError(500, "Internal Server Error");
                //resError(res, 500, "Internal Server Error");
            } else {
                res.writeHead(200, "ok", {
                    "Content-Type": mime.getType(fileName)
                });
                if (tplData) {
                    const html = _.template(data.toString())(tplData);
                    res.end(html);
                } else {
                    res.end(data);
                }
            }
        });
    };
    //为res对象新增1个error方法.
    res.sendError = (code, message) => {
        res.statusCode = code;
        res.statusMessage = message;
        if (code == 404) {
            fs.readFile(path.join(__dirname, "views", "404.html"), (err, data) => {
                res.end(data);
            })
        } else {
            res.end();
        }
    }
    //为req对象新增1个query属性.
    //希望它是1个对象,保存了get方式提交过来的数据.
    //url模块对象找出来
    const urlObj = url.parse(req.url, true);
    req.query = urlObj.query;
    req.pathname = urlObj.pathname;
    //console.log(urlObj);
}
