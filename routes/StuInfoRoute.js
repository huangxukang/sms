/**
 * @description 学生信息路由模块配置信息
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const appConfig = require("../config/appConfig.js");
const multer = require("multer");
const upload = multer({
    dest: appConfig.uploadImgs // 设置上传文件保存的文件夹
});
// const StuInfoService = require("../service/StuInfoService.js");
// const ClassInfoService = require("../service/ClassInfoService.js");
const ServiceFactory = require("../service/ServiceFactory.js");
const PageModel = require("../model/pageModel.js");
const MessageBox = require("../utils/MessageBox.js");
const ExcelUtil = require("../utils/ExcelUtil.js");

// 获取学生信息
router.get("/List", async (req, resp) => {
    try {
        // 得到所有学生信息，渲染到前台
        // let stuInfoService = new StuInfoService();
        let stuInfoService = ServiceFactory.createStuInfoService();
        // result是一个二维数组 [[{}],[{}]]
        let result = await stuInfoService.getListByPage(req.query);
        // 得到所有班级信息，渲染到前台
        // let classInfoService = new ClassInfoService();
        let classInfoService = ServiceFactory.createClassInfoService();
        let classInfoList = await classInfoService.getAllList();
        resp.render("StuInfo/List", {
            stuInfoList: result[0],
            classInfoList,
            // totalCount:result[1][0].totalCount
            pageModel: new PageModel(result[1][0].totalCount, req.query.pageIndex || 1)
        });
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

/*
    此处代码耦合度太高，精简代码改为上面的方法，同时前台提交action="/StuInfo/Query"改为action="/StuInfo/List"
    // 获取学生信息
    router.get("/List", async (req, resp) => {
        try {
            let stuInfoService = new StuInfoService();
            let result = await stuInfoService.getListByPage(req, resp);
            resp.render("StuInfo/List", {
                stuInfoList: result
            });
        } catch (error) {
            resp.status(500).send("服务器错误");
            console.log(error)
        }
    })

    // 查询学生信息
    router.get("/Query", async (req, resp) => {
        try {
            // req.query 接收前端发送过来的值
            // let {sid,sname,ssex} = req.query
            let stuInfoService = new StuInfoService();
            let result = await stuInfoService.getListByPage(req, resp);
            resp.render("StuInfo/List", {
                stuInfoList: result
            });
        } catch (error) {
            resp.status(500).send("服务器错误");
            console.log(error)
        }
    })
*/

// 检测学号是否存在
router.get("/checkSid", async (req, resp) => {
    try {
        // 把值传递给Service去数据库查询
        let sid = req.query.sid;
        // let stuInfoService = new StuInfoService();
        let stuInfoService = ServiceFactory.createStuInfoService();
        let flag = await stuInfoService.checkSid(sid);
        // 将结果发送到前台
        resp.send(flag);
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 新增学生信息
router.get("/addStuInfo", async (req, resp) => {
    try {
        // 得到所有班级信息，渲染到前台
        // let classInfoService = new ClassInfoService();
        let classInfoService = ServiceFactory.createClassInfoService();
        let classInfoList = await classInfoService.getAllList();
        // 解构得到所有民族信息
        let {
            nationList
        } = require("../config/appConfig.js");
        resp.render("StuInfo/addStuInfo", {
            classInfoList,
            nationList
        });
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 处理新增学生信息的表单提交
router.post("/doAddStuInfo", upload.single("sphoto"), async (req, resp) => {
    // upload.single()接收前台传来的单一文件（多个为array）
    // 接收到前面表单提交过来的数据，将这些数据存到数据库
    try {
        // 接收单一文件，如果用户没有上传文件，则是undefined
        let file = req.file;
        if (file) {
            // 接收到文件，重命名文件并加上后缀名，全局唯一标识符GUID
            fs.renameSync(file.path, file.path + file.originalname);
            let imgPath = `/uploadImgs/${file.filename + file.originalname}`;
            req.body.sphoto = imgPath;
        }
        // let stuInfoService = new StuInfoService();
        let stuInfoService = ServiceFactory.createStuInfoService();
        let result = await stuInfoService.addStuInfo(req.body);
        if (result.affectedRows > 0) {
            // 新增成功，跳转到列表页
            // resp.send(`<script>alert("新增成功");location.href="/StuInfo/List";</script>`);
            // resp.redirect("/StuInfo/List");
            MessageBox.alertAndRedirect("新增成功", "/StuInfo/List", resp);
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

// 删除学生信息
router.get("/deleteStu", async (req, resp) => {
    try {
        let {
            cksValue
        } = req.query;
        // let stuInfoService = new StuInfoService();
        let stuInfoService = ServiceFactory.createStuInfoService();
        let flag = await stuInfoService.deleteStuBySid(cksValue);
        // 将删除的结果返回给前台
        resp.send(flag);
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error)
    }
});

// 编辑学生信息，与新增学生信息一样
router.get("/editStuInfo", async (req, resp) => {
    try {
        //拿到要修改的学生学号，根据这个学号在数据库中查询学生信息
        let {
            sid,
            callBackUrl
        } = req.query;
        // let stuInfoService = new StuInfoService();
        let stuInfoService = ServiceFactory.createStuInfoService();
        let result = await stuInfoService.findBySid(sid);
        if (result.length == 0) {
            // 没有数据，可能已经被删除
            // resp.send(`<script>alert('不能修改当前数据，可能已经被删除，请返回刷新');history.back();</script>`);
            MessageBox.alertAndBack("不能修改当前数据，可能已经被删除，请返回刷新", resp);
        } else {
            // 有数据，开始渲染页面
            // 得到所有班级信息，渲染到前台
            // let classInfoService = new ClassInfoService();
            let classInfoService = ServiceFactory.createClassInfoService();
            let classInfoList = await classInfoService.getAllList();
            // 在这里在拿到民族列表
            let {
                nationList
            } = require("../config/appConfig.js");
            resp.render("StuInfo/editStuInfo", {
                classInfoList,
                nationList,
                stuInfo: result[0],
                callBackUrl
            });
        }
    } catch (error) {
        resp.status(500).send("服务器错误");
        console.log(error);
    }
});

// 处理编辑学生信息的请求
router.post("/doEditStuInfo", async (req, resp) => {
    try {
        let {
            callBackUrl
        } = req.body;
        // let stuInfoService = new StuInfoService();
        let stuInfoService = ServiceFactory.createStuInfoService();
        let flag = await stuInfoService.editStuInfoBySid(req.body);
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

// 导出学生信息为Excel文件
router.get("/exportToExcel", async (req, resp) => {
    try {
        // let stuInfoService = new StuInfoService();
        let stuInfoService = ServiceFactory.createStuInfoService();
        let result = await stuInfoService.exportToExcel(req.query);
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