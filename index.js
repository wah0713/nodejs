/*
1. 有几个不好的地方
   a. 所有的代码都写在1个文件里面.
      > 维护极其恐怖
      > 不利于团队开发. 切忌多个人修改同1个文件.


2.  模块化
    是否可以尝试将这个项目分为多个模块. 每1个模块负责完成1个单独的功能.
    维护方便.
    利于团队

3.  划分模块的依据.
    功能. 每一个相对独立的功能 我们就应该是1个模块.

     3.1 扩展req和res对象. Context
         req.url  req.method 全部转换为小写.
         res.render
         req.query属性. 可以直接拿到get到服务器的数据.
             req.query.id
             req.query.name.
         .....
         res.error();
         .....
         req.body. post过来的数据..


     3.2 路由模块  router
         用于做路由判断. 什么样的url对应什么样的处理.
         /  /index 对这个路由做出处理.
         /submit    对这个路由处理
         /add      对这个路由处理
         。。。。。

     3.3 业务模块 handler
         处理业务逻辑。 当路由匹配以后，要如何处理浏览器的请求.


     3.4 配置模块. config
         存储程序的配置信息
         端口号.
         json文件的位置.
         .....

     3.5 入口模块.
         负责启动程序.


        
*/


const http = require("http");
//加载context模块.
const context = require("./context.js");
//加载router模块.
const router = require("./router.js");
const config = require("./config.js");

/*
1. 路由设计.
   /   /index   /INDEX  views/index.html
   /item       views/details.html
   /submit     views/submit.html
   /add        表单提交.

*/


const server = http.createServer();

//事件,一直在监听浏览器的请求，每接收1次请求这个事件都会被触发
//req 封装的请求数据
//res 可以向浏览器响应数据,
server.on("request", (req, res) => {
    //函数.
    //扩展req  res
    context(req,res);
    //url method被小写了
    //res render
    //res sendError
    //req.query

    //去判断路由.
    router(req, res);


});

server.listen(config.port, () => {
    console.log("服务启动成功");
});


