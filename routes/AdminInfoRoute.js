/**
 * @description 管理员信息路由模块配置信息
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const appConfig = require("../config/appConfig.js");
// const AdminInfoService = require("../service/AdminInfoService.js");
const ServiceFactory = require("../service/ServiceFactory.js");
const MessageBox = require("../utils/MessageBox.js");
const ExcelUtil = require("../utils/ExcelUtil.js");

// 获取管理员信息
router.get("/List", async (req, resp) => {
    try {
        // 得到所有管理员信息，渲染到前台
        // let adminInfoservice = new AdminInfoservice();
        let adminInfoservice = ServiceFactory.createAdminInfoService();
        let adminInfoList = await adminInfoservice.getAllList();
        resp.render("AdminInfo/List", {
            adminInfoList
        });
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 检测管理员编号是否存在
router.get("/checkAdminid", async (req, resp) => {
    try {
        // 把值传递给Service去数据库查询
        let adminid = req.query.adminid;
        // let adminInfoservice = new AdminInfoservice();
        let adminInfoservice = ServiceFactory.createAdminInfoService();
        let flag = await adminInfoservice.checkAdminid(adminid);
        // 将结果发送到前台
        resp.send(flag);
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 新增管理员信息
router.get("/addAdminInfo", async (req, resp) => {
    try {
        resp.render("AdminInfo/addAdminInfo");
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 处理新增管理员信息的表单请求
router.post("/doAddAdminInfo", async (req, resp) => {
    try {
        // let adminInfoservice = new AdminInfoservice();
        let adminInfoservice = ServiceFactory.createAdminInfoService();
        let flag = await adminInfoservice.addAdminInfo(req.body);
        if (flag) {
            // 新增成功，跳转到列表页
            // resp.send(`<script>alert("新增成功");location.href="/StuInfo/List";</script>`);
            // resp.redirect("/StuInfo/List");
            MessageBox.alertAndRedirect("新增成功", "/AdminInfo/List", resp);
        } else {
            // 新增失败，后退回上一页
            // resp.send(`<script>alert('新增失败');history.back();</script>`);
            MessageBox.alertAndBack("新增失败", resp);
        }
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 导出管理员信息为Excel文件
router.get("/exportToExcel", async (req, resp) => {
    try {
        // let adminInfoservice = new AdminInfoservice();
        let adminInfoservice = ServiceFactory.createAdminInfoService();
        let result = await adminInfoservice.exportToExcel(req.query);
        // 准备一个文件名
        let excelName = Date.now() + ".xlsx";
        let excelPath = path.join(appConfig.excelDirectory, excelName);
        // 生成Excel文件
        ExcelUtil.resultToExcel(result, excelPath);
        // 将文件发送到浏览器，提供用户下载
        resp.download(excelPath);
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 检测管理员登录
router.post("/checkLogin", async (req, resp) => {
    // 在这里接收前台传过来的用户名，密码和验证码
    try {
        let {
            userName,
            userPwd
        } = req.body;
        // let adminInfoservice = new AdminInfoservice();
        let adminInfoservice = ServiceFactory.createAdminInfoService();
        let result = await adminInfoservice.checkLogin(userName, userPwd);
        if (result.length > 0) {
            // 把当前用户的登录信息记录到系统的session里面
            req.session.userInfo = result[0];
            // 登陆成功,跳转到主页面
            resp.redirect("/Main/Index");
        } else {
            // 登录失败
            MessageBox.alertAndBack("用户名或密码错误，请重试", resp);
        }
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
})

// 检测验证码
router.get("/checkVCode", async (req, resp) => {
    try {
        let {
            VCode
        } = req.query;
        // 与session里面的验证码做一个判断
        resp.send(VCode.toUpperCase() == req.session.VCode);
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 钉钉绑定用户
router.post("/doBindUser", async (req, resp) => {
    try {
        let {
            dingOpenId,
            adminid,
            adminpwd
        } = req.body;
        // let adminInfoservice = new AdminInfoservice();
        let adminInfoservice = ServiceFactory.createAdminInfoService();
        // 判断用户名与密码是否正确
        let result = await adminInfoservice.checkLogin(adminid, adminpwd);
        if (result.length == 1) {
            // 用户名密码正确
            let flag = adminInfoservice.bindUserFromDingOpenId(adminid, dingOpenId);
            if (flag) {
                // 绑定成功，创建session
                req.session.userInfo = result[0];
                resp.redirect("/Main/Index");
            } else {
                // 绑定失败
                MessageBox.alertAndBack("绑定失败，请重试", resp);
            }
        } else {
            // 用户名密码不正确
            MessageBox.alertAndBack("你输入的用户名或密码不正确，请重试", resp);
        }
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// QQ绑定用户
router.post("/doBindUserForQQ", async (req, resp) => {
    try {
        let {
            qqOpenId,
            adminid,
            adminpwd
        } = req.body;
        // 判断用户名与密码是否正确
        // let adminInfoservice = new AdminInfoservice();
        let adminInfoservice = ServiceFactory.createAdminInfoService();
        let result = await adminInfoservice.checkLogin(adminid, adminpwd);
        if (result.length == 1) {
            // 用户名密码正确
            let flag = adminInfoservice.bindUserFromqqOpenId(adminid, qqOpenId);
            if (flag) {
                //绑定成功，创建session 
                req.session.userInfo = result[0];
                resp.redirect("/Main/Index");
            } else {
                // 绑定失败
                MessageBox.alertAndBack("绑定失败，请重试", resp);
            }
        } else {
            //用户名密码不正确
            MessageBox.alertAndBack("你输入的用户名或密码不正确，请返回重试", resp);
        }
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

//退出系统
router.get("/logOut", async (req, resp) => {
    // 销毁session
    req.session.destroy();
    // 跳转到登陆页
    resp.redirect("/");
});

module.exports = router;