/**
 * @description 后台主页信息路由模块配置信息
 */

const express = require("express");
const router = express.Router();
const svgcaptcha = require("svg-captcha");
const axios = require("axios");
const dingConfig = require("../config/dingConfig");
const qqConfig = require("../config/qqConfig");
const ServiceFactory = require("../service/ServiceFactory");

// 三栏式布局请求,渲染三栏式布局页面
router.get("/Index", async (req, resp) => {
    let menuConfig = require("../config/menuConfig.js")
    resp.render("Main/Index", {
        menuConfig,
        userName: req.session.userInfo.realName // 当前登录用户真实姓名
    });
});

// 用户登录
router.get("/Login", async (req, resp) => {
    resp.render("Main/Login");
})

// 从服务器请求一张图片，Vcode(validate code)验证码图片
router.get("/getVcode", async (req, resp) => {
    // 调用模块，生成验证码图片
    let svgData = svgcaptcha.create({
        size: 4,
        noise: 3
        // color:true
        // background:"yellow"
        // ignoreChars: "0123456789"
    });
    /*
        得到SVG的图片对象信息
        {
            text:"ABCD",
            data:"<svg></svg>"
        }
     */
    // 将生成好的验证码放到session里面，同时转大写
    req.session.VCode = svgData.text.toUpperCase();
    // 设置svg响应头
    resp.setHeader("Content-Type", "image/svg+xml");
    // data属性就是svg图片的数据
    resp.send(svgData.data);
});

// 接收来自钉钉的消息
router.get("/fromDing", async (req, resp) => {
    let {
        code,
        state
    } = req.query; // 收到钉钉传递过来的两个参数
    let {
        appId,
        appSecret
    } = dingConfig;
    try {
        // 第一步：获取access令牌
        let resp1 = await axios.default.get(`https://oapi.dingtalk.com/sns/gettoken?appid=${appId}&appsecret=${appSecret}`);
        let {
            access_token
        } = resp1.data;
        // 第二步：获取永久授权码
        let resp2 = await axios.default.post(`https://oapi.dingtalk.com/sns/get_persistent_code?access_token=${access_token}`, {
            tmp_auth_code: code
        });
        let {
            openid,
            persistent_code
        } = resp2.data;
        // 第三步：获取用户的SNS_TOKEN
        let resp3 = await axios.default.post(`https://oapi.dingtalk.com/sns/get_sns_token?access_token=${access_token}`, {
            openid,
            persistent_code
        });
        let {
            sns_token
        } = resp3.data;
        // 第四步：拿用户信息
        let resp4 = await axios.default.get(`https://oapi.dingtalk.com/sns/getuserinfo?sns_token=${sns_token}`);
        if (resp4.data.errcode == 0) {
            // 在数据库里面查询有没有这个钉钉id
            let adminInfoService = ServiceFactory.createAdminInfoService();
            let result = await adminInfoService.findByDingOpenId(resp4.data.user_info.openid);
            if (result.length == 1) {
                // 之前绑定过
                req.session.userInfo = result[0];
                resp.redirect("/Main/Index");
            } else {
                // 之前没有绑定过，跳转到绑定页面
                resp.render("AdminInfo/BindUser", {
                    dingOpenId: resp4.data.user_info.openid
                });
            }
        }
    } catch (error) {
        console.log(error);
        resp.status(500).send("服务器错误");
    }
});

// 接收来自QQ的消息
router.get("/fromQQ", async (req, resp) => {
    let {
        code
    } = req.query;
    let url1 = "https://graph.qq.com/oauth2.0/token";
    let resp1 = await axios.default.get(`${url1}?grant_type=authorization_code&client_id=${qqConfig.appId}&client_secret=${qqConfig.appKey}&code=${code}&redirect_uri=http://jx.softeem.xin/Main/fromQQ`);
    let searchParams = new URLSearchParams(resp1.data);
    let access_token = searchParams.get("access_token");
    let url2 = "https://graph.qq.com/oauth2.0/me";
    let resp2 = await axios.default.get(`${url2}?access_token=${access_token}`)
    let qqOpenId = JSON.parse(resp2.data.replace("callback(", "").replace(")", "").replace(";", "")).openid;
    let result = await ServiceFactory.createAdminInfoService().findByqqOpenId(qqOpenId);
    if (result.length == 1) {
        // 之前绑定过
        req.session.userInfo = result[0];
        resp.redirect("/Main/Index");
    } else {
        // 之前没有绑定过，跳转到绑定页面
        resp.render("AdminInfo/BindUserForqqOpenId", {
            qqOpenId: qqOpenId
        });
    }
});

module.exports = router;