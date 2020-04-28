/**
 * @description 班级信息路由模块配置信息
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const appConfig = require("../config/appConfig.js");
// const ClassInfoService = require("../service/ClassInfoService.js");
// const DepartmentInfoService = require("../service/DepartmentInfoService.js");
// const InstructorService = require("../service/InstructorService.js");
const ServiceFactory = require("../service/ServiceFactory.js");
const PageModel = require("../model/pageModel.js");
const MessageBox = require("../utils/MessageBox.js");
const ExcelUtil = require("../utils/ExcelUtil.js");

// 获取班级信息
router.get("/List", async (req, resp) => {
    try {
        // 得到所有班级信息，渲染到前台
        // let classInfoService = new ClassInfoService();
        let classInfoService = ServiceFactory.createClassInfoService();
        // result是一个二维数组 [[{}],[{}]]
        let result = await classInfoService.getListByPage(req.query);
        // 得到所有院系信息，渲染到前台
        // let departmentInfoService = new DepartmentInfoService();
        let departmentInfoService = ServiceFactory.createDepartmentInfoService();
        let departmentInfoList = await departmentInfoService.getAllList();
        // 得到所有辅导员信息，渲染到前台
        // let instructorService = new InstructorService();
        let instructorService = ServiceFactory.createInstructorService();
        let instructorList = await instructorService.getAllList();
        resp.render("ClassInfo/List", {
            classInfoList: result[0],
            departmentInfoList,
            instructorList,
            // totalCount:result[1][0].totalCount
            pageModel: new PageModel(result[1][0].totalCount, req.query.pageIndex || 1)
        });
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 检测班级是否存在
router.get("/checkCname", async (req, resp) => {
    try {
        // 把值传递给Service去数据库查询
        let cname = req.query.cname;
        // let classInfoService = new ClassInfoService();
        let classInfoService = ServiceFactory.createClassInfoService();
        let flag = await classInfoService.checkCname(cname);
        // 将结果发送到前台
        resp.send(flag);
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 新增班级信息
router.get("/addClassInfo", async (req, resp) => {
    try {
        // 得到所有院系信息，渲染到前台
        // let departmentInfoService = new DepartmentInfoService();
        let departmentInfoService = ServiceFactory.createDepartmentInfoService();
        let departmentInfoList = await departmentInfoService.getAllList();
        // 得到所有辅导员信息，渲染到前台
        // let instructorService = new InstructorService();
        let instructorService = ServiceFactory.createInstructorService();
        let instructorList = await instructorService.getAllList();
        resp.render("ClassInfo/addClassInfo", {
            departmentInfoList,
            instructorList
        });
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

//处理新增班级信息的表单请求
router.post("/doAddClassInfo", async (req, resp) => {
    try {
        // let classInfoService = new ClassInfoService();
        let classInfoService = ServiceFactory.createClassInfoService();
        let result = await classInfoService.addClassInfo(req.body);
        if (result.affectedRows > 0) {
            // 新增成功，跳转到列表页面
            // resp.send(`<script>alert("新增成功");location.href="/StuInfo/List";</script>`);
            // resp.redirect("/StuInfo/List");
            MessageBox.alertAndRedirect("新增成功", "/ClassInfo/List", resp);
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

// 删除班级信息
router.get("/deleteByCid", async (req, resp) => {
    try {
        let {
            cksValue
        } = req.query;
        // let classInfoService = new ClassInfoService();
        let classInfoService = ServiceFactory.createClassInfoService();
        let flag = await classInfoService.deleteByCid(cksValue);
        resp.send(flag);
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error)
    }
});

// 编辑班级信息，与新增班级信息一样
router.get("/editClassInfo", async (req, resp) => {
    try {
        //拿到要修改的班级编号，根据这个编号在数据库中查询班级信息
        let {
            cid,
            callBackUrl
        } = req.query;
        // let classInfoService = new ClassInfoService();
        let classInfoService = ServiceFactory.createClassInfoService();
        let result = await classInfoService.findByCid(cid);
        if (result.length == 0) {
            // 没有数据，可能已经被删除
            // resp.send(`<script>alert('不能修改当前数据，可能已经被删除，请返回刷新');history.back();</script>`);
            MessageBox.alertAndBack("不能修改当前数据，可能已经被删除，请返回刷新", resp);
        } else {
            // 有数据，开始渲染页面
            // 得到所有院系信息，渲染到前台
            // let departmentInfoService = new DepartmentInfoService();
            let departmentInfoService = ServiceFactory.createDepartmentInfoService();
            let departmentInfoList = await departmentInfoService.getAllList();
            // 得到所有辅导员信息，渲染到前台
            // let instructorService = new InstructorService();
            let instructorService = ServiceFactory.createInstructorService();
            let instructorList = await instructorService.getAllList();
            resp.render("ClassInfo/editClassInfo", {
                departmentInfoList,
                instructorList,
                classInfo: result[0],
                callBackUrl
            });
        }
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 处理编辑班级信息的请求
router.post("/doEditClassInfo", async (req, resp) => {
    try {
        let {
            callBackUrl
        } = req.body;
        // let classInfoService = new ClassInfoService();
        let classInfoService = ServiceFactory.createClassInfoService();
        let flag = await classInfoService.editClassInfoByCid(req.body);
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

// 导出班级信息为Excel文件
router.get("/exportToExcel", async (req, resp) => {
    try {
        // let classInfoService = new ClassInfoService();
        let classInfoService = ServiceFactory.createClassInfoService();
        let result = await classInfoService.exportToExcel(req.query);
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