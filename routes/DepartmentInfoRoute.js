/**
 * @description 院系信息路由模块配置信息
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const appConfig = require("../config/appConfig.js");
// const DepartmentInfoService = require("../service/DepartmentInfoService.js");
const ServiceFactory = require("../service/ServiceFactory.js");
const MessageBox = require("../utils/MessageBox.js");
const ExcelUtil = require("../utils/ExcelUtil.js");

// 获取院系信息
router.get("/List", async (req, resp) => {
    try {
        // 得到所有院系信息，渲染到前台
        // let departmentInfoService = new DepartmentInfoService();
        let departmentInfoService = ServiceFactory.createDepartmentInfoService();
        let departmentInfoList = await departmentInfoService.getAllList();
        resp.render("DepartmentInfo/List", {
            departmentInfoList
        });
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 检测院系是否存在
router.get("/checkDname", async (req, resp) => {
    try {
        // 把值传递给Service去数据库查询
        let dname = req.query.dname;
        // let departmentInfoService = new DepartmentInfoService();
        let departmentInfoService = ServiceFactory.createDepartmentInfoService();
        let flag = await departmentInfoService.checkDname(dname);
        // 将结果发送到前台
        resp.send(flag);
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 新增院系信息
router.get("/addDepartmentInfo", async (req, resp) => {
    try {
        resp.render("DepartmentInfo/addDepartmentInfo");
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

//处理新增院系信息的表单请求
router.post("/doAddDepartmentInfo", async (req, resp) => {
    try {
        // let departmentInfoService = new DepartmentInfoService();
        let departmentInfoService = ServiceFactory.createDepartmentInfoService();
        let result = await departmentInfoService.addDepartmentInfo(req.body);
        if (result.affectedRows > 0) {
            // 新增成功，跳转到列表页
            // resp.send(`<script>alert("新增成功");location.href="/StuInfo/List";</script>`);
            // resp.redirect("/StuInfo/List");
            MessageBox.alertAndRedirect("新增成功", "/DepartmentInfo/List", resp);
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

// 删除院系信息
router.get("/deleteByDid", async (req, resp) => {
    try {
        let {
            cksValue
        } = req.query;
        // let departmentInfoService = new DepartmentInfoService();
        let departmentInfoService = ServiceFactory.createDepartmentInfoService();
        let flag = await departmentInfoService.deleteByDid(cksValue);
        // 将删除的结果返回给前台
        resp.send(flag);
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error)
    }
});

// 编辑院系信息，与新增院系信息一样
router.get("/editDepartmentInfo", async (req, resp) => {
    try {
        //拿到要修改的院系的编号，根据这个编号号在数据库中查询院系的信息
        let {
            did,
            callBackUrl
        } = req.query;
        // let departmentInfoService = new DepartmentInfoService();
        let departmentInfoService = ServiceFactory.createDepartmentInfoService();
        let result = await departmentInfoService.findByDid(did);
        if (result.length == 0) {
            // 没有数据，可能已经被删除
            // resp.send(`<script>alert('不能修改当前数据，可能已经被删除，请返回刷新');history.back();</script>`);
            MessageBox.alertAndBack("不能修改当前数据，可能已经被删除，请返回刷新", resp);
        } else {
            // 有数据，开始渲染页面
            resp.render("DepartmentInfo/editDepartmentInfo", {
                departmentInfo: result[0],
                callBackUrl
            });
        }
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 处理编辑院系信息的请求
router.post("/doEditDepartmentInfo", async (req, resp) => {
    try {
        let {
            callBackUrl
        } = req.body;
        // let departmentInfoService = new DepartmentInfoService();
        let departmentInfoService = ServiceFactory.createDepartmentInfoService();
        let flag = await departmentInfoService.editDepartmentInfoByDid(req.body);
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

// 导出院系信息为Excel文件
router.get("/exportToExcel", async (req, resp) => {
    try {
        // let departmentInfoService = new DepartmentInfoService();
        let departmentInfoService = ServiceFactory.createDepartmentInfoService();
        let result = await departmentInfoService.exportToExcel(req.query);
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