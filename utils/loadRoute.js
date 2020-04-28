/**
 * @description 加载app.js里面的路由配置信息
 */

const fs = require("fs");
const path = require("path");

/*
    function loadRoute(app){
        ......
    }
*/
const loadRoute = app => {
    // 首先确定路由的目录
    let routesPath = path.join(__dirname, "../routes");
    // fs.readdirSync(routesPath); ['AdminInfoRouter.js',''......]
    fs.readdirSync(routesPath).forEach(item => {
        app.use(`/${item.replace("Route.js","")}`, require(path.join(routesPath, item)));
    })
}

module.exports = loadRoute;