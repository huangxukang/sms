/**
 * @description 辅导员信息路由模块配置信息
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const appConfig = require("../config/appConfig.js");
// const InstructorService = require("../service/InstructorService.js");
const ServiceFactory = require("../service/ServiceFactory.js");
const MessageBox = require("../utils/MessageBox.js");
const ExcelUtil = require("../utils/ExcelUtil.js");

// 获取辅导员信息
router.get("/List", async (req, resp) => {
    try {
        // 得到所有辅导员信息，渲染到前台
        // let instructorService = new InstructorService();
        let instructorservice = ServiceFactory.createInstructorService();
        let instructorList = await instructorservice.getAllList();
        resp.render("Instructor/List", {
            instructorList
        });
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 检测辅导员是否存在
router.get("/checkInstructorname", async (req, resp) => {
    try {
        // 把值传递给Service去数据库查询
        let instructorname = req.query.instructorname;
        // let instructorService = new InstructorService();
        let instructorservice = ServiceFactory.createInstructorService();
        let flag = await instructorservice.checkInstructorname(instructorname);
        // 将结果发送到前台
        resp.send(flag);
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 新增辅导员信息
router.get("/addInstructor", async (req, resp) => {
    try {
        resp.render("Instructor/addInstructor");
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

//处理新增辅导员信息的表单请求
router.post("/doAddInstructor", async (req, resp) => {
    try {
        // let instructorService = new InstructorService();
        let instructorservice = ServiceFactory.createInstructorService();
        let result = await instructorservice.addInstructor(req.body);
        if (result.affectedRows > 0) {
            // 新增成功，跳转到列表页
            // resp.send(`<script>alert("新增成功");location.href="/StuInfo/List";</script>`);
            // resp.redirect("/StuInfo/List");
            MessageBox.alertAndRedirect("新增成功", "/Instructor/List", resp);
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

// 删除辅导员信息
router.get("/deleteByinstructorid", async (req, resp) => {
    try {
        let {
            cksValue
        } = req.query;
        // let instructorService = new InstructorService();
        let instructorservice = ServiceFactory.createInstructorService();
        let flag = await instructorservice.deleteByInstructorid(cksValue);
        // 将删除的结果返回给前台
        resp.send(flag);
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error)
    }
});

// 编辑辅导员信息，与新增辅导员信息一样
router.get("/editInstructor", async (req, resp) => {
    try {
        //拿到要修改的辅导员的编号，根据这个编号在数据库中查询辅导员的信息
        let {
            instructorid,
            callBackUrl
        } = req.query;
        // let instructorService = new InstructorService();
        let instructorservice = ServiceFactory.createInstructorService();
        let result = await instructorservice.findByInstructorid(instructorid);
        if (result.length == 0) {
            // 没有数据，可能已经被删除
            // resp.send(`<script>alert('不能修改当前数据，可能已经被删除，请返回刷新');history.back();</script>`);
            MessageBox.alertAndBack("不能修改当前数据，可能已经被删除，请返回刷新", resp);
        } else {
            // 有数据，开始渲染页面
            resp.render("Instructor/editInstructor", {
                instructor: result[0],
                callBackUrl
            });
        }
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 处理编辑辅导员信息的请求
router.post("/doEditInstructor", async (req, resp) => {
    try {
        let {
            callBackUrl
        } = req.body;
        // let instructorService = new InstructorService();
        let instructorservice = ServiceFactory.createInstructorService();
        let flag = await instructorservice.editInstructorByInstructorid(req.body);
        if (flag) {
            // 编辑成功后跳转到当前编辑页面而不是首页
            // resp.send(`<script>alert("编辑成功");location.href="/StuInfo/List";</script>`);
            // resp.redirect("/StuInfo/List");
            MessageBox.alertAndRedirect("编辑成功", callBackUrl || "/StuInfo/List", resp);
        } else {
            // 编辑失败，后退回上一页
            // resp.send(`<script>alert('编辑失败');history.back();</script>`);
            MessageBox.alertAndBack("编辑失败", resp);
        }
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 导出辅导员信息为Excel文件
router.get("/exportToExcel", async (req, resp) => {
    try {
        // let instructorService = new InstructorService();
        let instructorservice = ServiceFactory.createInstructorService();
        let result = await instructorservice.exportToExcel(req.query);
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

module.exports = router;