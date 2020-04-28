/**
 * @description 程序配置信息
 */

const path = require("path");

let appConfig = {
    // 分页页容量
    pageSize: 5,
    // 民族列表
    nationList: ['阿昌族', '白族', '保安族', '布朗族', '布依族', '藏族', '朝鲜族', '达斡尔族', '傣族', '德昂族', '东乡族', '侗族', '独龙族', '俄罗斯族', '鄂伦春族', '鄂温克族', '高山族', '哈尼族', '哈萨克族', '汉族', '赫哲族', '回族', '基诺族', '京族', '景颇族', '柯尔克孜族', '拉祜族', '黎族', '珞巴族', '满族', '毛南族', '门巴族', '蒙古族', '苗族', '仫佬族', '纳西族', '怒族', '普米族', '羌族', '撒拉族', '畲族', '水族', '僳僳族', '塔吉克族', '塔塔尔族', '土家族', '土族', '佤族', '维吾尔族', '乌孜别克族', '锡伯族', '瑶族', '彝族', '仡佬族', '裕固族', '壮族'],
    // excel生成目录
    excelDirectory: path.join(__dirname, "../excelDirectory"),
    // 图片上传目录
    uploadImgs: path.join(__dirname, "../uploadImgs"),
    // 登录验证需要放行的路径
    excludePath: [
        "/Main/Login",                // 登录页面路径
        "/Main/getVCode",             // 登录页面验证码路径
        "/AdminInfo/checkVCode",      // 检测用户名与密码路径
        "/AdminInfo/checkLogin",      // 检测验证码路径
        "/Main/fromDing",             // 钉钉扫码后回调路径
        "/AdminInfo/doBindUser"       // 通过钉钉绑定管理员账号  
    ]
}

module.exports = appConfig;