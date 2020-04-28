/**
 * @description 数据表departmentinfo相关操作配置信息
 */

const BaseService = require("./BaseService.js");

/**
 * @class DepartmentInfoService 数据表classinfo的数据操作
 * @extends BaseService 继承基础Service
 */
class DepartmentInfoService extends BaseService {
    constructor() {
        super("departmentinfo");
    }

    /**
     * @name checkDname 检测院系是否存在
     * @param {string} dname 需要检测的院系
     * @returns {boolean} true为存在，false为不存在
     */
    async checkDname(dname) {
        let strSql = super.createCountSql(" and dname=? ");
        let result = await this.executeSql(strSql, [dname]);
        if (result[0].totalCount > 0) {
            //存在
            return true;
        } else {
            //不存在
            return false;
        }
    }

    /**
     * @name addDepartmentInfo 新增院系信息
     * @returns {Promise} 返回executeSql执行的Promise
     */
    addDepartmentInfo({
        did,
        dname,
        manager,
        manager_tel
    }) {
        let strSql = `insert into ${this.tableName} (did,dname, manager, manager_tel) values (?,?,?,?) `;
        return this.executeSql(strSql, [did, dname, manager, manager_tel]);
    }

    /**
     * @name deleteByDid 根据院系号删除院系信息
     * @param {Array} cksValue 要删除的院系号
     * @returns {boolean} true代表删除成功,false代表删除失败
     */
    async deleteByDid(cksValue) {
        let cksValueString = cksValue.join("','");
        let strSql = `update ${this.tableName} set isDel=true where did in ('${cksValueString}')`;
        let result = await this.executeSql(strSql);
        if (result.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @name findByDid 根据院系编号号查询院系信息
     * @param {string} did 院系的编号
     * @returns {Promise} executeSql执行的结果
     */
    findByDid(did) {
        let strSql = `select * from ${this.tableName} where isDel=false and did = ? `;
        return this.executeSql(strSql, [did]);
    }

    /**
     * @name editDepartmentInfoByDid 根据班级编号编辑班级信息
     * @returns {boolean} true代表编辑成功 false代表编辑失败
     */
    async editDepartmentInfoByDid({
        dname,
        manager,
        manager_tel,
        did
    }) {
        let strSql = `UPDATE sms.departmentinfo SET dname=?, manager=?, manager_tel=? WHERE did=? `;
        let result = await this.executeSql(strSql, [dname, manager, manager_tel, did]);
        if (result.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @name exportToExcel 导出Excel
     * @returns {Promise} executeSql执行的结果
     */
    exportToExcel() {
        let strSql = `select * from departmentinfo where isDel=false`;
        return this.executeSql(strSql);
    }

}

module.exports = DepartmentInfoService;