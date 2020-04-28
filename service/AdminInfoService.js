/**
 * @description 数据表admininfo相关操作配置信息
 */

const BaseService = require("./BaseService.js");

/**
 * @class AdminInfoService 数据表stuinfo的数据操作
 * @extends BaseService 继承基础Service
 */
class AdminInfoService extends BaseService {
    constructor() {
        super("admininfo");
    }

    /**
     * @name checkAdminid 检测管理员账号是否存在
     * @param {string} adminid 要检测的账号
     * @returns {boolean} true为存在，false为不存在
     */
    async checkAdminid(adminid) {
        let strSql = super.createCountSql(" and adminid=? ");
        let result = await this.executeSql(strSql, [adminid]);
        if (result[0].totalCount > 0) {
            //存在
            return true;
        } else {
            //不存在
            return false;
        }
    }

    /**
     * @name addAdminInfo 新增管理员信息
     * @returns {Promise} 返回executeSql执行的Promise
     */
    async addAdminInfo({
        adminid,
        adminpwd,
        realName
    }) {
        let strSql = `insert into ${this.tableName} (adminid,adminpwd,realName) values (?,?,?) `;
        let result = await this.executeSql(strSql, [adminid, adminpwd, realName]);
        return result.affectedRows > 0 ? true : false;
    }

    /**
     * @name exportToExcel 导出Excel
     * @returns {Promise} executeSql执行的结果
     */
    exportToExcel() {
        let strSql = `select * from admininfo where isDel=false`;
        return this.executeSql(strSql);
    }

    /**
     * @name checkLogin 根据用户名与密码实现登陆
     * @param {string} userName 用户名
     * @param {string} userPwd 密码
     * @returns {Promise} 返回executeSql执行的结果
     */
    checkLogin(userName, userPwd) {
        let strSql = `select * from ${this.tableName} where isDel=false and adminid=? and adminpwd=? `;
        return this.executeSql(strSql, [userName, userPwd]);
    }

    /**
     * @name findByDingOpenId 通过钉钉的openid来获取用户数据
     * @param {string} dingOpenId  钉钉的openid
     * @returns {Promise} 返回executeSql执行的结果
     */
    findByDingOpenId(dingOpenId) {
        let strSql = `select * from ${this.tableName} where isDel=false and dingopenid=? `;
        return this.executeSql(strSql, [dingOpenId]);
    }

    /**
     * @name bindUserFromDingOpenId 根据用户名绑定钉钉的openid
     * @param {string} adminid 用户名 
     * @param {*} dingOpenId 钉钉的openid
     * @returns {boolean} true代表绑定成功，false代表绑定失败
     */
    async bindUserFromDingOpenId(adminid, dingOpenId) {
        let strSql = `update ${this.tableName} set dingopenid=? where isDel=false and adminid=?  `;
        let result = await this.executeSql(strSql, [dingOpenId, adminid]);
        return result.affectedRows > 0 ? true : false;
    }

    /**
     * @description 根据QQ的openid来获取用户数据
     * @param {String} qqOpenId QQ的openid
     * @returns {Promise} 返回executeSql执行的结果
     */
    findByqqOpenId(qqOpenId) {
        let strSql = `select * from ${this.tableName} where isDel=false and qqopenid=? `;
        return this.executeSql(strSql, [qqOpenId]);
    }

    /**
     * @name bindUserFromqqOpenId 根据用户名绑定QQ的openid
     * @param {string} adminid 用户名 
     * @param {*} qqOpenId QQ的openid
     * @returns {boolean} true代表绑定成功，false代表绑定失败
     */
    async bindUserFromqqOpenId(adminid, qqOpenId) {
        let strSql = `update ${this.tableName} set qqopenid=? where isDel=false and adminid=? `;
        let result = await this.executeSql(strSql, [qqOpenId, adminid])
        return result.affectedRows > 0 ? true : false;
    }

}

module.exports = AdminInfoService;