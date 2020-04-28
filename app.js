/**
 * @author 黄旭康 2019.10
 */

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const template = require("express-art-template");
const bodyParser = require("body-parser");
const session = require("express-session");
const appConfig = require("./config/appConfig.js");

// 设置模板引擎视图文件所在的位置
app.set("views", path.join(__dirname, "./views"));
// 设置模板后缀名.html
app.engine("html", template);
// 设置模板引擎所有的html文件都会通过template渲染
app.set("view engine", "html");

// 设置静态文件夹，可以直接访问
app.use("/public", express.static(path.join(__dirname, "./public")));

// post取值插件
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json({
    limit: '10mb'
}));

// 加载session插件，连接浏览器与服务器
app.use(session({
    // 是否加密
    secret: "huangxukang",
    // 是否可以重新保存
    resave: true,
    saveUninitialized: false
}));

// 拦截器设置在路由的前面，以便对所有的路由进行拦截，同时还需要设置在/public后面，express默认支持拦截器
app.use((req, resp, next) => {
    if (req.session.userInfo) {
        // 用户有登录
        next();
    } else {
        // 用户没有登录
        if (appConfig.excludePath.includes(req.path)) {
            // 如果当前访问的路径包含在排除的数组里面，不需要登录就可以放行
            next();
        } else {
            // 跳转到登录页，相当于302重定向
            resp.redirect("/Main/Login");
        }
    }
});

// 加载路由
// let loadRoute = require("./utils/loadRouter.js");
// loadRoute(app);
require("./utils/loadRoute.js")(app);
/*
    app.use("/Main", require("./routes/MainRouter.js"));
    app.use("/StuInfo", require("./routes/StuInfoRoute.js"));
    app.use("/AdminInfo", require("./routes/AdminInfoRoute.js"));
    app.use("/ClassInfo", require("./routes/ClassInfoRoute.js"));
    app.use("/instructor", require("./routes/instructorRoute.js"));
    app.use("/DepartmentInfo", require("./routes/DepartmentInfoRoute.js"));
*/

app.listen(80, () => {
    // http默认端口号80
    console.log("---> 服务器启动成功！");
    // ----------------------- Excel文件夹 -----------------------
    let excelDirectory = path.join(__dirname, "./excelDirectory");
    if (!fs.existsSync(excelDirectory)) {
        fs.mkdirSync(excelDirectory);
        console.log("------> excelDirectory导出文件夹创建成功！");
    } else {
        console.log("------> excelDirectory导出文件夹已存在！")
    }
    // ----------------------- 上传图片文件夹 -----------------------
    let uploadImgs = appConfig.uploadImgs;
    if (!fs.existsSync(uploadImgs)) {
        fs.mkdirSync(uploadImgs);
        console.log("---------> uploadImgs上传图片文件夹创建成功！");
    } else {
        console.log("---------> uploadImgs上传图片文件夹已经存在！")
    }
    // ----------------------- 公开图片文件夹 -----------------------
    app.use("/uploadImgs", express.static(appConfig.uploadImgs));
    console.log("------------> uploadImgs上传图片文件夹已公开！");
});