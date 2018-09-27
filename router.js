/*
 router.js 路由模块 负责路由判断的

 这个模块应该仅仅只是来负责路由判断的.
 真正的业务处理，应该交给我们的handler模块

*/

const handler = require("./handler.js");

module.exports = (req, res) => {
    //3. 路由判断.
    if ((req.url == "/" || req.url == "/index") && req.method == "get") {
        handler.index(req, res);
    } else if (req.url == "/submit" && req.method == "get") {
        handler.submit(req, res);
    } else if (req.pathname == "/item" && req.method == "get") {
        handler.item(req, res);
    } else if (req.url == "/add" && req.method == "post") {
        handler.add(req, res);
    } else if (req.url.startsWith("/public/")) {
        handler.static(req, res);
    } else{
        handler.notFound(req, res);
    }
}
